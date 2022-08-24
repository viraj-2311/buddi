import os

import logging

from django.conf import settings

from apps.personal_network.models import SocialNetwork
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.models import BenjiAccountInvitationToken, UserContact, BenjiAccount
from apps.user.utils import get_token, get_user_activation_expiry_time
from apps.personal_network.utils import add_person_network


SocialNetworkStatus = UserContact.SocialNetworkStatus
logger = logging.getLogger(__name__)


def can_invite_to_company_network(invitor_contact: UserContact):
    return (
        invitor_contact.status in {
            SocialNetworkStatus.NOT_INVITED,
            SocialNetworkStatus.NOT_CONNECTED,
            SocialNetworkStatus.CONNECT_REQUESTED
        }
    )


def add_company_network(invitor, invitee, company, accepted=False):
    SocialNetwork.objects.get_or_create(
        invitor_company=company, invitee=invitee, accepted=accepted
    )


def add_to_company_network(invitor, invitee, company):
    SocialNetwork.objects.get_or_create(
        invitor_company=company, invitee=invitee, accepted=True
    )


def send_invitation_to_professional(user_contact: UserContact):
    token = get_token()
    invitee_account = BenjiAccount.objects.filter(email=user_contact.email).first()
    if invitee_account and invitee_account.is_active is False:
        try:
            logger.info("Inactive invitee account found, resent email")
            bait = BenjiAccountInvitationToken.objects.get(
                user=invitee_account, company=None
            )
            bait.relationship = ""
            bait.expiry = get_user_activation_expiry_time()
            bait.save()
        except BenjiAccountInvitationToken.DoesNotExist:
            bait = BenjiAccountInvitationToken.objects.create(
                user=invitee_account,
                company=None,
                expiry=get_user_activation_expiry_time(),
                token=token,
                relationship="",
            )
        accept_invite_url = (
            (
                f"{settings.FRONTEND_BASE_URL}/signup/?token={bait.token}"
                f"&email={user_contact.email}")
        )
    elif invitee_account:
        add_person_network(user_contact.company, user_contact.email)
        accept_invite_url = f"{settings.FRONTEND_BASE_URL}/network/connections"

    else:
        add_person_network(user_contact.company, user_contact.email)
        accept_invite_url = f"{settings.FRONTEND_BASE_URL}/signup/"

    substitutions = {
        "user_request": user_contact.company.title,  # use invitor name
        "position": user_contact.company.company_owner.job_title,  # invitor job title
        "accept_request_url": accept_invite_url,
    }

    # to get the sender's full name and send it in the email
    invitor = BenjiAccount.objects.only('full_name').get(email=user_contact.company.owner_email)

    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[user_contact.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_PERSONAL_NETWORK_INVITATION_ID"),
        substitutions=substitutions,
        sender_name=f"{BUDDI_ADMIN if not invitor.full_name else invitor.full_name} {VIA_BUDDISYSTEMS}",
    )
    user_contact.is_invited = True
    user_contact.save()
