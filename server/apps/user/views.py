import json
import os
from xml.dom.pulldom import DOMEventStream

import requests
import logging
from functools import partial
import traceback

from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django.http.response import HttpResponseRedirect, JsonResponse

from typing import Union
from rest_framework import generics, status, viewsets
from rest_framework import status as status_codes
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404

from apps.finance.models import Invoice
from apps.jobs.constants import (
    ACCOUNT_COMPANY_NO_RELATION,
    ACCOUNT_COMPANY_OWN_RELATIONS,
    ACCOUNT_COMPANY_RELATION_OWNER,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    DEAL_MEMO,
    HOLD_MEMO,
    JOB_STATUS_ACTIVE,
    ACCOUNT_COMPANY_RELATION_OWNER,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    ACCOUNT_COMPANY_RELATION_COMMON_STAFF,
)

from apps.jobs.models import JobMemo, Job
from apps.jobs.utils import (
    get_dashboard_access_role_ids,
    get_exec_producer_id,
    get_line_producer_id,
)
from apps.sila_adapter.models import UserWallet, CorporateWallet, SilaUser, SilaCorporateMember

from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import (
    COMPANY_USER_TYPE,
    PRODUCER_USER_TYPE,
    BUSINESS_TYPES,
    COMPANY_TYPES, BUDDI_ADMIN, VIA_BUDDISYSTEMS,
)
from apps.user.models import (
    BenjiAccount,
    BenjiAccountActivationToken,
    BenjiAccountForgotPasswordToken,
    BenjiAccountInvitationToken,
    Company,
    CompanyAccessRequestToken,
    CompanyBenjiAccountEntry,
    UserActiveSince,
    UserAdvertisingAgency,
    UserAward,
    UserDirector,
    UserEducation,
    UserHeadline,
    UserPastClient,
    UserPress,
    UserProductionCompany,
    PrimarySkill,
    SecondarySkill,
    ToolAndTechnology,
    UserProducer,
    UserContact,
    GenericS3UploadedFile,
    CompanyLogout,
    DeleteUser,
    DeleteCompany,
    CompanySpecialities,
    CompanyPastClient,
    CompanyAward,
    CompanyPress,
)
from apps.user.serializers import (
    BenjiAccountSerializer,
    BenjiTokenObtainPairSerializer,
    CompanySerializer,
    SignupSerializer,
    UserProfileSerializer,
    UserPressSerializer,
    UserPrimarySkillSerializer,
    UserSecondarySkillSerializer,
    UserToolAndTechnologySerializer,
    UserAwardSerializer,
    UserEducationSerializer,
    UserProducerSerializer,
    UserContactSerializer,
    GenericS3UploadedFileSerializer,
    JobDocumentSerializer,
    CompanyLogoutSerializer,
    CompanyDeleteSerializer, CompanyPressSerializer, CompanyAwardSerializer,
)
from apps.user.utils import (
    get_account_own_company,
    get_company_owner,
    get_f_l_name,
    get_token,
    get_user_activation_expiry_time,
    resend_account_activation_email,
    send_access_request_to_owner,
    send_account_activation_email,
    send_approve_email_notification,
    send_decline_email_notification,
    send_invitation_to_owner_or_staff,
    update_skills_array,
    associate_connect_requests,
)
from apps.user.oauth import BuddiOAuth, ServiceCallerClient

logger = logging.getLogger(__name__)


class BenjiTokenObtainPairView(TokenObtainPairView):
    serializer_class = BenjiTokenObtainPairSerializer


class UserEntityList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = BenjiAccount.objects.all()
    serializer_class = BenjiAccountSerializer

    def get_queryset(self):
        return BenjiAccount.objects.all()


class ProducerEntityList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = BenjiAccount.objects.all()
    serializer_class = BenjiAccountSerializer

    def get_queryset(self):
        return BenjiAccount.objects.filter(
            type__in=[COMPANY_USER_TYPE, PRODUCER_USER_TYPE]
        )


class CompanyTypeViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk=None):
        resp = [
            {"companyTypeValue": x, "companyTypeName": y} for (x, y) in COMPANY_TYPES
        ]
        return Response(resp)


class BusinessTypeViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk=None):
        resp = [
            {"businessTypeValue": x, "businessTypeName": y} for (x, y) in BUSINESS_TYPES
        ]
        return Response(resp)


class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = BenjiAccount.objects.all()
    serializer_class = UserProfileSerializer

    def retrieve(self, request, pk=None):
        return super(UserProfileViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(UserProfileViewSet, self).partial_update(request=request, pk=pk)

    def update_profile(self, request, pk=None):  # noqa
        if not pk:
            raise NotImplementedError(
                "This API doesn't support execution missing user id."
            )
        try:
            user = BenjiAccount.objects.get(pk=pk)
        except BenjiAccount.DoesNotExist:
            return Response(
                f"BenjiAccount {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        response_data = {}
        if "headline" in request.data:
            user_headline, created_at = UserHeadline.objects.get_or_create(user=user)
            user_headline.headline = request.data["headline"]
            user_headline.save()
            response_data = {"headline": request.data["headline"]}
        if "active_since" in request.data:
            year = request.data["active_since"]["year"]
            month = request.data["active_since"]["month"]
            user_active_since, created_at = UserActiveSince.objects.get_or_create(
                user=user
            )
            user_active_since.year = year
            user_active_since.month = month
            user_active_since.save()
            response_data = {
                "active_since": {
                    "year": year,
                    "month": month,
                },
            }
        if "educations" in request.data:
            educations = request.data["educations"]
            for education in educations:
                education_id = education.get("id")
                if education_id:
                    education_obj = UserEducation.objects.get(id=education_id)
                    marked_for_delete = education.get("delete", False)
                    if marked_for_delete:
                        education_obj.delete()
                    else:
                        education_obj.university = education.get("university")
                        education_obj.degree = education.get("degree")
                        education_obj.study_field = education.get("study_field")
                        education_obj.start_year = education.get("start_year")
                        education_obj.end_year = education.get("end_year")
                        education_obj.save()
                else:
                    university = education.get("university")
                    degree = education.get("degree")
                    study_field = education.get("study_field")
                    start_year = education.get("start_year")
                    end_year = education.get("end_year")
                    education_obj = UserEducation.objects.create(
                        user=user,
                        university=university,
                        degree=degree,
                        study_field=study_field,
                        start_year=start_year,
                        end_year=end_year,
                    )
                    education_obj.save()
            response_data = {
                "educations": UserEducationSerializer(
                    user.education_user, many=True
                ).data
            }
        if "skills" in request.data:
            skill_key = "skills"
            primary_skills = update_skills_array(
                request, skill_key, "primary_skill", PrimarySkill, user
            )
            secondary_skills = update_skills_array(
                request, skill_key, "secondary_skill", SecondarySkill, user
            )
            tools_and_technologies = update_skills_array(
                request, skill_key, "tool_and_technology", ToolAndTechnology, user
            )
        if "directors" in request.data:
            directors = request.data["directors"]["directors"]
            directors_photography = request.data["directors"]["directors_photography"]
            user_director, created_at = UserDirector.objects.get_or_create(user=user)
            user_director.director = directors
            user_director.director_photography = directors_photography
            user_director.save()
            response_data = {
                "directors": {
                    "directors": directors,
                    "directors_photography": directors_photography,
                },
            }
        if "producers" in request.data:
            producers = request.data["producers"]
            user_producer, created_at = UserProducer.objects.get_or_create(user=user)
            user_producer.producer = producers
            user_producer.save()
            response_data = {
                "producers": {"producers": UserProducerSerializer(user_producer).data},
            }

        if "production_companies" in request.data:
            production_companies = request.data["production_companies"]
            (
                user_production_company,
                created_at,
            ) = UserProductionCompany.objects.get_or_create(user=user)
            user_production_company.production_company = production_companies
            user_production_company.save()
            response_data = {
                "production_companies": production_companies,
            }
        if "advertising_agencies" in request.data:
            advertising_agencies = request.data["advertising_agencies"]
            (
                user_advertising_agency,
                created_at,
            ) = UserAdvertisingAgency.objects.get_or_create(user=user)
            user_advertising_agency.advertising_agency = advertising_agencies
            user_advertising_agency.save()
            response_data = {
                "advertising_agencies": advertising_agencies,
            }
        if "past_clients" in request.data:
            past_clients = request.data["past_clients"]
            user_past_client, created_at = UserPastClient.objects.get_or_create(
                user=user
            )
            user_past_client.past_client = past_clients
            user_past_client.save()
            response_data = {
                "past_clients": past_clients,
            }
        if "awards" in request.data:
            awards = request.data["awards"]
            for award in awards:
                award_id = award.get("id")
                if award_id:
                    award_obj = UserAward.objects.get(id=award_id)
                    marked_for_delete = award.get("delete", False)
                    if marked_for_delete:
                        award_obj.delete()
                    else:
                        award_obj.award_title = award["title"]
                        award_obj.award_year = award.get("year")
                        award_obj.save()
                else:
                    title = award["title"]
                    year = award.get("year")
                    award_obj = UserAward.objects.create(
                        user=user, award_title=title, award_year=year
                    )
                    award_obj.save()
            response_data = {
                "awards": UserAwardSerializer(user.award_user, many=True).data
            }
        if "presses" in request.data:
            for press in request.data["presses"]:
                press_id = press.get("id")
                if press_id:
                    press_obj = UserPress.objects.get(id=press_id)
                    marked_for_delete = press.get("delete", False)
                    if marked_for_delete:
                        press_obj.delete()
                    else:
                        press_obj.description = press["description"]
                        press_obj.url = press.get("url")
                        press_obj.save()
                else:
                    press_description = press["description"]
                    press_url = press.get("url")
                    press_obj = UserPress.objects.create(
                        user=user, description=press_description, url=press_url
                    )
                    press_obj.save()

            response_data = {
                "presses": UserPressSerializer(user.presses, many=True).data
            }
        return Response(response_data, status=status.HTTP_200_OK)


class UserProfileSkillsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request):
        user_skills = UserSkill.objects.all()
        skills = []
        for user_skill in user_skills:
            primary_skill = user_skill.primary_skill
            secondary_skill = user_skill.secondary_skill
            resultList = list(set(primary_skill) | set(secondary_skill))
            skills = list(set(skills) | set(resultList))
        return Response(skills, status=status.HTTP_200_OK)


class UserContactViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserContactSerializer

    def retrieve(self, request, company_id=None):
        if company_id:
            entity = get_object_or_404(Company, id=company_id)
        else:
            entity = request.user
        source = request.GET.get("source")
        is_registered = request.GET.get("is_registered")
        status = request.GET.get("status")
        if isinstance(entity, Company):
            user_contacts = UserContact.objects.filter(company=entity)
        else:
            user_contacts = UserContact.objects.filter(user=entity)

        if source:
            user_contacts = user_contacts.filter(imported_from=source)

        if is_registered is not None:
            if is_registered == "false":
                _is_registered = False
            elif is_registered == "true":
                _is_registered = True
            else:
                return Response(UserContactSerializer([], many=True).data)

            user_contacts = list(
                filter(lambda u: u.is_registered is _is_registered, user_contacts)
            )

        if status:
            if status not in UserContact.SocialNetworkStatus:
                return Response(UserContactSerializer([], many=True).data)

            user_contacts = list(
                filter(lambda u: u.status == status, user_contacts)
            )

        return Response(UserContactSerializer(user_contacts, many=True).data)

    def bulk_add(self, request, company_id=None):
        contact_email_list = request.data.get("contact_email_list")
        if company_id:
            entity = get_object_or_404(Company, id=company_id)
        else:
            entity = request.user
        if contact_email_list and isinstance(entity, Company):
            for email in contact_email_list:
                UserContact.objects.get_or_create(
                    email=email.lower(), company=entity
                )
        elif contact_email_list and isinstance(entity, BenjiAccount):
            for email in contact_email_list:
                UserContact.objects.get_or_create(
                    email=email.lower(), user=entity
                )
        return self.retrieve(request)

    def delete(self, request, pk, company_id=None):
        if company_id:
            entity = get_object_or_404(Company, id=company_id)
        else:
            entity = request.user

        if isinstance(entity, Company):
            contact = UserContact.objects.get(pk=pk, company=entity)
        else:
            contact = UserContact.objects.get(pk=pk, user=entity)

        contact.delete()

        return self.retrieve(request)


class ContactImportAuthViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def auth_login(self, request, company_id=None):
        if company_id:
            entity = get_object_or_404(Company, id=company_id)
        else:
            entity = request.user
        service_provider = request.GET.get("service_provider")
        oauth_client = BuddiOAuth.get_client(service_provider, entity)
        auth_url = oauth_client.step1_get_authorize_url()
        return Response({"auth_url": auth_url})


class ContactOAuthCallbackView(viewsets.ViewSet):
    def callback(self, request):
        access_token = self.get_access_token(request)
        entity = self.get_buddi_entity(request)
        provider = self.get_oauth_provider(request)
        service_caller_client_class = ServiceCallerClient.get_client(provider)
        service_caller = service_caller_client_class(access_token)
        if provider == "GOOGLE":
            service_callback = partial(self.google_contact_sync, entity)
            params = {"pageSize": "100", "personFields": "names,emailAddresses,photos"}
            res, next_page_token = service_caller.call_api(
                "contact_info", params=params, callback=service_callback
            )
            while next_page_token is not None:
                params.update(pageToken=next_page_token)
                res, next_page_token = service_caller.call_api(
                    "contact_info", params=params, callback=service_callback
                )

        base_frontend_url = os.environ.get("FRONTEND_BASE_URL")
        if isinstance(entity, Company):
            frontend_target_url = base_frontend_url + f"/company-contact-import/{entity.id}/callback"
        else:
            frontend_target_url = base_frontend_url + "/contact-import/callback"

        return HttpResponseRedirect(frontend_target_url)

    def get_access_token(self, request):
        """A `code` for getting acess_token can only be called onece"""
        code = request.GET.get("code")
        state = request.GET.get("state")
        oauth_client = BuddiOAuth.get_client_by_state(state)
        credentials = oauth_client.step2_exchange(code)
        access_token_obj = credentials.get_access_token()
        access_token = access_token_obj.access_token

        return access_token

    def get_buddi_entity(self, request) -> Union[BenjiAccount, Company]:
        state = request.GET.get("state")
        user = BuddiOAuth.get_eneity_by_state(state)

        return user

    def get_oauth_provider(self, request) -> str:
        state = request.GET.get("state")
        oauth_provider = BuddiOAuth.get_oauth_provider_by_state(state)

        return oauth_provider

    @staticmethod
    def google_contact_sync(entity: Union[BenjiAccount, Company], response: requests.Response):
        response_data = response.json()
        next_page_token = response_data.get("nextPageToken")
        try:
            google_contacts = response_data["connections"]
        except KeyError:
            logger.info(f"{entity.__class__} id={entity.id} does not have contacts on Google")

            return None

        google_contacts = filter(
            lambda x: x.get("emailAddresses") is not None, google_contacts
        )
        for contact in google_contacts:
            try:
                display_name = contact["names"][0]["displayName"]
            except KeyError:
                # Google contact may not have `names` field returned
                display_name = ""

            email = contact["emailAddresses"][0]["value"]
            profile_photo_url = contact["photos"][0]["url"]
            if isinstance(entity, Company):
                UserContact.objects.get_or_create(
                    company=entity,
                    email=email.lower(),
                    defaults={
                        "imported_from": UserContact.ContactSourceChoice.GOOGLE,
                        "display_name": display_name,
                        "profile_photo_url": profile_photo_url,
                        "is_personal": False
                    },
                )
            else:
                UserContact.objects.get_or_create(
                    user=entity,
                    email=email.lower(),
                    defaults={
                        "imported_from": UserContact.ContactSourceChoice.GOOGLE,
                        "display_name": display_name,
                        "profile_photo_url": profile_photo_url,
                    },
                )

        return next_page_token


class PasswordViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer

    def change_password(self, request):
        user = request.user
        new_password = request.data.get("new_password")
        changed = False
        if new_password:
            user.set_password(new_password)
            user.save()
            changed = True
        return Response({"Success": changed}, status=status.HTTP_200_OK)


class SignupViewSet(viewsets.ModelViewSet):
    queryset = BenjiAccount.objects.all()
    serializer_class = SignupSerializer

    def create(self, request):
        existing_email = request.data.get("email")
        try:
            existing_user = BenjiAccount.objects.get(email__iexact=existing_email)
            if not existing_user.is_active:
                resend_account_activation_email(existing_user)
                return Response({"email": [
                    "The account with this email already exists, we sent you an activation link. Check your email and click on the link to verify."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except BenjiAccount.DoesNotExist:
            pass

        signup_serializer = SignupSerializer(data=request.data)
        if signup_serializer.is_valid(raise_exception=True):
            user = signup_serializer.create()
        send_account_activation_email(user)
        return Response(
            self.serializer_class(instance=user).data, status=status.HTTP_201_CREATED
        )

    def resend_email(self, request):
        email = request.data["email"]
        try:
            user = BenjiAccount.objects.get(email__iexact=email)
        except BenjiAccount.DoesNotExist:
            return Response(
                "This email does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        resend_account_activation_email(user)
        return Response(
            self.serializer_class(instance=user).data, status=status.HTTP_201_CREATED
        )

    def signup_verification(self, request, token=None):
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            benji_account_activation_token = BenjiAccountActivationToken.objects.get(
                token=token
            )
            email = benji_account_activation_token.email
            user = BenjiAccount.objects.get(email__iexact=email)
            if user.is_active:
                return Response(
                    {"error": "Your account has already been activated."},
                    status=status.HTTP_200_OK,
                )
            if timezone.now() <= benji_account_activation_token.expiry:
                user.is_active = True
                user.save()
                associate_connect_requests(user=user)
                return Response(
                    BenjiAccountSerializer(instance=user).data,
                    status=status.HTTP_200_OK,
                )
            else:
                user.delete()
                benji_account_activation_token.delete()
                return Response(
                    {
                        "error": "Your email verification request is expired. Please sign up again."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except BenjiAccountActivationToken.DoesNotExist:
            return Response(
                {"error": "An error occurred verifying your email."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def forgot_password(self, request):
        email = request.data["email"]
        try:
            user = BenjiAccount.objects.get(email__iexact=email)
        except BenjiAccount.DoesNotExist:
            return Response(
                "This email does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        if not user.is_active:
            return Response(
                "This user is not activated yet.", status=status.HTTP_400_BAD_REQUEST
            )
        token = get_token()
        BenjiAccountForgotPasswordToken.objects.create(
            user=user, token=token, expiry=get_user_activation_expiry_time()
        )
        send_email_template.delay(
            from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
            recipient_list=[user.email],
            email_template_id=os.getenv(
                "EMAIL_TEMPLATE_FORGOT_PASSWORD_NOTIFICATION_ID"
            ),
            substitutions={
                "reset_password_url": f"{settings.FRONTEND_BASE_URL}/reset-password/?token={token}&email={user.email}",
            },
            sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
        )
        return Response({"Success": True}, status=status.HTTP_200_OK)

    def reset_password(self, request):
        token = request.data["token"]
        password = request.data["password"]
        try:
            forgot_password_token = BenjiAccountForgotPasswordToken.objects.get(
                token=token
            )
            if timezone.now() <= forgot_password_token.expiry:
                user = forgot_password_token.user
                user.set_password(password)
                user.save()
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[user.email],
                    email_template_id=os.getenv(
                        "EMAIL_TEMPLATE_PASSWORD_CHANGED_NOTIFICATION_ID"
                    ),
                    substitutions={
                        "full_name": f"{user.full_name}",
                    },
                    sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
                )
            else:
                return Response(
                    {"error": "This reset password request is expired."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except BenjiAccountForgotPasswordToken.DoesNotExist:
            return Response(
                {"error": "This reset password link is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"Success": True}, status=status.HTTP_200_OK)

    def validate_reset_password(self, request, token=None):  # noqa
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            forgot_password_token = BenjiAccountForgotPasswordToken.objects.get(
                token=token
            )
            if timezone.now() <= forgot_password_token.expiry:
                return Response({"Success": True}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "This reset password request is expired."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except BenjiAccountForgotPasswordToken.DoesNotExist:
            return Response(
                {"error": "This reset password link is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def verify_memo_invitation(self, request, token=None):  # noqa
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            invitation_token = BenjiAccountInvitationToken.objects.get(token=token)
        except BenjiAccountInvitationToken.DoesNotExist:
            return Response(
                {"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )
        user = invitation_token.user
        try:
            BenjiAccountActivationToken.objects.get(email=user.email)
            user.is_active = True
            user.save()
        except BenjiAccountActivationToken.DoesNotExist:
            pass
        if invitation_token.relationship == ACCOUNT_COMPANY_RELATION_OWNER:
            CompanyBenjiAccountEntry.objects.filter(
                Q(company=invitation_token.company)
                & Q(relationship=ACCOUNT_COMPANY_NO_RELATION)
                & Q(dashboard_access=False)
            ).update(dashboard_access=True)
        if user.is_active:
            response_data = BenjiAccountSerializer(instance=user).data
            response_data["registered"] = True
            return Response(response_data, status=status.HTTP_200_OK)
        if timezone.now() <= invitation_token.expiry:
            user.profile_completed = True
            user.save()
            response_data = BenjiAccountSerializer(instance=user).data
            response_data["registered"] = False
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Token is expired."}, status=status.HTTP_400_BAD_REQUEST
            )

    def verify_invitation(self, request, token=None):  # noqa
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            cart = CompanyAccessRequestToken.objects.get(token=token)
            cart_exists = True
        except CompanyAccessRequestToken.DoesNotExist:
            cart_exists = False
        if cart_exists:
            owner = get_company_owner(cart.company)
            try:
                BenjiAccountActivationToken.objects.get(email=owner.email)
                owner.is_active = True
                owner.save()
            except BenjiAccountActivationToken.DoesNotExist:
                pass
            if owner.is_active:
                response_data = BenjiAccountSerializer(instance=owner).data
                response_data["registered"] = True
                return Response(response_data, status=status.HTTP_200_OK)
            if timezone.now() <= cart.expiry:
                response_data = BenjiAccountSerializer(instance=owner).data
                response_data["registered"] = False
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Token is expired."}, status=status.HTTP_400_BAD_REQUEST
                )
        try:
            invitation_token = BenjiAccountInvitationToken.objects.get(token=token)
            invitation_exists = True
        except BenjiAccountInvitationToken.DoesNotExist:
            invitation_exists = False
        if invitation_exists:
            user = invitation_token.user
            try:
                BenjiAccountActivationToken.objects.get(email=user.email)
                user.is_active = True
                user.save()
            except BenjiAccountActivationToken.DoesNotExist:
                pass
            if invitation_token.relationship == ACCOUNT_COMPANY_RELATION_OWNER:
                CompanyBenjiAccountEntry.objects.filter(
                    Q(company=invitation_token.company)
                    & Q(relationship=ACCOUNT_COMPANY_NO_RELATION)
                    & Q(dashboard_access=False)
                ).update(dashboard_access=True)
            if user.is_active:
                response_data = BenjiAccountSerializer(instance=user).data
                response_data["registered"] = True
                return Response(response_data, status=status.HTTP_200_OK)
            if timezone.now() <= invitation_token.expiry:
                user.profile_completed = True
                user.save()
                response_data = BenjiAccountSerializer(instance=user).data
                response_data["registered"] = False
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Token is expired."}, status=status.HTTP_400_BAD_REQUEST
                )
        if not invitation_exists and not cart_exists:
            return Response(
                {"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )

    def partial_update(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing id.")
        try:
            benji_account = BenjiAccount.objects.get(pk=pk)
            benji_account.job_title = request.data["job_title"]
            benji_account.full_name = request.data["full_name"]
            benji_account.set_password(request.data["password"])
            benji_account.is_active = True
            benji_account.profile_completed = False
            benji_account.save()
            return Response({"Success": True}, status=status.HTTP_201_CREATED)
        except BenjiAccount.DoesNotExist:
            return Response(
                f"Benji Account {pk} does not exist.",
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserViewSet(viewsets.ModelViewSet):
    queryset = BenjiAccount.objects.all()
    serializer_class = BenjiAccountSerializer

    def profile_completed(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing id.")
        user_type = request.data["type"]
        try:
            user = BenjiAccount.objects.get(pk=pk)
            user.profile_completed = True
            user.type = user_type
            user.save()
        except BenjiAccount.DoesNotExist:
            return Response(
                f"Benji Account {pk} does not exist.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        send_email_template.delay(
            from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
            recipient_list=[user.email],
            email_template_id=os.getenv("EMAIL_TEMPLATE_SETUP_BUDDI_WALLET_NOTIFICATION_ID"),
            substitutions={
                "account_name": user.full_name,
                "accept_url": settings.FRONTEND_BASE_URL + '/wallet',
            },
            sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
        )
        return Response(
            self.serializer_class(instance=user).data, status=status.HTTP_200_OK
        )

    def update_user(self, request, pk=None):
        return super(UserViewSet, self).partial_update(request=request, pk=pk)


class CrewUserViewSet(viewsets.ModelViewSet):
    queryset = BenjiAccount.objects.all()
    serializer_class = BenjiAccountSerializer

    def update_crew(self, request, pk=None):
        return super(CrewUserViewSet, self).partial_update(request=request, pk=pk)


class ProducerUserViewSet(viewsets.ModelViewSet):
    queryset = BenjiAccount.objects.all()
    serializer_class = BenjiAccountSerializer

    def update_producer(self, request, pk=None):
        return super(ProducerUserViewSet, self).partial_update(request=request, pk=pk)


class CompanyUserViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        companies = Company.objects.all()
        return Response(
            self.serializer_class(companies, many=True).data, status=status.HTTP_200_OK
        )

    def get_company_by_email(self, request):
        owner_email = request.data["owner_email"]
        try:
            company = Company.objects.get(owner_email__iexact=owner_email)
            company = CompanySerializer(instance=company).data
        except Company.DoesNotExist:
            company = {}
        return Response(company, status=status.HTTP_200_OK)

    def update_company(self, request, pk=None):
        response_data = super(CompanyUserViewSet, self).partial_update(
            request=request, pk=pk
        )
        try:
            company = Company.objects.get(pk=pk)
            if "past_clients" in request.data:
                past_clients = request.data["past_clients"]
                company_past_client, created_at = CompanyPastClient.objects.get_or_create(
                    company=company
                )
                company_past_client.past_client = past_clients
                company_past_client.save()
                response_data["past_clients"] = company_past_client.past_client
            if "awards" in request.data:
                awards = request.data["awards"]
                for award in awards:
                    award_id = award.get("id")
                    if award_id:
                        award_obj = CompanyAward.objects.get(id=award_id)
                        marked_for_delete = award.get("delete", False)
                        if marked_for_delete:
                            award_obj.delete()
                        else:
                            award_obj.award_title = award["award_title"]
                            award_obj.award_year = award.get("award_year")
                            award_obj.save()
                    else:
                        title = award["award_title"]
                        year = award.get("award_year")
                        award_obj = CompanyAward.objects.create(
                            company=company, award_title=title, award_year=year
                        )
                        award_obj.save()
                    response_data["awards"] = CompanyAwardSerializer(company.award_company, many=True).data

            if "presses" in request.data:
                for press in request.data["presses"]:
                    press_id = press.get("id")
                    if press_id:
                        press_obj = CompanyPress.objects.get(id=press_id)
                        marked_for_delete = press.get("delete", False)
                        if marked_for_delete:
                            press_obj.delete()
                        else:
                            press_obj.description = press["description"]
                            press_obj.url = press.get("url")
                            press_obj.save()
                    else:
                        press_description = press["description"]
                        press_url = press.get("url")
                        press_obj = CompanyPress.objects.create(
                            company=company, description=press_description, url=press_url
                        )
                        press_obj.save()
                    response_data["presses"] = CompanyPressSerializer(company.presses, many=True).data

            if "specialities" in request.data:
                specialities = request.data["specialities"]
                company_specialities, created_at = CompanySpecialities.objects.get_or_create(
                    company=company
                )
                company_specialities.specialities = specialities
                company_specialities.save()
                response_data["specialities"] = company_specialities.specialities

            creator_email = request.data.pop("creator_email")
            creator = BenjiAccount.objects.get(email__iexact=creator_email)
            send_access_request_to_owner(company, creator, request.data["owner_email"])
        except KeyError:
            pass
        return JsonResponse(response_data.data, status=status.HTTP_200_OK)

    def create_company(self, request):  # noqa
        # if owner itself creates account then creator and owner will be the same.
        if request.data.get('is_owner'):
            request.data['owner_email'] = request.data['creator_email']

        creator_email = request.data.pop("creator_email")
        creator = BenjiAccount.objects.get(email__iexact=creator_email)
        company_serializer = CompanySerializer(data=request.data)
        if company_serializer.is_valid(raise_exception=True):
            company = company_serializer.save()
        send_access_request_to_owner(company, creator, request.data["owner_email"])
        return Response(
            self.serializer_class(instance=company).data, status=status.HTTP_201_CREATED
        )

    def retrieve(self, request, pk=None):
        company = super(CompanyUserViewSet, self).retrieve(request=request, pk=pk)
        company.data["is_owner"] = request.user.email == company.data["owner_email"]
        return company

    def destroy(self, request, pk=None):
        benji_user = request.user
        benji_user.type = None
        benji_user.save()
        return super(CompanyUserViewSet, self).destroy(request=request, pk=pk)


class InviteCompanyStaffViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanySerializer

    def create(self, request):
        company = Company.objects.get(pk=request.data["company_id"])
        staffs = request.data["staffs"]
        response_data = []
        for staff in staffs:
            first_name, last_name = get_f_l_name(staff["full_name"])
            email = staff["email"]
            staff, created = BenjiAccount.objects.get_or_create(
                defaults={"email": email.lower()}, email__iexact=email
            )
            if created:
                staff.is_active = False
            staff.first_name = first_name
            staff.last_name = last_name
            staff.save()
            data = send_invitation_to_owner_or_staff(
                request.user, staff, company, ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF
            )
            if not bool(data):
                response_data.append(
                    {"email": email, "success": "Invited successfully"}
                )
            else:
                response_data.append(data)
        return Response(response_data, status=status.HTTP_200_OK)


class AcceptCompanyAccessTokenViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)

    def retrieve(self, request, token=None):
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            cart = CompanyAccessRequestToken.objects.get(token=token)
            if timezone.now() <= cart.expiry:
                pcbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    benji_account=cart.user, company=cart.company
                )
                pcbae.dashboard_access = True
                pcbae.save()
                send_approve_email_notification(cart.user, cart.company)
                return Response(
                    f"{settings.FRONTEND_BASE_URL}/signup/?token={token}",
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Token is expired. "}, status=status.HTTP_400_BAD_REQUEST
                )
        except CompanyAccessRequestToken.DoesNotExist:
            return Response(
                {"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )


class DeclineCompanyAccessToken(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)

    def retrieve(self, request, token=None):
        if not token:
            raise NotImplementedError(
                "This API doesn't support execution missing token."
            )
        try:
            cart = CompanyAccessRequestToken.objects.get(token=token)
            if timezone.now() <= cart.expiry:
                pcbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    benji_account=cart.user, company=cart.company
                )
                pcbae.dashboard_access = False
                pcbae.save()
                send_decline_email_notification(cart.user, cart.company)
                return Response(
                    f"{settings.FRONTEND_BASE_URL}/signup/?token={token}",
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Token is expired. "}, status=status.HTTP_400_BAD_REQUEST
                )
        except CompanyAccessRequestToken.DoesNotExist:
            return Response(
                {"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET"])  # noqa
@permission_classes((IsAuthenticated,))
def retrieve_auth_profile(request):
    data = {}
    data["user"] = BenjiAccountSerializer(instance=request.user).data
    # Get its related production company
    company_benji_account_entries = CompanyBenjiAccountEntry.objects.filter(
        benji_account=request.user,
        relationship__in=ACCOUNT_COMPANY_OWN_RELATIONS,
        dashboard_access=True
    )

    company = []
    company_titles = []
    for company_benji_account_entry in company_benji_account_entries:
        if CompanyLogout.objects.filter(user=request.user, company=company_benji_account_entry.company).count() > 0:
            continue
        own_company = company_benji_account_entry.company
        relationship = company_benji_account_entry.relationship
        own_company = CompanySerializer(instance=own_company).data
        own_company["relationship"] = relationship
        company.append(own_company)
        company_titles.append(own_company["title"])
    job_memos = JobMemo.objects.filter(benji_account=request.user, accepted=True)
    for job_memo in job_memos:

        # hide company
        if job_memo.job.is_archived:
            continue

        job_role = job_memo.job_role
        job = job_role.job_role_group.job
        job_company = job_role.job_role_group.job.company
        if (
                CompanyLogout.objects.filter(user=request.user, company=job_company).count()
                > 0
        ):
            continue
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        add_company = False
        if job_role.pk in [get_exec_producer_id(job), get_line_producer_id(job)]:
            if job_memo.memo_type == DEAL_MEMO:
                add_company = True
            else:
                if memo_type == HOLD_MEMO:
                    add_company = True
                else:
                    try:
                        deal_memo = JobMemo.objects.get(
                            job_role=job_role,
                            memo_type=DEAL_MEMO,
                            benji_account=job_memo.benji_account,
                        )
                        if not deal_memo.decline:
                            add_company = True
                    except JobMemo.DoesNotExist:
                        add_company = False
        elif job_role.pk in get_dashboard_access_role_ids(job):
            if DEAL_MEMO == job_memo.memo_type and job_memo.booked:
                add_company = True
        if add_company:
            title = job_role.job_role_group.job.company.title
            if title not in company_titles:
                try:
                    pc_data = CompanySerializer(
                        instance=job_role.job_role_group.job.company
                    ).data
                    pc_data["relationship"] = CompanyBenjiAccountEntry.objects.get(
                        benji_account=request.user,
                        company=job_role.job_role_group.job.company,
                        # dashboard_access=True,
                        # need to grant permissions while creation memo for this two roles
                    ).relationship
                    company.append(pc_data)
                except:
                    title = None
            if title:
                company_titles.append(title)

    # region Sila Business Member Allow

    if hasattr(request.user, 'sila_user'):
        current_sila_user = request.user.sila_user
        corporate_members = SilaCorporateMember.objects.filter(sila_user=current_sila_user).distinct()
        for corporate_member in corporate_members:
            my_company_title = corporate_member.sila_corporate.company.title
            if my_company_title in company_titles:
                continue
            my_company = corporate_member.sila_corporate.company
            relationship = corporate_member.role
            my_company = CompanySerializer(instance=my_company).data
            my_company["relationship"] = relationship
            company.append(my_company)
            company_titles.append(my_company["title"])
    # endregion Sila Business Member Allow

    data["company"] = company
    return Response(data)


@api_view(["POST", "GET"])
@permission_classes((IsAuthenticated,))
def retrieve_company_profile(request, pk=None):
    if not pk:
        raise NotImplementedError("This API doesn't support execution missing id.")
    if request.method == "GET":
        try:
            company = Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            return Response(
                f"Company {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        owner_account = CompanyBenjiAccountEntry.objects.get(
            company=company,
            relationship=ACCOUNT_COMPANY_RELATION_OWNER,
        ).benji_account
    elif request.method == "POST":
        owner_account_data = request.data.pop("owner")
        owner_account_data = {
            "first_name": owner_account_data["first_name"],
            "last_name": owner_account_data["last_name"],
            "job_title": owner_account_data["job_title"],
            "id": owner_account_data["id"],
        }
        company = request.data
        company = Company.objects.filter(pk=company["id"])
        company.update(**request.data)
        company = company.first()
        owner_account = BenjiAccount.objects.filter(pk=owner_account_data["id"])
        owner_account.update(**owner_account_data)
        owner_account = owner_account.first()
    result = CompanySerializer(instance=company).data
    result["owner"] = BenjiAccountSerializer(instance=owner_account).data
    return Response(result)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_company_by_id(request, pk=None):
    if not pk:
        raise NotImplementedError("This API doesn't support execution missing id.")
    try:
        company = Company.objects.get(pk=pk)
    except Company.DoesNotExist:
        return Response("Company does not exist.", status=status.HTTP_400_BAD_REQUEST)
    result = CompanySerializer(instance=company).data
    return Response(result)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_company_by_user(request, pk=None):
    if not pk:
        raise NotImplementedError("This API doesn't support execution missing id.")
    try:
        benji_account = BenjiAccount.objects.get(pk=pk)
    except BenjiAccount.DoesNotExist:
        return Response(
            "BenjiAccount does not exist.", status=status.HTTP_400_BAD_REQUEST
        )
    results = get_account_own_company(benji_account)
    return Response(results)


class GenericS3UploadedFileViewSet(viewsets.ModelViewSet):
    queryset = GenericS3UploadedFile.objects.all()
    serializer_class = GenericS3UploadedFileSerializer

    def create(self, request, pk):
        data = request.data
        data["user"] = pk
        GenericS3UploadedFile.objects.filter(
            user=request.user, purpose=data["purpose"]
        ).delete()
        pre_obj = GenericS3UploadedFileSerializer(data=data)
        if pre_obj.is_valid():
            obj = pre_obj.save()
        else:
            return Response(data=pre_obj.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=GenericS3UploadedFileSerializer(obj).data)

    def delete(self, request, pk_user, pk_doc):
        doc = GenericS3UploadedFile.objects.get(user=request.user, id=pk_doc)
        doc.delete()
        return Response({"status": "ok"})


class CompanyDocumentViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobDocumentSerializer

    def list(self, request, pk):
        jobs = Job.objects.filter(company_id=pk, status="WRAPPED")
        return Response(data=JobDocumentSerializer(jobs, many=True).data)

    def list_w9(self, request, company_pk, job_pk):
        job = Job.objects.get(id=job_pk, company_id=company_pk, status="WRAPPED")
        users = (jm.benji_account for jm in job.job_memos.filter(memo_type="DEAL"))
        docs = GenericS3UploadedFile.objects.filter(user__in=users, purpose="w9")
        return Response(data=GenericS3UploadedFileSerializer(docs, many=True).data)

    def list_invoice(self, request, company_pk, job_pk):
        job = Job.objects.get(id=job_pk, company_id=company_pk, status="WRAPPED")
        invoices = Invoice.objects.filter(
            invoice_memo__job_memo__job=job, invoice_memo__job_memo__memo_type="DEAL"
        )
        resp = []
        for invoice in invoices:
            user = invoice.benji_account
            resp_obj = {
                "file_name": f"Invoice_{'_'.join(user.full_name.split(' '))}.pdf",
                "invoice_id": invoice.id,
            }
            resp.append(resp_obj)

        return Response(data=resp)


class CompanyLogoutViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanyLogoutSerializer

    def logout_company(self, request, company_id):
        user = request.user
        company = Company.objects.get(id=company_id)
        logout, _ = CompanyLogout.objects.get_or_create(user=user, company=company)
        logout.save()
        return Response(data={"status": "ok"})


class CompanyDeleteViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanyDeleteSerializer

    def check_balance(self, request, pk):
        company = get_object_or_404(Company, pk=pk)
        try:
            if hasattr(company, 'sila_corporate'):
                sila_corporate = company.sila_corporate
                wallets = CorporateWallet.objects.filter(
                    sila_corporate=sila_corporate,
                ).values('balance')

                for wallet in wallets:
                    if wallet['balance']:
                        return Response({"status": "you still have balance in your wallet"},
                                        status=status_codes.HTTP_200_OK)

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})
        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)

    def delete(self, request, pk):
        data = request.data

        user = request.user
        company = get_object_or_404(Company, pk=pk)
        owner = CompanyBenjiAccountEntry.objects.filter(
            benji_account=user,
            company=company,
            relationship=ACCOUNT_COMPANY_RELATION_OWNER
        ).exists()

        if not owner:
            return Response({"status": "user does not have access to company"}, status=status_codes.HTTP_200_OK)

        try:

            password = request.data.get("password")
            valid = user.check_password(password)
            if valid:
                if hasattr(company, 'sila_corporate'):
                    sila_corporate = company.sila_corporate
                    wallets = CorporateWallet.objects.filter(
                        sila_corporate=sila_corporate,
                    ).delete()

                CompanyBenjiAccountEntry.objects.filter(company=company).delete()
                reason = data.get("reason")

                delete_obj = DeleteCompany.objects.filter(type=company.type, title=company.title)
                if delete_obj:
                    delete_obj.update(email=company.email,
                                      review=reason)
                else:
                    DeleteCompany.objects.create(type=company.type, title=company.title, email=company.email,
                                                 review=reason)
                company.delete()

            else:
                return Response({"status": "Incorrect password"}, status=status_codes.HTTP_200_OK)

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})

        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)


class UserDeleteViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanyDeleteSerializer

    def check_balance(self, request):
        user = request.user
        try:
            companies = CompanyBenjiAccountEntry.objects.filter(benji_account=user,
                                                                relationship=ACCOUNT_COMPANY_RELATION_OWNER)
            for company in companies:
                if hasattr(company, 'sila_corporate'):
                    sila_corporate = company.sila_corporate
                    wallets = CorporateWallet.objects.filter(
                        sila_corporate=sila_corporate,
                    ).values('balance')
                    for wallet in wallets:
                        if wallet['balance']:
                            return Response({"status": "you still have balance in your wallet"},
                                            status=status_codes.HTTP_200_OK)

            if hasattr(user, 'sila_user'):
                sila_user = user.sila_user
                user_wallet = UserWallet.objects.filter(
                    sila_user=sila_user,
                ).values('balance')
                for wallet in user_wallet:
                    if wallet['balance']:
                        return Response({"status": "you still have balance in your wallet"},
                                        status=status_codes.HTTP_200_OK)
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})
        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)

    def delete(self, request):
        data = request.data
        user = request.user

        try:
            password = request.data.get("password")
            valid = user.check_password(password)
            if valid:
                companies = CompanyBenjiAccountEntry.objects.filter(benji_account=user,
                                                                    relationship=ACCOUNT_COMPANY_RELATION_OWNER)

                if hasattr(user, 'sila_user'):
                    sila_user = user.sila_user
                    wallets = UserWallet.objects.filter(
                        sila_user=sila_user,
                    ).delete()

                for company_entry in companies:
                    if hasattr(company_entry, 'sila_corporate'):
                        sila_corporate = company_entry.sila_corporate
                        wallets = CorporateWallet.objects.filter(
                            sila_corporate=sila_corporate,
                        ).delete()
                    company_entry.company.delete()

                reason = data.get("option")
                review = data.get("otherReason")
                delete_obj = DeleteUser.objects.filter(email=user.email)
                if delete_obj:
                    delete_obj.update(reason=reason, review=review)
                else:
                    DeleteUser.objects.create(email=user.email, reason=reason, review=review)
                user.delete()

            else:
                return Response({"status": "you entered incorrect password"}, status=status_codes.HTTP_200_OK)

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)})

        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)


class NeedHelpViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def need_help(self, request):
        data = request.data
        send_email_template.delay(
            from_email=request.user.email,
            recipient_list=[os.getenv("INFO_FROM_EMAIL")],
            email_template_id=os.getenv("EMAIL_TEMPLATE_NEED_HELP_NOTIFICATION"),
            substitutions={"support_title": "Buddi support",
                           "user_request": request.user.full_name,
                           "title": data['subject'],
                           "message": data['message']},
            sender_name=f"{BUDDI_ADMIN if not request.user.full_name else request.user.full_name} {VIA_BUDDISYSTEMS}"
        )

        return Response({"status": "ok"}, status=status_codes.HTTP_200_OK)
