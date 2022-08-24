from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import PPB_ATTENDEES_PAGE
from apps.jobs.models import Agency, AgencyContact, Client, ClientContact, Job, PreProductionBook
from apps.jobs.serializers import (AgencyReadSerializer, AgencyWriteSerializer, ClientReadSerializer,
                                   ClientWriteSerializer)
from apps.jobs.utils import add_field_in_request_data


def add_client_to_ppb(client):
    ppb = PreProductionBook.objects.get(job=client.job)
    ppb_data = ppb.data
    client = {
        "client_id": client.id,
        "client_name": "",
        "client_name_style": PPB_ATTENDEES_PAGE["client_name_style"],
        "client_contact": "",
        "client_contact_style": PPB_ATTENDEES_PAGE["client_contact_style"],
    }
    try:
        ppb_data["Pages"]["Attendees"]["client"] = client
    except KeyError:
        ppb_data["Pages"]["Attendees"]["client"] = {}
        ppb_data["Pages"]["Attendees"]["client"] = client
    ppb.data = ppb_data
    ppb.save()


def add_client_attendee_to_ppb(client_attendee):
    ppb = PreProductionBook.objects.get(job=client_attendee.client.job)
    ppb_data = ppb.data
    client_attendee = {
        "client_attendee_id": client_attendee.id,
        "client_attendee_contact": "",
        "client_attendee_contact_style": PPB_ATTENDEES_PAGE["client_attendee_contact_style"],
        "client_attendee_contact_title": "",
        "client_attendee_contact_title_style": PPB_ATTENDEES_PAGE["client_attendee_contact_title_style"],
    }
    try:
        ppb_data["Pages"]["Attendees"]["client_attendees"].append(client_attendee)
    except KeyError:
        ppb_data["Pages"]["Attendees"]["client_attendees"] = []
        ppb_data["Pages"]["Attendees"]["client_attendees"].append(client_attendee)
    ppb.data = ppb_data
    ppb.save()


def remove_client_attendee_from_ppb(client_attendee):
    ppb = PreProductionBook.objects.get(job=client_attendee.client.job)
    ppb_data = ppb.data
    client_attendees = ppb_data["Pages"]["Attendees"]["client_attendees"]
    for i in range(len(client_attendees)):
        if client_attendees[i]["client_attendee_id"] == client_attendee.id:
            del client_attendees[i]
            break
    ppb.data = ppb_data
    ppb.save()


def add_agency_to_ppb(agency):
    ppb = PreProductionBook.objects.get(job=agency.job)
    ppb_data = ppb.data
    agency = {
        "agency_id": agency.id,
        "agency_name": "",
        "agency_name_style": PPB_ATTENDEES_PAGE["agency_name_style"],
        "agency_contact": "",
        "agency_contact_style": PPB_ATTENDEES_PAGE["agency_contact_style"],
    }
    try:
        ppb_data["Pages"]["Attendees"]["agency"] = agency
    except KeyError:
        ppb_data["Pages"]["Attendees"]["agency"] = {}
        ppb_data["Pages"]["Attendees"]["agency"] = agency
    ppb.data = ppb_data
    ppb.save()


def add_agency_attendee_to_ppb(agency_attendee):
    ppb = PreProductionBook.objects.get(job=agency_attendee.agency.job)
    ppb_data = ppb.data
    agency_attendee = {
        "agency_attendee_id": agency_attendee.id,
        "agency_attendee_contact": "",
        "agency_attendee_contact_style": PPB_ATTENDEES_PAGE["agency_attendee_contact_style"],
        "agency_attendee_contact_title": "",
        "agency_attendee_contact_title_style": PPB_ATTENDEES_PAGE["agency_attendee_contact_title_style"],
    }
    try:
        ppb_data["Pages"]["Attendees"]["agency_attendees"].append(agency_attendee)
    except KeyError:
        ppb_data["Pages"]["Attendees"]["agency_attendees"] = []
        ppb_data["Pages"]["Attendees"]["agency_attendees"].append(agency_attendee)
    ppb.data = ppb_data
    ppb.save()


def remove_agency_attendee_from_ppb(agency_attendee):
    ppb = PreProductionBook.objects.get(job=agency_attendee.agency.job)
    ppb_data = ppb.data
    agency_attendees = ppb_data["Pages"]["Attendees"]["agency_attendees"]
    for i in range(len(agency_attendees)):
        if agency_attendees[i]["agency_attendee_id"] == agency_attendee.id:
            del agency_attendees[i]
            break
    ppb.data = ppb_data
    ppb.save()


class JobAgencyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Agency.objects.all()
    serializer_class = AgencyReadSerializer

    def list(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            agency = Agency.objects.get(job=job)
            response_data = self.serializer_class(instance=agency).data
        except Agency.DoesNotExist:
            response_data = {}
        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        contacts = request.data.pop("contacts")
        add_field_in_request_data(request, "job", job.pk)
        agency_serializer = AgencyWriteSerializer(data=request.data)
        if agency_serializer.is_valid(raise_exception=True):
            agency = agency_serializer.save()
            add_agency_to_ppb(agency)
        for contact in contacts:
            agency_contact = AgencyContact(agency=agency,
                                           agency_contact=contact["agency_contact"],
                                           agency_contact_title=contact["agency_contact_title"])
            agency_contact.save()
            add_agency_attendee_to_ppb(agency_contact)
        return Response(self.serializer_class(instance=agency).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobAgencyViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        contacts = request.data.pop("contacts")
        agency_contact_ids = []
        agency = super(JobAgencyViewSet, self).partial_update(request=request, pk=pk)
        agency = Agency.objects.get(pk=pk)
        for contact in contacts:
            if "id" in contact:
                agency_contact_ids.append(contact["id"])
                agency_contact = AgencyContact.objects.get(pk=contact["id"])
                agency_contact.agency_contact = contact["agency_contact"]
                agency_contact.agency_contact_title = contact["agency_contact_title"]
                agency_contact.save()
            else:
                agency_contact = AgencyContact(agency=agency,
                                               agency_contact=contact["agency_contact"],
                                               agency_contact_title=contact["agency_contact_title"])
                agency_contact.save()
                agency_contact_ids.append(agency_contact.id)
                add_agency_attendee_to_ppb(agency_contact)
        agency_contacts = AgencyContact.objects.filter(agency=agency)
        for agency_contact in agency_contacts:
            if len(agency_contact_ids) > 0 and agency_contact.id not in agency_contact_ids:
                remove_agency_attendee_from_ppb(agency_contact)
                agency_contact.delete()
        return Response(self.serializer_class(instance=agency).data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobAgencyViewSet, self).destroy(request=request, pk=pk)


class JobClientViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Client.objects.all()
    serializer_class = ClientWriteSerializer

    def list(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            client = Client.objects.get(job=job)
            response_data = ClientReadSerializer(instance=client).data
        except Client.DoesNotExist:
            response_data = {"profile_photo": job.client_logo_s3_url,
                             "origin_profile_photo": job.origin_client_logo_s3_url}
        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        contacts = request.data.pop("contacts")
        add_field_in_request_data(request, "job", job.pk)
        client_serializer = ClientWriteSerializer(data=request.data)
        if client_serializer.is_valid(raise_exception=True):
            client = client_serializer.save()
            add_client_to_ppb(client)
        for contact in contacts:
            client_contact = ClientContact(client=client,
                                           client_contact=contact["client_contact"],
                                           client_contact_title=contact["client_contact_title"])
            client_contact.save()
            add_client_attendee_to_ppb(client_contact)
        return Response(ClientReadSerializer(instance=client).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobClientViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        contacts = request.data.pop("contacts")
        client_contact_ids = []
        client = super(JobClientViewSet, self).partial_update(request=request, pk=pk)
        client = Client.objects.get(pk=pk)
        for contact in contacts:
            if "id" in contact:
                client_contact_ids.append(contact["id"])
                client_contact = ClientContact.objects.get(pk=contact["id"])
                client_contact.client_contact = contact["client_contact"]
                client_contact.client_contact_title = contact["client_contact_title"]
                client_contact.save()
            else:
                client_contact = ClientContact(client=client,
                                               client_contact=contact["client_contact"],
                                               client_contact_title=contact["client_contact_title"])
                client_contact.save()
                client_contact_ids.append(client_contact.id)
                add_client_attendee_to_ppb(client_contact)
        client_contacts = ClientContact.objects.filter(client=client)
        for client_contact in client_contacts:
            if len(client_contact_ids) > 0 and client_contact.id not in client_contact_ids:
                remove_client_attendee_from_ppb(client_contact)
                client_contact.delete()
        return Response(ClientReadSerializer(instance=client).data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobClientViewSet, self).destroy(request=request, pk=pk)
