from django.urls import include, path

from rest_framework_simplejwt.views import TokenRefreshView

from . import views

v1_urlpatterns = [
    # Login
    path("token/", views.BenjiTokenObtainPairView.as_view(), name="token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # Create New Account, Forgot Password, Reset Password
    path("signup/", views.SignupViewSet.as_view({"post": "create"}), name="signup"),
    path("change_password/", views.PasswordViewSet.as_view({"patch": "change_password"}), name="change_password"),
    path("resend_email/", views.SignupViewSet.as_view({"post": "resend_email"}), name="resend-email"),
    path("signup/verification/<str:token>/", views.SignupViewSet.as_view({"get": "signup_verification"}),
         name="signup-verification"),
    path("forgot_password/", views.SignupViewSet.as_view({"post": "forgot_password"}), name="forgot-password"),
    path("reset_password/<str:token>/", views.SignupViewSet.as_view({"get": "validate_reset_password"}),
         name="validate-reset-password"),
    path("reset_password/", views.SignupViewSet.as_view({"post": "reset_password"}), name="reset-password"),
    path("invite/verification/<str:token>/", views.SignupViewSet.as_view({"get": "verify_invitation"}),
         name="verify-invitation"),
    path("user_registration/<int:pk>/", views.SignupViewSet.as_view({"patch": "partial_update"}), name="invite-signup"),
    # User Profile
    path("user/<int:pk>/update/", views.UserViewSet.as_view({"patch": "update_user"}), name="update-user"),
    path("user/<int:pk>/profile_completed/", views.UserViewSet.as_view({"post": "profile_completed"}),
         name="profile-completed"),
    path("user/<int:pk>/s3upload/", views.GenericS3UploadedFileViewSet.as_view({"post": "create"}),
         name="add-s3-document"),
    path("user/<int:pk_user>/s3upload/<int:pk_doc>/", views.GenericS3UploadedFileViewSet.as_view({"delete": "delete"}),
         name="delete-s3-document"),
    # Crew Profile
    path("crew/<int:pk>/update/", views.CrewUserViewSet.as_view({"patch": "update_crew"}), name="update-crew"),
    # Producer Profile
    path("producer/<int:pk>/update/", views.ProducerUserViewSet.as_view({"patch": "update_producer"}),
         name="update-producer"),
    # Company Profile
    path("company/", views.CompanyUserViewSet.as_view({"get": "list", "post": "create_company"}), name="company"),
    path("company/<int:pk>/",
         views.CompanyUserViewSet.as_view({"patch": "update_company", "get": "retrieve", "delete": "destroy"}),
         name="company-detail"),
    path("get_company_by_email/", views.CompanyUserViewSet.as_view({"post": "get_company_by_email"}),
         name="get-company-by-email"),
    # Users
    path("users/", views.UserEntityList.as_view(), name="users-list"),
    path("producers/", views.ProducerEntityList.as_view(), name="producers-list"),
    path("users/<int:pk>/",
         views.UserProfileViewSet.as_view({"get": "retrieve", "patch": "partial_update", "post": "update_profile"}),
         name="user-detail"),
    path("user_profile/skills/",
         views.UserProfileSkillsViewSet.as_view({"get": "retrieve"}),
         name="user-profile-skill"),
    # Special APIs
    path("auth/profile/",
         views.retrieve_auth_profile,
         name="retrieve-auth-profile"),
    path("company/<int:pk>/profile/",
         views.retrieve_company_profile,
         name="retrieve-company-profile"),
    path("user/<int:pk>/company/",
         views.retrieve_company_by_user,
         name="retrieve-company-by-user"),
    # Company Staff Invitation
    path("invite_company_staff/",
         views.InviteCompanyStaffViewSet.as_view({"post": "create"}),
         name="invite-company-staff"),
    # Company Access Request Validation
    path("validation/accept_company_access_token/<str:token>/",
         views.AcceptCompanyAccessTokenViewSet.as_view({"get": "retrieve"}),
         name="accept-company-access-token"),
    path("validation/decline_company_access_token/<str:token>/",
         views.DeclineCompanyAccessToken.as_view({"get": "retrieve"}),
         name="decline-company-access-token"),
    # Company types
    path("company_types/",
         views.CompanyTypeViewSet.as_view({"get": "retrieve"}),
         name="company-types"),
    # Company business types
    path("business_types/",
         views.BusinessTypeViewSet.as_view({"get": "retrieve"}),
         name="business-types"),
    # UserImportedContacts
    path("user_contacts/",
         views.UserContactViewSet.as_view({"get": "retrieve", "post":"bulk_add"}),
         name="user_contacts"),
    path("user_contacts/<int:pk>/",
         views.UserContactViewSet.as_view({"delete": "delete"}),
         name="user_contacts_delete"),
    path("company/<int:company_id>/company_contacts/",
         views.UserContactViewSet.as_view({"get": "retrieve", "post": "bulk_add"}),
         name="company_contacts"),
    path("company/<int:company_id>/company_contacts/<int:pk>/",
         views.UserContactViewSet.as_view({"delete": "delete"}),
         name="company_contacts_delete"),
    # SocialImportContact
    path("user_contacts/auth",
         views.ContactImportAuthViewSet.as_view({"get": "auth_login"}),
         name="contact-import-oauth-login"),
    path("company/<int:company_id>/company_contacts/auth",
         views.ContactImportAuthViewSet.as_view({"get": "auth_login"}),
         name="company-contact-import-oauth-login"),
    path("user_contacts/callback",
         views.ContactOAuthCallbackView.as_view({"get": "callback"}),
         name="contact-import-oauth-callback"),
    # company documents
    path("company/<int:pk>/document/job",
         views.CompanyDocumentViewSet.as_view({"get": "list"}),
         name="company_document_jobs_list"),
    path("company/<int:company_pk>/document/job/<int:job_pk>/w9",
         views.CompanyDocumentViewSet.as_view({"get": "list_w9"}),
         name="company_document_job_w9_list"),
    path("company/<int:company_pk>/document/job/<int:job_pk>/invoice",
         views.CompanyDocumentViewSet.as_view({"get": "list_invoice"}),
         name="company_document_job_invoice_list"),
    path("company/<int:company_id>/logout",
         views.CompanyLogoutViewSet.as_view({"post": "logout_company"}),
         name="logout_company"),
    path("company/<int:pk>/check_balance", views.CompanyDeleteViewSet.as_view({"get": "check_balance"}),
         name="company-check-balance"),
    path("company/<int:pk>/delete", views.CompanyDeleteViewSet.as_view({"post": "delete"}),
         name="company-delete"),
    path("user/sila_wallet/check_balance", views.UserDeleteViewSet.as_view({"get": "check_balance"}),
     name="user-check-balance"),
    path("user/delete", views.UserDeleteViewSet.as_view({"post": "delete"}),
         name="user-delete"),
    path("user/need_help/", views.NeedHelpViewSet.as_view({"post": "need_help"}),
         name="need_help"),


]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
