import datetime

import pytz
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import PPB_LOCATION_PAGE
from apps.jobs.models import Job, Location, PreProductionBook
from apps.jobs.serializers import LocationReadSerializer, LocationWriteSerializer
from apps.jobs.utils import add_field_in_request_data, get_timezone_name


def add_location_to_ppb(location):
    ppb = PreProductionBook.objects.get(job=location.job)
    ppb_data = ppb.data
    location = {
        "location_id": location.id,
        "location_title_label": "",
        "location_title_label_style": PPB_LOCATION_PAGE["location_title_label_style"],
        "location_title": "",
        "location_title_style": PPB_LOCATION_PAGE["location_title_style"],
        "address_label": "",
        "address_label_style": PPB_LOCATION_PAGE["address_label_style"],
        "address": "",
        "address_style": PPB_LOCATION_PAGE["address_style"],
        "directions_label": "",
        "directions_label_style": PPB_LOCATION_PAGE["directions_label_style"],
        "directions": "",
        "directions_style": PPB_LOCATION_PAGE["directions_style"],
        "notes_label": "",
        "notes_label_style": PPB_LOCATION_PAGE["notes_label_style"],
        "notes": "",
        "notes_style": PPB_LOCATION_PAGE["notes_style"],
        "image": "",
    }
    try:
        ppb_data["Pages"]["Location"]["locations"].append(location)
    except KeyError:
        ppb_data["Pages"]["Location"]["locations"] = []
        ppb_data["Pages"]["Location"]["locations"].append(location)
    ppb.data = ppb_data
    ppb.save()


def remove_location_from_ppb(location):
    ppb = PreProductionBook.objects.get(job=location.job)
    ppb_data = ppb.data
    locations = ppb_data["Pages"]["Location"]["locations"]
    for i in range(len(locations)):
        if locations[i]["location_id"] == location.id:
            del locations[i]
            break
    ppb.data = ppb_data
    ppb.save()


class LocationViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Location.objects.all()
    serializer_class = LocationReadSerializer

    def list(self, request, job_id=None):
        job = Job.objects.get(pk=job_id)
        results = Location.objects.filter(job=job)
        return Response(LocationReadSerializer(results, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "job", job.pk)
        location_serializer = LocationWriteSerializer(data=request.data)
        if location_serializer.is_valid(raise_exception=True):
            location = location_serializer.save()
            timezone_id = get_timezone_name(location.lat, location.lng)
            abbr_timezone = pytz.timezone(timezone_id).localize(datetime.datetime.now(), is_dst=None).tzname()
            location.timezone = abbr_timezone
            location.save()
            add_location_to_ppb(location)
        return Response(self.serializer_class(location_serializer.data).data,
                        status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(LocationViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(LocationViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        location = Location.objects.get(pk=pk)
        remove_location_from_ppb(location)
        return super(LocationViewSet, self).destroy(request=request, pk=pk)
