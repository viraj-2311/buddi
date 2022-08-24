import os

from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.notification.backends.benji_email_backend import send_email_template
from apps.personal_network.models import SocialNetwork
from apps.company_network.constants import CN_STATUS_ACCEPTED, CN_STATUS_PENDING, CN_STATUS_REJECTED
from apps.company_network.models import Favorites
from apps.company_network.serializers import (CNInviteeSerializer, CNInvitorSerializer, CompanyNetworkSerializer,
                                              ViewCompanyNetworkInviteeSerializer, ViewCompanyNetworkInvitorSerializer)
from apps.company_network.utils import can_invite_to_company_network, send_invitation_to_professional
from apps.user.constants import BUDDI_ADMIN
from apps.user.models import BenjiAccount, Company, UserContact
from apps.user.serializers import UserProfileSerializer
from benji_app import settings


class CompanyNetworkViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = SocialNetwork.objects.all()
    serializer_class = CompanyNetworkSerializer

    def company_network_user_profile(self, request, pk: int):
        benji_account = get_object_or_404(BenjiAccount, pk=pk)
        return Response(
            UserProfileSerializer(instance=benji_account).data,
            status=status.HTTP_200_OK
        )

    def view_company_network(self, request, pk: int):
        company = get_object_or_404(Company, pk=pk)
        invitee_people = SocialNetwork.objects.filter(
            Q(invitor_company=company),
            accepted=True,
        )
        return Response(
            ViewCompanyNetworkInviteeSerializer(invitee_people, many=True).data,
            status=status.HTTP_200_OK
        )

    def sent_company_networks(self, request, pk: int):
        company = get_object_or_404(Company, pk=pk)
        q_object = Q()

        try:
            if request.GET["status"] == CN_STATUS_PENDING:
                q_object |= (Q(accepted=False) & Q(rejected=False))
            elif request.GET["status"] == CN_STATUS_ACCEPTED:
                q_object |= Q(accepted=True)
            elif request.GET["status"] == CN_STATUS_REJECTED:
                q_object |= Q(rejected=True)
        except KeyError:
            q_object = Q()

        invitee_people = SocialNetwork.objects.filter(
            q_object, invitor_company=company,
        )

        return Response(
            CNInviteeSerializer(invitee_people, many=True).data,
            status=status.HTTP_200_OK
        )

    def received_company_networks(self, request, pk=None):
        company = get_object_or_404(Company, pk=pk)
        q_object = Q()
        try:
            if request.GET["status"] == CN_STATUS_PENDING:
                q_object |= (Q(accepted=False) & Q(rejected=False))
            elif request.GET["status"] == CN_STATUS_ACCEPTED:
                q_object |= Q(accepted=True)
            elif request.GET["status"] == CN_STATUS_REJECTED:
                q_object |= Q(rejected=True)
        except KeyError:
            q_object = Q()
        invitor_people = SocialNetwork.objects.filter(
            q_object, Q(invitee_company=company)
        )
        return Response(
            CNInvitorSerializer(invitor_people, many=True).data,
            status=status.HTTP_200_OK
        )

    def invite_professional(self, request, pk=None):
        company = get_object_or_404(Company, pk=pk)
        invitor: Company = company
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
                email=invitee_email, company=invitor
            )
            if not can_invite_to_company_network(user_contact):
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

    def accept_network_invitation(self, request, pk: int):
        company_network = get_object_or_404(SocialNetwork, pk=pk)
        company_network.accepted = True
        company_network.rejected = False
        company_network.save()

        # Create mutual personal network for the invitor and accept it automatically
        SocialNetwork.objects.update_or_create(
            invitor=company_network.invitee,
            invitee=company_network.invitor,
            invitor_company=company_network.invitee_company,
            invitee_company=company_network.invitor_company,
            defaults={"accepted": True, "rejected": False},
        )
        # Create manual user contact
        if company_network.invitor:
            UserContact.objects.update_or_create(
                email=company_network.invitor.email,
                user=company_network.invitee,
                company=company_network.invitee_company,
                defaults={"is_invited": True}
            )
        else:
            UserContact.objects.update_or_create(
                email=(
                    company_network.invitor_company.email
                    or company_network.invitor_company.owner_email
                ),
                user=company_network.invitee,
                company=company_network.invitee_company,
                defaults={"is_invited": True}
            )
        return Response(
            CNInviteeSerializer(instance=company_network).data,
            status=status.HTTP_200_OK
        )

    def reject_network_invitation(self, request, pk: int):
        """ User should have ability to invite user one more time. """
        company_network = get_object_or_404(SocialNetwork, pk=pk)

        # This same method is use when user removes the connection so at that time we don't have to send email to
        # another user so for that we use "mail_sent".
        mail_sent = False if company_network.accepted else True

        company_network.rejected = True
        company_network.accepted = False
        company_network.save(update_fields=["accepted", "rejected"])

        # checking if company send invitation to another company or to contractor and get data accordingly
        # also When any user want's to remove the connection then that user is also removed from other user's connection
        if company_network.invitee:
            try:
                other_connection = SocialNetwork.objects.get(invitor=company_network.invitee,
                                                             invitee_company=company_network.invitor_company)
                other_connection.accepted = False
                other_connection.rejected = True
                other_connection.save(update_fields=["accepted", "rejected"])
            except SocialNetwork.DoesNotExist:
                pass
            user_contact = UserContact.objects.get(company=company_network.invitor_company,
                                                   email=company_network.invitee.email)
            sender_name = company_network.invitee.full_name
        else:
            try:
                other_connection = SocialNetwork.objects.get(invitee_company=company_network.invitor_company,
                                                             invitor_company=company_network.invitee_company)
                other_connection.accepted = False
                other_connection.rejected = True
                other_connection.save(update_fields=["accepted", "rejected"])
            except SocialNetwork.DoesNotExist:
                pass
            user_contact = UserContact.objects.get(company=company_network.invitor_company,
                                                   email=company_network.invitee_company.owner_email)
            sender_name = company_network.invitee_company.title

        if user_contact.is_personal:
            network_type = "personal"
            network_url = f"{settings.FRONTEND_BASE_URL}/network/connections"
        else:
            network_type = "corporate"
            network_url = f"{settings.FRONTEND_BASE_URL}/companies/{company_network.invitor_company}/network/connections"

        response_data = CNInviteeSerializer(instance=company_network).data
        if mail_sent:
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[company_network.invitor_company.owner_email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_REQUEST_TO_CONNECT_DECLINE_NOTIFICATION_ID"),
                substitutions={
                    "approver_email": user_contact.email,
                    "network_type": network_type,
                    "network_url": network_url
                },
                sender_name=f"{BUDDI_ADMIN if not sender_name else sender_name}"
            )
        return Response(response_data, status=status.HTTP_200_OK)

    def like_unlike(self, request, pk=None):
        company = get_object_or_404(Company, pk=pk)
        try:
            friend_id = request.data["friend_id"]
            friend = BenjiAccount.objects.get(pk=friend_id)
        except BenjiAccount.DoesNotExist:
            return Response(f"BenjiAccount {friend_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            favorite = Favorites.objects.get(poster=request.user, friend=friend, company=company)
            favorite.delete()
        except Favorites.DoesNotExist:
            favorite = Favorites(poster=request.user, friend=friend, company=company)
            favorite.save()
        try:
            company_network = SocialNetwork.objects.get(
                invitor_company=company, invitee=friend
            )
            response_data = ViewCompanyNetworkInviteeSerializer(instance=company_network).data
        except SocialNetwork.DoesNotExist:
            company_network = SocialNetwork.objects.get(
                invitor=friend, invitee_company=company
            )
            response_data = ViewCompanyNetworkInvitorSerializer(instance=company_network).data
        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request):
        return Response([], status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(CompanyNetworkViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(CompanyNetworkViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(CompanyNetworkViewSet, self).destroy(request=request, pk=pk)
