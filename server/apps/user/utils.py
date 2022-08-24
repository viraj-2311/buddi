import copy
import datetime
import os
import random
import string

from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response

from apps.jobs.constants import (
    ACCOUNT_COMPANY_CONTRACTOR_RELATIONS,
    ACCOUNT_COMPANY_NO_RELATION,
    ACCOUNT_COMPANY_OWN_RELATIONS,
    ACCOUNT_COMPANY_RELATION_CONTRACTOR,
    ACCOUNT_COMPANY_RELATION_OWNER,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    ACCOUNT_COMPANY_RELATIONS,
)
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import COMPANY_USER_TYPE, BUDDI_ADMIN, VIA_BUDDISYSTEMS
from apps.user.models import (
    BenjiAccount,
    BenjiAccountActivationToken,
    BenjiAccountInvitationToken,
    CompanyAccessRequestToken,
    CompanyBenjiAccountEntry,
    UserContact,
)
from apps.user.serializers import CompanySerializer


def send_account_activation_email(user):
    token = get_token()
    BenjiAccountActivationToken.objects.create(email=user.email,
                                               token=token,
                                               expiry=get_user_activation_expiry_time())
    send_email_template.delay(
        from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
        recipient_list=[user.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_ACTIVATION_ID"),
        substitutions={
            "full_name": f"{user.full_name}",
            "email": f"{user.email}",
            "activation_url": f"{settings.FRONTEND_BASE_URL}/verification/?token={token}&email={user.email}",
        },
        sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}",
    )


def resend_account_activation_email(user):
    token = get_token()
    try:
        benji_account_activation_token = BenjiAccountActivationToken.objects.get(email=user.email)
        benji_account_activation_token.token = token
        benji_account_activation_token.save()
        send_email_template.delay(
            from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
            recipient_list=[user.email],
            email_template_id=os.getenv("EMAIL_TEMPLATE_ACTIVATION_ID"),
            substitutions={
                "full_name": f"{user.full_name}",
                "email": f"{user.email}",
                "activation_url": f"{settings.FRONTEND_BASE_URL}/verification/?token={token}&email={user.email}",
            },
            sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
        )
    except BenjiAccountActivationToken.DoesNotExist:
        user.delete()
        return Response({"error": "An unexpected problem occurred. Please sign up again"},
                        status=status.HTTP_400_BAD_REQUEST)


def get_f_l_name(full_name):
    first_name = full_name.split()[0]
    try:
        last_name = full_name.split()[1]
    except IndexError:
        last_name = ""
    return first_name, last_name


def get_token():
    return "".join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(25))


def get_user_activation_expiry_time():
    return timezone.now() + datetime.timedelta(hours=settings.ACTIVATION_TOKEN_EXPIRY)


def is_user_internal_staff(user, company, no_relation_included=True):
    try:
        pcba = CompanyBenjiAccountEntry.objects.only('relationship').get(benji_account=user,
                                                                         company=company)
        owner_relationships = copy.deepcopy(ACCOUNT_COMPANY_OWN_RELATIONS)
        if not no_relation_included:
            owner_relationships.remove(ACCOUNT_COMPANY_NO_RELATION)
        return pcba.relationship in owner_relationships
    except CompanyBenjiAccountEntry.DoesNotExist:
        return False


def is_user_contractor(user, company):
    try:
        pcba = CompanyBenjiAccountEntry.objects.only('relationship').get(benji_account=user,
                                                                         company=company)
        if pcba.relationship in ACCOUNT_COMPANY_CONTRACTOR_RELATIONS:
            return True
    except CompanyBenjiAccountEntry.DoesNotExist:
        return False
    return False


def does_user_have_relationship(user, company):
    try:
        pcba = CompanyBenjiAccountEntry.objects.get(benji_account=user,
                                                    company=company)
        if pcba.relationship in ACCOUNT_COMPANY_RELATIONS:
            return True
    except CompanyBenjiAccountEntry.DoesNotExist:
        return False
    return False


def get_company_owner(company):
    return CompanyBenjiAccountEntry.objects.get(company=company,
                                                relationship=ACCOUNT_COMPANY_RELATION_OWNER).benji_account


def get_account_own_company(user):
    own_companies = CompanyBenjiAccountEntry.objects.filter(
        Q(benji_account=user) &
        (Q(relationship=ACCOUNT_COMPANY_RELATION_OWNER) |
         Q(relationship=ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF)))
    results = []
    for own_company in own_companies:
        results.append(CompanySerializer(instance=own_company.company).data)
    return results


def get_account_company_relationship(company, user):
    filter_criteria = {"benji_account": user}
    if company:
        filter_criteria["company"] = company
    try:
        return CompanyBenjiAccountEntry.objects.only('relationship').get(**filter_criteria).relationship
    except CompanyBenjiAccountEntry.DoesNotExist:
        return ""


def get_all_accounts_in_the_system(relationship=None):
    filter_criteria = {}
    if relationship:
        filter_criteria["relationship"] = relationship
    users_list = CompanyBenjiAccountEntry.objects.filter(
        **filter_criteria).values_list("benji_account", flat=True)
    return users_list


def get_all_internal_staffs_in_the_company(company):
    return (CompanyBenjiAccountEntry.objects.filter(
        company=company, relationship__in=ACCOUNT_COMPANY_OWN_RELATIONS,
    ).values_list("benji_account", flat=True).distinct())


def set_contractor_relationship(benji_account, company):
    try:
        CompanyBenjiAccountEntry.objects.get(benji_account=benji_account,
                                             company=company)
    except CompanyBenjiAccountEntry.DoesNotExist:
        CompanyBenjiAccountEntry(benji_account=benji_account,
                                 company=company,
                                 relationship=ACCOUNT_COMPANY_RELATION_CONTRACTOR).save()


def send_invitation_to_owner_or_staff(invitor, owner, company, relationship):
    token = get_token()
    try:
        bait = BenjiAccountInvitationToken.objects.get(user=owner,
                                                       company=company)
        bait.relationship = relationship
        bait.expiry = get_user_activation_expiry_time()
        bait.save()
    except BenjiAccountInvitationToken.DoesNotExist:
        bait = BenjiAccountInvitationToken(user=owner,
                                           company=company,
                                           expiry=get_user_activation_expiry_time(),
                                           token=token,
                                           relationship=relationship)
        bait.save()
    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[owner.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_COMPANY_STAFF_INVITATION_ID"),
        substitutions={
            "owner": invitor.get_full_name(),
            "company_title": company.title,
            "first_name": owner.first_name,
            "last_name": owner.last_name,
            "activation_url": f"{settings.FRONTEND_BASE_URL}/signup/?token={bait.token}&email={owner.email}",
        },
        sender_name=f"{BUDDI_ADMIN if not invitor.get_full_name() else invitor.get_full_name()} {VIA_BUDDISYSTEMS}"
    )
    pcbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
        benji_account=owner,
        company=company)
    pcbae.relationship = relationship
    pcbae.dashboard_access = True
    pcbae.save()
    return {}


def can_send_access_request_email(company, creator):
    invitor_relationship = get_account_company_relationship(company, creator)
    if invitor_relationship in ACCOUNT_COMPANY_OWN_RELATIONS:
        return False
    return True


def send_access_request_to_owner(company, creator, owner_email):
    owner, owner_created = BenjiAccount.objects.get_or_create(defaults={"email": owner_email},
                                                              email__iexact=owner_email)
    if owner_created:
        owner.is_active = False
    owner.type = COMPANY_USER_TYPE
    owner.save()
    cbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
        benji_account=owner,
        company=company)
    cbae.relationship = ACCOUNT_COMPANY_RELATION_OWNER
    cbae.dashboard_access = True
    cbae.save()
    if creator != owner:
        try:
            cart = CompanyAccessRequestToken.objects.get(user=creator, company=company)
            cart.expiry = get_user_activation_expiry_time()
            cart.save()
        except CompanyAccessRequestToken.DoesNotExist:
            cart = CompanyAccessRequestToken(user=creator,
                                             company=company,
                                             expiry=get_user_activation_expiry_time(),
                                             token=get_token())
            cart.save()
        if can_send_access_request_email(company, creator):
            send_email_template.delay(
                from_email=os.getenv("INFO_FROM_EMAIL"),
                recipient_list=[owner.email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_ACCEPT_DECLINE_COMPANY_ACCESS_ID"),
                substitutions={
                        "talent_name": creator.get_full_name(),
                        "band_name": company.title,
                        "accept_url": f"{settings.FRONTEND_BASE_URL}/accept-company-request/"
                                  f"?token={cart.token}&email={owner.email}",
                        "decline_url": f"{settings.FRONTEND_BASE_URL}/decline-company-request/"
                                   f"?token={cart.token}&email={owner.email}"
                },
                sender_name=f"{BUDDI_ADMIN if not creator.get_full_name() else creator.get_full_name()} {VIA_BUDDISYSTEMS}"
            )
        cbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
            benji_account=creator, company=company)
        cbae.relationship = ACCOUNT_COMPANY_NO_RELATION
        cbae.save()


def send_approve_email_notification(requester, company):

    # to get the sender's full name and send it in the email
    benji_account = BenjiAccount.objects.only('full_name').get(email=company.owner_email)

    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[requester.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_COMPANY_ACCESS_ACCEPT_NOTIFICATION_ID"),
        substitutions={
            "requester_name": requester.get_full_name(),
            "company_title": company.title,
        },
        sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}"
    )


def send_decline_email_notification(requester, company):

    # to get the sender's full name and send it in the email
    benji_account = BenjiAccount.objects.only('full_name').get(email=company.owner_email)

    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[requester.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_COMPANY_ACCESS_DECLINE_NOTIFICATION_ID"),
        substitutions={
            "requester_name": requester.get_full_name(),
            "company_name": company.title,
            "account_url": f"{settings.FRONTEND_BASE_URL}/"
        },
        sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}"
    )


def update_skills_array(request, key1, key2, model_cls,  usr_obj):
    csv_list = request.data[key1].get(key2)
    csv_db_obj = None
    if csv_list:
        csv_db_obj, created = model_cls.objects.get_or_create(user=usr_obj)
        input_values = csv_list.split(",")
        lis = []
        for v in input_values:
            if v not in lis:
                lis.append(v)
        setattr(csv_db_obj,key2,lis)
        csv_db_obj.save()
    else:
        try:
            csv_db_obj = model_cls.objects.get(user=usr_obj)
            csv_db_obj.delete()
        except model_cls.DoesNotExist:
            pass

    return csv_db_obj


def associate_connect_requests(user: BenjiAccount):
    """Copy the invitations that were sent before this account being created.
        And create SocialNetwork so the user can see connect requests on
        Personal Network page
    """
    from apps.personal_network.utils import add_person_network

    user_contacts = UserContact.objects.filter(
        email=user.email, is_invited=True, is_personal=True
    )
    for user_contact in user_contacts:
        add_person_network(user_contact.user, user_contact.email)


def send_access_request_to_member(company, company_owner, user, sila_corporate_member):
    """
    This will send an email to the user with accept and decline url and with other details
    """
    cart = CompanyAccessRequestToken(user=user,
                                     company=company,
                                     expiry=get_user_activation_expiry_time(),
                                     token=get_token())
    cart.save()
    send_email_template.delay(
        from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
        recipient_list=[user.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_USER_BECOME_MEMBER_OF_COMPANY"),
        substitutions={
            "invitor_name": user.first_name,
            "role_member": sila_corporate_member.role,
            "company_name": company.title,
            "owner_name": company_owner.first_name,
            "accept_url": f"{settings.FRONTEND_BASE_URL}/companies/{company.id}/wallet",
            "decline_url": f"{settings.FRONTEND_BASE_URL}/decline-business-members?"
                           f"company_id={company.id}&member_id={sila_corporate_member.id}&token={cart.token}"
        },
        sender_name=f"{BUDDI_ADMIN if not company_owner.full_name else company_owner.full_name} {VIA_BUDDISYSTEMS}"
    )
