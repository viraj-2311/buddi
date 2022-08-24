import logging
import os
from itertools import chain

from django.db.models import Q
from django.shortcuts import get_object_or_404


from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.notification.backends.benji_email_backend import send_email_template
from apps.personal_network.constants import (
    PN_STATUS_ACCEPTED, PN_STATUS_PENDING, PN_STATUS_REJECTED
)
from apps.personal_network.models import Favorites, SocialNetwork
from apps.personal_network.serializers import (
    PersonalNetworkSerializer,
    PNInviteeSerializer,
    ViewPersonalNetworkInviteeSerializer,
    ViewPersonalNetworkInvitorSerializer,
    ViewPersonalNetworkConnectionsSerializer,
)
from apps.personal_network.services.connections import \
    PersonalNetworkConnections
from apps.personal_network.utils import (
    can_send_personal_network_request, send_invitation_to_professional
)
from apps.user.constants import BUDDI_ADMIN
from apps.user.models import BenjiAccount, UserContact
from apps.user.serializers import UserProfileSerializer
from benji_app import settings

logger = logging.getLogger(__name__)


class PersonalNetworkViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = SocialNetwork.objects.all()
    serializer_class = PersonalNetworkSerializer

    def personal_network_user_profile(self, request, pk: int):
        benji_account = get_object_or_404(BenjiAccount, pk=pk)
        return Response(
            UserProfileSerializer(instance=benji_account).data,
            status=status.HTTP_200_OK,
        )

    def view_personal_network(self, request, pk: int):
        benji_account = get_object_or_404(BenjiAccount, pk=pk)
        connections = PersonalNetworkConnections(benji_account).get_all()
        connections_data = ViewPersonalNetworkConnectionsSerializer(
            connections, many=True
        ).data

        return Response(connections_data, status=status.HTTP_200_OK)

    def sent_personal_networks(self, request, pk: int):
        benji_account = get_object_or_404(BenjiAccount, pk=pk)
        q_object = Q()
        try:
            if request.GET["status"] == PN_STATUS_PENDING:
                q_object |= (Q(accepted=False) & Q(rejected=False))
            elif request.GET["status"] == PN_STATUS_ACCEPTED:
                q_object |= Q(accepted=True)
            elif request.GET["status"] == PN_STATUS_REJECTED:
                q_object |= Q(rejected=True)
        except KeyError:
            q_object = Q()
        invitee_people = SocialNetwork.objects.filter(
            Q(invitor=benji_account) & q_object
        )

        return Response(
            PNInviteeSerializer(invitee_people, many=True).data,
            status=status.HTTP_200_OK,
        )

    def received_personal_networks(self, request, pk: int):
        benji_account = get_object_or_404(BenjiAccount, pk=pk)
        q_object = Q()
        try:
            if request.GET["status"] == PN_STATUS_PENDING:
                q_object |= (Q(accepted=False) & Q(rejected=False))
            elif request.GET["status"] == PN_STATUS_ACCEPTED:
                q_object |= Q(accepted=True)
            elif request.GET["status"] == PN_STATUS_REJECTED:
                q_object |= Q(rejected=True)
        except KeyError:
            q_object = Q()

        service = PersonalNetworkConnections(benji_account, q=q_object)
        invitee_from_personal_network = service.get_invitee_people_from_personal_network()
        invitee_from_corporate_network = service.get_invitee_people_from_corporate_network()

        qs = list(chain(invitee_from_personal_network, invitee_from_corporate_network))

        invitor_people = ViewPersonalNetworkConnectionsSerializer(
            qs, many=True
        ).data

        return Response(
            invitor_people, status=status.HTTP_200_OK
        )

    def invite_professional(self, request, pk=None):
        invitor: BenjiAccount = request.user
        professionals = request.data["professionals"]
        response_data = []
        for professional in professionals:

            invitee_email = professional["email"]

            if invitee_email == invitor.email:
                response_data.append(
                    {
                        "email": invitee_email,
                        "error": "You cannot invite yourself."
                    }
                )
                continue

            user_contact, _ = UserContact.objects.get_or_create(
                email=invitee_email, user=invitor
            )
            if not can_send_personal_network_request(user_contact):
                response_data.append(
                    {
                        "email": invitee_email,
                        "error": "You have already invited or connected to this person."
                    }
                )
            else:
                send_invitation_to_professional(user_contact)
                response_data.append(
                    {"email": invitee_email, "success": "Invited successfully"}
                )

        return Response(response_data, status=status.HTTP_201_CREATED)

    def accept_network_invitation(self, request, pk=None):
        personal_network = get_object_or_404(SocialNetwork, pk=pk)

        personal_network.accepted = True
        personal_network.rejected = False
        personal_network.save()

        # Create mutual personal network for the invitor and accept it automatically
        SocialNetwork.objects.update_or_create(
            invitor=personal_network.invitee,
            invitee=personal_network.invitor,
            invitor_company=personal_network.invitee_company,
            invitee_company=personal_network.invitor_company,
            defaults={"accepted": True, "rejected": False},
        )
        # Create manual user contact
        if personal_network.invitor:
            UserContact.objects.update_or_create(
                email=personal_network.invitor.email,
                user=personal_network.invitee,
                company=personal_network.invitee_company,
                defaults={"is_invited": True},
            )
        else:
            UserContact.objects.update_or_create(
                email=(
                    personal_network.invitor_company.email
                    or personal_network.invitor_company.owner_email
                ),
                company=personal_network.invitee_company,
                user=personal_network.invitee,
                defaults={"is_invited": True}
            )

        return Response(
            PNInviteeSerializer(instance=personal_network).data,
            status=status.HTTP_200_OK,
        )

    def reject_network_invitation(self, request, pk: int):
        """ User should have ability to invite user multiple times. """
        personal_network = get_object_or_404(SocialNetwork, pk=pk)

        # This same method is use when user removes the connection so at that time we don't have to send email to
        # another user so for that we use "mail_sent".
        mail_sent = False if personal_network.accepted else True

        personal_network.accepted = False
        personal_network.rejected = True
        personal_network.save(update_fields=["accepted", "rejected"])

        # When any user want's to remove the connection then that user is also removed from other user's connection
        if personal_network.invitor:
            try:
                other_connection = SocialNetwork.objects.get(invitee=personal_network.invitor,
                                                             invitor=personal_network.invitee)
                other_connection.accepted = False
                other_connection.rejected = True
                other_connection.save(update_fields=["accepted", "rejected"])
            except SocialNetwork.DoesNotExist:
                pass
        else:
            try:
                other_connection = SocialNetwork.objects.get(invitee_company=personal_network.invitor_company,
                                                             invitor=personal_network.invitee)
                other_connection.accepted = False
                other_connection.rejected = True
                other_connection.save(update_fields=["accepted", "rejected"])
            except SocialNetwork.DoesNotExist:
                pass

        response_data = PNInviteeSerializer(instance=personal_network).data
        if mail_sent:
            user_contact = UserContact.objects.get(
                user=personal_network.invitor,
                company=personal_network.invitor_company,
                email=personal_network.invitee.email,
            )
            if user_contact.is_personal:
                network_type = "personal"
                network_url = f"{settings.FRONTEND_BASE_URL}/network/connections"
                approver_email = personal_network.invitor.email
            else:
                network_type = "corporate"
                network_url = f"{settings.FRONTEND_BASE_URL}/companies/{personal_network.invitor_company}/network/connections"
                approver_email = personal_network.invitor_company.owner_email

            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[approver_email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_REQUEST_TO_CONNECT_DECLINE_NOTIFICATION_ID"),
                substitutions={
                    "approver_email": personal_network.invitee.email,
                    "network_type": network_type,
                    "network_url": network_url
                },
                sender_name=f"{BUDDI_ADMIN if not personal_network.invitee.full_name else personal_network.invitee.full_name}"
            )
        return Response(response_data, status=status.HTTP_200_OK)

    def like_unlike(self, request, pk: int):
        poster = get_object_or_404(BenjiAccount, pk=pk)

        try:
            friend_id = request.data["friend_id"]
            friend = BenjiAccount.objects.get(pk=friend_id)
        except BenjiAccount.DoesNotExist:
            return Response(
                f"BenjiAccount {friend_id} does not exist.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            favorite = Favorites.objects.get(poster=poster, friend=friend)
            favorite.delete()
        except Favorites.DoesNotExist:
            favorite = Favorites(poster=poster, friend=friend)
            favorite.save()
        try:
            personal_network = SocialNetwork.objects.get(
                invitor=poster, invitee=friend
            )
            response_data = ViewPersonalNetworkInviteeSerializer(
                instance=personal_network
            ).data
        except SocialNetwork.DoesNotExist:
            personal_network = SocialNetwork.objects.get(
                invitor=friend, invitee=poster
            )
            response_data = ViewPersonalNetworkInvitorSerializer(
                instance=personal_network
            ).data

        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request):
        return Response([], status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(PersonalNetworkViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(PersonalNetworkViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(PersonalNetworkViewSet, self).destroy(request=request, pk=pk)
