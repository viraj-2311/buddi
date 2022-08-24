import logging

from apps.sila_adapter.models import (
    SilaUser,
    SilaCorporate,
    UserWallet,
    CorporateWallet,
    KYC_Request,
    KYC_History,
    PlaidLinkedAccount,
    FiatToSilaTx,
    SilaToSilaTx,
    PlaidLinkedCorporateAccount,
    SilaCorporateMember,
    SilaToFiatTx,
    SilaRequest,
    BankRoutinNumberMapping,
)
from rest_framework import serializers

from apps.user.serializers import BenjiAccountSerializer
from apps.sila_adapter.utils import get_kyc_verification_status_mapping

logger = logging.getLogger(__name__)


class SilaUserSerializer(serializers.ModelSerializer):
    plaid_accounts = serializers.SerializerMethodField()
    sila_wallet = serializers.SerializerMethodField()
    user_info = serializers.SerializerMethodField()

    def get_user_info(self, obj):
        return BenjiAccountSerializer(obj.user).data

    def get_plaid_accounts(self, obj):
        return PlaidLinkedAccountSerializer(obj.user.plaid_accounts, many=True).data

    def get_sila_wallet(self, obj):
        return UserWalletSerializer(obj.wallet).data

    class Meta:
        model = SilaUser
        exclude = ("private_key",)


class KYC_HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = KYC_History
        fields = "__all__"


class KYC_RequestSerializer(serializers.ModelSerializer):
    kyc_histories = serializers.SerializerMethodField()

    class Meta:
        model = KYC_Request
        exclude = ["sila_user", "sila_corporate"]
        depth = 2

    def get_kyc_histories(self, obj):
        return KYC_HistorySerializer(
            obj.kyc_histories.order_by("-created_at"), many=True
        ).data


class SilaUserAccountManagerSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    kyc_requests = KYC_RequestSerializer(many=True)

    class Meta:
        model = SilaUser
        fields = ["id", "first_name", "last_name", "kyc_pass", "kyc_requests", "email"]

    def get_email(self, obj):
        return obj.user.email


class SilaUserOnlySerializer(serializers.ModelSerializer):
    """
    This is for corporate owner to view member's registration data
    Only non-sensitive data can be returned
    """
    email = serializers.SerializerMethodField()

    class Meta:
        model = SilaUser
        fields = ("id", "email", "user_handle", "first_name", "last_name", "kyc_pass")

    def get_email(self, obj):
        return obj.user.email


class SilaCorporateAccountManagerSerializer(serializers.ModelSerializer):
    owner_email = serializers.SerializerMethodField()
    kyc_requests = KYC_RequestSerializer(many=True)

    class Meta:
        model = SilaCorporate
        fields = [
            "id",
            "legal_company_name",
            "kyb_pass",
            "kyc_requests",
            "owner_email",
            "business_email",
        ]

    def get_owner_email(self, obj):
        return obj.company.owner_email


class SilaCorporateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SilaCorporate
        exclude = ("private_key",)


class UserWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWallet
        exclude = ("private_key",)


class CorporateWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorporateWallet
        exclude = ("private_key",)


class PlaidLinkedAccountSerializer(serializers.ModelSerializer):
    account_name = serializers.SerializerMethodField()

    class Meta:
        model = PlaidLinkedAccount
        fields = "__all__"

    def get_account_name(self, obj):
        try:
            route_map = BankRoutinNumberMapping.objects.get(
                routing_number=obj.routing_number
            )
            return f"{route_map.bank_name} ({obj.account_type})"
        except BankRoutinNumberMapping.DoesNotExist:
            logger.error(
                f"Cannot find bank name mapping for routing_number={obj.routing_number}"
            )
            return f"({obj.account_type})"


class PlaidLinkedCorporateAccountSerializer(serializers.ModelSerializer):
    account_name = serializers.SerializerMethodField()

    class Meta:
        model = PlaidLinkedCorporateAccount
        fields = "__all__"

    def get_account_name(self, obj):
        try:
            route_map = BankRoutinNumberMapping.objects.get(
                routing_number=obj.routing_number
            )
            return f"{route_map.bank_name} ({obj.account_type})"
        except BankRoutinNumberMapping.DoesNotExist:
            logger.error(
                f"Cannot find bank name mapping for routing_number={obj.routing_number}"
            )
            return f"({obj.account_type})"


class FiatToSilaTxSerializer(serializers.ModelSerializer):
    to_user_repr = serializers.SerializerMethodField()
    to_company_repr = serializers.SerializerMethodField()

    class Meta:
        model = FiatToSilaTx
        fields = "__all__"

    def get_to_user_repr(self, obj):
        if obj.to_user and hasattr(obj.to_user, 'sila_user'):
            return SilaUserSerializer(obj.to_user.sila_user).data
        return None

    def get_to_company_repr(self, obj):
        if obj.to_company and hasattr(obj.to_company, 'sila_corporate'):
            return SilaCorporateSerializer(obj.to_company.sila_corporate).data
        return None


class SilaToFiatTxSerializer(serializers.ModelSerializer):
    class Meta:
        model = SilaToFiatTx
        fields = "__all__"


class SilaToSilaTxSerializer(serializers.ModelSerializer):
    to_user_repr = serializers.SerializerMethodField()
    to_company_repr = serializers.SerializerMethodField()
    from_user_name = serializers.SerializerMethodField()
    from_company_name = serializers.SerializerMethodField()
    side = serializers.SerializerMethodField()

    class Meta:
        model = SilaToSilaTx
        fields = "__all__"

    def get_to_user_repr(self, obj):
        if obj.to_user and hasattr(obj.to_user, 'sila_user'):
            return SilaUserSerializer(obj.to_user.sila_user).data
        return None

    def get_to_company_repr(self, obj):
        if obj.to_company and hasattr(obj.to_company, 'sila_corporate'):
            return SilaCorporateSerializer(obj.to_company.sila_corporate).data
        return None

    def get_from_user_name(self, obj):
        if obj.from_user:
            return obj.from_user.email
        return None

    def get_from_company_name(self, obj):
        if obj.from_company:
            return obj.from_company.title
        return None

    def get_side(self, obj):
        try:
            return obj.side
        except Exception:
            pass
        return None


class KYC_OverviewSerializer(serializers.ModelSerializer):
    result_detail = serializers.SerializerMethodField()
    sila_user = SilaUserSerializer()
    sila_corporate = SilaCorporateSerializer()
    verification_status = serializers.SerializerMethodField()

    class Meta:
        model = KYC_Request
        fields = "__all__"
        depth = 0

    def get_result_detail(self, obj):
        return obj.result_detail.split(";")

    def get_verification_status(self, obj):
        return get_kyc_verification_status_mapping(obj.verification_status)


class SilaCorporateMemberUpdateRequestSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        required=True, choices=SilaCorporateMember.BusinessRoleChoice.choices
    )
    title = serializers.CharField(required=True)


class SilaCorporateMemberSerializer(serializers.ModelSerializer):
    sila_user = SilaUserOnlySerializer()

    class Meta:
        model = SilaCorporateMember
        fields = "__all__"


class SilaRequestSerializer(serializers.ModelSerializer):
    sila_corporate_repr = serializers.SerializerMethodField()
    sila_user_repr = serializers.SerializerMethodField()
    sila_to_user_repr = serializers.SerializerMethodField()
    sila_to_company_repr = serializers.SerializerMethodField()

    class Meta:
        model = SilaRequest
        fields = "__all__"

    def get_sila_user_repr(self, obj):
        if obj.sila_user:
            return SilaUserSerializer(obj.sila_user).data
        return None

    def get_sila_corporate_repr(self, obj):
        if obj.sila_corporate:
            return SilaCorporateSerializer(obj.sila_corporate).data
        return None

    def get_sila_to_user_repr(self, obj):
        if obj.from_user and hasattr(obj.from_user, 'sila_user'):
            return SilaUserSerializer(obj.from_user.sila_user).data
        return None

    def get_sila_to_company_repr(self, obj):
        if obj.from_company and hasattr(obj.from_company, 'sila_corporate'):
            return SilaCorporateSerializer(obj.from_company.sila_corporate).data
        return None


class SilaSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user_id = serializers.IntegerField(allow_null=True, required=False,)
    company_id = serializers.IntegerField(allow_null=True, required=False,)
    name = serializers.CharField()
    email = serializers.CharField()
    type = serializers.CharField()
    profile_photo_s3_url = serializers.CharField()
