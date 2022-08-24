from django.db import models

from apps.user.models import BenjiAccount, Company
from apps.user.constants import (
    BUSINESS_TYPES,
    DEFAULT_BUSINESS_TYPES,
    COMPANY_TYPES,
    PRODUCTION_COMPANY_TYPE,
)

DEFAULT_WALLET_NICKNAME = "default"


class SilaUser(models.Model):
    user = models.OneToOneField(
        BenjiAccount, on_delete=models.CASCADE, related_name="sila_user", unique=True
    )
    user_handle = models.CharField(max_length=100, help_text="Unique ID in Sila")
    private_key = models.CharField(max_length=100, help_text="User private key")
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    social_security_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    home_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip = models.CharField(max_length=50, blank=True, null=True)
    kyc_pass = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def user_info(self):
        return self.user

    @property
    def wallet(self):
        return self.wallets.first()


class SilaCorporate(models.Model):
    company = models.OneToOneField(
        Company, on_delete=models.CASCADE, related_name="sila_corporate", unique=True
    )
    user_handle = models.CharField(max_length=100, help_text="Unique ID in Sila")
    private_key = models.CharField(max_length=100, help_text="User private key")
    business_type = models.CharField(
        max_length=255, choices=BUSINESS_TYPES, default=DEFAULT_BUSINESS_TYPES
    )
    legal_company_name = models.CharField(max_length=255)
    category = models.CharField(
        max_length=30, choices=COMPANY_TYPES, default=PRODUCTION_COMPANY_TYPE
    )
    employer_id_number = models.CharField(max_length=30, help_text="also known as EIN")
    phone_number = models.CharField(max_length=50, null=True)
    business_address = models.CharField(max_length=255, null=True)
    business_email = models.CharField(max_length=1024, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip = models.CharField(max_length=50, blank=True, null=True)
    kyb_pass = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserWallet(models.Model):
    sila_user = models.ForeignKey(
        SilaUser, on_delete=models.CASCADE, related_name="wallets"
    )
    nickname = models.CharField(max_length=66, default=DEFAULT_WALLET_NICKNAME)
    private_key = models.TextField()
    public_key = models.CharField(max_length=42, unique=True)
    registered_at_sila = models.BooleanField(default=False)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    balance = models.FloatField(default=0.0, blank=True, null=True)

    class Meta:
        unique_together = [
            ["private_key", "public_key"],
            ["sila_user", "nickname"],
        ]


class CorporateWallet(models.Model):
    sila_corporate = models.ForeignKey(
        SilaCorporate, on_delete=models.CASCADE, related_name="wallets"
    )
    nickname = models.CharField(max_length=66, default=DEFAULT_WALLET_NICKNAME)
    private_key = models.TextField()
    public_key = models.CharField(max_length=42, unique=True)
    registered_at_sila = models.BooleanField(default=False)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    balance = models.FloatField(default=0.0, blank=True, null=True)

    class Meta:
        unique_together = [
            ["private_key", "public_key"],
            ["sila_corporate", "nickname"],
        ]


class KYC_Request(models.Model):
    class VerificationStatusChoice(models.TextChoices):
        UNVERIFIED = "unverified"
        PASSED = "passed"
        PENDING = "pending"
        REVIEW = "review"
        FAILED = "failed"
        MEMBER_UNVERIFIED = "member_unverified"
        MEMBER_FAILED = "member_failed"
        MEMBER_REVIEW = "member_review"
        MEMBER_PENDING = "member_pending"
        DOCUMENTS_REQUIRED = "documents_required"
        DOCUMENTS_RECEIVED = "documents_received"
        WEBHOOK_PENDING = "webhook_pending"

    class EntityTypeChoice(models.TextChoices):
        INDIVIDUAL = "individual"
        BUSINESS = "business"

    reference = models.CharField(max_length=100, help_text="A Unique Sila reference ID")
    verification_status = models.CharField(
        max_length=25, choices=VerificationStatusChoice.choices
    )
    result_detail = models.TextField(
        blank=True,
        help_text="Show matched detail, unmatch detail, document required message",
    )
    account_info_modified = models.BooleanField(
        default=False,
        help_text="Whether the info of SilaUser or SilaCorporate is modified",
    )
    entity_type = models.CharField(max_length=10, choices=EntityTypeChoice.choices)
    sila_user = models.ForeignKey(
        SilaUser, on_delete=models.CASCADE, related_name="kyc_requests", null=True
    )
    sila_corporate = models.ForeignKey(
        SilaCorporate, on_delete=models.CASCADE, related_name="kyc_requests", null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class KYC_History(models.Model):
    class KYC_LevelChoice(models.TextChoices):
        DOC_KYC = "DOC_KYC"
        KYC_LITE = "KYC-LITE"
        RECEIVE_ONLY = "RECEIVE_ONLY"
        INSTANT_ACH = "INSTANT-ACH"
        KYB_STANDARD = "KYB-STANDARD"
        KYB_LITE = "KYB-LITE"
        DEFAULT = "DEFAULT"

    kyc_request = models.ForeignKey(
        KYC_Request, related_name="kyc_histories", on_delete=models.CASCADE
    )
    verification_id = models.CharField(
        max_length=100, help_text="A unique ID from Sila"
    )
    requested_at = models.DateTimeField()
    sila_updated_at = models.DateTimeField()
    verification_status = models.CharField(
        max_length=25, choices=KYC_Request.VerificationStatusChoice.choices
    )
    result_detail = models.TextField(
        blank=True,
        help_text="Show matched detail, unmatch detail, document required message",
    )
    kyc_level = models.CharField(max_length=15, choices=KYC_LevelChoice.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PlaidLinkedAccount(models.Model):
    user = models.ForeignKey(
        BenjiAccount, on_delete=models.CASCADE, related_name="plaid_accounts"
    )
    account_number = models.CharField(max_length=120)
    routing_number = models.CharField(max_length=120)
    account_name = models.CharField(max_length=120)
    account_type = models.CharField(max_length=120)
    active = models.BooleanField(default=False)
    account_status = models.CharField(max_length=120)
    account_link_status = models.CharField(max_length=120)
    match_score = models.FloatField(null=True, default=None)
    entity_name = models.CharField(max_length=120)
    account_owner_name = models.CharField(
        max_length=120, blank=True, null=True, default=None
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "account_number", "account_name", "account_type")


class PlaidLinkedCorporateAccount(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="plaid_accounts"
    )
    account_number = models.CharField(max_length=120)
    routing_number = models.CharField(max_length=120)
    account_name = models.CharField(max_length=120)
    account_type = models.CharField(max_length=120)
    active = models.BooleanField(default=False)
    account_status = models.CharField(max_length=120)
    account_link_status = models.CharField(max_length=120)
    match_score = models.FloatField(null=True, default=None)
    entity_name = models.CharField(max_length=120)
    account_owner_name = models.CharField(
        max_length=120, blank=True, null=True, default=None
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("company", "account_number", "account_name", "account_type")


class PlaidLinkedAccountReference(models.Model):
    """Record reference_id while Linking acount with Plaid
    This is mainly for webhooks to find the mapping between reference_id
        and BenjiAccount
    """
    reference_id = models.CharField(
        max_length=100, help_text="A unique ID from Sila"
    )
    sila_user = models.ForeignKey(
        SilaUser,
        on_delete=models.CASCADE,
        null=True,
        related_name="plaid_linked_references",
    )
    sila_corporate = models.ForeignKey(
        SilaCorporate,
        on_delete=models.CASCADE,
        null=True,
        related_name="plaid_linked_references",
    )
    is_webhook_received = models.BooleanField(
        default=False, help_text="Whether a webhook is received"
    )
    initial_link_status = models.CharField(
        max_length=50, help_text="status from silasdk.User.linkAccount()"
    )
    initial_link_message = models.TextField(
        null=True, help_text="link message returned from silasdk.User.linkAccount()"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FiatToSilaTx(models.Model):
    amount = models.FloatField(default=0.0)
    to_user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="fiat_txs",
        null=True,
        blank=True,
    )
    to_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="company_received_fiat_to_silas",
        null=True,
        blank=True,
    )
    account_user = models.ForeignKey(
        PlaidLinkedAccount,
        on_delete=models.CASCADE,
        related_name="fiat_withdrawls",
        null=True,
        blank=True,
    )
    account_corporate = models.ForeignKey(
        PlaidLinkedCorporateAccount,
        on_delete=models.CASCADE,
        related_name="fiat_withdrawls",
        null=True,
        blank=True,
    )
    request_transaction_id = models.UUIDField(null=True, blank=True)
    processed = models.BooleanField(default=False)
    sila_status = models.CharField(default="unknown", max_length=40)
    note = models.CharField(max_length=512, null=True, blank=True)
    error_msg = models.CharField(max_length=512, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SilaToFiatTx(models.Model):
    amount = models.FloatField(default=0.0)
    from_user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="fiat_txs_out",
        null=True,
        blank=True,
    )
    from_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="company_paid_fiat_to_silas",
        null=True,
        blank=True,
    )
    account_user = models.ForeignKey(
        PlaidLinkedAccount,
        on_delete=models.CASCADE,
        related_name="fiat_sent",
        null=True,
        blank=True,
    )
    account_corporate = models.ForeignKey(
        PlaidLinkedCorporateAccount,
        on_delete=models.CASCADE,
        related_name="fiat_sent",
        null=True,
        blank=True,
    )
    request_transaction_id = models.UUIDField(null=True, blank=True)
    processed = models.BooleanField(default=False)
    sila_status = models.CharField(default="unknown", max_length=40)
    note = models.CharField(max_length=512, null=True, blank=True)
    error_msg = models.CharField(max_length=512, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SilaToSilaTx(models.Model):
    amount = models.FloatField(default=0.0)
    from_user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="sent_silas",
        null=True,
        blank=True,
    )
    to_user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="received_silas",
        null=True,
        blank=True,
    )
    from_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="sent_silas",
        null=True,
        blank=True,
    )
    to_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="received_silas",
        null=True,
        blank=True,
    )
    parent_request_transaction_id = models.UUIDField(null=True, blank=True)
    request_transaction_id = models.UUIDField(null=True, blank=True)
    is_auto_approve = models.BooleanField(default=False)
    fiat_parent = models.ForeignKey(
        FiatToSilaTx,
        on_delete=models.CASCADE,
        related_name="request_txs",
        null=True,
        blank=True,
    )
    processed = models.BooleanField(default=False)
    note = models.CharField(max_length=512, null=True, blank=True)
    error_msg = models.CharField(max_length=512, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SilaCorporateMember(models.Model):
    class BusinessRoleChoice(models.TextChoices):
        BENEFICIAL_OWNER = "beneficial_owner"
        CONTROLLING_OFFICER = "controlling_officer"
        ADMINISTRATOR = "administrator"

    sila_corporate = models.ForeignKey(
        SilaCorporate, related_name="members", on_delete=models.CASCADE
    )
    sila_user = models.ForeignKey(SilaUser, on_delete=models.CASCADE)
    role = models.CharField(max_length=19, choices=BusinessRoleChoice.choices)
    title = models.CharField(
        max_length=50, blank=True, help_text="Custom identifier within SilaCorporate"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SilaRequest(models.Model):
    class StatusChoice(models.TextChoices):
        REQUESTED = "requested"
        PENDING = "pending"
        REJECTED = "rejected"
        CANCELED = "canceled"
        COMPLETED = "completed"
        HIDDEN = "hidden"

        @classmethod
        def is_final_stage_status(cls, status):
            if status in [cls.REJECTED, cls.CANCELED, cls.COMPLETED]:
                return True
            else:
                return False

        @classmethod
        def is_revoke_status(cls, status):
            if status in [cls.REJECTED, cls.CANCELED]:
                return True
            else:
                return False

    sila_user = models.ForeignKey(
        SilaUser, on_delete=models.CASCADE, related_name="sila_requested",
        null=True, blank=True, help_text="someone who is supposed to receive money",
    )
    sila_corporate = models.ForeignKey(
        SilaCorporate,
        on_delete=models.CASCADE,
        related_name="sila_corporate_requested",
        null=True, blank=True, help_text="a company who is supposed to receive money",
    )
    amount = models.IntegerField(default=0)
    from_user = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="sila_requests",
        null=True,
        blank=True,
        help_text="someone who is supposed to send money",
    )
    from_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="sila_requests",
        null=True,
        blank=True,
        help_text="a company who is supposed to send money",
    )
    note = models.TextField(default="")
    revoke_reason = models.TextField(default="")
    requester_status = models.TextField(
        default=StatusChoice.REQUESTED, choices=StatusChoice.choices
    )
    requestee_status = models.TextField(
        default=StatusChoice.PENDING, choices=StatusChoice.choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class BankRoutinNumberMapping(models.Model):
    routing_number = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
