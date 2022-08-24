import asyncio
import base64
import os
import logging
import traceback
import datetime
from copy import deepcopy
import shutil
from enum import Enum
from itertools import chain
from tempfile import mkdtemp
from typing import Union, Optional

import pdfkit
from django.template.loader import render_to_string

import requests
from django.db.models import Q, Value, F, IntegerField, Case, When, ExpressionWrapper, FloatField
from dateutil.relativedelta import relativedelta

from django.conf import settings
from django.db import transaction
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models.functions import Concat
from django.db.models import CharField
from django.http import HttpRequest, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.timezone import now
from rest_framework.views import APIView
from silasdk import EthWallet
from rest_framework import viewsets, status
from rest_framework import status as status_codes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.user.models import Company, BenjiAccount, CompanyBenjiAccountEntry, CompanyAccessRequestToken
from apps.user.serializers import BenjiTokenObtainPairSerializer, BenjiAccountSerializer
from apps.sila_adapter.models import (
    SilaCorporate,
    SilaUser,
    CorporateWallet,
    UserWallet,
    KYC_Request,
    KYC_History,
    PlaidLinkedAccount,
    PlaidLinkedCorporateAccount,
    SilaCorporateMember,
    SilaToSilaTx,
    SilaToFiatTx,
    FiatToSilaTx,
    SilaRequest,
    PlaidLinkedAccountReference,
)
from apps.help.utils import get_default_event_loop
from apps.sila_adapter.sila_adapter import SilaAdapter
from apps.sila_adapter.utils import (
    generate_sila_user_handle,
    parse_error_message_from_sila,
    parse_register_field_error_from_sila,
    concatenate_image_files_to_pdf,
    concatenate_all_pdfs,
    get_kyc_request_fail_result_detail,
)
from apps.sila_adapter.serializers import (
    SilaCorporateSerializer,
    SilaUserSerializer,
    CorporateWalletSerializer,
    UserWalletSerializer,
    KYC_OverviewSerializer,
    PlaidLinkedAccountSerializer,
    SilaToSilaTxSerializer,
    FiatToSilaTxSerializer,
    PlaidLinkedCorporateAccountSerializer,
    SilaCorporateMemberSerializer,
    SilaToFiatTxSerializer,
    SilaRequestSerializer,
    SilaSearchSerializer,
    SilaUserAccountManagerSerializer,
    SilaCorporateAccountManagerSerializer,
    SilaCorporateMemberUpdateRequestSerializer,
)
from apps.jobs.constants import (
    ACCOUNT_COMPANY_RELATION_OWNER,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    ACCOUNT_COMPANY_RELATION_COMMON_STAFF,
    ACCOUNT_COMPANY_BUSINESS_MEMBER
)
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.permissions import AccountManagerPermission

from .tasks import perform_pending_transaction
from ..user.constants import BUDDI_ADMIN, VIA_BUDDISYSTEMS
from ..user.utils import send_access_request_to_member

adapter = SilaAdapter.setup(settings.SILA_CONFIG)
logger = logging.getLogger(__name__)


class BenjiTokenObtainPairView(TokenObtainPairView):
    serializer_class = BenjiTokenObtainPairSerializer


class SilaUserTxsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaUserSerializer

    class TransactionType(str, Enum):
        TRANSFERS = 'TRANSFERS'
        BUDDY_PAYMENTS = 'BUDDY_PAYMENTS'
        PAYMENTS_RECEIVED = 'PAYMENTS_RECEIVED'
        JOB_PAYMENTS = 'JOB_PAYMENTS'

    def _get_start_and_end_date(self, request):
        today = now()
        last_5_year = today - relativedelta(years=5)

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        try:

            if start_date:
                start_date = datetime.datetime.fromtimestamp(int(start_date) / 1000).date()
            else:
                start_date = last_5_year
            if end_date:
                end_date = datetime.datetime.fromtimestamp(int(end_date) / 1000).date()
            else:
                end_date = today

        except (ValueError, TypeError) as e:
            end_date = today
            start_date = last_5_year

        return start_date, end_date

    def _get_search_filter_for_sila_to_sila(self, request):
        search = request.query_params.get("key_search", '')

        if search:
            query = (
                Q(note__icontains=search) |
                Q(from_user__full_name__icontains=search) |
                Q(to_user__full_name__icontains=search) |
                Q(from_company__title__icontains=search) |
                Q(to_company__title__icontains=search)
            )
            return query

        return Q()

    def _get_search_filter_fiat_to_sila(self, request, instance: Union[BenjiAccount, Company]):
        search = request.query_params.get("key_search", '')

        if search and isinstance(instance, BenjiAccount):
            query = (
                Q(note__icontains=search) |
                Q(to_user__full_name__icontains=search)
            )
            return query

        if search and isinstance(instance, Company):
            query = (
                Q(note__icontains=search) |
                Q(to_company__title__icontains=search)
            )
            return query

        return Q()

    def _get_search_filter_sila_to_fiat(self, request, instance: Union[BenjiAccount, Company]):
        search = request.query_params.get("key_search", '')

        if search and isinstance(instance, BenjiAccount):
            query = (
                Q(note__icontains=search) |
                Q(from_user__full_name__icontains=search)
            )
            return query

        if search and isinstance(instance, Company):
            query = (
                Q(note__icontains=search) |
                Q(from_company__title__icontains=search)
            )
            return query

        return Q()

    def _get_filtered_transactions(self, request, instance: Union[BenjiAccount, Company]):
        start_date, end_date = self._get_start_and_end_date(request)
        date_filter = Q(created_at__gte=start_date) & Q(created_at__lte=end_date)
        transaction_type = request.query_params.get('transaction_type')

        sila_to_sila_search_filter = self._get_search_filter_for_sila_to_sila(request)
        fiat_to_sila_search_filter = self._get_search_filter_fiat_to_sila(request, instance)
        sila_to_fiat_search_filter = self._get_search_filter_sila_to_fiat(request, instance)

        fiat_to_sila_qs = None
        sila_to_fiat_qs = None
        sila_to_sila_qs = None

        if isinstance(instance, BenjiAccount):

            fiat_to_sila_qs = FiatToSilaTx.objects.filter(
                Q(to_user=instance) &
                date_filter &
                fiat_to_sila_search_filter
            ).annotate(
                type=Value('fiat_to_sila', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                receiver_type=Case(
                    When(to_user__isnull=False, then=Value('User')),
                    When(to_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_name=Case(
                    When(to_user__isnull=False, then=F('to_user__full_name')),
                    When(to_company__isnull=False, then=F('to_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_profile_photo_s3_url=Case(
                    When(to_user__isnull=False, then=F('to_user__profile_photo_s3_url')),
                    When(to_company__isnull=False, then=F('to_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_email=Case(
                    When(to_user__isnull=False, then=F('to_user__email')),
                    When(to_company__isnull=False, then=F('to_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_account_number=Case(
                    When(account_user__isnull=False, then=F('account_user__account_number')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_number')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_account_type=Case(
                    When(account_user__isnull=False, then=F('account_user__account_type')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_type')),
                    default=None,
                    output_field=CharField()
                ),
                sender_type=Value(None, output_field=CharField()),
                sender_name=Value(None, output_field=CharField()),
                sender_email=Value(None, output_field=CharField()),
                sender_profile_photo_s3_url=Value(None, output_field=CharField()),
                side=Value('credit', output_field=CharField()),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField())
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'sender_email', 'receiver_email',
                'side', 'created_at', 'processed', 'note', 'amount', 'amount_value',
                'receiver_account_number', 'receiver_account_type',
            ).order_by(
                'created_at'
            )

            sila_to_fiat_qs = SilaToFiatTx.objects.filter(
                Q(from_user=instance) &
                date_filter &
                sila_to_fiat_search_filter
            ).annotate(
                type=Value('sila_to_fiat', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                sender_type=Case(
                    When(from_user__isnull=False, then=Value('User')),
                    When(from_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                sender_name=Case(
                    When(from_user__isnull=False, then=F('from_user__full_name')),
                    When(from_company__isnull=False, then=F('from_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                sender_profile_photo_s3_url=Case(
                    When(from_user__isnull=False, then=F('from_user__profile_photo_s3_url')),
                    When(from_company__isnull=False, then=F('from_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                sender_email=Case(
                    When(from_user__isnull=False, then=F('from_user__email')),
                    When(from_company__isnull=False, then=F('from_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                sender_account_number=Case(
                    When(account_user__isnull=False, then=F('account_user__account_number')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_number')),
                    default=None,
                    output_field=CharField()
                ),
                sender_account_type=Case(
                    When(account_user__isnull=False, then=F('account_user__account_type')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_type')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_type=Value(None, output_field=CharField()),
                receiver_name=Value(None, output_field=CharField()),
                receiver_email=Value(None, output_field=CharField()),
                receiver_profile_photo_s3_url=Value(None, output_field=CharField()),
                side=Value('debit', output_field=CharField()),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField()),
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'side', 'created_at',
                'sender_email', 'receiver_email', 'processed', 'note', 'amount', 'amount_value',
                'sender_account_number', 'sender_account_type',
            ).order_by(
                'created_at'
            )

            sila_to_sila_qs = SilaToSilaTx.objects.filter(
                Q(from_user=instance) |
                Q(to_user=instance) &
                date_filter &
                sila_to_sila_search_filter
            ).annotate(
                type=Value('sila_to_sila', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                sender_type=Case(
                    When(from_user__isnull=False, then=Value('User')),
                    When(from_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_type=Case(
                    When(to_user__isnull=False, then=Value('User')),
                    When(to_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                sender_name=Case(
                    When(from_user__isnull=False, then=F('from_user__full_name')),
                    When(from_company__isnull=False, then=F('from_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_name=Case(
                    When(to_user__isnull=False, then=F('to_user__full_name')),
                    When(to_company__isnull=False, then=F('to_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                sender_email=Case(
                    When(from_user__isnull=False, then=F('from_user__email')),
                    When(from_company__isnull=False, then=F('from_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_email=Case(
                    When(to_user__isnull=False, then=F('to_user__email')),
                    When(to_company__isnull=False, then=F('to_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                sender_profile_photo_s3_url=Case(
                    When(from_user__isnull=False, then=F('from_user__profile_photo_s3_url')),
                    When(from_company__isnull=False, then=F('from_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_profile_photo_s3_url=Case(
                    When(to_user__isnull=False, then=F('to_user__profile_photo_s3_url')),
                    When(to_company__isnull=False, then=F('to_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                side=Case(
                    When(from_user=instance, then=Value('debit')),
                    When(to_user=instance, then=Value('credit')),
                    default=None,
                    output_field=CharField()
                ),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField())
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'side', 'created_at',
                'sender_email', 'receiver_email', 'processed', 'note', 'amount', 'amount_value',
            ).order_by(
                'created_at'
            )

        if isinstance(instance, Company):

            fiat_to_sila_qs = FiatToSilaTx.objects.filter(
                Q(to_company=instance) &
                date_filter &
                fiat_to_sila_search_filter
            ).annotate(
                type=Value('fiat_to_sila', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                receiver_type=Case(
                    When(to_user__isnull=False, then=Value('User')),
                    When(to_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_name=Case(
                    When(to_user__isnull=False, then=F('to_user__full_name')),
                    When(to_company__isnull=False, then=F('to_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_profile_photo_s3_url=Case(
                    When(to_user__isnull=False, then=F('to_user__profile_photo_s3_url')),
                    When(to_company__isnull=False, then=F('to_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_email=Case(
                    When(to_user__isnull=False, then=F('to_user__email')),
                    When(to_company__isnull=False, then=F('to_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_account_number=Case(
                    When(account_user__isnull=False, then=F('account_user__account_number')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_number')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_account_type=Case(
                    When(account_user__isnull=False, then=F('account_user__account_type')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_type')),
                    default=None,
                    output_field=CharField()
                ),
                sender_type=Value(None, output_field=CharField()),
                sender_name=Value(None, output_field=CharField()),
                sender_profile_photo_s3_url=Value(None, output_field=CharField()),
                sender_email=Value(None, output_field=CharField()),
                side=Value('credit', output_field=CharField()),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField())
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'side', 'created_at',
                'receiver_email', 'sender_email', 'processed', 'note', 'amount', 'amount_value',
                'receiver_account_number', 'receiver_account_type'
            ).order_by(
                '-created_at'
            )

            sila_to_fiat_qs = SilaToFiatTx.objects.filter(
                Q(from_company=instance) &
                date_filter &
                sila_to_fiat_search_filter
            ).annotate(
                type=Value('sila_to_fiat', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                sender_type=Case(
                    When(from_user__isnull=False, then=Value('User')),
                    When(from_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                sender_name=Case(
                    When(from_user__isnull=False, then=F('from_user__full_name')),
                    When(from_company__isnull=False, then=F('from_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                sender_profile_photo_s3_url=Case(
                    When(from_user__isnull=False, then=F('from_user__profile_photo_s3_url')),
                    When(from_company__isnull=False, then=F('from_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                sender_email=Case(
                    When(from_user__isnull=False, then=F('from_user__email')),
                    When(from_company__isnull=False, then=F('from_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                sender_account_number=Case(
                    When(account_user__isnull=False, then=F('account_user__account_number')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_number')),
                    default=None,
                    output_field=CharField()
                ),
                sender_account_type=Case(
                    When(account_user__isnull=False, then=F('account_user__account_type')),
                    When(account_corporate__isnull=False, then=F('account_corporate__account_type')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_type=Value(None, output_field=CharField()),
                receiver_name=Value(None, output_field=CharField()),
                receiver_profile_photo_s3_url=Value(None, output_field=CharField()),
                receiver_email=Value(None, output_field=CharField()),
                side=Value('debit', output_field=CharField()),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField()),
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'side', 'created_at',
                'sender_email', 'receiver_email', 'processed', 'note', 'amount', 'amount_value',
                'sender_account_number', 'sender_account_type'
            ).order_by(
                'created_at'
            )

            sila_to_sila_qs = SilaToSilaTx.objects.filter(
                Q(from_company=instance) |
                Q(to_company=instance) &
                date_filter &
                sila_to_sila_search_filter
            ).annotate(
                type=Value('sila_to_sila', output_field=CharField()),
                transfer_id=F('request_transaction_id'),
                sender_type=Case(
                    When(from_user__isnull=False, then=Value('User')),
                    When(from_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_type=Case(
                    When(to_user__isnull=False, then=Value('User')),
                    When(to_company__isnull=False, then=Value('Company')),
                    default=None,
                    output_field=CharField()
                ),
                sender_name=Case(
                    When(from_user__isnull=False, then=F('from_user__full_name')),
                    When(from_company__isnull=False, then=F('from_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_name=Case(
                    When(to_user__isnull=False, then=F('to_user__full_name')),
                    When(to_company__isnull=False, then=F('to_company__title')),
                    default=None,
                    output_field=CharField()
                ),
                sender_profile_photo_s3_url=Case(
                    When(from_user__isnull=False, then=F('from_user__profile_photo_s3_url')),
                    When(from_company__isnull=False, then=F('from_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_profile_photo_s3_url=Case(
                    When(to_user__isnull=False, then=F('to_user__profile_photo_s3_url')),
                    When(to_company__isnull=False, then=F('to_company__profile_photo_s3_url')),
                    default=None,
                    output_field=CharField()
                ),
                sender_email=Case(
                    When(from_user__isnull=False, then=F('from_user__email')),
                    When(from_company__isnull=False, then=F('from_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                receiver_email=Case(
                    When(to_user__isnull=False, then=F('to_user__email')),
                    When(to_company__isnull=False, then=F('to_company__email')),
                    default=None,
                    output_field=CharField()
                ),
                side=Case(
                    When(from_company=instance, then=Value('debit')),
                    When(to_company=instance, then=Value('credit')),
                    default=None,
                    output_field=CharField()
                ),
                amount_value=ExpressionWrapper(F('amount') / 100, output_field=FloatField())
            ).values(
                'id', 'type', 'transfer_id', 'sender_type', 'receiver_type', 'sender_name', 'receiver_name',
                'sender_profile_photo_s3_url', 'receiver_profile_photo_s3_url', 'side', 'created_at',
                'sender_email', 'receiver_email', 'processed', 'note', 'amount', 'amount_value',
            ).order_by(
                'created_at'
            )

        if transaction_type == self.TransactionType.TRANSFERS:
            # Only transactions with bank accounts
            sila_to_sila_qs = []

        if transaction_type == self.TransactionType.BUDDY_PAYMENTS:
            # Only transactions between buddy wallets
            sila_to_fiat_qs = []
            fiat_to_sila_qs = []

        if transaction_type == self.TransactionType.PAYMENTS_RECEIVED:
            if isinstance(instance, BenjiAccount):
                sila_to_sila_qs = sila_to_sila_qs.filter(to_user=instance)
                fiat_to_sila_qs = fiat_to_sila_qs.filter(to_user=instance)
            if isinstance(instance, Company):
                sila_to_sila_qs = sila_to_sila_qs.filter(to_company=instance)
                fiat_to_sila_qs = fiat_to_sila_qs.filter(to_company=instance)
            sila_to_fiat_qs = []

        if transaction_type == self.TransactionType.BUDDY_PAYMENTS:
            fiat_to_sila_qs = []
            sila_to_fiat_qs = []
            sila_to_sila_qs = sila_to_sila_qs.filter(
                invoice__isnull=False
            )

        results = sorted(
            chain(fiat_to_sila_qs, sila_to_fiat_qs, sila_to_sila_qs),
            key=lambda x: x['created_at'],
            reverse=True
        )

        return results

    def list_all_company(self, request, company_id):
        company = get_object_or_404(Company, pk=company_id)
        results = self._get_filtered_transactions(request, instance=company)
        return Response(results, status=status.HTTP_200_OK)

    def list_all_user(self, request):
        user = request.user
        results = self._get_filtered_transactions(request, instance=user)
        return Response(results, status=status.HTTP_200_OK)

    def pdf_for_user(self, request):
        user = request.user
        results = self._get_filtered_transactions(request, instance=user)
        html = render_to_string(
            template_name='transactions.html',
            context={'transactions': results}
        )
        pdf = pdfkit.from_string(html, output_path=False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="transaction.pdf"'
        return response

    def pdf_for_company(self, request, company_id: int):
        company = get_object_or_404(Company, pk=company_id)
        results = self._get_filtered_transactions(request, instance=company)
        html = render_to_string(
            template_name='transactions.html',
            context={'transactions': results}
        )
        pdf = pdfkit.from_string(html, output_path=False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="transaction.pdf"'
        return response


class SilaAccountList(APIView):

    def get(self, request, search=None):

        sila_users = SilaUser.objects.select_related(
            'user'
        ).filter(
            Q(kyc_pass=True) &
            Q(user__email__icontains=search) |\
            Q(first_name__icontains=search) |\
            Q(last_name__icontains=search)
        ).annotate(
            company_id=Value(None, output_field=IntegerField()),
            name=Concat(
                F('first_name'), Value(' '), F('last_name')
            ),
            type=Value('sila_user', output_field=CharField()),
            email=F('user__email'),
            profile_photo_s3_url=F('user__profile_photo_s3_url'),
        ).values_list(
            'id', 'user_id', 'company_id', 'name', 'profile_photo_s3_url', 'email', 'type'
        ).values(
            'id', 'user_id', 'company_id', 'name', 'profile_photo_s3_url', 'email', 'type'
        )

        sila_corporate = SilaCorporate.objects.select_related(
            'company'
        ).filter(
            Q(kyb_pass=True) &
            Q(business_email__icontains=search) | \
            Q(company__title__icontains=search)
        ).annotate(
            user_id=Value(None, output_field=IntegerField()),
            name=F('company__title'),
            type=Value('sila_corporate', output_field=CharField()),
            email=F('business_email'),
            profile_photo_s3_url=F('company__profile_photo_s3_url')
        ).values(
            'id', 'user_id', 'company_id', 'name', 'profile_photo_s3_url', 'email', 'type'
        )

        results =list(chain(sila_users, sila_corporate))

        serialized_results = SilaSearchSerializer(results, many=True).data
        return Response(serialized_results, status=200)


class SilaUserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaUserSerializer

    def list(self, request, search):
        query = Q(kyc_pass=True)
        if len(search) > 0:
            query_email = Q(user__email__icontains=search, kyc_pass=True)
            query_fname = Q(first_name__icontains=search, kyc_pass=True)
            query_lname = Q(last_name__icontains=search, kyc_pass=True)
            query = (query_lname | query_fname | query_email)
        sila_users = SilaUser.objects.filter(query)
        status_code = status_codes.HTTP_200_OK
        serialized_data = SilaUserSerializer(sila_users, many=True).data
        return Response(serialized_data, status=status_code)

    def list_last_transacted_user(self, request):
        user = request.user
        txs_from = [(tx.to_user,tx.created_at,tx.amount) for tx in SilaToSilaTx.objects.filter(from_user=user, processed=True).order_by('-created_at')]
        txs_to = [(tx.to_user,tx.created_at,-1*tx.amount) for tx in SilaToSilaTx.objects.filter(to_user=user, processed=True).order_by('-created_at')]
        txs = [t for t in sorted(txs_from + txs_to, key=lambda x: x[1], reverse=True)]
        txs_users = set([tx[0] for tx in txs])
        txs_dict = {tx[0].id:(tx[1],tx[2]) for tx in txs}
        serialized_data = BenjiAccountSerializer(txs_users, many=True).data
        for data in serialized_data:
            (created_at,amount) = txs_dict[data["id"]]
            data["tx_amount"] = amount
            data["tx_date"] = created_at
            data["sila_user"] = SilaUserSerializer(SilaUser.objects.get(user_id=data["id"])).data
        status_code = status_codes.HTTP_200_OK
        return Response(serialized_data,status=status_code)



class SilaUserTransactionsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaUserSerializer

    def list(self, request, search):
        query = Q(kyc_pass=True)
        if len(search) > 0:
            query_email = Q(user__email__istartswith=search, kyc_pass=True)
            query_fname = Q(first_name__istartswith=search, kyc_pass=True)
            query_lname = Q(last_name__istartswith=search, kyc_pass=True)
            query = (query_lname | query_fname | query_email)
        sila_users = SilaUser.objects.filter(query)
        status_code = status_codes.HTTP_200_OK
        serialized_data = SilaUserSerializer(sila_users, many=True).data
        return Response(serialized_data, status=status_code)


class SilaUserRegisterAPIViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaUserSerializer

    @transaction.atomic
    def create(self, request):
        valid_keys = [
            "first_name",
            "last_name",
            "social_security_number",
            "date_of_birth",
            "phone_number",
            "home_address",
            "city",
            "state",
            "zip",
        ]
        user = request.user
        request_data = request.data
        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )

        first_name = request_data.get("first_name")
        last_name = request_data.get("last_name")
        social_security_number = request_data.get("social_security_number")
        date_of_birth = request_data.get("date_of_birth")
        phone_number = request_data.get("phone_number")
        home_address = request_data.get("home_address")
        city = request_data.get("city")
        state = request_data.get("state")
        zip = request_data.get("zip")

        if date_of_birth:
            date_of_birth = datetime.datetime.strptime(date_of_birth, "%Y-%m-%d").date()

        user_handle = generate_sila_user_handle()
        logger.info(f"user_handle={user_handle}")
        eth_wallet = EthWallet.create()
        if SilaUser.objects.filter(user=user).exists() is True:
            sila_user = user.sila_user
            return Response(
                {"error": f"sila_user: {sila_user.id} already registered "},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        save_point_id = transaction.savepoint()
        sila_user = SilaUser.objects.create(
            user=user,
            user_handle=user_handle,
            private_key=eth_wallet["eth_private_key"],
            first_name=first_name,
            last_name=last_name,
            social_security_number=social_security_number,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            home_address=home_address,
            city=city,
            state=state,
            zip=zip,
        )
        user_wallet = UserWallet.objects.create(
            sila_user=sila_user,
            is_default=True,
            nickname="default",
            private_key=eth_wallet["eth_private_key"],
            public_key=eth_wallet["eth_address"],
        )
        result = adapter.register_user(sila_user)
        # An wallet will be created upon user registration
        if result["success"] is False:
            transaction.savepoint_rollback(save_point_id)
            error_dict_message = parse_register_field_error_from_sila(result)
            if error_dict_message.get("identity") is not None:
                error_dict_message["social_security_number"] = error_dict_message[
                    "identity"
                ]  # noqa: E501
                error_dict_message.pop("identity")

            return Response(
                error_dict_message, status=status_codes.HTTP_400_BAD_REQUEST
            )

        user_wallet.registered_at_sila = True
        user_wallet.save()
        result = adapter.update_wallet(user_wallet)
        status_code = status_codes.HTTP_400_BAD_REQUEST

        if result["success"] is False:
            error_message = parse_error_message_from_sila(result)
            return Response(
                {"error": error_message}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        status_code = status_codes.HTTP_200_OK
        serialized_data = SilaUserSerializer(sila_user).data
        return Response(serialized_data, status=status_code)

    def retrieve(self, request):
        try:
            sila_user = request.user.sila_user
        except SilaUser.DoesNotExist:
            return Response({})

        serialized_data = SilaUserSerializer(sila_user).data

        return Response(serialized_data)

    @classmethod
    def _parse_get_entity_response(cls, response: dict):
        entity = response["entity"]
        data = {}
        data["first_name"] = entity["first_name"]
        data["last_name"] = entity["last_name"]
        data["date_of_birth"] = entity["birthdate"]
        address = response["addresses"][0]
        data["city"] = address["city"]
        data["state"] = address["state"]
        data["zip"] = address["postal_code"]
        data["home_address"] = address["street_address_1"]
        data["phone_number"] = response["phones"][0]["phone"]
        data["social_security_number"] = response["identities"][0]["identity"]

        return data

    def update(self, request):
        valid_keys = [
            "first_name",
            "last_name",
            "social_security_number",
            "date_of_birth",
            "phone_number",
            "home_address",
            "city",
            "state",
            "zip",
        ]
        try:
            sila_user = request.user.sila_user
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        request_data = request.data
        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )

        asyncio.run(adapter.update_registration_data(request_data, sila_user))
        response = adapter.get_entity(sila_user)
        data = self._parse_get_entity_response(response)
        sila_user_queryset = SilaUser.objects.filter(id=sila_user.id)
        count = sila_user_queryset.update(**data)
        if count == 0:
            logger.error(f"update_user_info_to_db: failed. sila_user={sila_user.id}")

        sila_user.refresh_from_db()
        serialized_data = SilaUserSerializer(sila_user).data

        return Response(serialized_data)


class UserWalletViewSet(viewsets.ModelViewSet):
    serializer_class = UserWalletSerializer
    permission_classes = (IsAuthenticated,)
    queryset = UserWallet.objects.all()

    def create(self, request):
        user = request.user
        sila_user = user.sila_user
        try:
            nickname = request.data.get("nickname", "default")
            eth_wallet = EthWallet.create()
            wallet = UserWallet.objects.create(
                sila_user=sila_user,
                nickname=nickname,
                private_key=eth_wallet["eth_private_key"],
                public_key=eth_wallet["eth_address"],
            )
            result = adapter.register_user_wallet(wallet)
            # An wallet will be created upon user registration
            if result["success"] is False:
                error_message = parse_error_message_from_sila(result)
                return Response(
                    {"error": error_message}, status=status_codes.HTTP_400_BAD_REQUEST
                )

            wallet.registered_at_sila = True
            wallet.save()
            serialized_data = UserWalletSerializer(wallet).data

            return Response(serialized_data)
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})

    def list(self, request):
        user = request.user
        try:
            sila_user = user.sila_user
        except SilaUser.DoesNotExist:
            return Response([])

        # Currently we only support one wallet for each user
        wallet = self.queryset.filter(sila_user=sila_user).get(is_default=True)
        serialized_data = UserWalletSerializer(wallet).data

        return Response(serialized_data)

    def update_balances(self, request):
        user = request.user
        try:
            sila_user = user.sila_user
            wallets = adapter.update_user_balances(sila_user, skip_interval=60)
        except SilaUser.DoesNotExist:
            return Response([])
        serialized_data = UserWalletSerializer(wallets, many=True).data
        return Response(serialized_data)


class SilaCorporateRegisterAPIViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaCorporateSerializer

    @transaction.atomic
    def create(self, request, company_id: int):
        valid_keys = [
            "business_type",
            "category",
            "city",
            "state",
            "zip",
            "legal_company_name",
            "employer_id_number",
            "phone_number",
            "business_address",
            "business_email",
        ]
        user = request.user
        request_data = request.data
        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )

        business_type = request_data.get("business_type")
        category = request_data.get("category")
        city = request_data.get("city")
        state = request_data.get("state")
        zip = request_data.get("zip")
        legal_company_name = request_data.get("legal_company_name")
        employer_id_number = request_data.get("employer_id_number")
        phone_number = request_data.get("phone_number")
        business_address = request_data.get("business_address")
        business_email = request_data.get("business_email", "")
        if business_email == "":
            business_email = user.email

        if (
            Company.objects.filter(id=company_id, owner_email=user.email).exists()
            is False
        ):
            return Response(
                {
                    "error": (f"The user: {user.email} doesn't own company_id: "
                              f"{company_id}")
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        company = Company.objects.get(id=company_id, owner_email=user.email)
        user_handle = generate_sila_user_handle()
        eth_wallet = EthWallet.create()
        if SilaCorporate.objects.filter(company=company).exists() is True:
            return Response(
                {"error": f"The company: {company.id} already registered"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        save_point_id = transaction.savepoint()
        sila_corporate = SilaCorporate.objects.create(
            company=company,
            user_handle=user_handle,
            private_key=eth_wallet["eth_private_key"],
            business_type=business_type,
            category=category,
            legal_company_name=legal_company_name,
            employer_id_number=employer_id_number,
            phone_number=phone_number,
            business_address=business_address,
            business_email=business_email,
            city=city,
            state=state,
            zip=zip,
        )

        corporate_wallet = CorporateWallet.objects.create(
            sila_corporate=sila_corporate,
            is_default=True,
            nickname="default",
            private_key=eth_wallet["eth_private_key"],
            public_key=eth_wallet["eth_address"],
        )
        result = adapter.register_business_user(sila_corporate)
        # An wallet will be created upon user registration
        if result["success"] is False:
            transaction.savepoint_rollback(save_point_id)
            error_message = parse_register_field_error_from_sila(result)
            if error_message.get("identity") is not None:
                error_message["employer_id_number"] = error_message[
                    "identity"
                ]  # noqa: E501
                error_message.pop("identity")
            return Response(error_message, status=status_codes.HTTP_400_BAD_REQUEST)

        corporate_wallet.registered_at_sila = True
        corporate_wallet.save()
        result = adapter.update_wallet(corporate_wallet)

        if result["success"] is False:
            error_message = parse_error_message_from_sila(result)
            return Response(
                {"error": error_message}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        status_code = status_codes.HTTP_200_OK
        serialized_data = SilaCorporateSerializer(sila_corporate).data
        return Response(serialized_data, status=status_code)

    def retrieve(self, request, company_id):
        try:
            _ = request.user.sila_user
            company = Company.objects.get(id=company_id, owner_email=request.user.email)
            sila_corporate = company.sila_corporate
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except Company.DoesNotExist:
            return Response(
                {
                    "error": (
                        f"The user: {request.user.email} doesn't own "
                        f"company_id: {company_id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except SilaCorporate.DoesNotExist:
            return Response({})

        serialized_data = SilaCorporateSerializer(sila_corporate).data

        return Response(serialized_data)

    @classmethod
    def _parse_get_entity_response(cls, response: dict):
        entity = response["entity"]
        data = {}
        data["business_type"] = entity["business_type"]
        data["legal_company_name"] = entity["entity_name"]
        address = response["addresses"][0]
        data["business_email"] = response["emails"][0]["email"]
        data["city"] = address["city"]
        data["state"] = address["state"]
        data["zip"] = address["postal_code"]
        data["business_address"] = address["street_address_1"]
        data["phone_number"] = response["phones"][0]["phone"]
        data["employer_id_number"] = response["identities"][0]["identity"]

        return data

    def update(self, request, company_id):
        valid_keys = [
            "business_type",
            "category",
            "city",
            "state",
            "zip",
            "legal_company_name",
            "employer_id_number",
            "phone_number",
            "business_address",
            "business_email",
        ]
        try:
            _ = request.user.sila_user
            company = Company.objects.get(id=company_id, owner_email=request.user.email)
            sila_corporate = company.sila_corporate
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except Company.DoesNotExist:
            return Response(
                {
                    "error": (
                        f"The user: {request.user.email} doesn't own "
                        f"company_id: {company_id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except SilaCorporate.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The company has not registered yet. "
                        f"company_id: {company.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        request_data = request.data
        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )
        if request_data.get("category") is not None:
            _request_data = deepcopy(request_data)
            _request_data.pop("category")
        else:
            _request_data = request_data
        asyncio.run(adapter.update_registration_data(_request_data, sila_corporate))
        response = adapter.get_entity(sila_corporate)
        data = self._parse_get_entity_response(response)
        if request_data.get("category") is not None:
            data["category"] = request_data["category"]

        sila_corporate_queryset = SilaCorporate.objects.filter(id=sila_corporate.id)
        count = sila_corporate_queryset.update(**data)
        if count == 0:
            logger.error(
                f"update_user_info_to_db: failed. sila_corporate={sila_corporate.id}"
            )

        sila_corporate.refresh_from_db()
        serialized_data = SilaCorporateSerializer(sila_corporate).data

        return Response(serialized_data)


class CorporateWalletViewSet(viewsets.ModelViewSet):
    serializer_class = CorporateWalletSerializer
    permission_classes = (IsAuthenticated,)
    queryset = CorporateWallet.objects.all()

    def create(self, request, company_id: int):
        user = request.user
        try:
            company = Company.objects.get(owner_email=user.email, id=company_id)
            sila_corporate = company.sila_corporate
        except Company.DoesNotExist:
            return Response(
                f"The user: {user.email} doesn't own company_id: {company_id}",
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        try:
            nickname = request.data.get("nickname", "default")
            eth_wallet = EthWallet.create()
            transaction.savepoint()
            wallet = CorporateWallet.objects.create(
                sila_corporate=sila_corporate,
                nickname=nickname,
                private_key=eth_wallet["eth_private_key"],
                public_key=eth_wallet["eth_address"],
            )
            result = adapter.register_corporate_wallet(wallet)
            # An wallet will be created upon user registration
            if result["success"] is False:
                transaction.savepoint_rollback()
                error_message = parse_error_message_from_sila(result)
                return Response(
                    {"error": error_message}, status=status_codes.HTTP_400_BAD_REQUEST
                )

            wallet.registered_at_sila = True
            wallet.save()
            serialized_data = CorporateWalletSerializer(wallet).data

            return Response(serialized_data)
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})

    def list(self, request, company_id: int):
        user = request.user
        company = Company.objects.filter(
            pk=company_id,
            sila_corporate__isnull=False
        ).first()

        if not company or not hasattr(user, 'sila_user'):
            return Response([])

        # check business member
        wallet = CorporateWallet.objects.filter(
            sila_corporate=company.sila_corporate,
            sila_corporate__members__sila_user=request.user.sila_user,
            is_default=True,
        ).first()

        # check company owner
        if not wallet:
            wallet = CorporateWallet.objects.filter(
                sila_corporate__company__owner_email=user.email,
                sila_corporate__company=company,
                is_default=True,
            ).first()

        if not wallet:
            return Response([])

        serialized_data = CorporateWalletSerializer(wallet).data
        return Response(serialized_data)

    def update_balances(self, request):
        user = request.user
        try:
            sila_user = user.sila_user
            wallets = adapter.update_user_balances(sila_user, skip_interval=60)
        except SilaUser.DoesNotExist:
            return Response([])
        serialized_data = UserWalletSerializer(wallets, many=True).data
        return Response(serialized_data)


class SilaPlaidLinkViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def create_plaid_token(self, request):
        try:
            payload = request.data
            sila_user_handle = request.user.sila_user.user_handle
            if payload and "company_id" in payload:
                company_id = payload["company_id"]
                sila_user_handle = SilaCorporate.objects.get(
                    company_id=company_id
                ).user_handle
            link_token = adapter.get_plaid_token(sila_user_handle)
            return Response({"link_token": link_token})
        except SilaUser.DoesNotExist:
            return Response(
                "Kindly ask for assistance", status=status_codes.HTTP_400_BAD_REQUEST
            )

    def link_plaid_account(self, request):
        payload = request.data

        if payload and "company_id" in payload:
            company_id = payload["company_id"]
            sila_entity = SilaCorporate.objects.get(company_id=company_id)
            is_corporate_account = True
        else:
            sila_entity = request.user.sila_user
            is_corporate_account = False

        public_token = request.data.get("public_token")

        accounts = payload.get('accounts', [])

        if accounts:
            for account in accounts:
                account_payload = {
                    'public_token': public_token,
                    'account_name': account['name'],
                    'selected_account_id': account['id'],
                    'account_type': account['subtype'].upper(),
                    'plaid_token_type': 'link',
                }
                response = adapter.link_plaid_account(account_payload, sila_entity)
                logger.info(f"link_plaid_account_response={response}")
                PlaidLinkedAccountReference.objects.create(
                    reference_id=response["reference"],
                    sila_user=None if is_corporate_account else sila_entity,
                    sila_corporate=sila_entity if is_corporate_account else None,
                    initial_link_status=response["status"],
                    initial_link_message=response["message"],
                )

        else:
            account_payload = {
                'public_token': public_token,
                'plaid_token_type': 'link',
            }
            response = adapter.link_plaid_account(account_payload, sila_entity)
            logger.info(f"link_plaid_account_response={response}")
            PlaidLinkedAccountReference.objects.create(
                reference_id=response["reference"],
                sila_user=None if is_corporate_account else sila_entity,
                sila_corporate=sila_entity if is_corporate_account else None,
                initial_link_status=response["status"],
                initial_link_message=response["message"],
            )

        message = response["message"]
        if response["success"]:
            adapter.sync_plaid_accounts(sila_entity)
            return Response(message)
        return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)

    def link_account_manually(self, request):
        valid_keys = [
            "account_number",
            "routing_number",
            "account_type",
            "account_name",
            "from_company",
        ]

        request_data = request.data

        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )

        company_id = request_data.get('from_company')

        if request_data.get('from_company'):
            company = get_object_or_404(Company, pk=company_id)
            sila_user = company.sila_corporate
        else:
            sila_user = request.user.sila_user

        account_number = request_data.get("account_number")
        routing_number = request_data.get("routing_number")
        account_type = request_data.get("account_type")
        account_name = request_data.get("account_name")
        if not account_number:
            return Response(
                {"error": "account_number must be provided!"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        if not routing_number:
            return Response(
                {"error": "routing_number must be provided!"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        result = adapter.link_account_manually(
            sila_user,
            account_number,
            routing_number,
            account_name,
            account_type=account_type,
        )

        if result["success"] is False:
            return Response(result, status=status_codes.HTTP_400_BAD_REQUEST)
        adapter.sync_plaid_accounts(sila_user)
        return Response(result)


class UserKYC_RequestViewset(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def create(self, request):
        try:
            sila_user = request.user.sila_user
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        if KYC_Request.objects.filter(sila_user=sila_user).exists():
            return Response(
                {"error": "The user already applied for KYC"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        response = adapter.request_kyc(sila_user)

        if response["success"] is False:
            return Response(
                response["message"], status=status_codes.HTTP_400_BAD_REQUEST
            )

        response = adapter.check_kyc(sila_user)
        latest_history = max(
            response["verification_history"], key=lambda k: k["requested_at"]
        )
        _result_details = get_kyc_request_fail_result_detail(latest_history["tags"])
        kyc_request = KYC_Request.objects.create(
            reference=response["reference"],
            verification_status=response["verification_status"],
            result_detail=";".join(_result_details),
            entity_type=response["entity_type"],
            sila_user=sila_user,
        )
        KYC_History.objects.create(
            kyc_request=kyc_request,
            verification_id=latest_history["verification_id"],
            requested_at=datetime.datetime.fromtimestamp(
                latest_history["requested_at"],
            ),
            sila_updated_at=datetime.datetime.fromtimestamp(
                latest_history["updated_at"]
            ),
            verification_status=latest_history["verification_status"],
            result_detail="\n".join(latest_history["tags"]),
            kyc_level=latest_history["kyc_level"],
        )
        response_data = KYC_OverviewSerializer(kyc_request).data
        return Response(response_data)

    def retrieve(self, request):
        try:
            sila_user = request.user.sila_user
        except SilaUser.DoesNotExist:
            # don't show error, and return {} to the frontend
            return Response({})
        kyc_request = sila_user.kyc_requests.order_by("-created_at").first()
        if not kyc_request:
            # don't show error, and return {} to the frontend
            return Response({})

        kyc_request.refresh_from_db()
        response_data = KYC_OverviewSerializer(kyc_request).data
        return Response(response_data)


class UserKYC_DocumentUpload(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        try:
            sila_user = request.user.sila_user
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        supported_extensions = [".jpg", ".jpeg", ".png", ".pdf"]
        files = dict((request.data).lists())["files"]
        uploaded_file = None
        tmpdirname = mkdtemp()
        try:
            for file in files:
                filename = file.name
                file_extension = os.path.splitext(filename)[-1]
                if file_extension not in supported_extensions:
                    return Response(
                        {
                            "error": (
                                f"The uploaded document extension: {file_extension}. "
                                "doesn't support, supported_extensions: "
                                f"{supported_extensions}"
                            )
                        },
                        status=status_codes.HTTP_400_BAD_REQUEST,
                    )
                with open(f"{tmpdirname}/{filename}", "wb") as f:
                    f.write(file.read())
            concatenate_image_files_to_pdf(tmpdirname)
            uploaded_file = open(concatenate_all_pdfs(tmpdirname), "rb")
            assert uploaded_file is not None
            response = adapter.upload_document(sila_user, uploaded_file)
        except Exception:
            return Response(
                {"error": "Error uploading file"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        finally:
            shutil.rmtree(tmpdirname)
        if response["success"] is False:
            logger.info(
                (
                    "The uploaded document to Sila is not valid. "
                    f"sila_user={sila_user.id} response={response}"
                )
            )
            return Response(
                {"error": response["message"]}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        return Response(response)


class CorporateKYB_DocumentUpload(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def create(self, request, company_id):
        try:
            _ = request.user.sila_user
            company = Company.objects.get(id=company_id, owner_email=request.user.email)
            sila_corporate = company.sila_corporate
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except Company.DoesNotExist:
            return Response(
                {
                    "error": (
                        f"The user: {request.user.email} doesn't own company_id:"
                        f" {company_id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except SilaCorporate.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The company has not registered yet. "
                        f"company_id: {company.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        supported_extensions = [".jpg", ".jpeg", ".png", ".pdf"]
        filename = request.FILES["file"].name
        file_extension = os.path.splitext(filename)[-1]
        if file_extension not in supported_extensions:
            return Response(
                {
                    "error": (
                        f"The uploaded document extension: {file_extension}. doesn't"
                        f" support, supported_extensions: {supported_extensions}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        uploaded_file = SimpleUploadedFile(filename, request.FILES["file"].file.read())
        response = adapter.upload_document(sila_corporate, uploaded_file)
        if response["success"] is False:
            logger.error(
                (
                    "The uploaded document to Sila is not valid. "
                    f"sila_corporate={sila_corporate.id} response={response}"
                )
            )
            return Response(
                {"error": response["message"]}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        return Response(response)


class UserKYC_SupportedDocuments(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request):
        document_types = adapter.get_supported_documents()
        return Response({"data": document_types})


class SilaTransactionWebhook(viewsets.ViewSet):

    def update_transaction_webhook(self, request):
        request_data = request.data

        if not request_data["event_type"] == "transaction":
            return Response()

        reference_id = request_data["event_details"]["transaction"]
        perform_pending_transaction.delay(reference_id)

        return Response()


class SilaLinkPlaidAccountWebhook(viewsets.ViewSet):

    def update_plaid_account_webhook(self, request):
        request_data = request.data

        if not request_data["event_type"] == "account_link":
            logger.error(
                (
                    "update_plaid_account_webhook received invalid event_type: "
                    f"{request_data['event_type']}"
                )
            )
            return Response()

        reference_id = request_data["event_details"]["account"]

        loop = get_default_event_loop()
        plaid_link_reference = PlaidLinkedAccountReference.objects.get(
            reference_id=reference_id
        )
        sila_entity = (
            plaid_link_reference.sila_user or plaid_link_reference.sila_corporate
        )
        loop.run_in_executor(None, adapter.sync_plaid_accounts, sila_entity)

        return Response()


class SilaKYC_Webhook(viewsets.ViewSet):
    def update_kyc_webhook(self, request):
        request_data = request.data
        assert request_data["event_type"] == "kyc"
        user_handle = request_data["event_details"]["entity"]
        try:
            sila_entity = SilaUser.objects.get(user_handle=user_handle)
        except SilaUser.DoesNotExist:
            sila_entity = SilaCorporate.objects.get(user_handle=user_handle)

        reference_id = sila_entity.kyc_requests.first().reference
        loop = get_default_event_loop()

        loop.run_in_executor(None, self.update_kyc_request, reference_id)

        return Response()

    @classmethod
    @transaction.atomic
    def update_kyc_request(cls, reference_id: str):
        try:
            kyc_request = KYC_Request.objects.get(reference=reference_id)
        except KYC_Request.DoesNotExist:
            logger.error(f"kyc_request does not exist, reference_id={reference_id}")

            return

        if kyc_request.sila_user is not None:
            sila_entity = kyc_request.sila_user
        else:
            sila_entity = kyc_request.sila_corporate

        response = adapter.check_kyc(sila_entity)
        latest_history = max(
            response["verification_history"], key=lambda k: k["requested_at"]
        )
        _result_details = get_kyc_request_fail_result_detail(latest_history["tags"])
        _result_details = ";".join(_result_details)
        kyc_request.verification_status = response["verification_status"]
        kyc_request.result_detail = _result_details
        kyc_request.save()
        if (kyc_request.verification_status ==
                KYC_Request.VerificationStatusChoice.PASSED.value):
            if isinstance(sila_entity, SilaUser):
                sila_entity.kyc_pass = True
            else:
                sila_entity.kyb_pass = True

            sila_entity.save()
        for _history in response["verification_history"]:
            kyc_request.kyc_histories.update_or_create(
                kyc_request=kyc_request,
                verification_id=_history["verification_id"],
                requested_at=datetime.datetime.fromtimestamp(
                    _history["requested_at"],
                ),
                kyc_level=latest_history["kyc_level"],
                defaults={
                    "sila_updated_at": datetime.datetime.fromtimestamp(
                        _history["updated_at"]
                    ),
                    "verification_status": _history["verification_status"],
                    "result_detail": "\n".join(_history["tags"]),
                },
            )
        if isinstance(sila_entity, SilaCorporate):
            # Need to certify business
            members = SilaCorporateMember.objects.filter(sila_corporate=sila_entity)
            for member in members:
                adapter.certifiy_business(
                    sila_corporate=member.sila_corporate, sila_user=member.sila_user
                )


class PlaidAccountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlaidLinkedAccount.objects.all()
    serializer_class = PlaidLinkedAccountSerializer

    def list(self, request):
        try:
            accounts = request.user.plaid_accounts.all()
        except Exception as e:
            accounts = []
            logger.error(f"Getting plaid account failed. {e}")
            logger.error(traceback.format_exc())
        return Response(PlaidLinkedAccountSerializer(accounts, many=True).data)

    def delete_plaid_account(self, request, account_id: int):
        try:
            sila_user = request.user.sila_user
            plaid_account = request.user.plaid_accounts.get(id=account_id)
        except (SilaUser.DoesNotExist, PlaidLinkedAccount.DoesNotExist):
            message = "Plaid account doesn't exist or doesn't belong to current user"
            return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)

        response = adapter.unlink_account(sila_user, plaid_account)
        message = response["message"]
        if response["success"]:
            plaid_account.delete()
            return Response(message)
        return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)


class PlaidAccountCorporateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlaidLinkedCorporateAccount.objects.all()
    serializer_class = PlaidLinkedAccountSerializer

    def list(self, request, company_id):
        try:
            company = get_object_or_404(Company, pk=company_id)
            accounts = company.plaid_accounts.all()
        except Exception:
            accounts = []
        return Response(PlaidLinkedCorporateAccountSerializer(accounts, many=True).data)

    def delete_corporate_plaid_acount(self, request, company_id: int, account_id: int):
        try:
            _ = request.user.sila_user  # to check sila_user exist
            company = Company.objects.get(id=company_id)
            sila_corporate = company.sila_corporate
            if not company.is_company_owner(request.user):
                message = "You don't have permission to delete this account"
                return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)

        except (Company.DoesNotExist, SilaCorporate.DoesNotExist):
            message = f"The company_id {company_id} has not registered yet"
            return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)
        except SilaUser.DoesNotExist:
            message = f"The user_id {request.user.id} has not registered wallet yet"
            return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)

        plaid_account = company.plaid_accounts.filter(id=account_id).first()
        if not plaid_account:
            message = "Plaid account doesn't exist or user has no permission to delete"
            return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)

        response = adapter.unlink_account(sila_corporate, plaid_account)
        message = response["message"]
        if response["success"]:
            plaid_account.delete()
            return Response(message)
        return Response(message, status=status_codes.HTTP_400_BAD_REQUEST)


class KYB_RequestViewset(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def create(self, request, company_id):
        try:
            sila_user = request.user.sila_user
            company = Company.objects.get(id=company_id, owner_email=request.user.email)
            sila_corporate = company.sila_corporate
            KYC_Request.objects.get(
                sila_user=sila_user,
                verification_status=KYC_Request.VerificationStatusChoice.PASSED,
            )
        except SilaUser.DoesNotExist:
            return Response(
                {
                    "error": (
                        "The user has not registered yet. "
                        f"user_id: {request.user.id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except Company.DoesNotExist:
            return Response(
                {
                    "error": (
                        f"The user: {request.user.email} doesn't own company_id:"
                        f" {company_id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except SilaCorporate.DoesNotExist:
            return Response(
                {
                    "error": (
                        f"The company has not registered yet. company_id={company_id}"
                    )
                },
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        except KYC_Request.DoesNotExist:
            return Response(
                {"error": "Users cannot request KYB unless individual KYC is passed"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        # Link owoner to controlling_officer and administrator role
        response = asyncio.run(adapter.link_owner_to_roles(sila_corporate, sila_user))
        if response["success"] is False:
            if "has already been assigned to member" in response["message"]:
                # There is no harm when the owner trys to link itself again but failed
                logger.info((
                    "Ignoring error: link_owner_to_roles failed. "
                    f"sila_corporate={sila_corporate.id}, sila_user={sila_user.id} "
                    f" reason: {response['message']}"
                ))
            else:
                logger.error(
                    (
                        f"link_owner_to_roles faild: sila_corporate={sila_corporate.id}"
                        f", sila_user={sila_user.id} reason: {response['message']}"
                    )
                )
                return Response(
                    {"error": f"link_owner_to_roles: {response['message']}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )
        else:
            SilaCorporateMember.objects.get_or_create(
                sila_user=sila_user,
                sila_corporate=sila_corporate,
                role=SilaCorporateMember.BusinessRoleChoice.CONTROLLING_OFFICER,
            )
            SilaCorporateMember.objects.get_or_create(
                sila_user=sila_user,
                sila_corporate=sila_corporate,
                role=SilaCorporateMember.BusinessRoleChoice.ADMINISTRATOR,
            )

        response = adapter.request_kyc(sila_corporate)
        if response["success"] is False:
            return Response(
                {"error": response["message"]}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        # Get KYC_Request frmo Sila and save it to database
        response = adapter.check_kyc(sila_corporate)
        latest_history = max(
            response["verification_history"], key=lambda k: k["requested_at"]
        )
        _result_details = get_kyc_request_fail_result_detail(latest_history["tags"])
        kyc_request = KYC_Request.objects.create(
            reference=response["reference"],
            verification_status=response["verification_status"],
            result_detail=";".join(_result_details),
            entity_type=response["entity_type"],
            sila_corporate=sila_corporate,
        )
        KYC_History.objects.create(
            kyc_request=kyc_request,
            verification_id=latest_history["verification_id"],
            requested_at=datetime.datetime.fromtimestamp(
                latest_history["requested_at"],
            ),
            sila_updated_at=datetime.datetime.fromtimestamp(
                latest_history["updated_at"]
            ),
            verification_status=latest_history["verification_status"],
            result_detail="\n".join(latest_history["tags"]),
            kyc_level=latest_history["kyc_level"],
        )
        response_data = KYC_OverviewSerializer(kyc_request).data

        return Response(response_data)

    def retrieve(self, request, company_id):
        try:
            _ = request.user.sila_user
            company = Company.objects.get(id=company_id, owner_email=request.user.email)
            sila_corporate = company.sila_corporate
            kyc_request = sila_corporate.kyc_requests.order_by("-created_at").first()
        except (
            SilaCorporate.DoesNotExist,
            KYC_Request.DoesNotExist,
            Company.DoesNotExist,
            SilaUser.DoesNotExist
        ):
            # don't show error, and return None to the frontend
            return Response({})

        if not kyc_request:
            # don't show error, and return None to the frontend
            return Response({})

        kyc_request.refresh_from_db()
        response_data = KYC_OverviewSerializer(kyc_request).data
        return Response(response_data)


class SilaToFiatTxViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaToFiatTxSerializer

    @transaction.atomic
    def create(self, request):
        data = request.data

        from_user = request.user
        from_company = data.get("from_company")
        to_account_id = data.get("account_id")  # bank account to transfer money
        amount = data.get("amount")

        if not to_account_id:
            return Response({"status": "error", "message": "Bank account should be provided."})

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({
                    "status": "error",
                    "message": "Amount isn't valid."
                }, status=status.HTTP_400_BAD_REQUEST)

        if from_company:
            # Check if we transfer money from corporate wallet
            from_company = get_object_or_404(Company, pk=from_company)
            account = get_object_or_404(PlaidLinkedCorporateAccount, company=from_company, id=to_account_id)
            from_sila = from_company.sila_corporate
        else:
            account = get_object_or_404(PlaidLinkedAccount, user=from_user, id=to_account_id)
            from_sila = from_user.sila_user

        response = adapter.transfer_sila_to_fiat(
            amount, from_sila, account
        )
        if not response["success"]:
            return Response(
                {"status": "error", "message": response["message"]},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        tx_data = {
            "amount": amount,
            "from_user": None,
            "from_company": None,
            "account_user": None,
            "account_corporate": None,
            "request_transaction_id": response['transaction_id'],
            "note": data.get("note", f"amount {amount} on: {datetime.datetime.now()}")
        }

        if from_company:
            tx_data["from_company"] = from_company.id
            tx_data["account_corporate"] = account.id
            recipient = [from_company.owner_email]
        else:
            tx_data["from_user"] = from_user.id
            tx_data["account_user"] = account.id
            recipient = [from_user.email]


        sila_to_fiat_serialized = SilaToFiatTxSerializer(data=tx_data)

        if sila_to_fiat_serialized.is_valid(raise_exception=True):
            instance = sila_to_fiat_serialized.save()

            substitutions = {
                "payee_name": account.account_owner_name,
                "notes": sila_to_fiat_serialized.data['note'],
                "wallet_url": settings.FRONTEND_BASE_URL + '/wallet',
                "payment_due": instance.created_at.strftime("%m/%d/%Y"),
                "amount_due": "{:,.2f}".format(int(amount) / 100),
                "payment_ID": sila_to_fiat_serialized.data['id']
            }

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_PAYMENT_SENT_ID"),
                substitutions=substitutions,
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )

        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)


    def create_for_company_to_user(self, request):
        try:
            # create a sila -> fiat tx
            data = request.data
            company_id = data["from_company"]
            company = Company.objects.get(id=company_id)
            request.data["from_company"] = company.id
            amount = request.data["amount"]
            account = PlaidLinkedCorporateAccount.objects.filter(
                company=company, id=request.data["account_id"]
            ).get()
            response = adapter.transfer_sila_to_fiat(
                amount, company.sila_corporate, account
            )
            if not response["success"]:
                return Response(
                    {"status": "error", "message": response["message"]},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )
            tx_id = response["transaction_id"]
            tx_data = request.data
            tx_data["request_transaction_id"] = tx_id
            tx_data["account_corporate"] = account.id
            tx = SilaToFiatTxSerializer(data=request.data)
            if tx.is_valid():
                tx.save()
            else:
                raise Exception(tx.errors)
        except Exception:
            return Response(
                {"status": "error"}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)

    def create_for_user_to_user(self, request):
        try:
            # create a fiat -> sila tx
            user = request.user
            amount = request.data["amount"]
            request.data["from_user"] = user.id
            account = PlaidLinkedAccount.objects.filter(
                user=user, id=request.data["account_id"]
            ).get()
            response = adapter.transfer_sila_to_fiat(
                request.data["amount"], request.user.sila_user, account
            )
            if not response["success"]:
                return Response(
                    {"status": "error", "message": response["message"]},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )
            tx_id = response["transaction_id"]
            tx_data = request.data
            tx_data["request_transaction_id"] = tx_id
            tx_data["account_user"] = account.id
            tx = SilaToFiatTxSerializer(data=request.data)
            if tx.is_valid():
                tx.save()
            else:
                raise Exception(tx.errors)
        except Exception:
            return Response(
                {"status": "error"}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)


class FiatToSilaTxViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = FiatToSilaTxSerializer

    @transaction.atomic
    def bulk_create(self, request):
        data = request.data
        from_company_id = data["company_id"]
        from_account_id = data["account_id"]
        errors = []
        for payment in data["payments"]:
            to_user_id = payment["to_user"]
            amount = payment["amount"]
            note = payment.get("note")
            try:
                self.create_for_company_to_user(
                    from_company_id, from_account_id, to_user_id, amount, note
                )
            except Exception as e:
                error_msg = f"Error paying {to_user_id} amount={amount} err_msg={e}"
                errors.append(error_msg)
        if errors:
            return Response(
                {"status": "error", "message": errors},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)

    @transaction.atomic
    def create(self, request):
        data = request.data

        # get bank account id
        from_account_id = data.get('account_id')
        if not from_account_id:
            return Response({"status": "error", "message": "Bank account should be provided."})

        from_user = request.user
        from_company = data.get("from_company")
        to_user = data.get("to_user")
        to_company = data.get("to_company")
        amount = data.get("amount")
        note = data.get("note")

        if to_user and to_company:
            return Response({"status": "error", "message": "Both to_user and to_company are not allowed."})

        if from_company:
            from_company = get_object_or_404(Company, pk=from_company)
            from_user = None
        if to_user:
            to_user = get_object_or_404(BenjiAccount, pk=to_user)
        if to_company:
            to_company = get_object_or_404(Company, pk=to_company)

        # Validate amount

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({
                    "status": "error",
                    "message": "Amount isn't valid."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve bank account and sila user

        if from_company:
            # if transaction from company need to get corporate account
            account = get_object_or_404(PlaidLinkedCorporateAccount, company=from_company, id=from_account_id)
            from_sila = from_company.sila_corporate
            recipient = from_company.owner_email

        else:
            # if transaction from user need to get personal account
            account = get_object_or_404(PlaidLinkedAccount, user=from_user, id=from_account_id)
            from_sila = from_user.sila_user
            recipient = from_user.email

        # Make transfer to user's personal or corporate account
        response = adapter.transfer_fiat_to_sila(
            amount, from_sila, account
        )
        if not response["success"]:
            return Response({
                "status": "error",
                "message": response["message"]
            }, status=status.HTTP_400_BAD_REQUEST)

        # Save transaction (parent)
        tx_data = {}
        if from_company:
            tx_data["to_company"] = from_company.id
            tx_data["account_corporate"] = account.id
        else:
            tx_data["to_user"] = from_user.id
            tx_data["account_user"] = account.id

        tx_data["request_transaction_id"] = response["transaction_id"]
        tx_data["note"] = note
        tx_data["amount"] = amount

        fiat_to_sila_obj = None
        fiat_to_sila_serialized = FiatToSilaTxSerializer(data=tx_data)
        if fiat_to_sila_serialized.is_valid(raise_exception=True):
            fiat_to_sila_obj = fiat_to_sila_serialized.save()

        if to_user or to_company:
            # Make one more transaction from sila to sila if need to send money to other user or company
            inner_sila_to_sila_transaction = {
                "to_user": None,
                "to_company": None,
                "amount": amount,
                "is_auto_approve": False,
                "parent_request_transaction_id": response["transaction_id"],
                "fiat_parent": fiat_to_sila_obj.id,
                "note": f"amount: {amount} on: {datetime.datetime.now()}",
            }

            if to_user:
                inner_sila_to_sila_transaction['to_user'] = to_user.id
                payee = to_user.full_name

            if to_company:
                inner_sila_to_sila_transaction['to_company'] = to_company.id
                payee = to_company.title

            wallet_url = settings.FRONTEND_BASE_URL
            if from_company:
                inner_sila_to_sila_transaction["from_company"] = from_company.id
                wallet_url += '/' + str(from_company.id) + '/wallet'

            else:
                inner_sila_to_sila_transaction["from_user"] = from_user.id
                wallet_url += '/wallet'

            sila_to_sila_serialized = SilaToSilaTxSerializer(data=inner_sila_to_sila_transaction)

            if sila_to_sila_serialized.is_valid(raise_exception=True):
                instance = sila_to_sila_serialized.save()

                substitutions = {
                    "payee_name": payee,
                    "notes": fiat_to_sila_serialized.data['note'],
                    "wallet_url": wallet_url,
                    "payment_due": instance.created_at.strftime("%m/%d/%Y"),
                    "amount_due": "{:,.2f}".format(int(amount) / 100),
                    "payment_ID": fiat_to_sila_serialized.data['id']
                }

                send_email_template.delay(
                    from_email=os.getenv("INFO_FROM_EMAIL"),
                    recipient_list=recipient,
                    email_template_id=os.getenv("EMAIL_TEMPLATE_PAYMENT_SENT_ID"),
                    substitutions=substitutions,
                    sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
                )

        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

    # create a back to back sila => sila tx now as transfering to other user wallet
    def create_back_to_back_tx(self,parent_tx_data,to_user_id=None,to_company_id=None,from_user=None,from_company=None):
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
        tx_data = {"note": note, "to_user": to_user_id, "amount": amount}
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

    def create_for_user_to_user(self, from_user, from_account_id, to_user_id, amount, note):
        # create a fiat -> sila tx
        account = PlaidLinkedAccount.objects.filter(
            user=from_user, id=from_account_id
        ).get()
        response = adapter.transfer_fiat_to_sila(
            amount, from_user.sila_user, account
        )

        if not response["success"]:
            return Response({"status": "error", "message": response["message"]}, status=status_codes.HTTP_400_BAD_REQUEST )

        tx_id = response["transaction_id"]
        tx_data = {"note": note, "to_user": to_user_id, "amount": amount}
        tx_data["request_transaction_id"] = tx_id
        tx_data["account_user"] = account.id
        tx = FiatToSilaTxSerializer(data=tx_data)
        tx_obj = None
        if tx.is_valid():
            if from_user.id != to_user_id:
                # create a back to back sila => sila tx now as transfering to other user wallet
                tx_sila_to_sila_serialized =  self.create_back_to_back_tx(tx.validated_data,to_user_id=to_user_id,from_user=from_user.id)
                if tx_sila_to_sila_serialized.is_valid():
                    tx_obj = tx.save()
                    if tx_sila_to_sila_serialized.is_valid():
                        tx_sila_to_sila_obj = tx_sila_to_sila_serialized.save()
                        tx_sila_to_sila_obj.fiat_parent_id = tx_obj.id
                        tx_sila_to_sila_obj.save()
                    else:
                        raise Exception("Error in payment")
            else:
                tx_obj = tx.save()
        else:
            raise Exception(tx.errors)
        return tx_obj

    @transaction.atomic
    def create_company(self, request, company_id: int):
        data = request.data
        company = get_object_or_404(Company, pk=company_id)
        from_company_id = company.id
        from_account_id = data["account_id"]
        to_user_id = data.get("to_user")
        to_company_id = data.get("to_company", company_id)
        amount = data["amount"]
        note = data.get("note")

        if to_user_id and to_company_id:
            return Response({"status": "error", "message": ""})

        if to_user_id:
            tx = self.create_for_company_to_user(
                from_company_id,
                from_account_id,
                to_user_id,
                amount,
                note
            )

        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)



class SilaToSilaTxViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaToSilaTxSerializer

    def create_for_company_to_user(self, request):
        try:
            data = request.data
            from_company = data["from_company"]
            from_company = Company.objects.get(id=from_company)
            from_sila_user = from_company.sila_corporate
            to_user = data["to_user"]
            to_user = BenjiAccount.objects.get(id=to_user)
            destination_handle = to_user.sila_user.user_handle
            amount = data["amount"]
            response = adapter.transfer_sila_to_sila(amount, from_sila_user, destination_handle)

            if not response["success"]:
                return Response({"status": "error", "message": response["message"]},
                                status=status_codes.HTTP_400_BAD_REQUEST)
            tx_id = response["transaction_id"]
            child_tx_data = {
                "from_company": from_company.id,
                "to_user": to_user.id,
                "amount": amount,
                "request_transaction_id": tx_id,
                "is_auto_approve": True,
                "note": data.get("note",
                                 f"amount: {amount} from: {from_company.id} to: {to_user.id} on: {datetime.datetime.now()}")
            }
            tx = SilaToSilaTxSerializer(data=child_tx_data)
            if tx.is_valid():
                tx.save()
            else:
                return Response(
                    {"status": tx.errors}, status=status_codes.HTTP_400_BAD_REQUEST
                )
        except Exception:
            return Response(
                {"status": "error"}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)


    def create_for_user_to_user(self, request):
        try:
            data = request.data
            from_user = request.user
            from_sila_user = from_user.sila_user
            to_user = data["to_user"]
            to_user = BenjiAccount.objects.get(id=to_user)
            destination_handle = to_user.sila_user.user_handle
            amount = data["amount"]
            response = adapter.transfer_sila_to_sila(amount, from_sila_user, destination_handle)
            if not response["success"]:
                return Response({"status": "error", "message": response["message"]},
                                status=status_codes.HTTP_400_BAD_REQUEST)
            tx_id = response["transaction_id"]
            child_tx_data = {
                "from_user": from_user.id,
                "to_user": to_user.id,
                "amount": amount,
                "request_transaction_id": tx_id,
                "is_auto_approve": True,
                "note": data.get("note",
                                 f"amount: {amount} from: {from_user.id} to: {to_user.id} on: {datetime.datetime.now()}")
            }
            tx = SilaToSilaTxSerializer(data=child_tx_data)
            if tx.is_valid():
                tx.save()
            else:
                return Response(
                    {"status": tx.errors}, status=status_codes.HTTP_400_BAD_REQUEST
                )
        except BenjiAccount.sila_user.RelatedObjectDoesNotExist as _:
            return Response(
                {"status": "error", "message": f"{to_user} does not have sila wallet"}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": f"{str(e)}"}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        return Response({"status": "ok"}, status=status_codes.HTTP_201_CREATED)

    @transaction.atomic
    def create(self, request):
        data = request.data

        from_user = request.user
        from_company = data.get("from_company")
        to_user = data.get("to_user")
        to_company = data.get("to_company")
        amount = data.get("amount")

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({
                    "status": "error",
                    "message": "Amount isn't valid."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Get money receiver
        destination_handler = None

        if to_user:
            to_user = get_object_or_404(BenjiAccount, pk=to_user)
            destination_handle = to_user.sila_user.user_handle
            payee = to_user.full_name

        elif to_company:
            to_company = get_object_or_404(Company, pk=to_company)
            destination_handle = to_company.sila_corporate.user_handle
            payee = to_company.title

        else:
            return Response({
                    "status": "error",
                    "message": "Either user or company should be provided."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Get money sender
        from_sila: Union[SilaUser, SilaCorporate, None] = None

        wallet_url = settings.FRONTEND_BASE_URL

        if from_company:
            # Check if payment should be sent from company
            # TODO: Check if user has access to company
            from_company = get_object_or_404(Company, pk=from_company)
            from_sila = from_company.sila_corporate
            recipient = from_company.owner_email
            wallet_url += '/' + str(from_company.id) + '/wallet'

        else:
            from_sila = from_user.sila_user
            recipient = from_user.email
            wallet_url += '/wallet'

        # Perform Transaction

        response = adapter.transfer_sila_to_sila(amount, from_sila, destination_handle)
        if not response["success"]:
            return Response({
                    "status": "error",
                    "message": response["message"]
                }, status=status.HTTP_400_BAD_REQUEST)

        from_user_id = None
        if not from_company:
            from_user_id = from_user.id
            from_user = None

        child_tx_data = {
            "from_user": from_user_id,
            "from_company": data.get("from_company"),
            "to_user": data.get("to_user"),
            "to_company": data.get("to_company"),
            "amount": amount,
            "request_transaction_id": response["transaction_id"],
            "is_auto_approve": True,
            "note": data.get("note", f"Sent {amount} on: {datetime.datetime.now()}")
        }

        tx = SilaToSilaTxSerializer(data=child_tx_data)
        if tx.is_valid(raise_exception=True):
            instance = tx.save()

            substitutions = {
                "payee_name": payee,
                "notes": tx.data['note'],
                "wallet_url": wallet_url,
                "payment_due": instance.created_at.strftime("%m/%d/%Y"),
                "amount_due": "{:,.2f}".format(int(amount) / 100),
                "payment_ID": tx.data['id']
            }

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_PAYMENT_SENT_ID"),
                substitutions=substitutions,
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )

        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)


class BussinessRole(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request):
        roles = adapter.get_business_roles()

        return Response({"data": roles})


class LinkBusinessMemberViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaCorporateMemberSerializer
    queryset = SilaCorporateMember.objects.all()

    @transaction.atomic
    def link(self, request, company_id):
        valid_keys = ["role", "email", "title"]
        request_data = request.data
        for key in request_data.keys():
            if key not in valid_keys:
                return Response(
                    {"error": f"Invalid key: {key} provided, expected: {valid_keys}"},
                    status=status_codes.HTTP_400_BAD_REQUEST,
                )
        try:
            email = request_data["email"]
            role = request_data["role"]
            title = request_data["title"]
        except KeyError as e:
            err_msg = f"{e} is a requred field"
            logger.error(err_msg)
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        try:
            company = Company.objects.select_related('sila_corporate').get(id=company_id)
            sila_corporate = company.sila_corporate
            company_owner = BenjiAccount.objects.get(email=company.owner_email)
            user = BenjiAccount.objects.select_related('sila_user').get(email=email)
            sila_user = user.sila_user
            has_right = SilaCorporateMember.objects.filter(
                sila_user=request.user.sila_user,
                sila_corporate=sila_corporate,
                role=SilaCorporateMember.BusinessRoleChoice.CONTROLLING_OFFICER,
            ).exists()
        except BenjiAccount.DoesNotExist:
            err_msg = (f"BenjiAccount doesn't exist, linking_user_email={email}, "
                       f"request_user_id={request.user.id}")
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except SilaUser.DoesNotExist:
            err_msg = f"SilaUser doesn't exist, email={email}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except Company.DoesNotExist:
            err_msg = f"Company doesn't exist, company_id={company_id}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except SilaCorporate.DoesNotExist:
            err_msg = f"SilaCorporate doesn't exist, company_id={company_id}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        if not has_right:
            return Response(
                {"error": (f"The user: {request.user.id} has no permission to link: "
                           f"{email} to company: {company_id}")},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        res = asyncio.run(adapter.link_business_mamber(sila_corporate, sila_user, role))
        if res["status_code"] != 200:
            logger.error(
                (
                    f"link_business_member failed: sila_corporate={sila_corporate.id}"
                    f", sila_user={sila_user.id} reason: {res['message']}"
                )
            )
            return Response(
                {"error": f"link_business_member: {res['message']}"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        sila_corporate_member, _ = SilaCorporateMember.objects.get_or_create(
            sila_user=sila_user,
            sila_corporate=sila_corporate,
            role=role,
            title=title,
        )
        send_access_request_to_member(company, company_owner, user, sila_corporate_member)
        response_data = SilaCorporateMemberSerializer(sila_corporate_member).data
        company_obj = Company.objects.get(pk=company_id)
        CompanyBenjiAccountEntry.objects.get_or_create(
            company=company_obj,
            benji_account=user,
            relationship=ACCOUNT_COMPANY_BUSINESS_MEMBER
        )

        return Response(response_data)

    @transaction.atomic
    def unlink(self, request, company_id, member_id):
        try:
            company = Company.objects.get(id=company_id)
            sila_corporate = company.sila_corporate

            has_right = SilaCorporateMember.objects.filter(
                sila_user=request.user.sila_user,
                sila_corporate=sila_corporate,
                role=SilaCorporateMember.BusinessRoleChoice.CONTROLLING_OFFICER,
            ).exists()
            sila_corporate_member_queryset = SilaCorporateMember.objects.filter(
                id=member_id,
            )
            is_linked = sila_corporate_member_queryset.exists()
        except BenjiAccount.DoesNotExist:
            err_msg = (f"BenjiAccount doesn't exist, member_id={member_id}, "
                       f"request_user_id={request.user.id}")
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except SilaUser.DoesNotExist:
            err_msg = f"SilaUser doesn't exist, member_id={member_id}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except Company.DoesNotExist:
            err_msg = f"Company doesn't exist, company_id={company_id}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        except SilaCorporate.DoesNotExist:
            err_msg = f"SilaCorporate doesn't exist, company_id={company_id}"
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )
        sila_corporate_member = sila_corporate_member_queryset.first()
        sila_user = sila_corporate_member.sila_user
        email = sila_user.user.email
        if not has_right:
            return Response(
                {"error": (f"The user: {request.user.id} has no permission to unlink: "
                           f"{email} to company: {company_id}")},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        if not is_linked:
            return Response(
                {"error": f"The user: {email} isn't linked to company: {company_id}"},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        res = asyncio.run(
            adapter.unlink_business_mamber(
                sila_corporate, sila_user, sila_corporate_member.role
            )
        )
        if res["success"] is False:
            logger.error(
                (
                    f"unlink_business_member failed: sila_corporate={sila_corporate.id}"
                    f", sila_user={sila_user.id} reason: {res['message']}"
                )
            )
            return Response(
                {"error": res['message']},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        sila_corporate_member.delete()
        return Response({}, status=status.HTTP_200_OK)

    @transaction.atomic
    def decline(self, request, company_id, member_id, token=None):
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token"
            )
        try:
            cart = CompanyAccessRequestToken.objects.get(token=token)
            if timezone.now() <= cart.expiry:
                try:
                    company = Company.objects.get(id=company_id)
                    sila_corporate = company.sila_corporate

                    has_right = SilaCorporateMember.objects.filter(
                        sila_user=request.user.sila_user,
                        sila_corporate=sila_corporate,
                    ).exists()
                    sila_corporate_member_queryset = SilaCorporateMember.objects.filter(
                        id=member_id,
                    )
                    is_linked = sila_corporate_member_queryset.exists()
                except BenjiAccount.DoesNotExist:
                    err_msg = (f"BenjiAccount doesn't exist, member_id={member_id}, "
                               f"request_user_id={request.user.id}")
                    return Response(
                        {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
                    )
                except SilaUser.DoesNotExist:
                    err_msg = f"SilaUser doesn't exist, member_id={member_id}"
                    return Response(
                        {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
                    )
                except Company.DoesNotExist:
                    err_msg = f"Company doesn't exist, company_id={company_id}"
                    return Response(
                        {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
                    )
                except SilaCorporate.DoesNotExist:
                    err_msg = f"SilaCorporate doesn't exist, company_id={company_id}"
                    return Response(
                        {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
                    )
                sila_corporate_member = sila_corporate_member_queryset.first()
                sila_user = sila_corporate_member.sila_user
                email = sila_user.user.email
                if not has_right:
                    return Response(
                        {"error": (f"The user: {request.user.id} has no permission to unlink: "
                                   f"{email} to company: {company_id}")},
                        status=status_codes.HTTP_400_BAD_REQUEST,
                    )

                if not is_linked:
                    return Response(
                        {"error": f"The user: {email} isn't linked to company: {company_id}"},
                        status=status_codes.HTTP_400_BAD_REQUEST,
                    )
                res = asyncio.run(
                    adapter.unlink_business_mamber(
                        sila_corporate, sila_user, sila_corporate_member.role
                    )
                )
                if res["success"] is False:
                    logger.error(
                        (
                            f"unlink_business_member failed: sila_corporate={sila_corporate.id}"
                            f", sila_user={sila_user.id} reason: {res['message']}"
                        )
                    )
                    return Response(
                        {"error": res['message']},
                        status=status_codes.HTTP_400_BAD_REQUEST,
                    )
                sila_corporate_member.delete()
                return Response({})
            else:
                return Response(
                    {"error": "Token is expired."}, status=status.HTTP_400_BAD_REQUEST
                )
        except CompanyAccessRequestToken.DoesNotExist:
            return Response(
                {"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, company_id, member_id):
        """Change a linked member's role
        Sila doens't provide API to update the role. Process on Sila side is:
            1. Delete existing role
            2. Create new role
        """
        user = request.user
        request_serializer = SilaCorporateMemberUpdateRequestSerializer(
            data=request.data
        )
        if not request_serializer.is_valid():
            return Response(
                {"error": request_serializer.errors},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        add_role_data = request_serializer.validated_data
        member = get_object_or_404(
            SilaCorporateMember, id=member_id, sila_corporate__company_id=company_id
        )
        if member.role == add_role_data["role"]:
            logger.info(f"member: {member.id} role stay the same, only update title")
            member.title = add_role_data["title"]
            member.save()
            response_data = SilaCorporateMemberSerializer(member).data
            return Response(response_data)

        # Unlink role and re-link role
        delete_request = HttpRequest()
        delete_request.user = user
        response = self.unlink(delete_request, company_id, member_id)
        if response.status_code != 200:
            logger.error("Updating SilaCorporateMember failed: unlink old role error")
            return response

        add_role_data["email"] = member.sila_user.user.email
        link_request = HttpRequest()
        link_request.user = user
        link_request.data = add_role_data

        return self.link(link_request, company_id)

    def retrieve(self, request, company_id):
        company = Company.objects.get(id=company_id)
        if not hasattr(company, 'sila_corporate'):
            return Response({"error": "The company don't have their wallet registered."},
                            status=status_codes.HTTP_400_BAD_REQUEST)
        sila_corporate = company.sila_corporate
        has_right = SilaCorporateMember.objects.filter(
            sila_user=request.user.sila_user,
            sila_corporate=sila_corporate,
        ).exists()
        if not has_right:
            return Response(
                {"error": (f"The user: {request.user.id} has not right to view "
                           f"bussiness  members of the company: {company_id}")},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        members = SilaCorporateMember.objects.filter(
            sila_corporate=sila_corporate
        ).all()
        response_data = SilaCorporateMemberSerializer(members, many=True).data
        return Response(response_data)


class SilaRequestViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaRequestSerializer

    def list_for_company(self, request, company_id):
        requested = []
        sent = []
        company = get_object_or_404(Company, pk=company_id)
        try:
            requested = SilaRequestSerializer(
                company.sila_requests.exclude(
                    requestee_status=SilaRequest.StatusChoice.HIDDEN
                ),
                many=True,
            ).data
            sent = SilaRequestSerializer(
                SilaRequest.objects.filter(
                    sila_corporate=company.sila_corporate
                ).exclude(
                    requester_status=SilaRequest.StatusChoice.HIDDEN
                ),
                many=True,
            ).data
        except SilaCorporate.DoesNotExist:
            logger.info(f"The company {company.id} hasn't registered with sila")

        response_data = {"recv": requested, "sent": sent}
        return Response(response_data)

    def list_for_user(self, request):
        requested = []
        sent = []
        try:
            requested = SilaRequestSerializer(
                request.user.sila_requests.exclude(
                    requestee_status=SilaRequest.StatusChoice.HIDDEN
                ),
                many=True,
            ).data
            sent = SilaRequestSerializer(
                SilaRequest.objects.filter(
                    sila_user=request.user.sila_user,
                ).exclude(
                    requester_status=SilaRequest.StatusChoice.HIDDEN
                ),
                many=True,
            ).data
        except SilaUser.DoesNotExist:
            logger.info(f"The user {request.user.id} hasn't registered with sila")

        response_data = {"recv": requested, "sent": sent}
        return Response(response_data)

    def create(self, request):
        data = request.data

        user = request.user
        amount = data.get("amount")
        from_user = data.get("from_user")
        from_company = data.get("from_company")

        # Validate amount

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({
                    "status": "error",
                    "message": "Amount isn't valid."
                }, status=status.HTTP_400_BAD_REQUEST)

        note = data.get("note", f"Amount {amount}")

        if from_company:
            from_company: Company = get_object_or_404(Company, pk=from_company)
        if from_user:
            from_user: BenjiAccount = get_object_or_404(BenjiAccount, pk=from_user)

        if not (from_user or from_company):
            return Response({
                    "status": "error",
                    "message": "From user or from company should be provided."
                }, status=status.HTTP_400_BAD_REQUEST)

        if from_user and from_company:
            return Response({
                    "status": "error",
                    "message": "From user and from are not allowed at the same time."
                }, status=status.HTTP_400_BAD_REQUEST)

        tx_data = {
            "amount": amount,
            "sila_user": user.sila_user.id,
            "note": note,
        }

        if from_company:
            tx_data["from_company"] = from_company.id
            payer_name = from_company.title
            recipient = [from_company.owner_email]

        else:
            tx_data["from_user"] = from_user.id
            payer_name = from_user.full_name
            recipient = [from_user.email]

        tx_request = SilaRequestSerializer(data=tx_data)
        if tx_request.is_valid():
            instance = tx_request.save()

            wallet_url = settings.FRONTEND_BASE_URL
            if from_company:
                wallet_url += '/' + str(from_company.id) + '/wallet'
            else:
                wallet_url += '/wallet'

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_SILA_REQUEST_ID"),
                substitutions={
                    "payer_name": payer_name,
                    "payee_name": "you",
                    "notes": note,
                    "wallet_url": wallet_url,
                    "request_date": instance.created_at.strftime("%m/%d/%Y"),
                    "amount": "{:,.2f}".format(int(amount) / 100),
                    "payment_ID": tx_request.data['id'],
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_SILA_REQUEST_ID"),
                substitutions={
                    "payer_name": 'you',
                    "payee_name": user.full_name,
                    "notes": note,
                    "wallet_url": wallet_url,
                    "request_date": instance.created_at.strftime("%m/%d/%Y"),
                    "amount": "{:,.2f}".format(int(amount) / 100),
                    "payment_ID": tx_request.data['id'],
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )
            return Response({"status": "ok"}, status=status.HTTP_201_CREATED)
        return Response({
                "status": "error",
                "message": tx_request.errors,
            }, status=status_codes.HTTP_400_BAD_REQUEST)

    def create_for_company(self, request, company_id):

        data = request.data
        company = get_object_or_404(Company, pk=company_id)
        amount = data.get("amount")
        from_user = data.get("from_user")
        from_company = data.get("from_company")

        # Validate amount

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({
                "status": "error",
                "message": "Amount isn't valid."
            }, status=status.HTTP_400_BAD_REQUEST)

        note = data.get("note", f"Amount {amount}")

        if from_company:
            from_company: Company = get_object_or_404(Company, pk=from_company)
        if from_user:
            from_user: BenjiAccount = get_object_or_404(BenjiAccount, pk=from_user)

        if not (from_user or from_company):
            return Response({
                "status": "error",
                "message": "From user or from company should be provided."
            }, status=status.HTTP_400_BAD_REQUEST)

        if from_user and from_company:
            return Response({
                "status": "error",
                "message": "From user and from are not allowed at the same time."
            }, status=status.HTTP_400_BAD_REQUEST)

        tx_data = {
            "amount": amount,
            "sila_corporate": company.sila_corporate.id,
            "note": note,
        }

        if from_company:
            tx_data["from_company"] = from_company.id
            payer_name = from_company.title
            recipient = from_company.owner_email
        else:
            tx_data["from_user"] = from_user.id
            payer_name = from_user.full_name
            recipient = from_user.email

        tx_request = SilaRequestSerializer(data=tx_data)

        if tx_request.is_valid():
            instance = tx_request.save()

            wallet_url = settings.FRONTEND_BASE_URL
            if from_company:
                wallet_url += '/' + str(from_company.id) + '/wallet'
            else:
                wallet_url += '/wallet'

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_SILA_REQUEST_ID"),
                substitutions={
                    "payer_name": payer_name,
                    "payee_name": "you",
                    "notes": note,
                    "wallet_url": wallet_url,
                    "request_date": instance.created_at.strftime("%m/%d/%Y"),
                    "amount": "{:,.2f}".format(int(amount) / 100),
                    "payment_ID": tx_request.data['id'],
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )

            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=recipient,
                email_template_id=os.getenv("EMAIL_TEMPLATE_SILA_REQUEST_ID"),
                substitutions={
                    "payer_name": "you",
                    "payee_name": company.title,
                    "notes": note,
                    "wallet_url": wallet_url,
                    "request_date": instance.created_at.strftime("%m/%d/%Y"),
                    "amount": "{:,.2f}".format(int(amount) / 100),
                    "payment_ID": tx_request.data['id'],
                },
                sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
            )

            return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

        return Response({
            "status": "error",
            "message": tx_request.errors,
        }, status=status_codes.HTTP_400_BAD_REQUEST)

    def delete(self, request, sila_request_id):
        user = request.user
        money_request = SilaRequest.objects.get(id=sila_request_id)
        if user.sila_user.id == money_request.sila_user_id:
            money_request.delete()
            return Response(
                {"status": "ok"},
                status=status_codes.HTTP_200_OK
            )
        return Response(
            {"status": "error"},
            status=status_codes.HTTP_401_UNAUTHORIZED
        )

    def payment_request_update(
        self, request, sila_request_id: int, company_id: int = None,
    ):
        """Payment request update for company account or individual account"""
        payload = request.data
        requester_status = payload.get("requester_status")
        requestee_status = payload.get("requestee_status")
        revoke_reason = payload.get("revoke_reason", "")
        if company_id is not None:
            entity = get_object_or_404(Company, pk=company_id)

            if not entity.is_user_staff(request.user):
                return Response(
                    {"error": "Unauthorized, the user is not the company's staff."},
                    status=status_codes.HTTP_401_UNAUTHORIZED
                )

            query_filter = (
                Q(sila_corporate__company__id=company_id)
                | Q(from_company_id=company_id)
            )
        else:
            entity = request.user
            query_filter = Q(sila_user__user=entity) | Q(from_user=entity)

        payment_request = SilaRequest.objects.filter(
            query_filter, id=sila_request_id,
        ).first()

        if not payment_request:
            return Response(
                {"error": "Payment request not found"},
                status=status_codes.HTTP_401_UNAUTHORIZED
            )

        if entity in [payment_request.from_company, payment_request.from_user]:
            is_user_requester = False
            status_for_update = requestee_status
            current_status = payment_request.requestee_status
            valid_status = [
                SilaRequest.StatusChoice.REJECTED,
                SilaRequest.StatusChoice.COMPLETED,
                SilaRequest.StatusChoice.HIDDEN,
            ]
        else:
            is_user_requester = True
            status_for_update = requester_status
            current_status = payment_request.requester_status
            valid_status = [
                SilaRequest.StatusChoice.COMPLETED,
                SilaRequest.StatusChoice.HIDDEN,
                SilaRequest.StatusChoice.CANCELED,
            ]

        logger.info(f"is_user_requester={is_user_requester}")
        if is_user_requester and requestee_status is not None:
            return Response(
                {"error": "Payment requester cannot update requestee's status"},
                status=status_codes.HTTP_401_UNAUTHORIZED
            )

        if not is_user_requester and requester_status is not None:
            return Response(
                {"error": "Payment requestee cannot update requester's status"},
                status=status_codes.HTTP_400_BAD_REQUEST
            )

        if status_for_update not in valid_status:
            return Response(
                {"error": (
                    f"Invalid status {requester_status or requestee_status} provided, "
                    f"expected {', '.join(valid_status)}"
                )},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )

        if (
            current_status == SilaRequest.StatusChoice.COMPLETED
            and status_for_update != SilaRequest.StatusChoice.HIDDEN
        ):
            return Response(
                {"error": (
                    f"Cannot update status to {status_for_update} as it's completed"
                )},
                status=status_codes.HTTP_400_BAD_REQUEST,
            )
        if is_user_requester:
            payment_request.requester_status = status_for_update
            if SilaRequest.StatusChoice.is_final_stage_status(status_for_update):
                payment_request.requestee_status = status_for_update
        else:
            payment_request.requestee_status = status_for_update
            if SilaRequest.StatusChoice.is_final_stage_status(status_for_update):
                payment_request.requester_status = status_for_update

        if SilaRequest.StatusChoice.is_revoke_status(status_for_update):
            payment_request.revoke_reason = revoke_reason

        payment_request.save()

        return Response(
            SilaRequestSerializer(payment_request).data,
            status=status_codes.HTTP_200_OK,
        )


class SilaRejectRequestViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = SilaRequestSerializer

    def delete(self, request, sila_request_id, company_id=None):
        user = request.user
        money_request = SilaRequest.objects.filter(id=sila_request_id).first()

        is_authenticated = False
        if money_request and money_request.from_user:
            if money_request.from_user == user:
                is_authenticated = True
            recipient = [money_request.from_user.email]
        elif money_request and money_request.from_company:
            is_authenticated = CompanyBenjiAccountEntry.objects.filter(
                    benji_account=user,
                    company=money_request.from_company,
                    company_id=company_id,
                    relationship__in=[
                        ACCOUNT_COMPANY_RELATION_OWNER,
                        ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
                        ACCOUNT_COMPANY_RELATION_COMMON_STAFF,
                    ],
            ).exists()
            recipient = [money_request.from_company.owner_email]

        if is_authenticated is False:
            err_msg = (
                "Cannot find payment request or you don't have permission to "
                f"decline. Payment Request ID: {sila_request_id}"
            )
            return Response(
                {"error": err_msg}, status=status_codes.HTTP_400_BAD_REQUEST
            )

        money_request.status = 'rejected'
        money_request.save()

        substitutions = {
            "payer_name": user.full_name,
            "notes": money_request.note,
            "wallet_url": settings.FRONTEND_BASE_URL + '/wallet',
            "request_date":  money_request.created_at.strftime("%m/%d/%Y"),
            "amount": "{:,.2f}".format(int(money_request.amount) / 100),
            "payment_ID": money_request.id
        }

        send_email_template.delay(
            from_email=os.getenv("INFO_FROM_EMAIL"),
            recipient_list=recipient,
            email_template_id=os.getenv("EMAIL_TEMPLATE_REJECT_SILA_REQUEST_ID"),
            substitutions=substitutions,
            sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
        )

        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)


class SilaTransactionPdf(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def _get_s3_image_by_url_or_none(self, url: Optional[str]):
        if url:
            response = requests.get(url)
            if response.status_code == 200:
                content = requests.get(url).content
                byteBase64 = base64.b64encode(content)
                return byteBase64.decode("utf-8")
        return None

    def get_sila_to_sila(self, request, pk: int):
        sila_to_sila = get_object_or_404(SilaToSilaTx, pk=pk)

        sender_image = None
        sender_name = ''
        sender_email = ''
        receiver_image = None
        receiver_name = ''
        receiver_email = ''
        date = sila_to_sila.created_at.strftime("%d %B")
        amount = sila_to_sila.amount / 100
        transaction_id = sila_to_sila.request_transaction_id
        note = sila_to_sila.note

        if sila_to_sila.from_user:
            image_url = sila_to_sila.from_user.profile_photo_s3_url
            sender_image = self._get_s3_image_by_url_or_none(image_url)
            sender_name = sila_to_sila.from_user.full_name
            sender_email = sila_to_sila.from_user.email
        elif sila_to_sila.from_company:
            image_url = sila_to_sila.from_company.profile_photo_s3_url
            sender_image = self._get_s3_image_by_url_or_none(image_url)
            sender_name = sila_to_sila.from_company.title
            sender_email = sila_to_sila.from_company.email

        if sila_to_sila.to_user:
            image_url = sila_to_sila.to_user.profile_photo_s3_url
            receiver_image = self._get_s3_image_by_url_or_none(image_url)
            receiver_name = sila_to_sila.to_user.full_name
            receiver_email = sila_to_sila.to_user.email
        elif sila_to_sila.to_company:
            image_url = sila_to_sila.to_company.profile_photo_s3_url
            receiver_image = self._get_s3_image_by_url_or_none(image_url)
            receiver_name = sila_to_sila.to_company.title
            receiver_email = sila_to_sila.to_company.email

        html = render_to_string(
            template_name='sila_to_sila_transaction.html',
            context={
                'type': 'Payment transfer',
                'sender_image': sender_image,
                'receiver_image': receiver_image,
                'sender_name': sender_name,
                'receiver_name': receiver_name,
                'sender_email': sender_email,
                'receiver_email': receiver_email,
                'amount': amount,
                'date': date,
                'transaction_id': transaction_id,
                'note': note,
                'detail': 'Payment transfer to ' + str(receiver_name)
            }
        )
        pdf = pdfkit.from_string(html, output_path=False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="transaction.pdf"'
        return response

    def get_fiat_to_sila(self, request, pk: int):
        fiat_to_sila = get_object_or_404(FiatToSilaTx, pk=pk)


        receiver_image = None
        receiver_name = ''
        receiver_email = ''
        account_number = ''
        account_type = ''
        date = fiat_to_sila.created_at.strftime("%d %B")
        amount = fiat_to_sila.amount / 100
        transaction_id = fiat_to_sila.request_transaction_id
        note = fiat_to_sila.note

        if fiat_to_sila.to_user:
            image_url = fiat_to_sila.to_user.profile_photo_s3_url
            receiver_image = self._get_s3_image_by_url_or_none(image_url)
            receiver_name = fiat_to_sila.to_user.full_name
            receiver_email = fiat_to_sila.to_user.email

            account_number = fiat_to_sila.account_user.account_number
            account_type = fiat_to_sila.account_user.account_type

        elif fiat_to_sila.to_company:
            image_url = fiat_to_sila.to_company.profile_photo_s3_url
            receiver_image = self._get_s3_image_by_url_or_none(image_url)
            receiver_name = fiat_to_sila.to_company.title
            receiver_email = fiat_to_sila.to_company.email

            account_number = fiat_to_sila.account_corporate.account_number
            account_type = fiat_to_sila.account_corporate.account_type

        html = render_to_string(
            template_name='fiat_to_sila_transaction.html',
            context={
                'type': 'Payment transfer from your bank',
                'receiver_image': receiver_image,
                'receiver_name': receiver_name,
                'receiver_email': receiver_email,
                'account_number': account_number,
                'account_type': account_type,
                'amount': amount,
                'date': date,
                'transaction_id': transaction_id,
                'note': note,
                'detail': 'Payment transfer to your wallet'
            }
        )
        pdf = pdfkit.from_string(html, output_path=False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="transaction.pdf"'
        return response

    def get_sila_to_fiat(self, request, pk: int):
        sila_to_fiat = get_object_or_404(SilaToFiatTx, pk=pk)
        sender_image = None
        sender_name = ''
        sender_email = ''
        account_number = ''
        account_type = ''
        date = sila_to_fiat.created_at.strftime("%d %B")
        amount = sila_to_fiat.amount / 100
        transaction_id = sila_to_fiat.request_transaction_id
        note = sila_to_fiat.note

        if sila_to_fiat.from_user:
            image_url = sila_to_fiat.from_user.profile_photo_s3_url
            sender_image = self._get_s3_image_by_url_or_none(image_url)
            sender_name = sila_to_fiat.from_user.full_name
            sender_email = sila_to_fiat.from_user.email

            account_number = sila_to_fiat.account_user.account_number
            account_type = sila_to_fiat.account_user.account_type

        elif sila_to_fiat.from_company:
            image_url = sila_to_fiat.from_company.profile_photo_s3_url
            sender_image = self._get_s3_image_by_url_or_none(image_url)
            sender_name = sila_to_fiat.from_company.title
            sender_email = sila_to_fiat.from_company.email

            account_number = sila_to_fiat.account_corporate.account_number
            account_type = sila_to_fiat.account_corporate.account_type

        html = render_to_string(
            template_name='sila_to_fiat_transaction.html',
            context={
                'type': 'Payment transfer from your wallet',
                'sender_image': sender_image,
                'sender_name': sender_name,
                'sender_email': sender_email,
                'account_number': account_number,
                'account_type': account_type,
                'amount': amount,
                'date': date,
                'transaction_id': transaction_id,
                'note': note,
                'detail': 'Payment transfer to your bank'
            }
        )
        pdf = pdfkit.from_string(html, output_path=False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="transaction.pdf"'
        return response


class SilaAccountManagerViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, AccountManagerPermission)

    def get_sila_user_info(self, request):
        user_email = request.data.get("email")
        if user_email:
            sila_users = SilaUser.objects.filter(user__email=user_email)
        else:
            # get last 5 registered user if email is not specified
            sila_users = SilaUser.objects.order_by("-created_at")[:5]

        response_data = SilaUserAccountManagerSerializer(sila_users, many=True).data

        return Response(response_data)

    def get_sila_corporate_info(self, request):
        email = request.data.get("email")
        if email:
            query_filter = Q(business_email=email) | Q(company__owner_email=email)
            sila_corporate = SilaCorporate.objects.filter(query_filter)
        else:
            # get last 5 registered user if email is not specified
            sila_corporate = SilaCorporate.objects.order_by("-created_at")[:5]

        response_data = SilaCorporateAccountManagerSerializer(
            sila_corporate, many=True
        ).data

        return Response(response_data)
