from rest_framework import permissions

from apps.finance.models import (Invoice, InvoiceBillFrom, InvoiceBillTo, InvoiceDocument, InvoiceLineItem,
                                 InvoiceReceipt)
from apps.jobs.constants import AGENCY_MEMO, INVOICE_STATUS_APPROVED
from apps.jobs.exceptions import CanNotHandleApprovedInvoiceError


def can_handle_memo(user, job_memo):
    if job_memo.memo_staff != AGENCY_MEMO and job_memo.benji_account == user:
        return True
    elif job_memo.memo_staff == AGENCY_MEMO:
        if job_memo.agency == user:
            return True
        else:
            return False
    else:
        return False


class FinancePermission(permissions.BasePermission):
    message = "You don't have permission. Please wait until an agency handles it."

    def has_permission(self, request, view):
        if (view.action == "get_contractor_invoices" or
                view.action == "get_contractor_statistics" or view.action == "partial_update"):
            return True
        else:
            invoice_id = view.kwargs.get("invoice_id", None)
            if not invoice_id:
                return False
            try:
                invoice = Invoice.objects.get(pk=invoice_id)
            except Invoice.DoesNotExist:
                return False
            user = request.user
            job_memo = invoice.invoice_memo.job_memo
            return can_handle_memo(user, job_memo)


class InvoiceBillFromPermission(permissions.BasePermission):
    message = "You don't have permission to update this address."

    def has_permission(self, request, view):
        invoice_bill_from_pk = view.kwargs.get("pk", None)
        if not invoice_bill_from_pk:
            return False
        try:
            invoice_bill_from = InvoiceBillFrom.objects.get(pk=invoice_bill_from_pk)
            invoice = invoice_bill_from.invoice
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except InvoiceBillFrom.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice_bill_from.invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceBillToPermission(permissions.BasePermission):
    message = "You don't have permission to update this address."

    def has_permission(self, request, view):
        invoice_bill_to_pk = view.kwargs.get("pk", None)
        if not invoice_bill_to_pk:
            return False
        try:
            invoice_bill_to = InvoiceBillTo.objects.get(pk=invoice_bill_to_pk)
            invoice = invoice_bill_to.invoice
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except InvoiceBillTo.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice_bill_to.invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceDocumentCreatePermission(permissions.BasePermission):
    message = "You don't have permission to create an invoice document."

    def has_permission(self, request, view):
        invoice_id = view.kwargs.get("invoice_id", None)
        if not invoice_id:
            return False
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except Invoice.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceDocumentPermission(permissions.BasePermission):
    message = "You don't have permission to update/remove this document."

    def has_permission(self, request, view):
        invoice_document_pk = view.kwargs.get("pk", None)
        if not invoice_document_pk:
            return False
        try:
            invoice_document = InvoiceDocument.objects.get(pk=invoice_document_pk)
            invoice = invoice_document.invoice
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except InvoiceDocument.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice_document.invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceLineItemCreatePermission(permissions.BasePermission):
    message = "You don't have permission to create an invoice line item."

    def has_permission(self, request, view):
        invoice_id = view.kwargs.get("invoice_id", None)
        if not invoice_id:
            return False
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except Invoice.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceLineItemPermission(permissions.BasePermission):
    message = "You don't have permission to update/remove this line item."

    def has_permission(self, request, view):
        invoice_line_item_pk = view.kwargs.get("pk", None)
        if not invoice_line_item_pk:
            return False
        try:
            invoice_line_item = InvoiceLineItem.objects.get(pk=invoice_line_item_pk)
            invoice = invoice_line_item.invoice
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except InvoiceLineItem.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice_line_item.invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceReceiptCreatePermission(permissions.BasePermission):
    message = "You don't have permission to create an invoice receipt."

    def has_permission(self, request, view):
        invoice_id = view.kwargs.get("invoice_id", None)
        if not invoice_id:
            return False
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except Invoice.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)


class InvoiceReceiptPermission(permissions.BasePermission):
    message = "You don't have permission to update/remove this receipt."

    def has_permission(self, request, view):
        invoice_receipt_pk = view.kwargs.get("pk", None)
        if not invoice_receipt_pk:
            return False
        try:
            invoice_receipt = InvoiceReceipt.objects.get(pk=invoice_receipt_pk)
            invoice = invoice_receipt.invoice
            if invoice.invoice_status == INVOICE_STATUS_APPROVED:
                raise CanNotHandleApprovedInvoiceError()
        except InvoiceReceipt.DoesNotExist:
            return False
        user = request.user
        job_memo = invoice_receipt.invoice.invoice_memo.job_memo
        return can_handle_memo(user, job_memo)
