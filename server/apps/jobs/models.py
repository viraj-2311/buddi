from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models import CASCADE
from django.forms.models import model_to_dict

import jsonfield
from django.utils.functional import cached_property

from apps.jobs.constants import (AGENCY_MEMO, CONTRACTOR_W2_MEMO, CONTRACTOR_W9_MEMO, DEAL_MEMO, EMPLOYEE_MEMO, FIXED,
                                 HOLD_MEMO, HOURLY, JOB_STATUS_ACTIVE, JOB_STATUS_PENDING,
                                 JOB_STATUS_WRAPPED, ContractorAcceptanceLevel, MemoChoiceLevelInJob,
                                 PAY_WITHOUT_INVOICING, PAY_WITH_INVOICING)
from apps.user.models import BenjiAccount, Company, InvitationToken


class RawJSONField(JSONField):

    def db_type(self, connection):
        return "json"


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def to_dict(self):
        return model_to_dict(self)

    class Meta:
        abstract = True


class Job(BaseModel):
    JobStatuses = [
        (JOB_STATUS_PENDING, JOB_STATUS_PENDING),
        (JOB_STATUS_ACTIVE, JOB_STATUS_ACTIVE),
        (JOB_STATUS_WRAPPED, JOB_STATUS_WRAPPED),
    ]

    WrapAndPay = [
        (PAY_WITHOUT_INVOICING, 'PAY_WITHOUT_INVOICING'),
        (PAY_WITH_INVOICING, 'PAY_WITH_INVOICING'),
    ]

    class PaidBy(models.TextChoices):
        BANK = 'bank', 'bank'  # means bank account
        WALLET = 'wallet', 'wallet'  # means sila wallet

    client = models.CharField(max_length=255)
    agency = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)  # job name
    job_number = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField()
    wrap_date = models.DateField()
    status = models.CharField(max_length=255, choices=JobStatuses, default=JOB_STATUS_PENDING)
    is_archived = models.BooleanField(default=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    exec_producer = models.ForeignKey(BenjiAccount,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="exec_producer")
    exec_producer_name = models.CharField(max_length=255, blank=True, null=True)
    exec_producer_relationship = models.CharField(max_length=255, blank=True, null=True)
    director = models.ForeignKey(BenjiAccount,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 related_name="director")
    director_name = models.CharField(max_length=255, blank=True, null=True)
    director_relationship = models.CharField(max_length=255, blank=True, null=True)
    line_producer = models.ForeignKey(BenjiAccount,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="line_producer")
    line_producer_name = models.CharField(max_length=255, blank=True, null=True)
    line_producer_relationship = models.CharField(max_length=255, blank=True, null=True)
    wrap_and_pay_type = models.IntegerField(choices=WrapAndPay, blank=True, null=True)

    paid_by = models.CharField(max_length=32, null=True, blank=True, choices=PaidBy.choices)

    created = models.DateField(auto_now_add=True)
    set_time = models.CharField(max_length=255, blank=True, null=True)
    sound_check_time = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "job"
        unique_together = (
            ("company", "job_number"),
        )

    def __str__(self):
        return f"{self.title} - {self.job_number}"


class JobRoleId(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    exec_producer_id = models.IntegerField(null=True, blank=True)
    line_producer_id = models.IntegerField(null=True, blank=True)
    director_id = models.IntegerField(null=True, blank=True)
    production_manager_id = models.IntegerField(null=True, blank=True)
    production_coordinator_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "job_role_ids"


class JobRoleGroupId(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    talent_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "job_role_group_ids"


class JobSettings(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    ppb_settings = jsonfield.JSONField()

    class Meta:
        db_table = "job_settings"


class CrewTemplate(models.Model):
    name = models.CharField(max_length=255)
    template = RawJSONField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    class Meta:
        db_table = "crew_templates"
        unique_together = (("company", "name"),)


class JobShootDate(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        db_table = "job_shoot_dates"


class JobRoleGroup(models.Model):
    job_role_group_type = models.ForeignKey("JobRoleGroupType", on_delete=models.CASCADE, null=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_role_groups')
    order = models.IntegerField(null=True, blank=True)
    selected = models.BooleanField(default=True)

    class Meta:
        db_table = "job_role_group"
        unique_together = (("job_role_group_type", "job"),)

    def __str__(self):
        return self.job_role_group_type.title


class JobRole(models.Model):
    job_role_type = models.ForeignKey("JobRoleType", on_delete=models.CASCADE, null=True)
    job_role_group = models.ForeignKey(JobRoleGroup, on_delete=models.CASCADE)

    class Meta:
        db_table = "job_role"
        unique_together = (("job_role_type", "job_role_group"),)

    def __str__(self):
        return "%s -> %s" % (self.job_role_group.job_role_group_type.title,
                             self.job_role_group.job_role_group_type.title)


class JobRoleBudget(models.Model):
    budget = models.IntegerField(null=True)
    job_role = models.ForeignKey(JobRole, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        db_table = "job_role_budget"


class JobMemoManager(models.Manager):
    def get_full_name(self):
        try:
            full_name = self.benji_account.get_full_name()
        except AttributeError:
            full_name = self.full_name
        return full_name

    def get_email(self):
        try:
            email = self.benji_account.email
        except AttributeError:
            email = self.email
        return email


class JobMemo(models.Model):
    MemoTypes = [
        (HOLD_MEMO, HOLD_MEMO),
        (DEAL_MEMO, DEAL_MEMO),
    ]
    MemoStaffs = [
        (CONTRACTOR_W2_MEMO, CONTRACTOR_W2_MEMO),
        (CONTRACTOR_W9_MEMO, CONTRACTOR_W9_MEMO),
        (EMPLOYEE_MEMO, EMPLOYEE_MEMO),
        (AGENCY_MEMO, AGENCY_MEMO),
    ]
    PriceTypes = [
        (HOURLY, HOURLY),
        (FIXED, FIXED),
    ]
    AcceptanceLevel = [
        (ContractorAcceptanceLevel.FIRST, "1st"),
        (ContractorAcceptanceLevel.SECOND, "2nd"),
        (ContractorAcceptanceLevel.THIRD, "3rd"),
    ]
    ChoiceLevel = [
        (MemoChoiceLevelInJob.FIRST, "1st Choice"),
        (MemoChoiceLevelInJob.SECOND, "2nd Choice"),
        (MemoChoiceLevelInJob.THIRD, "3rd Choice"),
    ]

    memo_type = models.CharField(max_length=255, choices=MemoTypes, default=HOLD_MEMO)
    memo_staff = models.CharField(max_length=255, choices=MemoStaffs, default=EMPLOYEE_MEMO)
    memo_sender = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="sender_job_memo")
    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="receiver_job_memo")
    email = models.CharField(max_length=1024)
    full_name = models.CharField(max_length=255)
    agency = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="agency_job_memo",
                               blank=True, null=True)
    agency_email = models.CharField(max_length=1024, blank=True, null=True)
    agency_full_name = models.CharField(max_length=255, blank=True, null=True)
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    pay_terms = models.PositiveIntegerField(default=0, blank=True, null=True)
    price_type = models.CharField(max_length=255, choices=PriceTypes, default=FIXED)
    daily_hours = models.CharField(max_length=255, null=True)
    working_days = models.PositiveIntegerField(default=0, blank=True, null=True)
    working_rate = models.FloatField(default=0, blank=True, null=True)
    kit_fee = models.PositiveIntegerField(default=0, blank=True, null=True)
    project_rate = models.FloatField(default=0, blank=True, null=True)
    acceptance_level = models.IntegerField(choices=AcceptanceLevel, blank=True, null=True)
    choice_level = models.IntegerField(choices=ChoiceLevel, blank=True, null=True)
    accepted = models.BooleanField(default=False)
    decline = models.BooleanField(default=False)
    booked = models.BooleanField(default=False)
    canceled = models.BooleanField(default=False)
    is_memo = models.BooleanField(default=True)
    optional_message = models.CharField(max_length=500, blank=True, null=True)
    headline = models.TextField(null=True, blank=True)
    job = models.ForeignKey(Job, related_name="job_memos", on_delete=CASCADE, blank=True, null=True)
    objects = JobMemoManager()

    class Meta:
        db_table = "job_memo"
        unique_together = (("benji_account", "job_role", "memo_type"),)

    @property
    def memo_status(self):
        if self.accepted:
            return "Confirm"
        elif self.decline:
            return "Decline"
        elif self.booked:
            return "Sent"
        else:
            return ""

    @property
    def contract_value(self):
        total_value = 0.0
        if self.price_type == HOURLY:
            total_value = self.working_days * self.working_rate + self.kit_fee
        elif self.price_type == FIXED:
            total_value = self.project_rate + self.kit_fee
        return total_value

    @cached_property
    def added_rates_value(self):
        return sum(rate.total_amount for rate in self.rates.all())

    @cached_property
    def get_total_price(self):
        total_price = self.contract_value + self.added_rates_value
        return total_price


class JobMemoRate(models.Model):
    job_memo = models.ForeignKey(JobMemo, on_delete=models.CASCADE, related_name='rates')
    title = models.CharField(max_length=100)
    number_of_days = models.PositiveIntegerField(default=1)
    day_rate = models.FloatField(default=0.0)
    project_rate = models.FloatField(default=0.0)
    price_type = models.CharField(max_length=20, default="FIXED")

    class Meta:
        db_table = "job_memo_rate"

    @property
    def total_amount(self):
        if self.price_type == "FIXED":
            return self.project_rate
        return self.day_rate * self.number_of_days


class JobMemoAttachment(models.Model):
    job_memo = models.ForeignKey(JobMemo, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    path = models.CharField(max_length=255, blank=True, null=True)
    size = models.IntegerField(default=0)
    uploaded_by = models.ForeignKey(BenjiAccount, blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = "job_memo_attachment"


class VirtualMemo(models.Model):
    MemoTypes = [
        (HOLD_MEMO, HOLD_MEMO),
        (DEAL_MEMO, DEAL_MEMO),
    ]
    ChoiceLevel = [
        (MemoChoiceLevelInJob.FIRST, "1st Choice"),
        (MemoChoiceLevelInJob.SECOND, "2nd Choice"),
        (MemoChoiceLevelInJob.THIRD, "3rd Choice"),
    ]

    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    choice_level = models.IntegerField(choices=ChoiceLevel, null=True)
    is_memo = models.BooleanField(default=False)

    class Meta:
        db_table = "virtual_memo"


class JobMemoShootDate(models.Model):
    job_memo = models.ForeignKey(JobMemo, on_delete=models.CASCADE, related_name="shoot_dates")
    date = models.DateField()

    class Meta:
        db_table = "job_memo_shoot_dates"


class JobRoleBudgetLineItem(models.Model):
    budget = models.IntegerField(null=True)
    job_role_budget = models.ForeignKey(JobRoleBudget, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        db_table = "job_role_budget_line_item"


class JobRoleGroupType(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=500, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = "job_role_group_type"
        # unique_together = (("title", "job"),)

    def __str__(self):
        return self.title


class JobRoleType(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=500, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = "job_role_type"
        # unique_together = (("title", "job"),)

    def __str__(self):
        return self.title


class Location(models.Model):
    location_title = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    zip_code = models.CharField(max_length=255)
    link = models.CharField(max_length=255, blank=True, null=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="job")
    notes = models.CharField(max_length=255, null=True, blank=True)
    lat = models.CharField(max_length=255, null=True, blank=True)
    lng = models.CharField(max_length=255, null=True, blank=True)
    view_mode = models.CharField(max_length=50, null=True, blank=True)
    timezone = models.CharField(max_length=50, null=True, blank=True)
    image = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = "location"

    def __str__(self):
        return f"{self.address_line1},{self.city},{self.state} {self.zip_code}"

    def get_address(self):
        return f"{self.address_line1},{self.city},{self.state} {self.zip_code}"


class ClientCallSheet(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    production_contact = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    production_contact_phone = models.CharField(max_length=255)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="clientcallsheet_location")
    hospital = models.CharField(max_length=255)
    hospital_state = models.CharField(max_length=255, null=True, blank=True)
    hospital_city = models.CharField(max_length=255, null=True, blank=True)
    hospital_address_line1 = models.CharField(max_length=255, null=True, blank=True)
    hospital_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    hospital_zip_code = models.CharField(max_length=255, null=True, blank=True)
    parking = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    notes = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "client_call_sheet"


class CallSheet(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    production_contact = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE)
    production_contact_phone = models.CharField(max_length=255)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="callsheet_location")
    hospital = models.CharField(max_length=255)
    hospital_state = models.CharField(max_length=255, null=True, blank=True)
    hospital_city = models.CharField(max_length=255, null=True, blank=True)
    hospital_address_line1 = models.CharField(max_length=255, null=True, blank=True)
    hospital_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    hospital_zip_code = models.CharField(max_length=255, null=True, blank=True)
    parking = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    notes = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "call_sheet"


class CallSheetJobMemo(models.Model):
    call_sheet = models.ForeignKey(CallSheet, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    job_memo = models.ForeignKey(JobMemo, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)

    class Meta:
        db_table = "call_sheet_job_memo"


class Schedule(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="schedule_job")
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=10, default="#000000")
    date = models.DateField()
    time = models.TimeField()
    text_display = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    zip_code = models.CharField(max_length=255, blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "schedule"


class UserSchedule(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = "user_schedule"


class ShootNote(models.Model):
    job_shoot_date = models.ForeignKey(JobShootDate, on_delete=models.CASCADE)
    time = models.TimeField()
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    zip_code = models.CharField(max_length=255, blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "shoot_note"


class JobBid(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="bid_job")
    document = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "job_bid"


class Script(models.Model):
    document = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "script"


class JobScript(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="script_job")
    script = models.ForeignKey(Script, on_delete=models.CASCADE)

    class Meta:
        db_table = "job_script"


class Document(models.Model):
    title = models.CharField(max_length=100)
    document = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "document"


class JobDocument(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="document_job")
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    class Meta:
        db_table = "job_document"


class Cast(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="cast_job")
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE, null=True, blank=True)
    role_title = models.CharField(max_length=50)
    full_name = models.CharField(max_length=50)
    profile_photo = models.CharField(max_length=500, blank=True, null=True)
    origin_profile_photo = models.CharField(max_length=500, blank=True, null=True)
    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = "cast"


class Wardrobe(models.Model):
    cast = models.ForeignKey(Cast, on_delete=models.CASCADE)
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "wardrobe"


class WardrobeNote(models.Model):
    wardrobe = models.ForeignKey(Wardrobe, on_delete=models.CASCADE)
    number = models.IntegerField()
    x_coord = models.FloatField()
    y_coord = models.FloatField()
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "wardrobe_note"
        # unique_together = (("wardrobe", "number"),)


class Agency(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="agency_job")
    profile_photo = models.CharField(max_length=255, blank=True, null=True)
    origin_profile_photo = models.CharField(max_length=255, blank=True, null=True)
    agency_contact = models.CharField(max_length=50)
    agency_contact_title = models.CharField(max_length=50)
    agency_address = models.CharField(max_length=255)
    state = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    class Meta:
        db_table = "agency"


class AgencyContact(BaseModel):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name="contacts")
    agency_contact = models.CharField(max_length=50)
    agency_contact_title = models.CharField(max_length=50)

    class Meta:
        db_table = "agency_contact"


class Client(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="client_job")
    profile_photo = models.CharField(max_length=255, blank=True, null=True)
    origin_profile_photo = models.CharField(max_length=255, blank=True, null=True)
    client_contact = models.CharField(max_length=50)
    client_contact_title = models.CharField(max_length=50)
    client_address = models.CharField(max_length=255)
    state = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    class Meta:
        db_table = "client"

    def get_profile_photo(self):
        if self.profile_photo:
            return self.profile_photo
        elif self.job.client_logo_s3_url:
            return self.job.client_logo_s3_url
        else:
            return None


class ClientContact(BaseModel):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="contacts")
    client_contact = models.CharField(max_length=50)
    client_contact_title = models.CharField(max_length=50)

    class Meta:
        db_table = "client_contact"


class JobMemoInvitationToken(InvitationToken):
    job_memo = models.ForeignKey(
        JobMemo,
        related_name="invitation_tokens",
        on_delete=models.CASCADE,
    )


class CompanyDashboardJobRoles(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = "company_dashboard_job_roles"
        unique_together = (("company", "job_role"),)


class PreProductionBook(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="ppb_job")
    data = JSONField(null=True, blank=True)
    is_cover_updated = models.BooleanField(default=False)
    is_title_updated = models.BooleanField(default=False)
    is_attendees_updated = models.BooleanField(default=False)
    is_board_script_updated = models.BooleanField(default=False)
    is_schedule_updated = models.BooleanField(default=False)
    is_cast_updated = models.BooleanField(default=False)
    is_wardrobe_updated = models.BooleanField(default=False)
    is_callsheet_updated = models.BooleanField(default=False)
    is_location_updated = models.BooleanField(default=False)
    is_weather_updated = models.BooleanField(default=False)
    is_thank_you_updated = models.BooleanField(default=False)
    is_watermark_updated = models.BooleanField(default=False)

    class Meta:
        db_table = "job_pre_production_book"
