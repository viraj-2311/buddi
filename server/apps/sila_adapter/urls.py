from django.urls import include, path
from .views import (
    SilaUserRegisterAPIViewSet,
    SilaCorporateRegisterAPIViewSet,
    CorporateWalletViewSet,
    UserWalletViewSet,
    SilaPlaidLinkViewSet,
    UserKYC_RequestViewset,
    UserKYC_DocumentUpload,
    UserKYC_SupportedDocuments,
    SilaKYC_Webhook,
    KYB_RequestViewset,
    CorporateKYB_DocumentUpload,
    PlaidAccountViewSet,
    FiatToSilaTxViewSet,
    SilaToSilaTxViewSet,
    BussinessRole,
    PlaidAccountCorporateViewSet,
    SilaUserViewSet,
    LinkBusinessMemberViewSet,
    SilaToFiatTxViewSet,
    SilaUserTxsViewSet,
    SilaRequestViewSet,
    SilaTransactionWebhook,
    SilaRejectRequestViewSet,
    SilaAccountList,
    SilaLinkPlaidAccountWebhook,
    SilaAccountManagerViewSet,
    SilaRejectRequestViewSet, SilaAccountList, SilaTransactionPdf,
)

v1_urlpatterns = [
    path(
        "user/sila/register_user/",
        SilaUserRegisterAPIViewSet.as_view({"post": "create"}),
        name="register-sila-user",
    ),
    path(
        "user/plaid/account/",
        PlaidAccountViewSet.as_view({
            "get": "list",
        })
    ),
    path(
        "user/plaid/account/<int:account_id>",
        PlaidAccountViewSet.as_view({
            "delete": "delete_plaid_account",
        })
    ),

    path("sila_user/<str:search>", SilaUserViewSet.as_view({"get": "list"})),

    path("sila_accounts/<str:search>", SilaAccountList.as_view()),

    path(
        "sila_user/list_last_transacted_user/",
        SilaUserViewSet.as_view({"get": "list_last_transacted_user"}),
    ),
    path(
        "user/sila_transaction/", SilaUserTxsViewSet.as_view({"get": "list_all_user"})
    ),
    path(
        "user/sila_transaction/pdf/", SilaUserTxsViewSet.as_view({"get": "pdf_for_user"})
    ),
    path(
        "company/<int:company_id>/sila_transaction/",
        SilaUserTxsViewSet.as_view({"get": "list_all_company"}),
    ),
    path(
        "company/<int:company_id>/sila_transaction/pdf/",
        SilaUserTxsViewSet.as_view({"get": "pdf_for_company"}),
    ),
    path(
        "company/<int:company_id>/plaid/account/",
        PlaidAccountCorporateViewSet.as_view({"get": "list"}),
    ),
    path(
        "company/<int:company_id>/plaid/account/<int:account_id>",
        PlaidAccountCorporateViewSet.as_view(
            {"delete": "delete_corporate_plaid_acount"}
        ),
    ),
    path(
        "user/fiat_to_sila_transfer/", FiatToSilaTxViewSet.as_view({"post": "create"})
    ),
    path(
        "user/fiat_to_sila_transfer/bulk_pay",
        FiatToSilaTxViewSet.as_view({"post": "bulk_create"}),
    ),
    path(
        "user/sila_to_fiat_transfer/", SilaToFiatTxViewSet.as_view({"post": "create"})
    ),
    path(
        "user/sila_to_sila_transfer/", SilaToSilaTxViewSet.as_view({"post": "create"})
    ),
    path(
        "company/<int:company_id>/fiat_to_sila_transfer/",
        FiatToSilaTxViewSet.as_view({"post": "create_company"}),
    ),
    path(
        "company/<int:company_id>/sila_to_sila_transfer/",
        SilaToSilaTxViewSet.as_view({"post": "create_company"}),
    ),
    path(
        "user/sila/user-info/",
        SilaUserRegisterAPIViewSet.as_view({"get": "retrieve", "put": "update"}),
        name="get-sila-user",
    ),
    path(
        "user/sila/wallet/",
        UserWalletViewSet.as_view(
            {"post": "create", "get": "list", "patch": "update_balances"}
        ),
        name="sila-user-wallet",
    ),
    path(
        r"company/<int:company_id>/sila/register/",
        SilaCorporateRegisterAPIViewSet.as_view({"post": "create"}),
        name="register-sila-corporate-user",
    ),
    path(
        "company/<int:company_id>/sila/corporate-info/",
        SilaCorporateRegisterAPIViewSet.as_view({"get": "retrieve", "put": "update"}),
        name="get-sila-user",
    ),
    path(
        r"company/<int:company_id>/sila/wallet/",
        CorporateWalletViewSet.as_view(
            {"post": "create", "get": "list", "patch": "update_balances"}
        ),
        name="sila-corporate-wallet",
    ),
    path(
        r"user/plaid/token/",
        SilaPlaidLinkViewSet.as_view(
            {"post": "create_plaid_token", "patch": "link_plaid_account"}
        ),
        name="sila-plaid-link",
    ),
    path(
        r"user/sila/account/",
        SilaPlaidLinkViewSet.as_view({"post": "link_account_manually"}),
        name="sila-link-account-manually",
    ),
    path(
        r"user/sila/kyc",
        UserKYC_RequestViewset.as_view({"post": "create", "get": "retrieve"}),
        name="sila-kyc",
    ),
    path(
        r"user/sila/kyc/document",
        UserKYC_DocumentUpload.as_view({"post": "create"}),
        name="sila-kyc-upload-document",
    ),
    path(
        r"user/sila/kyc/supported-documents",
        UserKYC_SupportedDocuments.as_view({"get": "retrieve"}),
        name="sila-kyc-supported_documents",
    ),
    path(
        r"sila/webhook/kyc_update",
        SilaKYC_Webhook.as_view({"post": "update_kyc_webhook"}),
        name="sila-kyc-webhook",
    ),
    path(
        r"sila/webhook/transaction_update",
        SilaTransactionWebhook.as_view({"post": "update_transaction_webhook"}),
        name="sila-transaction-update-webhook",
    ),
    path(
        r"sila/webhook/account_link",
        SilaLinkPlaidAccountWebhook.as_view({"post": "update_plaid_account_webhook"}),
        name="update_plaid_account_webhook",
    ),
    path(
        r"company/<int:company_id>/sila/kyb/",
        KYB_RequestViewset.as_view({"post": "create", "get": "retrieve"}),
        name="sila-kyb",
    ),
    path(
        r"company/<int:company_id>/sila/kyb/document",
        CorporateKYB_DocumentUpload.as_view({"post": "create"}),
        name="sila-kyb-upload-documnet",
    ),
    path(
        r"sila/business_role",
        BussinessRole.as_view({"get": "retrieve"}),
        name="sila-business-role",
    ),
    path(
        r"company/<int:company_id>/sila/member",
        LinkBusinessMemberViewSet.as_view(
            {"get": "retrieve", "post": "link"}
        ),
        name="sila-link-corporate-member",
    ),
    path(
        r"company/<int:company_id>/sila/member/<int:member_id>",
        LinkBusinessMemberViewSet.as_view(
            {"put": "update", "delete": "unlink"}
        ),
        name="sila-link-corporate-member",
    ),
    path(
        r"company/<int:company_id>/sila/member/<int:member_id>/<str:token>",
        LinkBusinessMemberViewSet.as_view(
            {"get": "decline"}
        ),
        name="sila-link-corporate-member",
    ),
    path(
        r"user/request_sila",
        SilaRequestViewSet.as_view({"get": "list_for_user", "post": "create"}),
        name="request-sila",
    ),
    path(
        r"user/request_sila/<int:sila_request_id>",
        SilaRequestViewSet.as_view({"put": "payment_request_update"}),
        name="request-payment-update-company",
    ),
    path(
        r"company/<int:company_id>/request_sila",
        SilaRequestViewSet.as_view({
            "get": "list_for_company",
            "post": "create_for_company"
        }),
        name="request-sila-company",
    ),
    path(
        r"company/<int:company_id>/request_sila/<int:sila_request_id>",
        SilaRequestViewSet.as_view({'put': 'payment_request_update'}),
        name="request-payment-update-company",
    ),
    path(
        "transactions/sila_to_sila/<int:pk>/pdf",
        SilaTransactionPdf.as_view({'get': 'get_sila_to_sila'}),
        name='sila-to-sila-transaction'
    ),
    path(
        "transactions/fiat_to_sila/<int:pk>/pdf",
        SilaTransactionPdf.as_view({'get': 'get_fiat_to_sila'}),
        name='fiat-to-sila-transaction'
    ),
    path(
        "transactions/sila_to_fiat/<int:pk>/pdf",
        SilaTransactionPdf.as_view({'get': 'get_sila_to_fiat'}),
        name='sila-to-fiat-transaction'
    ),
    path(
        r"account-manager/sila-user",
        SilaAccountManagerViewSet.as_view({"post": "get_sila_user_info"}),
        name="account-manager-sila-user"
    ),
    path(
        r"account-manager/sila-corporate",
        SilaAccountManagerViewSet.as_view({"post": "get_sila_corporate_info"}),
        name="account-manager-sila-corporate"
    ),
]
urlpatterns = [
    path("", include(v1_urlpatterns)),
]
