from apps.finance.models import Invoice


def get_unique_invoice_number(user):
    invoices = Invoice.objects.filter(benji_account=user).order_by("-created_at")
    try:
        return int(invoices[0].invoice_number) + 1
    except IndexError:
        return 1


def validate_invoice_number(user, invoice, invoice_number):
    invoices = Invoice.objects.filter(benji_account=user, invoice_number=invoice_number).exclude(pk=invoice.pk)
    return invoices.count() == 0
