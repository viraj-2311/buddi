from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import PPB_CAST_PAGE, PPB_WARDROBE_PAGE
from apps.jobs.models import Cast, Job, PreProductionBook, Wardrobe, WardrobeNote
from apps.jobs.serializers import (CastReadSerializer, CastWriteSerializer, WardrobeReadSerializer,
                                   WardrobeWriteSerializer)
from apps.jobs.utils import add_field_in_request_data


def add_cast_to_ppb(cast):
    ppb = PreProductionBook.objects.get(job=cast.job)
    ppb_data = ppb.data
    cast = {
        "cast_id": cast.id,
        "profile_photo": "",
        "role_title": "",
        "role_title_style": PPB_CAST_PAGE["role_title_style"],
        "full_name": "",
        "full_name_style": PPB_CAST_PAGE["full_name_style"],
    }
    try:
        ppb_data["Pages"]["Cast"]["casts"].append(cast)
    except KeyError:
        ppb_data["Pages"]["Cast"]["casts"] = []
        ppb_data["Pages"]["Cast"]["casts"].append(cast)
    ppb.data = ppb_data
    ppb.save()


def remove_cast_from_ppb(cast):
    ppb = PreProductionBook.objects.get(job=cast.job)
    ppb_data = ppb.data
    casts = ppb_data["Pages"]["Cast"]["casts"]
    for i in range(len(casts)):
        if casts[i]["cast_id"] == cast.id:
            del casts[i]
            break
    ppb.data = ppb_data
    ppb.save()


def add_wardrobe_to_ppb(wardrobe):
    ppb = PreProductionBook.objects.get(job=wardrobe.cast.job)
    ppb_data = ppb.data
    wardrobe = {
        "wardrobe_id": wardrobe.id,
        "role_title": "",
        "role_title_style": PPB_WARDROBE_PAGE["role_title_style"],
        "full_name": "",
        "full_name_style": PPB_WARDROBE_PAGE["full_name_style"],
        "image": "",
    }
    try:
        ppb_data["Pages"]["Wardrobe"]["wardrobes"].append(wardrobe)
    except KeyError:
        ppb_data["Pages"]["Wardrobe"]["wardrobes"] = []
        ppb_data["Pages"]["Wardrobe"]["wardrobes"].append(wardrobe)
    ppb.data = ppb_data
    ppb.save()


def remove_wardrobe_from_ppb(wardrobe):
    ppb = PreProductionBook.objects.get(job=wardrobe.cast.job)
    ppb_data = ppb.data
    wardrobes = ppb_data["Pages"]["Wardrobe"]["wardrobes"]
    for i in range(len(wardrobes)):
        if wardrobes[i]["wardrobe_id"] == wardrobe.id:
            del wardrobes[i]
            break
    ppb.data = ppb_data
    ppb.save()


class JobCastViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Cast.objects.all()
    serializer_class = CastWriteSerializer

    def list(self, request, job_id=None):
        job = Job.objects.get(pk=job_id)
        results = Cast.objects.filter(job=job)
        return Response(CastReadSerializer(results, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "job", job.pk)
        add_field_in_request_data(request, "benji_account", None)
        cast_serializer = CastWriteSerializer(data=request.data)
        if cast_serializer.is_valid(raise_exception=True):
            cast = cast_serializer.save()
            add_cast_to_ppb(cast)
        return Response(CastReadSerializer(instance=cast).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobCastViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(JobCastViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        cast = Cast.objects.get(pk=pk)
        remove_cast_from_ppb(cast)
        return super(JobCastViewSet, self).destroy(request=request, pk=pk)


class JobWardrobeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Wardrobe.objects.all()
    serializer_class = WardrobeReadSerializer

    def create(self, request, cast_id):
        if not cast_id:
            raise NotImplementedError("This API doesn't support execution missing cast id.")
        try:
            cast = Cast.objects.get(pk=cast_id)
        except Cast.DoesNotExist:
            return Response(f"Cast {cast_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "cast", cast.pk)
        wardrobe_serializer = WardrobeWriteSerializer(data=request.data)
        if wardrobe_serializer.is_valid(raise_exception=True):
            wardrobe = wardrobe_serializer.save()
            add_wardrobe_to_ppb(wardrobe)
        return Response(self.serializer_class(instance=wardrobe).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobWardrobeViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        wardrobes_notes = request.data.pop("wardrobe_notes")
        wardrobe = super(JobWardrobeViewSet, self).partial_update(request=request, pk=pk)
        wardrobe = Wardrobe.objects.get(pk=wardrobe.data["id"])
        WardrobeNote.objects.filter(wardrobe=wardrobe).delete()
        for note in wardrobes_notes:
            wardrobe_note = WardrobeNote(wardrobe=wardrobe,
                                         number=note["number"],
                                         x_coord=note["x_coord"],
                                         y_coord=note["y_coord"],
                                         notes=note["notes"])
            wardrobe_note.save()
        return Response(self.serializer_class(instance=wardrobe).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        wardrobe = Wardrobe.objects.get(pk=pk)
        remove_wardrobe_from_ppb(wardrobe)
        return super(JobWardrobeViewSet, self).destroy(request=request, pk=pk)
