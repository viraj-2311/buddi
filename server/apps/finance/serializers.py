import pdb

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers, fields

from apps.finance.models import (Invoice, InvoiceBillFrom, InvoiceBillTo, InvoiceDocument, InvoiceLineItem, InvoiceMemo,
                                 InvoiceReceipt)
from apps.jobs.constants import FIXED, HOURLY
from apps.jobs.models import Job, JobMemoShootDate, JobRole, JobRoleGroup, JobShootDate, JobMemoRate, JobMemo
from apps.jobs.serializers import JobMemoRateSerializer, JobMemoSerializer
from apps.jobs.utils import get_all_job_dates, get_all_job_memo_dates
from apps.user.serializers import BenjiAccountSerializer, CompanySerializer


class JobReadSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    wrap_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    shoot_dates = serializers.SerializerMethodField()
    production_company = serializers.SerializerMethodField()
    shoot_dates_string = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"
        extra_kwargs = {
            "benji_job_number": {"read_only": True},
        }

    def get_production_company(self, obj):
        return obj.company.title

    def get_shoot_dates(self, obj):
        job_shoot_dates = JobShootDate.objects.filter(job=obj)
        response_data = []
        for job_shoot_date in job_shoot_dates:
            response_data.append(job_shoot_date.date)
        return response_data

    def get_shoot_dates_string(self, obj):
        return get_all_job_dates(obj)


class InvoiceMemoSerializer(serializers.ModelSerializer):
    job_role = serializers.IntegerField(source="job_memo.job_role.id")
    shoot_dates = serializers.SerializerMethodField()
    rates = serializers.SerializerMethodField()
    invoice_memo_base_amount = serializers.ReadOnlyField()
    total_invoice_memo_job_memo_rates_amount = serializers.ReadOnlyField()
    total_invoice_memo_amount = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    position = serializers.ReadOnlyField()
    pay_terms = serializers.ReadOnlyField()
    dates = serializers.ReadOnlyField()
    memo_status = serializers.SerializerMethodField()
    memo_staff = serializers.SerializerMethodField()
    memo_type = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    union = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceMemo
        fields = "__all__"

    def get_memo_status(self, obj):
        job_memo = obj.job_memo
        return job_memo.memo_status

    def get_memo_type(self, obj):
        job_memo = obj.job_memo
        return job_memo.memo_type

    def get_memo_staff(self, obj):
        job_memo = obj.job_memo
        return job_memo.memo_staff

    def update(self, instance, validated_data):
        del validated_data["job_memo"]
        InvoiceMemo.objects.filter(pk=instance.id).update(**validated_data)
        return InvoiceMemo.objects.get(pk=instance.id)

    def get_total_price(self, obj):
        if self.context.get('reports', False):
            try:
                total_amount = (obj.total_invoice_memo_amount +
                                sum(i.total_amount for i in obj.job_memo.invoicememo.invoice.line_items.all()) +
                                sum(i.amount for i in obj.job_memo.invoicememo.invoice.receipts.all())
                                )
            except ObjectDoesNotExist:
                total_amount = obj.total_invoice_memo_amount
            return total_amount
        return obj.total_invoice_memo_amount

    def get_shoot_dates(self, obj):
        job_memo_shoot_dates = JobMemoShootDate.objects.filter(job_memo=obj.job_memo)
        response_data = []
        for job_memo_shoot_date in job_memo_shoot_dates:
            response_data.append(job_memo_shoot_date.date)
        return response_data

    def get_rates(self, obj):
        if self.context.get('reports', False):
            rates = JobMemoRateSerializer(obj.job_memo.rates.all(), many=True).data
            try:
                rates += InvoiceLineItemReadSerializer(
                    obj.job_memo.invoicememo.invoice.line_items.all(),
                    many=True
                ).data
                rates += InvoiceReceiptReadSerializer(
                    obj.job_memo.invoicememo.invoice.receipts.all(),
                    many=True
                ).data
                return rates
            except ObjectDoesNotExist:
                return rates
        return JobMemoRateSerializer(obj.job_memo.rates.all(), many=True).data

    def get_union(self, obj):
        return obj.job_memo.benji_account.union

    def get_phone_number(self, obj):
        return obj.job_memo.benji_account.phone


class InvoiceReceiptReadSerializer(serializers.ModelSerializer):
    total_amount = serializers.IntegerField(source="amount")

    class Meta:
        model = InvoiceReceipt
        exclude = ("invoice", )


class InvoiceReceiptWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceReceipt
        fields = "__all__"


class InvoiceLineItemReadSerializer(serializers.ModelSerializer):
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = InvoiceLineItem
        exclude = ("invoice", )


class InvoiceLineItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceLineItem
        fields = "__all__"


class InvoiceDocumentReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceDocument
        exclude = ("invoice", )


class InvoiceDocumentWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceDocument
        fields = "__all__"


class InvoiceBillToReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillTo
        exclude = ("invoice", )


class InvoiceBillToWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillTo
        fields = "__all__"


class InvoiceBillFromReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillFrom
        exclude = ("invoice",)


class InvoiceBillFromWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillFrom
        fields = "__all__"


class JobRoleGroupSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="job_role_group_type.title", read_only=True)

    class Meta:
        model = JobRoleGroup
        exclude = ("job", "job_role_group_type")


class JobRoleSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="job_role_type.title", read_only=True)

    class Meta:
        model = JobRole
        exclude = ("job_role_group", "job_role_type")


class CompanyFinanceInvoiceSerializer(serializers.ModelSerializer):
    invoice_memo = InvoiceMemoSerializer(read_only=True, many=False)
    benji_account = BenjiAccountSerializer(read_only=True, many=False)

    class Meta:
        model = Invoice
        fields = "__all__"


class ContractorFinanceInvoiceSerializer(serializers.ModelSerializer):
    receipts = InvoiceReceiptReadSerializer(many=True, read_only=True)
    line_items = InvoiceLineItemReadSerializer(many=True, read_only=True)
    documents = InvoiceDocumentReadSerializer(many=True, read_only=True)
    invoice_memo = InvoiceMemoSerializer(read_only=True, many=False)
    benji_account = BenjiAccountSerializer(read_only=True, many=False)
    bill_to = InvoiceBillToReadSerializer(read_only=True, many=False)
    bill_from = InvoiceBillFromReadSerializer(read_only=True, many=False)
    job = serializers.SerializerMethodField()
    rates = serializers.SerializerMethodField()
    total_invoice_receipts_amount = serializers.ReadOnlyField()
    total_invoice_lineitems_amount = serializers.ReadOnlyField()
    total_invoice_amount = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = "__all__"

    def get_job(self, obj):
        return JobReadSerializer(instance=obj.invoice_memo.job_memo.job_role.job_role_group.job).data

    def get_rates(self, obj):
        job_memo = obj.invoice_memo.job_memo
        return JobMemoRateSerializer(job_memo.rates.all(),many=True).data

class InvoiceReadSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        exclude = ("invoice_memo",)

    def get_total_price(self, obj):
        return obj.total_invoice_amount


class InvoiceWithJobSerializer(serializers.ModelSerializer):
    job = serializers.SerializerMethodField()
    total_invoice_amount = serializers.ReadOnlyField()
    city = serializers.CharField(source="invoice_memo.job_memo.city", read_only=True)
    state = serializers.CharField(source="invoice_memo.job_memo.state", read_only=True)
    shoot_dates = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        exclude = ("invoice_memo", "benji_account")

    def get_job(self, obj):
        return JobReadSerializer(instance=obj.invoice_memo.job_memo.job).data

    def get_shoot_dates(self, obj):
        job_memo = obj.invoice_memo.job_memo
        return JobMemoShootDate.objects.filter(job_memo=job_memo).values_list('date', flat=True)

    def get_dates(self, obj):
        job_memo = obj.invoice_memo.job_memo
        return get_all_job_memo_dates(job_memo)

class InvoiceBillFromSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillFrom
        fields = [ "name", "city", "state", "address", "email", "phone", "zip_code"]

class InvoiceBillToSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceBillTo
        fields = [ "name", "city", "state", "address", "email", "phone", "zip_code"]


class InvoiceSerializer(serializers.ModelSerializer):

    bill_from = InvoiceBillFromSerializer()
    bill_to = InvoiceBillToSerializer()
    payment_due =  fields.DateField(input_formats=['%Y-%m-%d'])
    invoice_date =  fields.DateField(input_formats=['%Y-%m-%d'])


    class Meta:
        model = Invoice
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get('request', None)
        benji_account = request.user
        bill_from_data = validated_data.pop('bill_from')
        bill_to_data = validated_data.pop('bill_to')
        invoice = Invoice.objects.create(benji_account=benji_account,**validated_data)
        invoice.payment_due = validated_data["payment_due"]
        invoice.invoice_date = validated_data["invoice_date"]
        invoice.save()
        InvoiceBillFrom.objects.create(invoice=invoice, **bill_from_data)
        InvoiceBillTo.objects.create(invoice=invoice, **bill_to_data)
        return invoice


class InvoiceWithCrewDetails(serializers.ModelSerializer):
    crew_amount = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()
    crew = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['client', 'agency', 'title', 'job_number', 'company', 'crew', 'crew_amount', 'dates', 'wrap_and_pay_type']

    def get_dates(self, obj):
        return JobReadSerializer(instance=obj).data

    def get_company(self, obj):
        return CompanySerializer(instance=obj.company).data

    def get_crew(self, obj):
        reports = self.context.get('reports', False)
        if obj.wrap_and_pay_type == 3:
            crew = []
            job_memos = JobMemo.objects.filter(job=obj)
            for job_memo in job_memos:
                data = JobMemoSerializer(instance=job_memo, context={'reports': reports}).data
                if reports:
                    try:
                        data["total_price"] = (job_memo.get_total_price +
                                               sum(
                                                   i.total_amount for i in
                                                   obj.job_memo.invoicememo.invoice.line_items.all()
                                               ) +
                                               sum(i.amount for i in
                                                   obj.job_memo.invoicememo.invoice.receipts.all()
                                                   )
                                               )
                    except ObjectDoesNotExist:
                        data["total_price"] = job_memo.get_total_price
                else:
                    data["total_price"] = job_memo.get_total_price
                data["position"] = job_memo.job_role.job_role_type.title
                data["invoice_memo_base_amount"] = data["notes"] = data["total_invoice_memo_amount"] = None
                data["total_invoice_memo_job_memo_rates_amount"] = data["job_memo"] = None
                crew.append(data)
            return crew
        else:
            invoices = InvoiceMemo.objects.filter(job_memo__job=obj)
            return InvoiceMemoSerializer(instance=invoices, many=True,context={'reports':reports}).data

    def get_crew_amount(self, obj):
        if obj.wrap_and_pay_type == 3:
            job_memos = JobMemo.objects.filter(job=obj)
            job_memo = JobMemoSerializer(instance=job_memos, many=True).data
            total = sum(d.get('total_price', 0) for d in job_memo)
        else:
            invoices = InvoiceMemo.objects.filter(job_memo__job=obj)
            invoice_memo = InvoiceMemoSerializer(instance=invoices, many=True).data
            total = sum(d.get('total_price', 0) for d in invoice_memo)
        return total
