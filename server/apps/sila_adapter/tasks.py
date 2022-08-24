from django.conf import settings

from apps.sila_adapter.models import SilaToFiatTx, SilaToSilaTx, FiatToSilaTx
from apps.sila_adapter.sila_adapter import SilaAdapter
from benji_app.celery import app
import logging

logger = logging.getLogger(__name__)
adapter = SilaAdapter.setup(settings.SILA_CONFIG)


@app.task
def perform_pending_transaction(reference_id):

    sila_transaction = SilaToFiatTx.objects.filter(
        request_transaction_id=reference_id
    ).first()

    if not sila_transaction:
        sila_transaction = SilaToSilaTx.objects.filter(
            request_transaction_id=reference_id
        ).first()

    if not sila_transaction:
        sila_transaction = FiatToSilaTx.objects.filter(
            request_transaction_id=reference_id
        ).first()

    if not sila_transaction:
        logger.error(f"Cannot find transaction_id: {reference_id}")
        return

    if isinstance(sila_transaction, SilaToFiatTx):
        adapter.update_pending_sila_to_fiat(sila_transaction)
    elif isinstance(sila_transaction, SilaToSilaTx):
        adapter.update_pending_sila_to_sila(sila_transaction)
    elif isinstance(sila_transaction, FiatToSilaTx):
        adapter.update_pending_fiat_to_sila(sila_transaction)

    return
