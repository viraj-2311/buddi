import pdb

from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.jobs.constants import (
    ACCOUNT_COMPANY_OWN_RELATIONS,
    DEAL_MEMO,
    HOLD_MEMO,
    JOB_STATUS_ACTIVE,
)
from apps.jobs.exceptions import UserCredentialWrongError, UserNotActivatedError
from apps.jobs.models import JobMemo, Job
from apps.jobs.utils import (
    get_dashboard_access_role_ids,
    get_exec_producer_id,
    get_line_producer_id,
)
from apps.user.constants import PASSWORD, REG_SR_FIELDS
from apps.user.models import (
    BenjiAccount,
    Company,
    CompanyBenjiAccountEntry,
    UserActiveSince,
    UserAdvertisingAgency,
    UserAward,
    UserDirector,
    UserEducation,
    UserHeadline,
    UserPastClient,
    UserPress,
    UserProductionCompany,
    PrimarySkill,
    SecondarySkill,
    ToolAndTechnology, UserProducer, UserContact, GenericS3UploadedFile, CompanyLogout,
    CompanyAward, CompanyPress, CompanySpecialities, CompanyPastClient
)


class BenjiTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):  # noqa
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            self.user = BenjiAccount.objects.get(
                email__iexact=authenticate_kwargs["email"]
            )
        except BenjiAccount.DoesNotExist:
            raise UserCredentialWrongError()
        if not self.user.check_password(authenticate_kwargs["password"]):
            raise UserCredentialWrongError()
        if not self.user.is_active:
            raise UserNotActivatedError()
        data = {}
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["user"] = BenjiAccountSerializer(instance=self.user).data
        # Get its related company
        company_benji_account_entries = CompanyBenjiAccountEntry.objects.filter(
            benji_account=self.user,
            relationship__in=ACCOUNT_COMPANY_OWN_RELATIONS,
            dashboard_access=True,
        )
        company = []
        company_titles = []
        for company_benji_account_entry in company_benji_account_entries:
            own_company = company_benji_account_entry.company
            relationship = company_benji_account_entry.relationship
            own_company = CompanySerializer(instance=own_company).data
            own_company["relationship"] = relationship
            company.append(own_company)
            company_titles.append(own_company["title"])
        job_memos = JobMemo.objects.filter(benji_account=self.user, accepted=True)
        for job_memo in job_memos:
            job_role = job_memo.job_role
            job = job_role.job_role_group.job
            job_company = job_role.job_role_group.job.company
            if CompanyLogout.objects.filter(user=self.user, company=job_company).count() > 0:
                continue
            if job.status == JOB_STATUS_ACTIVE:
                memo_type = DEAL_MEMO
            else:
                memo_type = HOLD_MEMO
            add_company = False
            if job_role.pk in [get_exec_producer_id(job), get_line_producer_id(job)]:
                if job_memo.memo_type == DEAL_MEMO:
                    add_company = True
                else:
                    if memo_type == HOLD_MEMO:
                        add_company = True
                    else:
                        try:
                            deal_memo = JobMemo.objects.get(
                                job_role=job_role,
                                memo_type=DEAL_MEMO,
                                benji_account=job_memo.benji_account,
                            )
                            if not deal_memo.decline:
                                add_company = True
                        except JobMemo.DoesNotExist:
                            add_company = False
            elif job_role.pk in get_dashboard_access_role_ids(job):
                if memo_type == job_memo.memo_type:
                    add_company = True
            if add_company:
                title = job_role.job_role_group.job.company.title
                if title not in company_titles:
                    try:
                        pc_data = CompanySerializer(
                            instance=job_role.job_role_group.job.company
                        ).data
                        pc_data["relationship"] = CompanyBenjiAccountEntry.objects.get(
                            benji_account=self.user,
                            company=job_role.job_role_group.job.company,
                            dashboard_access=True,
                        ).relationship
                        company.append(pc_data)
                    except Exception as e:
                        title = None
                    if title:
                        company_titles.append(title)
        data["company"] = company
        self.user.last_login = timezone.now()
        self.user.save()
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["email"] = user.email
        token["client_id"] = user.pk
        return token


class SignupSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(required=True,
    #                                  style={"input_type": "password"},
    #                                  allow_blank=False,
    #                                  validators=[RegexValidator(PASSWORD_REG_EX, message=INVALID_PASSWORD_MSG)])
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=BenjiAccount.objects.all(),
                message="The account with this email already exists.",
                lookup="iexact",
            )
        ],
    )

    def create(self):
        benji_account = get_user_model().objects.create_user(**self.validated_data)
        benji_account.is_active = False
        benji_account.save()
        return benji_account

    def save(self):
        benji_account_info = {"is_active": True}
        for key in REG_SR_FIELDS:
            try:
                benji_account_info[key] = self.validated_data[key]
            except KeyError:
                pass
        benji_account = get_user_model().objects.create_user(**benji_account_info)
        return benji_account

    class Meta:
        model = get_user_model()
        fields = "__all__"
        extra_kwargs = {
            PASSWORD: {"write_only": True},
        }


class BenjiAccountSerializer(serializers.ModelSerializer):
    w9_document = serializers.SerializerMethodField()

    class Meta:
        model = BenjiAccount
        exclude = ("password",)

    def get_w9_document(self, obj):
        if obj.w9_document:
            return GenericS3UploadedFileSerializer(obj.w9_document).data
        return None


class CompanyPressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPress
        exclude = ("company",)



class CompanyAwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAward
        exclude = ("company",)


class CompanyPastClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPastClient
        exclude = ("company",)


class CompanySpecialitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySpecialities
        exclude = ("company",)


class UserPressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPress
        exclude = ("user",)


class UserAwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAward
        exclude = ("user",)


class UserEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEducation
        exclude = ("user",)


class UserProducerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProducer
        exclude = ("user",)


class UserPrimarySkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrimarySkill
        exclude = ("id",)


class UserSecondarySkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecondarySkill
        exclude = ("id",)


class UserToolAndTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolAndTechnology
        exclude = ("id",)


class UserContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContact
        fields = (
            'id',
            'email',
            'full_name',
            # 'benji_account_id',
            'is_registered',
            'first_name',
            'last_name',
            'imported_from',
            'job_title',
            'status',
            'profile_photo_url',
        )


class UserProfileSerializer(serializers.ModelSerializer):
    headline = serializers.SerializerMethodField()
    active_since = serializers.SerializerMethodField()
    educations = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    directors = serializers.SerializerMethodField()
    producers = serializers.SerializerMethodField()
    production_companies = serializers.SerializerMethodField()
    advertising_agencies = serializers.SerializerMethodField()
    past_clients = serializers.SerializerMethodField()
    awards = serializers.SerializerMethodField()
    presses = serializers.SerializerMethodField()
    w9_document = serializers.SerializerMethodField()

    def get_w9_document(self, obj):
        if obj.w9_document:
            return GenericS3UploadedFileSerializer(obj.w9_document).data
        return None

    def get_headline(self, obj):
        try:
            user_headline = UserHeadline.objects.get(user=obj).headline
        except UserHeadline.DoesNotExist:
            user_headline = ""
        return user_headline

    def get_active_since(self, obj):
        try:
            user_active_since = UserActiveSince.objects.get(user=obj)
            year = user_active_since.year
            month = user_active_since.month
        except UserActiveSince.DoesNotExist:
            year = None
            month = None
        return {"year": year, "month": month}

    def get_educations(self, obj):
        user_educations = UserEducation.objects.filter(user=obj)
        results = []
        for user_education in user_educations:
            results.append(
                {
                    "id": user_education.id,
                    "university": user_education.university,
                    "degree": user_education.degree,
                    "study_field": user_education.study_field,
                    "start_year": user_education.start_year,
                    "end_year": user_education.end_year,
                }
            )
        return results

    def get_skills(self, obj):
        try:
            primary_skill_obj = PrimarySkill.objects.get(user=obj)
            primary_skill = UserPrimarySkillSerializer(primary_skill_obj).data
        except PrimarySkill.DoesNotExist:
            primary_skill = {}
        try:
            secondary_skill_obj = SecondarySkill.objects.get(user=obj)
            secondary_skill = UserSecondarySkillSerializer(secondary_skill_obj).data
        except SecondarySkill.DoesNotExist:
            secondary_skill = {}
        try:
            tool_and_technology_obj = ToolAndTechnology.objects.get(user=obj)
            tool_and_technology = UserToolAndTechnologySerializer(
                tool_and_technology_obj
            ).data
        except ToolAndTechnology.DoesNotExist:
            tool_and_technology = {}
        return {
            "primary_skills": primary_skill,
            "secondary_skills": secondary_skill,
            "tools_and_technologies": tool_and_technology,
        }

    def get_producers(self, obj):
        try:
            producers = UserProducer.objects.get(user=obj)
        except UserProducer.DoesNotExist:
            producers = []
        return {"producers": UserProducerSerializer(producers).data}

    def get_directors(self, obj):
        try:
            user_director = UserDirector.objects.get(user=obj)
            director = user_director.director
            director_photography = user_director.director_photography
        except UserDirector.DoesNotExist:
            director = []
            director_photography = []
        return {"directors": director, "directors_photography": director_photography}

    def get_production_companies(self, obj):
        try:
            user_production_company = UserProductionCompany.objects.get(user=obj)
            production_company = user_production_company.production_company
        except UserProductionCompany.DoesNotExist:
            production_company = []
        return production_company

    def get_advertising_agencies(self, obj):
        try:
            user_advertising_agency = UserAdvertisingAgency.objects.get(user=obj)
            advertising_agency = user_advertising_agency.advertising_agency
        except UserAdvertisingAgency.DoesNotExist:
            advertising_agency = []
        return advertising_agency

    def get_past_clients(self, obj):
        try:
            user_past_client = UserPastClient.objects.get(user=obj)
            past_client = user_past_client.past_client
        except UserPastClient.DoesNotExist:
            past_client = []
        return past_client

    def get_awards(self, obj):
        user_awards = UserAward.objects.filter(user=obj)
        results = []
        for user_award in user_awards:
            results.append(
                {
                    "id": user_award.id,
                    "title": user_award.award_title,
                    "year": user_award.award_year,
                }
            )
        return results

    def get_presses(self, obj):
        try:
            press = obj.presses.all()
        except UserPress.DoesNotExist:
            press = []
        return UserPressSerializer(press, many=True).data

    def validate(self, data):
        if not data.get('birthday'):
            data.pop('bithday', None)
        return data

    class Meta:
        model = BenjiAccount
        exclude = ("password",)


class CompanySerializer(serializers.ModelSerializer):
    past_clients = serializers.SerializerMethodField('get_past_clients')
    awards = serializers.SerializerMethodField('get_awards')
    presses = serializers.SerializerMethodField('get_presses')
    specialities = serializers.SerializerMethodField('get_specialities')

    class Meta:
        model = Company
        fields = [
            "id",
            "type",
            "title",
            "owner_email",
            "email",
            "phone",
            "city",
            "state",
            "zip_code",
            "address",
            "vimeo",
            "ein",
            "profile_photo_s3_url",
            "origin_profile_photo_s3_url",
            "business_type",
            "summary",
            "website",
            "headquarters",
            "industry",
            "year_founded",
            "company_size",
            "past_clients",
            "awards",
            "presses",
            "specialities"
        ]

    def get_past_clients(self, obj):
        try:
            company_past_clients = CompanyPastClient.objects.get(company=obj)
            past_client = company_past_clients.past_client
        except CompanyPastClient.DoesNotExist:
            past_client = []
        return past_client

    def get_awards(self, obj):
        try:
            award = obj.award_company.all()
        except CompanyAward.DoesNotExist:
            award = []
        return CompanyAwardSerializer(award, many=True).data

    def get_presses(self, obj):
        try:
            press = obj.presses.all()
        except CompanyPress.DoesNotExist:
            press = []
        return CompanyPressSerializer(press, many=True).data

    def get_specialities(self, obj):
        try:
            company_specialities = CompanySpecialities.objects.get(company=obj)
            specialities = company_specialities.specialities
        except CompanySpecialities.DoesNotExist:
            specialities = []
        return specialities


class GenericS3UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericS3UploadedFile
        fields = "__all__"


class JobDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "client", "title", "start_date", "wrap_date"]


class CompanyLogoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLogout
        fields = "__all__"


class CompanyDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("password",)
        extra_kwargs = {
            PASSWORD: {"write_only": True},
        }
