from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from bs4 import BeautifulSoup as BSHTML
from rest_framework import serializers

from apps.finance.models import InvoiceMemo
from apps.jobs.constants import (ACCOUNT_COMPANY_CONTRACTOR_RELATIONS, DEAL_MEMO, HOLD_MEMO, JOB_STATUS_ACTIVE,
                                 JOB_STATUS_PENDING, JOB_STATUS_WRAPPED, MemoChoiceLevelInJob, INVOICE_STATUS_APPROVED,
                                 INVOICE_STATUS_IN_DISPUTE)
from apps.jobs.models import (Agency, AgencyContact, CallSheet, Cast, Client, ClientCallSheet, ClientContact,
                              CrewTemplate, Document, Job, JobBid, JobMemo, JobMemoAttachment,
                              JobRole, JobRoleGroup, JobRoleGroupType, JobRoleId, JobRoleType, JobScript, JobShootDate,
                              Location, Schedule, Script, ShootNote, UserSchedule, VirtualMemo, Wardrobe, WardrobeNote,
                              JobMemoRate)
from apps.jobs.utils import get_all_job_dates, get_all_job_memo_dates
from apps.user.models import BenjiAccount
from apps.user.serializers import BenjiAccountSerializer, CompanySerializer
from apps.user.utils import get_account_company_relationship

from apps.jobs.models import PreProductionBook


class ChoicesField(serializers.Field):
    def __init__(self, choices, **kwargs):
        self._choices = choices
        super(ChoicesField, self).__init__(**kwargs)

    def to_representation(self, obj):
        return self._choices[obj]

    def to_internal_value(self, data):
        return getattr(self._choices, data)


class JobRoleGroupTypeReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleGroupType
        exclude = ("company", "job")


class JobRoleGroupTypeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleGroupType
        fields = "__all__"
        # validators = [
        #     serializers.UniqueTogetherValidator(
        #         queryset=model.objects.all(),
        #         fields=("title", "job"),
        #         message="This department already exists.",
        #     ),
        # ]


class JobRoleTypeReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleType
        exclude = ("company", "job")


class JobRoleTypeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleType
        fields = "__all__"
        # validators = [
        #     serializers.UniqueTogetherValidator(
        #         queryset=model.objects.all(),
        #         fields=("title", "job"),
        #         message="This gig role already exists.",
        #     ),
        # ]


class LocationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        exclude = ("job",)


class JobMemoAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.SerializerMethodField()
    class Meta:
        model = JobMemoAttachment
        exclude = ("job_memo",)

    def get_uploaded_by(self, obj: JobMemoAttachment):
        if obj.uploaded_by:
            return obj.uploaded_by.full_name
        return None

class JobMemoRateSerializer(serializers.ModelSerializer):
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = JobMemoRate
        fields = '__all__'


class JobMemoSerializer(serializers.ModelSerializer):
    shoot_dates = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()
    memo_status = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    rates = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = JobMemo
        fields = "__all__"
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=("benji_account", "job_role", "memo_type"),
                message="This user has already been assigned to this gig role.",
            ),
        ]

    def get_attachments(self, obj):
        if (
                self.context and
                ((not self.context.get("attachments", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        attachments = JobMemoAttachment.objects.only('uploaded_by').filter(job_memo=obj)
        return JobMemoAttachmentSerializer(attachments, many=True).data

    def get_memo_status(self, obj: JobMemo):
        if (
                self.context and
                ((not self.context.get("memo_status", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        return obj.memo_status

    def get_shoot_dates(self, obj: JobMemo):
        if (
                self.context and
                ((not self.context.get("shoot_dates", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        return obj.shoot_dates.values_list('date', flat=True)

    def get_dates(self, obj: JobMemo):
        if (
                self.context and
                ((not self.context.get("dates", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        return get_all_job_memo_dates(obj)

    def get_rates(self, obj: JobMemo):
        if (
                self.context and
                ((not self.context.get("rates", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        if self.context.get('reports', False):
            rates = JobMemoRateSerializer(obj.rates.all(), many=True).data
            from apps.finance.serializers import InvoiceLineItemReadSerializer
            rates += InvoiceLineItemReadSerializer(
                obj.invoicememo.invoice.line_items.all(),
                many=True
            ).data
            from apps.finance.serializers import InvoiceReceiptReadSerializer
            rates += InvoiceReceiptReadSerializer(
                obj.invoicememo.invoice.receipts.all(),
                many=True
            ).data
            return rates
        return JobMemoRateSerializer(obj.rates.all(), many=True).data

    def get_total_price(self, obj: JobMemo):
        if (
                self.context and
                ((not self.context.get("total_price", False)) and
                 (not self.context.get("reports", False)))
        ):
            return None
        return obj.get_total_price


class VirtualMemoSerializer(serializers.ModelSerializer):

    class Meta:
        model = VirtualMemo
        fields = "__all__"
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=("benji_account", "job_role"),
                message="This user has already been assigned to this gig role.",
            ),
        ]


class VirtualMemoReadSerializer(serializers.ModelSerializer):
    benji_account = BenjiAccountSerializer(read_only=True, many=False)

    class Meta:
        model = VirtualMemo
        fields = "__all__"
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=("benji_account", "job_role"),
                message="This user has already been assigned to this gig role.",
            ),
        ]


class LocationWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = "__all__"


class JobReadSerializer(serializers.ModelSerializer):
    exec_producer = BenjiAccountSerializer(read_only=True, many=False)
    director = BenjiAccountSerializer(read_only=True, many=False)
    line_producer = BenjiAccountSerializer(read_only=True, many=False)
    start_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    wrap_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    crew_budget = serializers.SerializerMethodField()
    shoot_dates = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    shoot_dates_string = serializers.SerializerMethodField()
    exec_producer_role_id = serializers.SerializerMethodField()
    line_producer_role_id = serializers.SerializerMethodField()
    director_role_id = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"

    def get_exec_producer_role_id(self, obj: Job):
        job_role_id, created = JobRoleId.objects.get_or_create(job=obj)
        return job_role_id.exec_producer_id

    def get_line_producer_role_id(self, obj):
        job_role_id, created = JobRoleId.objects.get_or_create(job=obj)
        return job_role_id.line_producer_id

    def get_director_role_id(self, obj):
        job_role_id, created = JobRoleId.objects.get_or_create(job=obj)
        return job_role_id.director_id

    def get_company(self, obj):
        return obj.company.title

    def get_shoot_dates(self, obj):
        return JobShootDate.objects.filter(job=obj).values_list('date', flat=True)

    def get_shoot_dates_string(self, obj):
        return get_all_job_dates(obj)

    def get_crew_budget(self, obj):  # noqa
        if obj.status == JOB_STATUS_PENDING:
            memo_type = HOLD_MEMO
        elif obj.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        elif obj.status == JOB_STATUS_WRAPPED:
            memo_type = DEAL_MEMO
        else:
            return 0

        memos = JobMemo.objects.select_related('job_role').filter(
            memo_type=memo_type,
            choice_level__in=[
                MemoChoiceLevelInJob.FIRST,
                MemoChoiceLevelInJob.SECOND,
                MemoChoiceLevelInJob.THIRD,
            ],
            accepted=True,
            job_role__job_role_group__job=obj,
        )

        crew_budget = 0
        for job_memo in memos:
            # if get_account_company_relationship(
            #         job_memo.job_role.job_role_group.job.company_id, job_memo.benji_account_id,
            # ) in ACCOUNT_COMPANY_CONTRACTOR_RELATIONS:
            if obj.status == JOB_STATUS_WRAPPED:
                try:
                    if job_memo.invoicememo.invoice.invoice_status == INVOICE_STATUS_APPROVED:
                        crew_budget += job_memo.invoicememo.invoice.total_invoice_amount
                    elif job_memo.invoicememo.invoice.invoice_status == INVOICE_STATUS_IN_DISPUTE:
                        continue
                    else:
                        crew_budget += job_memo.get_total_price
                except ObjectDoesNotExist:
                    crew_budget += job_memo.get_total_price
            else:
                crew_budget += job_memo.get_total_price

        return crew_budget

class JobReadSerializerChild(JobReadSerializer):
    exec_producer = None
    director = None
    line_producer = None
    start_date = None
    wrap_date = None
    crew_budget = None
    shoot_dates = None
    company = None
    shoot_dates_string = None
    exec_producer_role_id = None
    line_producer_role_id = None
    director_role_id = None


class JobGallerySerializer(serializers.ModelSerializer):
    shoot_dates_string = serializers.SerializerMethodField()
    crews = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    invoice_total = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"

    def get_shoot_dates_string(self, obj):
        return get_all_job_dates(obj)

    def get_crews(self, obj):
        users = list(JobMemo.objects.filter(Q(job_role__job_role_group__job=obj)
                                            & Q(accepted=True)).values_list("benji_account", flat=True).distinct())
        response_data = []
        for user in users:
            user = BenjiAccount.objects.get(pk=user)
            data = BenjiAccountSerializer(instance=user).data
            response_data.append(data)
        return response_data

    def get_company(self, obj):
        return CompanySerializer(instance=obj.company).data

    def get_invoice_total(self, obj):
        if obj.status == "WRAPPED":
            job_memos = JobMemo.objects.filter(job=obj)
            job_memo = JobMemoSerializer(instance=job_memos, many=True).data
            total = sum(d.get('total_price', 0) for d in job_memo)
        else:
            total = None
        return total

    def get_payment_status(self, obj):
        if obj.status == "WRAPPED":
            try:
                job_memo = JobMemo.objects.filter(job=obj).last()
                payment_status = job_memo.invoicememo.invoice.payment_status
            except ObjectDoesNotExist:
                payment_status = None
        else:
            payment_status = None
        return payment_status

class JobGalleryArchiveSerializer(JobGallerySerializer):

    def get_invoice_total(self, obj):
        if obj.status == "WRAPPED":
            total = 0
            job_memos = JobMemo.objects.filter(job=obj).select_related("invoicememo")
            for job_memo in job_memos:
                try:
                    if job_memo.invoicememo.invoice.invoice_status == INVOICE_STATUS_APPROVED:
                        total += job_memo.invoicememo.invoice.total_invoice_amount
                    elif job_memo.invoicememo.invoice.invoice_status == INVOICE_STATUS_IN_DISPUTE:
                        continue
                    else:
                        total += job_memo.get_total_price
                except ObjectDoesNotExist:
                    continue
        else:
            total = None
        return total


class JobWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        exclude = ("created", "exec_producer", "director", "line_producer")
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Job.objects.all(),
                fields=('company', 'title'),
                message="Gig with this Gig Name already exists."
            )
        ]


class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = "__all__"


class JobRoleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleGroup
        fields = "__all__"


class CrewTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrewTemplate
        fields = "__all__"


class ClientCallSheetSerializer(serializers.ModelSerializer):
    production_contact = BenjiAccountSerializer(read_only=True, many=False)
    location = LocationReadSerializer(read_only=True, many=False)

    class Meta:
        model = ClientCallSheet
        exclude = ("job",)


class CallSheetSerializer(serializers.ModelSerializer):
    location = LocationReadSerializer(read_only=True, many=False)
    production_contact = BenjiAccountSerializer(read_only=True, many=False)

    class Meta:
        model = CallSheet
        fields = "__all__"


class ScheduleReadSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    crews = serializers.SerializerMethodField()
    filtered_notes = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = "__all__"

    def get_filtered_notes(self, obj):
        soup = BSHTML(obj.notes, features="html.parser")
        while len(soup.findAll("img")) > 0:
            soup.findAll("img")[0].decompose()
        return str(soup)

    def get_images(self, obj):
        soup = BSHTML(obj.notes, features="html.parser")
        images = []
        for image in soup.findAll("img"):
            images.append(image["src"])
        return images

    def get_crews(self, obj):
        user_schedules = UserSchedule.objects.filter(schedule=obj)
        crews = []
        for user_schedule in user_schedules:
            data = BenjiAccountSerializer(instance=user_schedule.benji_account).data
            crews.append(data)
        return crews


class ScheduleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"


class JobShootDateReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobShootDate
        exclude = ("job",)


class JobShootDateWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobShootDate
        fields = "__all__"


class ShootNoteReadSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    job_shoot_date = JobShootDateReadSerializer(read_only=True, many=False)
    shoot_dates = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    filtered_notes = serializers.SerializerMethodField()

    class Meta:
        model = ShootNote
        fields = "__all__"

    def get_filtered_notes(self, obj):
        soup = BSHTML(obj.notes, features="html.parser")
        while len(soup.findAll("img")) > 0:
            soup.findAll("img")[0].decompose()
        return str(soup)

    def get_images(self, obj):
        soup = BSHTML(obj.notes, features="html.parser")
        images = []
        for image in soup.findAll("img"):
            images.append(image["src"])
        return images

    def get_date(self, obj):
        return obj.job_shoot_date.date

    def get_shoot_dates(self, obj):
        job = obj.job_shoot_date.job
        job_shoot_dates = JobShootDate.objects.filter(job=job)
        dates = []
        for job_shoot_date in job_shoot_dates:
            dates.append(job_shoot_date.date)
        return dates


class ShootNoteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShootNote
        fields = "__all__"


class JobBidReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBid
        exclude = ("job",)


class JobBidWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBid
        fields = "__all__"


class ScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Script
        fields = "__all__"


class JobScriptReadSerializer(serializers.ModelSerializer):
    script = ScriptSerializer(read_only=True, many=False)

    class Meta:
        model = JobScript
        exclude = ("job",)


class JobScriptWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobScript
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"


class CastReadSerializer(serializers.ModelSerializer):
    wardrobes = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Cast
        exclude = ("job",)

    def get_wardrobes(self, obj):
        return WardrobeReadSerializer(obj.wardrobe_set, many=True).data

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            return obj.profile_photo
        else:
            if obj.benji_account:
                return obj.benji_account.profile_photo_s3_url
            else:
                return None


class CastWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = "__all__"


class WardrobeReadSerializer(serializers.ModelSerializer):
    wardrobe_notes = serializers.SerializerMethodField()

    class Meta:
        model = Wardrobe
        exclude = ("cast",)

    def get_wardrobe_notes(self, obj):
        return WardrobeNoteReadSerializer(obj.wardrobenote_set, many=True).data


class WardrobeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wardrobe
        fields = "__all__"

class PreProductionBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreProductionBook
        fields = "__all__"


class PreProductionWardrobeSerializer(serializers.ModelSerializer):
    role_title = serializers.ReadOnlyField(source="cast.role_title")
    full_name = serializers.ReadOnlyField(source="cast.full_name")

    class Meta:
        model = Wardrobe
        exclude = ("cast",)


class WardrobeNoteReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = WardrobeNote
        exclude = ("wardrobe",)


class WardrobeNoteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = WardrobeNote
        fields = "__all__"


class AgencyReadSerializer(serializers.ModelSerializer):
    contacts = serializers.SerializerMethodField()

    class Meta:
        model = Agency
        exclude = ("job",)

    def get_contacts(self, obj):
        return AgencyContactReadSerializer(obj.contacts, many=True).data


class AgencyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = "__all__"


class AgencyContactReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgencyContact
        exclude = ("agency",)


class ClientReadSerializer(serializers.ModelSerializer):
    contacts = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = Client
        exclude = ("job",)

    def get_contacts(self, obj):
        return ClientContactReadSerializer(obj.contacts, many=True).data

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            return obj.profile_photo
        elif obj.job.client_logo_s3_url:
            return obj.job.client_logo_s3_url
        else:
            return None


class ClientWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class ClientContactReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientContact
        exclude = ("client",)
