from django.db import models

from apps.jobs.constants import (FIXED, HOURLY, INVOICE_STATUS_APPROVED, INVOICE_STATUS_IN_DISPUTE,
                                 PAYMENT_STATUS_PAYMENT_SENT, INVOICE_STATUS_RECEIVED, INVOICE_STATUS_REQUESTED,
                                 PAYMENT_STATUS_PROCESSING, INVOICE_STATUS_ARCHIVE, INVOICE_STATUS_OVERDUE, PAYMENT_STATUS_PAYMENT_FAILED)
from apps.jobs.models import BaseModel, JobMemo
from apps import jobs
from apps.sila_adapter.models import SilaToSilaTx
from apps.user.models import BenjiAccount


class InvoiceMemo(models.Model):
    PriceTypes = [
        (HOURLY, HOURLY),
        (FIXED, FIXED),
    ]
    job_memo = models.OneToOneField(JobMemo, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    price_type = models.CharField(max_length=30, choices=PriceTypes, default=FIXED)
    daily_hours = models.CharField(max_length=255, null=True)
    working_days = models.PositiveIntegerField(default=0, blank=True, null=True)
    working_rate = models.FloatField(default=0.0, blank=True, null=True)
    kit_fee = models.FloatField(default=0.0, blank=True, null=True)
    project_rate = models.FloatField(default=0.0, blank=True, null=True)
    notes = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = "invoice_memo"

    @property
    def invoice_memo_base_amount(self):
        base_amount = 0.0
        if self.price_type == HOURLY:
            base_amount = self.working_days * self.working_rate + self.kit_fee
        elif self.price_type == FIXED:
            base_amount = self.project_rate + self.kit_fee
        return base_amount

    @property
    def total_invoice_memo_job_memo_rates_amount(self):
        return self.job_memo.added_rates_value

    @property
    def total_invoice_memo_amount(self):
        return self.job_memo.added_rates_value + self.invoice_memo_base_amount

    @property
    def job_memo_shoot_dates(self):
        return [shoot_date.date for shoot_date in self.job_memo.shoot_dates.all()]

    @property
    def email(self):
        return self.job_memo.email

    @property
    def pay_terms(self):
        return self.job_memo.pay_terms

    @property
    def position(self):
        return self.job_memo.job_role.job_role_type.title

    @property
    def dates(self):
        return jobs.utils.get_all_job_memo_dates(self.job_memo)


class Invoice(BaseModel):
    InvoiceStatuses = [
        (INVOICE_STATUS_REQUESTED, INVOICE_STATUS_REQUESTED),
        (INVOICE_STATUS_IN_DISPUTE, INVOICE_STATUS_IN_DISPUTE),
        (INVOICE_STATUS_APPROVED, INVOICE_STATUS_APPROVED),
        (INVOICE_STATUS_RECEIVED, INVOICE_STATUS_RECEIVED),
        (INVOICE_STATUS_ARCHIVE, INVOICE_STATUS_ARCHIVE),
        (INVOICE_STATUS_OVERDUE, INVOICE_STATUS_OVERDUE),

    ]

    PaymentStatuses = [
        (PAYMENT_STATUS_PROCESSING, PAYMENT_STATUS_PROCESSING),
        (PAYMENT_STATUS_PAYMENT_SENT, PAYMENT_STATUS_PAYMENT_SENT),
        (PAYMENT_STATUS_PAYMENT_FAILED, PAYMENT_STATUS_PAYMENT_FAILED),
    ]

    benji_account = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, null=True, blank=True,
                                      related_name="owner_invoice")
    agency = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, blank=True, null=True,
                               related_name="agency_invoice")
    invoice_memo = models.OneToOneField(InvoiceMemo, on_delete=models.CASCADE, null=True)
    invoice_number = models.CharField(max_length=255)
    invoice_date = models.DateField()
    payment_due = models.DateField()
    invoice_status = models.CharField(max_length=30, choices=InvoiceStatuses, default=INVOICE_STATUS_REQUESTED)
    payment_status = models.CharField(max_length=30, choices=PaymentStatuses, null=True)
    status_message = models.CharField(max_length=255, null=True)
    notes = models.CharField(max_length=500, blank=True, null=True)
    created = models.BooleanField(default=False)
    job_number = models.CharField(max_length=255)
    job_name = models.CharField(max_length=255)
    agency_description = models.CharField(max_length=255)
    client_description = models.CharField(max_length=255)
    transaction = models.OneToOneField(
        SilaToSilaTx, blank=True, null=True, related_name='invoice', on_delete=models.SET_NULL
    )

    @property
    def total_invoice_receipts_amount(self):
        return sum(receipt.amount for receipt in self.receipts.all())

    @property
    def total_invoice_lineitems_amount(self):
        return sum(line_item.number_of_days * line_item.rate * line_item.units for line_item in self.line_items.all())

    @property
    def total_invoice_amount(self):
        receipt_memo_total = self.invoice_memo.total_invoice_memo_amount
        line_item_total = self.total_invoice_lineitems_amount
        receipt_total = self.total_invoice_receipts_amount
        return receipt_memo_total + line_item_total + receipt_total

    @property
    def memo_status(self):
        return self.status

    class Meta:
        db_table = "invoice"


class InvoiceBillFrom(models.Model):
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name="bill_from")
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=1024, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "invoice_bill_from"


class InvoiceBillTo(models.Model):
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name="bill_to")
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=1024, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "invoice_bill_to"


class InvoiceLineItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="line_items")
    title = models.CharField(max_length=100)
    units = models.PositiveIntegerField()
    number_of_days = models.PositiveIntegerField()
    rate = models.PositiveIntegerField()
    notes = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "invoice_line_item"

    @property
    def total_amount(self):
        return self.number_of_days * self.rate * self.units


class InvoiceReceipt(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts")
    title = models.CharField(max_length=100)
    document = models.CharField(max_length=500, blank=True, null=True)
    payment_due = models.DateField()
    amount = models.PositiveIntegerField()
    notes = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "invoice_receipt"


class InvoiceDocument(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=100)
    document = models.CharField(max_length=500, blank=True, null=True)
    amount = models.PositiveIntegerField()
    notes = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "invoice_uploaded_document"
