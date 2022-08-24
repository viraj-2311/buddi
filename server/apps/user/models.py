from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.forms.models import model_to_dict

from apps.jobs.constants import (
    ACCOUNT_COMPANY_NO_RELATION,
    ACCOUNT_COMPANY_RELATION_COMMON_STAFF,
    ACCOUNT_COMPANY_RELATION_CONTRACTOR,
    ACCOUNT_COMPANY_RELATION_OWNER,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    ACCOUNT_COMPANY_BUSINESS_MEMBER

)
from apps.jobs.managers import CustomUserManager
from apps.user.constants import (
    COMPANY_USER_TYPE,
    CREW_USER_TYPE,
    PRODUCER_USER_TYPE,
    PRODUCTION_COMPANY_TYPE,
    BUSINESS_TYPES,
    COMPANY_TYPES,
    DEFAULT_BUSINESS_TYPES,
    I_HAVE_DUPLICATE_ACCOUNT,
    GETTING_TO_MANY_MAILS,
    NOT_GETTING_ANY_VALUE_FOR_MY_MEMBERSHIP,
    PRIVACY_CONCERN,
    RECEIVING_UNWANTED_CONTACT,
    OTHER, BAND_TYPE,
)


class BenjiAccount(AbstractUser):
    UserTypes = [
        (COMPANY_USER_TYPE, COMPANY_USER_TYPE),
        (PRODUCER_USER_TYPE, PRODUCER_USER_TYPE),
        (CREW_USER_TYPE, CREW_USER_TYPE),
    ]
    username = None  # Disregard built-in username field
    type = models.CharField(max_length=255, choices=UserTypes, blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    nickname = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=1024, unique=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=50, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=50, blank=True, null=True)
    union = models.CharField(max_length=255, blank=True, null=True)
    vimeo = models.CharField(max_length=255, blank=True, null=True)
    link_to_work = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    profile_photo_s3_url = models.CharField(max_length=500, blank=True, null=True)
    primary_instrument = models.CharField(max_length=500, blank=True, null=True)
    origin_profile_photo_s3_url = models.CharField(
        max_length=500, blank=True, null=True
    )
    profile_completed = models.BooleanField(default=False)
    tool_tip_step = models.IntegerField(
        default=0,
        null=False,
        help_text="the last tool tip step that the user has skipped",
    )
    tool_tip_finished = models.BooleanField(
        default=False, help_text="whether the user has skipped all tool tips"
    )
    producer_tool_tip_step = models.IntegerField(
        default=0,
        null=False,
        help_text=(
            "the last tool tip step on producer's screen that the user has skipped"
        ),
    )
    producer_tool_tip_finished = models.BooleanField(
        default=False,
        help_text="whether the user has skipped all tool tips on producer's screen",
    )

    # Customized User settings
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        db_table = "benji_account"

    def get_full_name(self):
        return self.full_name

    def to_dict(self):
        return model_to_dict(self)

    def __str__(self):
        return f"{self.first_name} {self.last_name} [{self.email}]"

    @property
    def is_company_owner(self):
        companies = CompanyBenjiAccountEntry.objects.filter(benji_account=self).count()
        return companies > 0

    @property
    def w9_document(self):
        w9_document = None
        try:
            w9_document = self.user_documents.filter(purpose="w9").first()
        except _:
            pass
        return w9_document


class Company(models.Model):
    # information
    type = models.CharField(
        max_length=255, default=BAND_TYPE
    )
    title = models.CharField(max_length=255, unique=True)
    owner_email = models.CharField(max_length=1024, unique=True, null=True, blank=True)
    email = models.CharField(max_length=1024, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    vimeo = models.CharField(max_length=255, blank=True, null=True)
    ein = models.CharField(max_length=50, blank=True, null=True)

    profile_photo_s3_url = models.CharField(max_length=500, blank=True, null=True)
    origin_profile_photo_s3_url = models.CharField(
        max_length=500, blank=True, null=True
    )
    business_type = models.CharField(
        max_length=255, choices=BUSINESS_TYPES, default=DEFAULT_BUSINESS_TYPES
    )
    # about
    summary = models.TextField(blank=True,null=True)
    # overview
    website = models.CharField(max_length=255, blank=True, null=True)
    headquarters = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    year_founded = models.CharField(max_length=255, blank=True, null=True)
    company_size = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "company"

    def __str__(self):
        return self.title

    def is_company_owner(self, benji_account: BenjiAccount):
        return benji_account.email == self.owner_email

    def is_user_staff(self, benji_account: BenjiAccount):
        """Check whether a BenjiAccount is a staff of this Company"""
        _is_staff = CompanyBenjiAccountEntry.objects.filter(
                benji_account=benji_account,
                company=self,
                relationship__in=[
                    ACCOUNT_COMPANY_RELATION_OWNER,
                    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
                    ACCOUNT_COMPANY_RELATION_COMMON_STAFF,
                ],
        ).exists()

        return _is_staff

    @property
    def company_owner(self) -> BenjiAccount:
        account_entry = CompanyBenjiAccountEntry.objects.filter(
            company=self,
            relationship=ACCOUNT_COMPANY_RELATION_OWNER,
        ).first()

        return account_entry.benji_account


class CompanySpecialities(models.Model):
    company = models.OneToOneField(
        Company, on_delete=models.CASCADE, related_name="specialities_company"
    )
    specialities = ArrayField(models.CharField(max_length=50), null=True, blank=True)

    class Meta:
        db_table = "company_specialities"


class CompanyPastClient(models.Model):
    company = models.OneToOneField(
        Company, on_delete=models.CASCADE, related_name="past_client_company"
    )
    past_client = ArrayField(models.CharField(max_length=50), null=True, blank=True)

    class Meta:
        db_table = "company_past_client"


class CompanyAward(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="award_company"
    )
    award_title = models.CharField(max_length=100, null=True, blank=True)
    award_year = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "company_award"


class CompanyPress(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="presses"
    )
    description = models.CharField(max_length=500, null=False, blank=False)
    url = models.CharField(max_length=1024, null=True, blank=True)

    class Meta:
        db_table = "company_press"


class UserContact(models.Model):
    class ContactSourceChoice(models.TextChoices):
        MANUAL = "manual"
        GOOGLE = "google"

    class SocialNetworkStatus(models.TextChoices):
        # invitee is not registered and invitor has not sent invite
        NOT_INVITED = "not_invited"
        # invitee is not registered and invitor has sent invite
        INVITE_SENT = "invite_sent"
        # invitee is registered and invitor has not sent invite
        NOT_CONNECTED = "not_connected"
        # invitee is registered and invitor has sent invite and invitee
        #    hasn't accepted
        CONNECT_REQUESTED = "connect_requested"
        # invitee is registered and invitor has sent invite and invitee accepted
        CONNECTED = "connected"
        # * From the logged-in user's persective:
        #   Got an connect request from invitee
        #   already, the user should aceept/reject the invite instead of sending invite
        #   back. Thus, the status is `pending_accept`.
        # * From the persective of the user who sent the connect request originally:
        #   This user should see status `connect_requested` in his/her contact list.
        PENDING_ACCEPT = "pending_accept"

    # invitor
    user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="imported_contacts",
        null=True,
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="imported_contacts",
        null=True,
    )
    email = models.CharField(max_length=1024, blank=False, null=False)
    display_name = models.CharField(max_length=500, null=False)
    imported_from = models.CharField(
        max_length=32,
        choices=ContactSourceChoice.choices,
        default="manual",
    )
    is_personal = models.BooleanField(
        default=True, help_text="whether belong to personal or company network"
    )
    is_invited = models.BooleanField(default=False)
    profile_photo_url = models.TextField(null=True)

    @property
    def is_registered(self):
        is_registered = BenjiAccount.objects.filter(
            email=self.email, is_active=True
        ).exists()
        if not is_registered:
            is_registered = Company.objects.filter(email=self.email).exists()

        return is_registered

    @property
    def is_connected(self):
        """
        When the invite is sent and the invitee has accepted the invite -> True
        Otherwise -> False
        """
        from ..personal_network.models import SocialNetwork
        is_connected = False
        if self.is_registered and self.user:
            invitee_personal_accepted = SocialNetwork.objects.filter(
                invitor=self.user, invitee__email=self.email, accepted=True
            ).exists()
            invitor_personal_accepted = SocialNetwork.objects.filter(
                invitor__email=self.email, invitee=self.user, accepted=True
            ).exists()
            invitee_company_accepted = SocialNetwork.objects.filter(
                invitor=self.user, invitee_company__email=self.email, accepted=True
            ).exists()
            invitor_company_accepted = SocialNetwork.objects.filter(
                invitor_company__email=self.email, invitee=self.user, accepted=True
            ).exists()
            is_connected = (
                (invitee_personal_accepted and invitor_personal_accepted) or
                (invitee_company_accepted and invitor_company_accepted)
            )
        elif self.is_registered and self.company:
            invitee_personal_accepted = SocialNetwork.objects.filter(
                invitor_company=self.company, invitee__email=self.email, accepted=True
            ).exists()
            invitor_personal_accepted = SocialNetwork.objects.filter(
                invitor__email=self.email, invitee_company=self.company, accepted=True
            ).exists()
            invitee_company_accepted = SocialNetwork.objects.filter(
                invitor_company=self.company,
                invitee_company__email=self.email,
                accepted=True,
            ).exists()
            invitor_company_accepted = SocialNetwork.objects.filter(
                invitor_company__email=self.email,
                invitee_company=self.company,
                accepted=True,
            ).exists()
            is_connected = (
                (invitee_personal_accepted and invitor_personal_accepted) or
                (invitee_company_accepted and invitor_company_accepted)
            )

        return is_connected

    @property
    def is_invite_pending(self):
        """The user has sent the invitation to the invitee, checking whether the
             invitee hasn't replied yet.

        if invite has not sent -> False
        if invite is sent and the invitee aceepted -> False
        if invite is sent and the invitee rejected -> True
        if invite is sent but the invitee has not replied -> True
        """
        from apps.personal_network.models import SocialNetwork
        is_pending = False
        if self.is_registered:
            is_invitee_not_replied = SocialNetwork.objects.filter(
                invitor=self.user,
                invitee__email=self.email,
                accepted=False,
            ).exists()
            is_invitee_company_not_replied = SocialNetwork.objects.filter(
                invitor=self.user,
                invitee_company__email=self.email,
                accepted=False,
            ).exists()
            if any([is_invitee_not_replied, is_invitee_company_not_replied]) is True:
                is_pending = True
        else:
            is_pending = self.is_invited

        return is_pending

    @property
    def is_requested_to_connect(self):
        """
        The user has gotten an invite from the invitee earlier.
        The user should accept/reject the invite and the user shouldn't send an invite
            back at this moment
        """
        from apps.personal_network.models import SocialNetwork
        is_requested = False
        if self.is_registered:
            is_requested = SocialNetwork.objects.filter(
                invitor__email=self.email,
                invitee=self.user,
                rejected=False,
                accepted=False,
            )
        if not is_requested:
            is_requested = SocialNetwork.objects.filter(
                invitor_company__email=self.email,
                invitee=self.user,
                rejected=False,
                accepted=False,
            )

        return is_requested

    @property
    def full_name(self):
        entity = None
        if self.is_registered:
            entity = BenjiAccount.objects.filter(email=self.email).first()
            if not entity:
                entity = Company.objects.get(email=self.email)

        if isinstance(entity, BenjiAccount):
            name = entity.full_name
        elif isinstance(entity, Company):
            name = entity.title
        else:
            name = self.display_name

        return name

    @property
    def first_name(self):
        entity = None
        name = None
        if self.is_registered:
            entity = BenjiAccount.objects.filter(email=self.email).first()

        if entity:
            name = entity.first_name

        return name

    @property
    def last_name(self):
        entity = None
        name = None
        if self.is_registered:
            entity = BenjiAccount.objects.filter(email=self.email).first()

        if entity:
            name = entity.last_name

        return name

    @property
    def job_title(self):
        entity = None
        name = None
        if self.is_registered:
            entity = BenjiAccount.objects.filter(email=self.email).first()

        if entity:
            name = entity.job_title

        return name

    @property
    def status(self):
        is_registered = self.is_registered
        is_invite_pending = self.is_invite_pending
        is_connected = self.is_connected
        is_requested_to_connect = self.is_requested_to_connect

        if not is_registered and is_invite_pending:
            status = self.SocialNetworkStatus.INVITE_SENT
        elif not is_registered and not is_invite_pending:
            status = self.SocialNetworkStatus.NOT_INVITED
        elif is_registered and is_requested_to_connect:
            status = self.SocialNetworkStatus.PENDING_ACCEPT
        elif is_registered and not is_invite_pending and not is_connected:
            status = self.SocialNetworkStatus.NOT_CONNECTED
        elif is_registered and is_invite_pending:
            status = self.SocialNetworkStatus.CONNECT_REQUESTED
        elif is_registered and is_connected:
            status = self.SocialNetworkStatus.CONNECTED

        return status

    class Meta:
        db_table = "imported_contact"


class UserHeadline(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="headline_user"
    )
    headline = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "user_headline"


class UserActiveSince(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="active_since_user"
    )
    year = models.IntegerField(null=True, blank=True)
    month = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "user_active_since"


class UserEducation(models.Model):
    user = models.ForeignKey(
        BenjiAccount, on_delete=models.CASCADE, related_name="education_user"
    )
    university = models.CharField(max_length=100, null=True, blank=True)
    degree = models.CharField(max_length=50, null=True, blank=True)
    study_field = models.CharField(max_length=50, null=True, blank=True)
    start_year = models.IntegerField(null=True, blank=True)
    end_year = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "user_education"


class PrimarySkill(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="primary_skills"
    )
    primary_skill = ArrayField(models.CharField(max_length=50), default=list)


class SecondarySkill(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="secondary_skills"
    )
    secondary_skill = ArrayField(models.CharField(max_length=50), default=list)


class ToolAndTechnology(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="tools_and_technologies"
    )
    tool_and_technology = ArrayField(models.CharField(max_length=50), default=list)


class UserDirector(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="director_user"
    )
    director = ArrayField(models.CharField(max_length=50), null=True, blank=True)
    director_photography = ArrayField(
        models.CharField(max_length=50), null=True, blank=True
    )

    class Meta:
        db_table = "user_director"


class UserProducer(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="producers"
    )
    producer = ArrayField(models.CharField(max_length=50), null=True, blank=True)

    class Meta:
        db_table = "user_producer"


class UserProductionCompany(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="production_company_user"
    )
    production_company = ArrayField(
        models.CharField(max_length=50), null=True, blank=True
    )

    class Meta:
        db_table = "user_production_company"


class UserAdvertisingAgency(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="advertising_agency_user"
    )
    advertising_agency = ArrayField(
        models.CharField(max_length=50), null=True, blank=True
    )

    class Meta:
        db_table = "user_advertising_agency"


class UserPastClient(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="past_client_user"
    )
    past_client = ArrayField(models.CharField(max_length=50), null=True, blank=True)

    class Meta:
        db_table = "user_past_client"


class UserAward(models.Model):
    user = models.ForeignKey(
        BenjiAccount, on_delete=models.CASCADE, related_name="award_user"
    )
    award_title = models.CharField(max_length=100, null=True, blank=True)
    award_year = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "user_award"


class UserPress(models.Model):
    user = models.ForeignKey(
        BenjiAccount, on_delete=models.CASCADE, related_name="presses"
    )
    description = models.CharField(max_length=500, null=False, blank=False)
    url = models.CharField(max_length=1024, null=True, blank=True)

    class Meta:
        db_table = "user_press"


class CompanyBenjiAccountEntry(models.Model):
    Relationships = [
        (ACCOUNT_COMPANY_RELATION_OWNER, ACCOUNT_COMPANY_RELATION_OWNER),
        (ACCOUNT_COMPANY_RELATION_CONTRACTOR, ACCOUNT_COMPANY_RELATION_CONTRACTOR),
        (
            ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
            ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
        ),
        (ACCOUNT_COMPANY_RELATION_COMMON_STAFF, ACCOUNT_COMPANY_RELATION_COMMON_STAFF),
        (ACCOUNT_COMPANY_BUSINESS_MEMBER, ACCOUNT_COMPANY_BUSINESS_MEMBER),

    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    relationship = models.CharField(
        max_length=255, choices=Relationships, default=ACCOUNT_COMPANY_RELATION_OWNER
    )
    dashboard_access = models.BooleanField(default=False)

    class Meta:
        db_table = "company_benji_account_entry"
        unique_together = (("company", "benji_account"),)


class InvitationToken(models.Model):
    token = models.CharField(max_length=255, null=True, blank=True)
    expiry = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class BenjiAccountActivationToken(InvitationToken):
    email = models.CharField(max_length=1024)


class BenjiAccountInvitationToken(InvitationToken):
    Relationships = [
        (ACCOUNT_COMPANY_RELATION_OWNER, ACCOUNT_COMPANY_RELATION_OWNER),
        (ACCOUNT_COMPANY_RELATION_CONTRACTOR, ACCOUNT_COMPANY_RELATION_CONTRACTOR),
        (
            ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
            ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
        ),
        (ACCOUNT_COMPANY_RELATION_COMMON_STAFF, ACCOUNT_COMPANY_RELATION_COMMON_STAFF),
        (ACCOUNT_COMPANY_NO_RELATION, ACCOUNT_COMPANY_NO_RELATION),
    ]
    user = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)
    relationship = models.CharField(
        max_length=255, choices=Relationships, default=ACCOUNT_COMPANY_RELATION_OWNER
    )


class BenjiAccountForgotPasswordToken(InvitationToken):
    user = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)


class PersonalNetworkInvitationToken(InvitationToken):
    user = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)


class CompanyAccessRequestToken(InvitationToken):
    user = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)


class GenericS3UploadedFile(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    path = models.CharField(max_length=255)
    size = models.IntegerField(default=0)
    purpose = models.CharField(max_length=100)
    user = models.ForeignKey(BenjiAccount, related_name="user_documents", on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = "s3_document"
        unique_together = (("user", "type", "size", "purpose", "name"),)


class CompanyLogout(models.Model):
    user = models.ForeignKey(BenjiAccount, related_name="logouts", on_delete=models.CASCADE)
    company = models.ForeignKey(Company,  on_delete=models.CASCADE)

    class Meta:
        unique_together = (("user", "company"),)


class DeleteCompany(models.Model):
    type = models.CharField(
        max_length=255, default=BAND_TYPE
    )
    title = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=1024, null=True, blank=True)
    review = models.TextField(blank=True)

    class Meta:
        db_table = "delete_company"


class DeleteUser(models.Model):
    reasons = [
        (I_HAVE_DUPLICATE_ACCOUNT, 'I_HAVE_DUPLICATE_ACCOUNT'),
        (GETTING_TO_MANY_MAILS, 'GETTING_TO_MANY_MAILS'),
        (NOT_GETTING_ANY_VALUE_FOR_MY_MEMBERSHIP, 'NOT_GETTING_ANY_VALUE_FOR_MY_MEMBERSHIP'),
        (PRIVACY_CONCERN, 'PRIVACY_CONCERN'),
        (RECEIVING_UNWANTED_CONTACT, 'RECEIVING_UNWANTED_CONTACT'),
        (OTHER, 'OTHER'),
    ]
    email = models.CharField(max_length=1024, unique=True)
    reason = models.CharField(max_length=1024, choices=reasons)
    review = models.TextField(blank=True, default="")

    class Meta:
        db_table = "delete_user"
