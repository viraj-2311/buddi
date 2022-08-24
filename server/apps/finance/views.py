import datetime
import os
from datetime import date
from datetime import datetime as datetime_datetime
from datetime import timedelta as datetime_timedelta
from typing import Optional

from django.db.models import Q, Sum
from django.views.generic import View
from django.utils import timezone
from apps.finance.render import Render
from dateutil.relativedelta import relativedelta
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.finance.models import (Invoice, InvoiceBillFrom, InvoiceBillTo, InvoiceDocument, InvoiceLineItem, InvoiceMemo,
                                 InvoiceReceipt)
from apps.finance.permissions import (FinancePermission, InvoiceBillFromPermission, InvoiceBillToPermission,
                                      InvoiceDocumentCreatePermission, InvoiceDocumentPermission,
                                      InvoiceLineItemCreatePermission, InvoiceLineItemPermission,
                                      InvoiceReceiptCreatePermission, InvoiceReceiptPermission)
from apps.finance.serializers import (ContractorFinanceInvoiceSerializer, InvoiceBillFromReadSerializer,
                                      InvoiceBillToReadSerializer, InvoiceDocumentReadSerializer,
                                      InvoiceDocumentWriteSerializer, InvoiceLineItemReadSerializer,
                                      InvoiceLineItemWriteSerializer, InvoiceMemoSerializer, InvoiceReadSerializer,
                                      InvoiceReceiptReadSerializer, InvoiceReceiptWriteSerializer,
                                      InvoiceWithJobSerializer, JobRoleGroupSerializer, JobRoleSerializer,
                                      InvoiceSerializer, InvoiceWithCrewDetails)

from apps.jobs.serializers import JobReadSerializer
from apps.finance.utils import get_unique_invoice_number, validate_invoice_number
from apps.jobs.constants import (
    AGENCY_MEMO,
    CONTRACTOR_W2_MEMO,
    CONTRACTOR_W9_MEMO,
    DEAL_MEMO,
    INVOICE_STATUS_RECEIVED,
    INVOICE_STATUS_REQUESTED,
    JOB_STATUS_WRAPPED,
    INVOICE_STATUS_IN_DISPUTE,
    INVOICE_STATUS_APPROVED,
    INVOICE_STATUS_OVERDUE,
    PAYMENT_STATUS_PROCESSING,
    PAYMENT_STATUS_PAYMENT_SENT,
    PAYMENT_STATUS_PAYMENT_FAILED, ACCOUNT_COMPANY_RELATION_CONTRACTOR, PAY_WITHOUT_INVOICING, PAY_WITH_INVOICING
)
from apps.jobs.models import Job, JobMemo, JobRole, JobRoleGroup, JobMemoRate, JobShootDate
from apps.jobs.serializers import JobMemoSerializer
from apps.jobs.utils import add_field_in_request_data
from apps.jobs.view.crew import add_attachment_to_memo
from apps.jobs.views import get_job_detail
from apps.notification.backends.benji_email_backend import send_email_template
from apps.shared.permissions import MixedPermissionModelViewSet
from apps.user.constants import VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.models import BenjiAccount, Company
from apps.user.serializers import BenjiAccountSerializer, CompanySerializer
from apps.jobs.view.crew import set_rates
import logging

from apps.sila_adapter.sila_adapter import SilaAdapter, PlaidLinkedCorporateAccount
from django.conf import settings
from rest_framework import status as status_codes
from apps.sila_adapter.serializers import SilaToSilaTxSerializer, FiatToSilaTxSerializer
from django.db import transaction
from apps.sila_adapter.models import SilaCorporate, PlaidLinkedAccount
from apps.user.utils import get_account_company_relationship

adapter = SilaAdapter.setup(settings.SILA_CONFIG)
logger = logging.getLogger(__name__)


def get_job_role_ids_by_job_role_group(job_role_group_and_job_role, job_role_group_id):
    job_role_ids = []
    for job_role_group, job_role in job_role_group_and_job_role:
        if job_role_group == job_role_group_id:
            job_role_ids.append(job_role)
    return job_role_ids

def get_job_role_objs_by_job_role_group(job_memos,job_role_group_id):
    job_role_objs = []
    for job_memo in job_memos:
        if job_memo.job_role.job_role_group.id == job_role_group_id:
            job_role_objs.append(job_memo.job_role)
    return job_role_objs


def can_handle_invoice(user, invoice):
    job_memo = invoice.invoice_memo.job_memo
    if job_memo.memo_staff == AGENCY_MEMO:
        if job_memo.agency == user:
            return True
        if job_memo.benji_account == user:
            return False
    else:
        if job_memo.benji_account == user:
            return True
        else:
            return False


class InvoicePdf(View):

    def get(self, request, pk):
        invoice = Invoice.objects.select_related('invoice_memo__job_memo__job_role__job_role_type').get(id=pk)
        job_memo_rates = JobMemoRate.objects.filter(job_memo=invoice.invoice_memo.job_memo.id)
        shoot_dates = JobShootDate.objects.filter(job=invoice.invoice_memo.job_memo.job_id)
        receipts = InvoiceReceipt.objects.filter(invoice=invoice)
        line_items = InvoiceLineItem.objects.filter(invoice=invoice)
        today = timezone.now()
        params = {
            "invoice": invoice,
            "job": invoice.invoice_memo.job_memo.job,
            "job_memo_rates": job_memo_rates,
            "receipts": receipts,
            "line_items": line_items,
            "shoot_dates": shoot_dates
        }
        return Render.render('invoice_pdf_template.html', params)


class CompanyInvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceMemo.objects.all()
    serializer_class = InvoiceMemoSerializer

    def create(self, request, job_id=None, job_memo_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            JobMemo.objects.get(pk=job_memo_id)
        except Job.DoesNotExist:
            return Response(f"GigMemo {job_memo_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "job_memo", job_memo_id)
        invoice_memo_serializer = InvoiceMemoSerializer(data=request.data)
        if invoice_memo_serializer.is_valid(raise_exception=True):
            invoice_memo = invoice_memo_serializer.save()
        invoice_memo = InvoiceMemoSerializer(instance=invoice_memo).data
        return Response(invoice_memo, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(CompanyInvoiceViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        response = super(CompanyInvoiceViewSet, self).partial_update(request=request, pk=pk)
        invoice_memo = InvoiceMemo.objects.select_related('job_memo').get(pk=pk)
        job_memo_serializer = JobMemoSerializer(instance=invoice_memo.job_memo, data=request.data, partial=True)
        job_memo_serializer.is_valid()
        job_memo_serializer.save()
        if "attachments" in request.data:
            attachments = request.data["attachments"]
            add_attachment_to_memo(invoice_memo.job_memo, attachments, request.user)
        if "headline" in request.data:
            headline = request.data["headline"]
            job_memo = invoice_memo.job_memo
            job_memo.headline = headline
            job_memo.save()
        if "rates" in request.data:
            job_memo = invoice_memo.job_memo
            set_rates(request, job_memo)
        return self.retrieve(request, pk)

    def destroy(self, request, pk=None):
        return super(CompanyInvoiceViewSet, self).destroy(request=request, pk=pk)

    def retrieve_contractor_deal_memos_in_a_job(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        job_memos = JobMemo.objects.filter(
            Q(job_role__job_role_group__job_id=job_id) &
            Q(memo_type=DEAL_MEMO) &
            (Q(memo_staff=CONTRACTOR_W2_MEMO) | Q(memo_staff=CONTRACTOR_W9_MEMO) | Q(memo_staff=AGENCY_MEMO)) &
            Q(accepted=True))
        for job_memo in job_memos:
            try:
                InvoiceMemo.objects.get(job_memo=job_memo)
            except InvoiceMemo.DoesNotExist:
                InvoiceMemo(job_memo=job_memo,
                            full_name=job_memo.benji_account.get_full_name(),
                            city=job_memo.city,
                            state=job_memo.state,
                            price_type=job_memo.price_type,
                            daily_hours=job_memo.daily_hours,
                            working_days=job_memo.working_days,
                            working_rate=job_memo.working_rate,
                            kit_fee=job_memo.kit_fee,
                            project_rate=job_memo.project_rate).save()
        job_role_group_ids = list(job_memos.values_list("job_role__job_role_group", flat=True).distinct())
        job_role_group_and_job_role = list(job_memos.values_list("job_role__job_role_group", "job_role"))
        results = {}
        results["departments"] = []
        for job_role_group_id in job_role_group_ids:
            job_role_group = JobRoleGroup.objects.get(pk=job_role_group_id)
            job_role_group = JobRoleGroupSerializer(instance=job_role_group).data
            job_role_group["job_roles"] = []
            job_role_ids = get_job_role_ids_by_job_role_group(job_role_group_and_job_role, job_role_group_id)
            for job_role_id in job_role_ids:
                job_role = JobRole.objects.get(pk=job_role_id)
                job_role = JobRoleSerializer(instance=job_role).data
                job_role_group["job_roles"].append(job_role)
            results["departments"].append(job_role_group)
        results["job_memos"] = []
        for job_memo in job_memos:
            data = JobMemoSerializer(instance=job_memo).data
            data["total_price"] = job_memo.get_total_price
            data["position"] = job_memo.job_role.job_role_type.title
            try:
                invoice_memo = InvoiceMemo.objects.get(job_memo=job_memo)
                data["invoice_memo"] = InvoiceMemoSerializer(instance=invoice_memo).data
                data["invoice_memo"]["total_price"] = invoice_memo.total_invoice_memo_amount
            except InvoiceMemo.DoesNotExist:
                data["invoice_memo"] = None
            results["job_memos"].append(data)
        return Response(results, status=status.HTTP_200_OK)

    def retrieve_contractor_invoices_in_a_job(self, request, job_id: int):  # noqa
        job = get_object_or_404(Job, pk=job_id)
        job_memos = JobMemo.objects.filter(
            Q(job_role__job_role_group__job_id=job_id) & Q(memo_type=DEAL_MEMO) & (
                    Q(memo_staff=CONTRACTOR_W2_MEMO) | Q(memo_staff=CONTRACTOR_W9_MEMO) |
                    Q(memo_staff=AGENCY_MEMO)
            ) &
            Q(accepted=True)
        ).prefetch_related('invoicememo', 'job_role__job_role_group', 'job_role')
        job_role_group_objs = JobRoleGroup.objects.filter(
            Q(id__in=job_memos.values_list(
                "job_role__job_role_group",
                flat=True
                ).distinct()
            )
        )
        results = {}
        results["paid_by"] = job.paid_by
        results["set_time"] = job.set_time
        results["sound_check_time"] = job.sound_check_time
        results["departments"] = []
        for job_role_group_obj in job_role_group_objs:
            job_role_group = JobRoleGroupSerializer(instance=job_role_group_obj).data
            job_role_group["job_roles"] = []
            job_role_objs = get_job_role_objs_by_job_role_group(job_memos, job_role_group_obj.id)
            for job_role_obj in job_role_objs:
                job_role = JobRoleSerializer(instance=job_role_obj).data
                job_role_group["job_roles"].append(job_role)
            results["departments"].append(job_role_group)
        results["invoice_memos"] = []
        if job.wrap_and_pay_type == 3:
            for job_memo in job_memos:
                data = JobMemoSerializer(instance=job_memo).data
                data["total_price"] = job_memo.get_total_price
                data["position"] = job_memo.job_role.job_role_type.title
                results["invoice_memos"].append(data)
        else:
            for job_memo in job_memos:
                try:
                    invoice_memo = job_memo.invoicememo
                except InvoiceMemo.DoesNotExist:
                    continue
                invoice_memo = InvoiceMemoSerializer(instance=invoice_memo).data
                invoice_memo["job_memo"] = JobMemoSerializer(instance=job_memo, context={"total_price": True}).data
                invoice_memo["headline"] = job_memo.headline

                try:
                    invoice = Invoice.objects.get(invoice_memo=invoice_memo["id"])
                    invoice_memo["invoice"] = InvoiceReadSerializer(instance=invoice).data
                except Invoice.DoesNotExist:
                    invoice_memo["invoice"] = {}
                results["invoice_memos"].append(invoice_memo)
        return Response(results, status=status.HTTP_200_OK)

    def archive_job(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.select_related('company', 'exec_producer', 'line_producer', 'director').get(pk=job_id)
            job.is_archived = True
            job.save()
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        response_data = get_job_detail(job)
        return Response(response_data, status=status.HTTP_200_OK)

    def wrap_job(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
            job.status = JOB_STATUS_WRAPPED
            job.save()
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)

        # to get the sender's full name and send it in the email
        benji_account = BenjiAccount.objects.only('full_name').get(email=job.company.owner_email)

        # Confirm & Request Invoices
        job_roles = request.data["job_roles"]

        for job_role in job_roles:
            try:
                invoice_memo = InvoiceMemo.objects.get(job_memo__job_role_id=job_role)
            except InvoiceMemo.DoesNotExist:
                continue
            try:
                invoice = Invoice.objects.get(invoice_memo=invoice_memo)
            except Invoice.DoesNotExist:
                user = invoice_memo.job_memo.benji_account
                agency = None
                if invoice_memo.job_memo.memo_staff == AGENCY_MEMO:
                    agency = invoice_memo.job_memo.agency
                company = job.company
                invoice_number = "%08d" % get_unique_invoice_number(invoice_memo.job_memo.benji_account)
                nett_days = datetime_timedelta(days=invoice_memo.job_memo.working_days)
                last_shoot_date = invoice_memo.job_memo.shoot_dates.order_by('-date').first().date
                if not last_shoot_date:
                    return Response(f"Shoot date(s) does not exist.", status=status.HTTP_400_BAD_REQUEST)

                pay_term_days = invoice_memo.job_memo.pay_terms
                payment_due = last_shoot_date + datetime_timedelta(days=pay_term_days)
                if job.wrap_and_pay_type == PAY_WITHOUT_INVOICING:
                    # Add created=True and invoice_status="Approved" so that bandleader can directly pay the bands.
                    invoice = Invoice(invoice_memo=invoice_memo,
                                      benji_account=user,
                                      agency=agency,
                                      invoice_number=invoice_number,
                                      created=True,
                                      invoice_status=INVOICE_STATUS_APPROVED)
                else:
                    # if bandleader wants to pay with invoices then the setting invoice_status="Approved" is not
                    # necessary here
                    invoice = Invoice(invoice_memo=invoice_memo,
                                      benji_account=user,
                                      agency=agency,
                                      invoice_number=invoice_number)
                current_date = request.data.get('current_date')
                current_date = datetime_datetime.strptime(current_date, '%Y-%m-%d').date()
                invoice.invoice_date = current_date
                invoice.payment_due = payment_due
                invoice.save()
                InvoiceBillFrom(invoice_id=invoice.id,
                                name=user.get_full_name(),
                                city=user.city,
                                state=user.state,
                                address=user.street,
                                email=user.email,
                                phone=user.phone,
                                zip_code=user.zip_code).save()
                InvoiceBillTo(invoice_id=invoice.id,
                              name=company.title,
                              city=company.city,
                              state=company.state,
                              address=company.address,
                              email=company.email,
                              phone=company.phone,
                              zip_code=company.zip_code).save()
            if invoice_memo.job_memo.memo_staff == AGENCY_MEMO:
                email = invoice_memo.job_memo.agency_email
            else:
                email = invoice_memo.job_memo.email

            review_invoice_url = settings.FRONTEND_BASE_URL + '/finance/invoices/' + str(invoice.id) + '/detail'

            # only send emails if wrap_and_pay_type will be pay with invoicing
            if job.wrap_and_pay_type == PAY_WITH_INVOICING:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_CONFIRM_REQUEST_INVOICE_NOTIFICATION_ID"),
                    substitutions={
                        "band_name": job.company.title,
                        "talent_name": invoice_memo.job_memo.full_name,
                        "band_leader": invoice_memo.job_memo.memo_sender.full_name,
                        "venue_name": job.title,
                        "review_invoice_url": review_invoice_url,
                        "gig_title": job.agency
                    },
                    sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}",
                )

        return Response([], status=status.HTTP_200_OK)

    def get_invoice(self, request, job_id=None, invoice_memo_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            InvoiceMemo.objects.get(pk=invoice_memo_id)
        except InvoiceMemo.DoesNotExist:
            return Response(f"InvoiceMemo {invoice_memo_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(invoice_memo_id=invoice_memo_id)
        except Invoice.DoesNotExist:
            return Response("Invoice does not exist.", status=status.HTTP_400_BAD_REQUEST)
        response_data = ContractorFinanceInvoiceSerializer(instance=invoice).data
        response_data["benji_account"] = BenjiAccountSerializer(
            instance=invoice.invoice_memo.job_memo.benji_account).data
        response_data["company"] = CompanySerializer(instance=job.company).data
        return Response(response_data, status=status.HTTP_200_OK)

    def process_invoice(self, request, job_id=None, invoice_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.payment_status == PAYMENT_STATUS_PAYMENT_SENT:
                return Response("You can not do any activity against the paid invoice.",
                                status=status.HTTP_400_BAD_REQUEST)
            invoice.payment_status = request.data["invoice_status"]
            invoice.notes = request.data["reason"]
            invoice.save()
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        return Response(InvoiceReadSerializer(instance=invoice).data, status=status.HTTP_200_OK)

    def mark_as_disputed(self, request, job_id=None, invoice_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.payment_status == PAYMENT_STATUS_PAYMENT_SENT:
                return Response("You can not do any activity against the paid invoice.",
                                status=status.HTTP_400_BAD_REQUEST)
            invoice.invoice_status = INVOICE_STATUS_IN_DISPUTE
            invoice.notes = request.data["reason"]
            invoice.save()
            job = Job.objects.get(pk=job_id)
            email = invoice.invoice_memo.job_memo.email
            review_invoice_url = settings.FRONTEND_BASE_URL + '/finance/invoices/' + str(invoice.id) + '/detail'
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_IN_DISPUTE_NOTIFICATION_ID"),
                substitutions={
                    "band_leader": invoice.invoice_memo.job_memo.memo_sender.full_name,
                    "talent_name": invoice.invoice_memo.job_memo.full_name,
                    "review_invoice_url": review_invoice_url
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
            )

        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        return Response(InvoiceReadSerializer(instance=invoice).data, status=status.HTTP_200_OK)

    def approve(self, request, job_id=None, invoice_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.payment_status == PAYMENT_STATUS_PAYMENT_SENT:
                return Response("You can not do any activity against the paid invoice.",
                                status=status.HTTP_400_BAD_REQUEST)
            invoice.invoice_status = INVOICE_STATUS_APPROVED
            invoice.save()
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        return Response(InvoiceReadSerializer(instance=invoice).data, status=status.HTTP_200_OK)

    def pay_invoices(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        job_roles = request.data["job_roles"]
        for job_role in job_roles:
            try:
                invoice = Invoice.objects.get(invoice_memo__job_memo__job_role_id=job_role)
                invoice.payment_status = PAYMENT_STATUS_PAYMENT_SENT
                invoice.save()
            except Invoice.DoesNotExist:
                continue
        invoices = Invoice.objects.filter(invoice_memo__job_memo__job_role_id__in=job_roles)
        return Response(InvoiceReadSerializer(invoices, many=True).data, status=status.HTTP_200_OK)


class ContractorInvoiceViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated, FinancePermission)
    queryset = Invoice.objects.all()
    serializer_class = InvoiceReadSerializer

    def get_contractor_invoices(self, request, user_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")

        user = get_object_or_404(BenjiAccount, pk=user_id)
        try:
            payment_status = request.GET["status"]
            if payment_status == "Paid":
                q_object = Q(payment_status=PAYMENT_STATUS_PAYMENT_SENT)
            else:
                q_object = ~Q(payment_status=PAYMENT_STATUS_PAYMENT_SENT)
        except KeyError:
            q_object = Q()
        invoices = Invoice.objects.select_related('invoice_memo__job_memo', 'invoice_memo__job_memo__job').filter((Q(benji_account=user) | Q(agency=user)) & q_object)
        results = []
        for invoice in invoices:
            try:
                invoice_data = InvoiceWithJobSerializer(instance=invoice).data
                invoice_data["can_handle_invoice"] = can_handle_invoice(request.user, invoice)
                results.append(invoice_data)
            except Exception as e:
                logger.warn("Error with invocie", exc_info=True)
        return Response(results, status=status.HTTP_200_OK)

    def get_contractor_statistics(self, request, user_id=None):
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            user = BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        period = request.GET["period"]
        total_paid = 0
        invoices = Invoice.objects.filter((Q(benji_account=user) | Q(agency=user)) &
                                          Q(payment_due__gte=date.today() - relativedelta(months=int(period))) &
                                          Q(payment_status=PAYMENT_STATUS_PAYMENT_SENT) &
                                          Q(created=True))
        for invoice in invoices:
            total_paid += invoice.total_invoice_amount
        sent = 0
        requested = 0
        all_invoices = Invoice.objects.filter(Q(benji_account=user) | Q(agency=user))
        requested_invoices = all_invoices.filter(invoice_status=INVOICE_STATUS_REQUESTED)
        for invoice in requested_invoices:
            requested += invoice.invoice_memo.total_invoice_memo_amount
        received_invoices = all_invoices.filter(invoice_status=INVOICE_STATUS_RECEIVED)
        for invoice in received_invoices:
            total_receipt = invoice.total_invoice_receipts_amount
            total_line_item = invoice.total_invoice_lineitems_amount
            sent += invoice.invoice_memo.total_invoice_memo_amount + total_receipt + total_line_item

        overdue_invoices = all_invoices.filter(invoice_status=INVOICE_STATUS_OVERDUE)
        overdue = sum([i.total_invoice_amount for i in overdue_invoices])
        in_dispute_invoices = all_invoices.filter(invoice_status=INVOICE_STATUS_IN_DISPUTE)
        in_dispute = sum([i.total_invoice_amount for i in in_dispute_invoices])
        INVOICE_STATUS_IN_DISPUTE
        response_data = {
            "total_paid": total_paid,
            "overdue": overdue,
            "sent": sent,
            "requested": requested,
            "in_dispute": in_dispute,
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice_date = request.data["invoice_date"]
            invoice.invoice_date = datetime.datetime.strptime(invoice_date, "%Y-%m-%d").date()
        except KeyError:
            pass
        try:
            payment_due = request.data["payment_due"]
            invoice.payment_due = datetime.datetime.strptime(payment_due, "%Y-%m-%d").date()
        except KeyError:
            pass
        invoice.save()
        return super(ContractorInvoiceViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, invoice_id=None):
        return super(ContractorInvoiceViewSet, self).destroy(request=request, pk=invoice_id)

    def retrieve(self, request, invoice_id=None):
        return super(ContractorInvoiceViewSet, self).retrieve(request=request, pk=invoice_id)

    def update_invoice_number(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            user = BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        invoice_number = request.data["invoice_number"]
        if not validate_invoice_number(user, invoice, invoice_number):
            return Response("This invoice number already exists.", status=status.HTTP_400_BAD_REQUEST)
        invoice.invoice_number = invoice_number
        invoice.save()
        return Response(self.serializer_class(instance=invoice).data, status=status.HTTP_200_OK)

    def update_invoice_date(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        invoice.invoice_date = request.data["invoice_date"]
        invoice.save()
        return Response(self.serializer_class(instance=invoice).data, status=status.HTTP_200_OK)

    def update_payment_due(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        invoice.payment_due = request.data["payment_due"]
        invoice.save()
        return Response(self.serializer_class(instance=invoice).data, status=status.HTTP_200_OK)

    def get_contractor_invoice(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        return Response(ContractorFinanceInvoiceSerializer(instance=invoice).data, status=status.HTTP_200_OK)

    def send_invoice(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            benji_account = BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)

        if invoice.invoice_status == INVOICE_STATUS_IN_DISPUTE:
            job = Job.objects.get(pk=invoice.invoice_memo.job_memo.job_id)
            email = invoice.invoice_memo.job_memo.job.company.owner_email
            company = invoice.invoice_memo.job_memo.job.company
            review_invoice_url = settings.FRONTEND_BASE_URL + '/companies/' + str(company.id) + '/jobs/' + str(job.id) + '/payment'
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_RETURN_DISPUTE_NOTIFICATION_ID"),
                substitutions={
                    "band_leader": invoice.invoice_memo.job_memo.memo_sender.full_name,
                    "talent_name": invoice.invoice_memo.job_memo.full_name,
                    "review_invoice_url": review_invoice_url
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
            )
        else:
            job = Job.objects.get(pk=invoice.invoice_memo.job_memo.job_id)
            email = invoice.invoice_memo.job_memo.job.company.owner_email
            company = invoice.invoice_memo.job_memo.job.company
            review_invoice_url = settings.FRONTEND_BASE_URL + '/companies/' + str(company.id) + '/jobs/' + str(job.id) + '/payment'
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_INVOICE_SENT_NOTIFICATION_ID"),
                substitutions={
                    "band_name": job.company.title,
                    "talent_name": invoice.invoice_memo.job_memo.full_name,
                    "review_invoice_url": review_invoice_url
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
            )


        invoice.invoice_status = INVOICE_STATUS_RECEIVED
        invoice.created = True
        invoice.save()
        wallet_registered = hasattr(benji_account, 'sila_user') and hasattr(benji_account.sila_user, 'wallets')
        if not wallet_registered:
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[benji_account.email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_WALLET_REGISTER_NOTIFICATION_ID"),
                substitutions={
                    "account_name": benji_account.full_name,
                    "accept_url": settings.FRONTEND_BASE_URL + '/wallet',
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )
        return self.get_contractor_invoice(request, user_id, invoice_id)


class InvoiceReceiptViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceReceipt.objects.all()
    serializer_class = InvoiceReceiptReadSerializer
    permission_classes_by_action = {"create": [IsAuthenticated, InvoiceReceiptCreatePermission],
                                    "partial_update": [IsAuthenticated, InvoiceReceiptPermission],
                                    "destroy": [IsAuthenticated, InvoiceReceiptPermission]}

    def create(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "invoice", invoice_id)
        invoice_receipt_serializer = InvoiceReceiptWriteSerializer(data=request.data)
        if invoice_receipt_serializer.is_valid(raise_exception=True):
            invoice_receipt = invoice_receipt_serializer.save()
        return Response(self.serializer_class(instance=invoice_receipt).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(InvoiceReceiptViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(InvoiceReceiptViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(InvoiceReceiptViewSet, self).destroy(request=request, pk=pk)


class InvoiceLineItemViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceLineItem.objects.all()
    serializer_class = InvoiceLineItemReadSerializer
    permission_classes_by_action = {"create": [IsAuthenticated, InvoiceLineItemCreatePermission],
                                    "partial_update": [IsAuthenticated, InvoiceLineItemPermission],
                                    "destroy": [IsAuthenticated, InvoiceLineItemPermission]}

    def create(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        line_items = request.data["line_items"]
        existing_line_item_ids = []
        for line_item in line_items:
            if "id" in line_item:
                existing_line_item_ids.append(line_item["id"])
                invoice_line_item = InvoiceLineItem.objects.filter(pk=line_item["id"])
                _ = line_item.pop("total_amount", None)
                invoice_line_item.update(**line_item)
        InvoiceLineItem.objects.exclude(pk__in=existing_line_item_ids).delete()
        for line_item in line_items:
            if "id" not in line_item:
                line_item["invoice"] = invoice_id
                invoice_line_item_serializer = InvoiceLineItemWriteSerializer(data=line_item)
                if invoice_line_item_serializer.is_valid(raise_exception=True):
                    invoice_line_item_serializer.save()
        invoice_line_items = InvoiceLineItem.objects.filter(invoice=invoice)
        return Response(self.serializer_class(invoice_line_items, many=True).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(InvoiceLineItemViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(InvoiceLineItemViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(InvoiceLineItemViewSet, self).destroy(request=request, pk=pk)


class InvoiceDocumentViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceDocument.objects.all()
    serializer_class = InvoiceDocumentReadSerializer
    permission_classes_by_action = {"create": [IsAuthenticated, InvoiceDocumentCreatePermission],
                                    "partial_update": [IsAuthenticated, InvoiceDocumentPermission],
                                    "destroy": [IsAuthenticated, InvoiceDocumentPermission]}

    def create(self, request, user_id=None, invoice_id=None):  # noqa
        if not user_id:
            raise NotImplementedError("This API doesn't support execution missing user id.")
        try:
            BenjiAccount.objects.get(pk=user_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response(f"Invoice {invoice_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "invoice", invoice_id)
        invoice_document_serializer = InvoiceDocumentWriteSerializer(data=request.data)
        if invoice_document_serializer.is_valid(raise_exception=True):
            invoice_document = invoice_document_serializer.save()
        return Response(self.serializer_class(instance=invoice_document).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(InvoiceDocumentViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(InvoiceDocumentViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(InvoiceDocumentViewSet, self).destroy(request=request, pk=pk)


class InvoiceBillFromViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceBillFrom.objects.all()
    serializer_class = InvoiceBillFromReadSerializer
    permission_classes_by_action = {"partial_update": [IsAuthenticated, InvoiceBillFromPermission]}

    def partial_update(self, request, pk=None):
        return super(InvoiceBillFromViewSet, self).partial_update(request=request, pk=pk)


class InvoiceBillToViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceBillTo.objects.all()
    serializer_class = InvoiceBillToReadSerializer
    permission_classes_by_action = {"partial_update": [IsAuthenticated, InvoiceBillToPermission]}

    def partial_update(self, request, pk=None):
        return super(InvoiceBillToViewSet, self).partial_update(request=request, pk=pk)


class InvoiceViewSet(MixedPermissionModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = InvoiceSerializer

    def post(self, request, format=None):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PreviewReport(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Job.objects.all()
    serializer_class = InvoiceWithCrewDetails

    def get_crew_info(self, request, job_id=None):
        job = get_object_or_404(Job.objects.only('id', 'company', 'wrap_and_pay_type').select_related('company'),
                                pk=job_id)
        response_data = InvoiceWithCrewDetails(instance=job, context={'reports':True}).data
        invoice_memo_ids = request.data.get('invoice_memo_ids', [])
        crew_list = [crew for crew in response_data['crew'] if crew['id'] in invoice_memo_ids] if invoice_memo_ids else response_data['crew']
        response_data['crew'] = crew_list
        return Response(response_data, status=status.HTTP_200_OK)

    def download_report(self, request, job_id=None):
        job = get_object_or_404(Job.objects.only('id', 'company', 'wrap_and_pay_type').select_related('company'),
                                pk=job_id)
        invoices = InvoiceWithCrewDetails(instance=job, context={'reports':True}).data
        invoice_memo_ids = request.data.get('invoice_memo_ids', [])
        crew_list = [crew for crew in invoices['crew'] if crew['id'] in invoice_memo_ids] if invoice_memo_ids else invoices['crew']
        params = {
            "invoice": invoices,
            "crew": crew_list,
        }
        return Render.render('report_template.html', params)

    def update_payment_option(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        job.wrap_and_pay_type = request.data["wrap_and_pay_type"]
        job.save()
        serializer = self.get_serializer(job)
        return Response(serializer.data)


class PayFromBuddi(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceMemo.objects.all()
    serializer_class = SilaToSilaTxSerializer

    def get_approved(self, request, job_id=None):
        job = get_object_or_404(Job, pk=job_id)
        invoices = Invoice.objects.filter(invoice_memo__job_memo__job_id=job_id,
                                          invoice_status=INVOICE_STATUS_APPROVED)
        results = {}
        results["invoice_memos"] = []
        for invoice in invoices:
            results["invoice_memos"].append(InvoiceReadSerializer(instance=invoice).data)
        return Response(results, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request, job_id):
        invoice_ids = request.data.get('invoices', [])
        job = get_object_or_404(Job, pk=job_id)
        invoices = Invoice.objects.filter(
            invoice_memo__job_memo__job_id=job_id,
            invoice_status=INVOICE_STATUS_APPROVED,
        ).exclude(
            payment_status__in=[PAYMENT_STATUS_PAYMENT_SENT, PAYMENT_STATUS_PROCESSING]
        )
        for invoice in invoices:
            if invoice.id in invoice_ids:
                invoice.payment_status = PAYMENT_STATUS_PROCESSING
                invoice.status_message = None
                invoice.save()

                data = InvoiceReadSerializer(instance=invoice).data
                from_user = request.user
                from_company = job.company
                to_user = data['benji_account']
                amount = data['total_price']
                try:
                    amount = int(amount) * 100
                except (TypeError, ValueError):
                    invoice.payment_status = PAYMENT_STATUS_PAYMENT_FAILED
                    invoice.status_message = "Invalid payment amount."
                    invoice.save()
                    continue

                # Get money receiver
                destination_handler = None

                if to_user:
                    # get receiver details to check weather user has wallet or not.
                    to_user = get_object_or_404(BenjiAccount, pk=to_user)
                    try:
                        destination_handler = to_user.sila_user.user_handle
                    except BenjiAccount.sila_user.RelatedObjectDoesNotExist:
                        invoice.payment_status = PAYMENT_STATUS_PAYMENT_FAILED
                        invoice.status_message = "The user doesn't have a Buddi Wallet account."
                        invoice.save()
                        continue
                        # return Response(
                        #     {"status": "error", "message": f"{to_user} does not have sila wallet"},
                        #     status=status_codes.HTTP_400_BAD_REQUEST)

                # Get money sender
                # from_sila: Union[SilaUser, None] = None

                if from_company:
                    # Check if payment should be sent from company
                    # TODO: Check if user has access to company
                    from_sila = from_company.sila_corporate
                else:
                    from_sila = from_user.sila_user

                # Perform Transaction

                response = adapter.transfer_sila_to_sila(
                    amount, from_sila, destination_handler
                )
                if not response["success"]:
                    invoice.payment_status = PAYMENT_STATUS_PAYMENT_FAILED
                    invoice.status_message = response["message"]
                    invoice.save()
                    logger.error(
                        (
                            f"invoice_id: {invoice.id} payment failed. reason: "
                            f"{invoice.status_message}"
                        )
                    )
                    continue
                else:
                    # save the payment status ASAP to avoid duplicated payment
                    invoice.payment_status = PAYMENT_STATUS_PAYMENT_SENT
                    invoice.save()
                    substitutions = {
                        "payee_name": invoice.benji_account.full_name,
                        # "notes": invoice.notes,
                        "wallet_url": settings.FRONTEND_BASE_URL + '/wallet',
                        "payment_due": invoice.payment_due.strftime("%m/%d/%Y"),
                        "amount_due": "{:,.2f}".format(int(amount) / 100),
                    }

                    send_email_template.delay(
                        from_email=os.getenv("INFO_FROM_EMAIL"),
                        recipient_list=[from_user.email],
                        email_template_id=os.getenv("EMAIL_TEMPLATE_PAYMENT_SENT_ID"),
                        substitutions=substitutions,
                        sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
                    )

                from_user_id = None
                if not from_company:
                    from_user_id = from_user.id
                    from_user = None

                formatted_amount = "{:,.2f}".format(amount/100)
                child_tx_data = {
                    "from_user": from_user_id,
                    "from_company": from_company.id,
                    "to_user": to_user.id,
                    "amount": amount,
                    "request_transaction_id": response["transaction_id"],
                    "is_auto_approve": True,
                    "note": data.get("note", f"Sent ${formatted_amount} on {datetime.datetime.now().strftime('%B %d, %Y')}")
                }

                tx = SilaToSilaTxSerializer(data=child_tx_data)
                if tx.is_valid(raise_exception=True):
                    tx.save()
                    invoice.status_message = None
                    invoice.transaction = tx.instance
                    invoice.save()

        job.paid_by = Job.PaidBy.WALLET
        job.save()

        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)


class PayFromBank(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = InvoiceMemo.objects.all()
    serializer_class = FiatToSilaTxSerializer

    @transaction.atomic
    def bulk_create(self, request, job_id):
        job = get_object_or_404(Job, pk=job_id)
        requested_data = request.data
        from_company_id = job.company_id
        from_account_id = requested_data.get('account_id')
        invoice_ids = requested_data.get('invoices')
        errors = []

        invoices = Invoice.objects.filter(
            invoice_memo__job_memo__job_id=job_id,
            invoice_status=INVOICE_STATUS_APPROVED,
        ).exclude(
            payment_status__in=[PAYMENT_STATUS_PAYMENT_SENT, PAYMENT_STATUS_PROCESSING]
        )

        for invoice in invoices:
            if invoice.id in invoice_ids:
                invoice.payment_status = PAYMENT_STATUS_PROCESSING
                invoice.status_message = None
                invoice.save()

                to_user_id = invoice.benji_account
                amount = invoice.total_invoice_amount
                note = invoice.notes
                try:
                    self.create_for_company_to_user(
                        from_company_id, from_account_id, to_user_id, amount, note
                    )
                    invoice.payment_status = PAYMENT_STATUS_PAYMENT_SENT
                    invoice.status_message = None
                    invoice.save()
                except Exception as e:
                    invoice.payment_status = PAYMENT_STATUS_PAYMENT_FAILED
                    invoice.status_message = f"{e}"
                    invoice.save()
                    error_msg = f"Error paying {to_user_id} amount={amount} err_msg={e}"
                    errors.append(error_msg)
        if errors:
            return Response(
                {"status": "error", "message": errors},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)

    def create_for_company_to_user(self, from_company_id, from_account_id, to_user_id, amount, note):
        # create a fiat -> sila tx
        company = Company.objects.get(id=from_company_id)
        account = PlaidLinkedCorporateAccount.objects.filter(
            company=company, id=from_account_id
        ).get()
        response = adapter.transfer_fiat_to_sila(
            amount, company.sila_corporate, account
        )
        if not response["success"]:
            return Response({"status": "error", "message": response["message"]}, status=status_codes.HTTP_400_BAD_REQUEST )
        tx_id = response["transaction_id"]

        tx_data = {"note": note, "to_user": to_user_id.pk, "amount": amount}
        tx_data["request_transaction_id"] = tx_id
        tx_data["account_corporate"] = account.id
        tx = FiatToSilaTxSerializer(data=tx_data)
        tx_obj = None
        if tx.is_valid():
            if from_company_id != to_user_id:
                # create a back to back sila => sila tx now as transfering to other user wallet
                tx_sila_to_sila_serialized = self.create_back_to_back_tx(tx.validated_data, to_user_id=to_user_id, from_company=from_company_id)
                if tx_sila_to_sila_serialized.is_valid():
                    tx_obj = tx.save()
                    tx_sila_to_sila_serialized.validated_data["fiat_parent"] = tx_obj
                    tx_sila_to_sila_serialized.save()
            else:
                tx_obj = tx.save()

        else:
            raise Exception(tx.errors)
        return tx_obj

    def create_back_to_back_tx(self, parent_tx_data, to_user_id=None, to_company_id=None, from_user=None, from_company=None):
        amount = parent_tx_data["amount"]
        parent_request_transaction_id = parent_tx_data["request_transaction_id"]
        tx_sila_to_sila = {
            "to_user": to_user_id,
            "to_company": to_company_id,
            "amount": amount,
            "parent_request_transaction_id": parent_request_transaction_id,
            "is_auto_approve": False,
        }
        if from_user:
            tx_sila_to_sila["from_user"] = from_user
            tx_sila_to_sila["note"] = parent_tx_data.get("note", f"amount: {amount} from: {from_user} to: {from_user} on: {datetime.datetime.now()}")
        else:
            tx_sila_to_sila["from_company"] = from_company
            tx_sila_to_sila["note"] = parent_tx_data.get("note", f"amount: {amount} from: {from_company} to: {from_company} on: {datetime.datetime.now()}")

        tx_sila_to_sila_serialized = SilaToSilaTxSerializer(
            data=tx_sila_to_sila
        )
        return tx_sila_to_sila_serialized
