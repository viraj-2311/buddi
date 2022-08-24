import datetime
import os

from django.db.models import Q

from bs4 import BeautifulSoup as BSHTML
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import DEAL_MEMO, HOLD_MEMO, JOB_STATUS_ACTIVE
from apps.jobs.models import (BenjiAccount, Job, JobMemo, JobMemoShootDate, JobShootDate, Schedule, ShootNote,
                              UserSchedule)
from apps.jobs.serializers import (ScheduleReadSerializer, ScheduleWriteSerializer, ShootNoteReadSerializer,
                                   ShootNoteWriteSerializer)
from apps.jobs.utils import add_field_in_request_data, get_job_memo_shoot_dates
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.serializers import BenjiAccountSerializer


def send_event_notifications(event_id, date):
    # event = Event.objects.get(pk=event_id)
    benji_account_ids = UserSchedule.objects.filter(
        schedule=event_id,
        schedule__date=date).values_list("job_memo__benji_account", flat=True).distinct()
    for benji_account_id in benji_account_ids:
        benji_account = BenjiAccount.objects.get(pk=benji_account_id)
        send_email_template.delay(
            from_email=os.getenv("INFO_FROM_EMAIL"),
            recipient_list=[benji_account.email],
            email_template_id=os.getenv("EMAIL_TEMPLATE_EVENT_NOTIFICATION_ID"),
            substitutions={
                # "first_name": benji_account.first_name,
                # "last_name": benji_account.last_name,
                # "event_title": event.title,
                # "job_title": event.job.title,
                # "company_title": event.job.company.title,
                # "schedule_url": f"{settings.FRONTEND_SIGNUP_URL}/",
            },
            sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
        )


def remove_image_in_note(notes, index):
    soup = BSHTML(notes, features="html.parser")
    soup.findAll("img")[index].decompose()
    return soup


class JobScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Schedule.objects.all()
    serializer_class = ScheduleReadSerializer

    def schedule_by_date(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            events = request.GET["events"]
            if events == "":
                return Response([], status=status.HTTP_200_OK)
            q_object = Q()
            for name_color in events.split(","):
                q_object |= Q(name=name_color.split("|")[0]) & Q(color=name_color.split("|")[1])
            schedules = Schedule.objects.filter(Q(job_id=job_id) & q_object)
        except KeyError:
            schedules = Schedule.objects.filter(job_id=job_id)
        try:
            start_date = request.GET["start_date"]
            end_date = request.GET["end_date"]
            start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
            schedules = schedules.filter(date__gte=start_date,
                                         date__lte=end_date).order_by("date", "time")
        except KeyError:
            pass
        return Response(self.serializer_class(schedules, many=True).data, status=status.HTTP_200_OK)

    def delete_schedule_image(self, request, pk):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing pk.")
        try:
            schedule = Schedule.objects.get(pk=pk)
        except Schedule.DoesNotExist:
            return Response(f"Schedule {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        index = request.data["index"]
        notes = schedule.notes
        schedule.notes = str(remove_image_in_note(notes, index))
        schedule.save()
        return Response(ScheduleReadSerializer(instance=schedule).data, status=status.HTTP_200_OK)

    def list(self, request, job_id=None):
        results = Schedule.objects.filter(job_id=job_id).values_list(["name", "color"], flat=True).distinct(
            ["name", "color"])
        return Response(self.serializer_class(results, many=True).data, status=status.HTTP_200_OK)

    def get_schedule_group(self, request, job_id=None):
        results = Schedule.objects.filter(job_id=job_id).values("name", "color").distinct()
        for result in results:
            crews = list(UserSchedule.objects.filter(schedule__name=result["name"]).values_list("benji_account",
                                                                                                flat=True).distinct())
            crews = BenjiAccount.objects.filter(pk__in=crews)
            result["crews"] = BenjiAccountSerializer(crews, many=True).data
        return Response(list(results), status=status.HTTP_200_OK)

    def create(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing event id.")
        try:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%H:%M:%S").strftime("%I:%M %p")
        except ValueError:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%I:%M %p").time()
        request.data["date"] = datetime.datetime.strptime(request.data["date"], "%Y-%m-%d").date()
        add_field_in_request_data(request, "job", job_id)
        crews = request.data.pop("crews")
        schedule_serializer = ScheduleWriteSerializer(data=request.data)
        if schedule_serializer.is_valid(raise_exception=True):
            schedule = schedule_serializer.save()
        for crew_id in crews:
            benji_account = BenjiAccount.objects.get(pk=crew_id)
            try:
                UserSchedule.objects.get(schedule=schedule, benji_account=benji_account)
            except UserSchedule.DoesNotExist:
                UserSchedule(schedule=schedule, benji_account=benji_account).save()
        response_data = self.serializer_class(instance=schedule).data
        response_data["id"] = schedule_serializer.data["id"]
        # send_event_notifications(schedule.event.pk, schedule.date)
        return Response(response_data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobScheduleViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        try:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%H:%M:%S").strftime("%I:%M %p")
        except ValueError:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%I:%M %p").time()
        request.data["date"] = datetime.datetime.strptime(request.data["date"], "%Y-%m-%d").date()
        crews = request.data.pop("crews")
        response_data = super(JobScheduleViewSet, self).partial_update(request=request, pk=pk)
        schedule = Schedule.objects.get(pk=pk)
        UserSchedule.objects.filter(schedule=schedule).delete()
        for crew_id in crews:
            benji_account = BenjiAccount.objects.get(pk=crew_id)
            UserSchedule(schedule=schedule, benji_account=benji_account).save()
        response_data = self.serializer_class(instance=schedule).data
        response_data["id"] = schedule.pk
        return Response(response_data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobScheduleViewSet, self).destroy(request=request, pk=pk)


class JobShootNoteViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = ShootNote.objects.all()
    serializer_class = ShootNoteReadSerializer

    def shoot_note_by_date(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            start_date = request.GET["start_date"]
            end_date = request.GET["end_date"]
            start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
            shoot_days = []
            if "shoot_days" in request.GET:
                for shoot_day in request.GET["shoot_days"].split(","):
                    if shoot_day != "":
                        shoot_day = datetime.datetime.strptime(shoot_day, "%Y-%m-%d").date()
                        shoot_days.append(shoot_day)
                shoot_notes = ShootNote.objects.filter(job_shoot_date__job_id=job_id,
                                                       job_shoot_date__date__gte=start_date,
                                                       job_shoot_date__date__lte=end_date,
                                                       job_shoot_date__date__in=shoot_days,
                                                       ).order_by("job_shoot_date__date", "time")
            else:
                shoot_notes = ShootNote.objects.filter(job_shoot_date__job_id=job_id,
                                                       job_shoot_date__date__gte=start_date,
                                                       job_shoot_date__date__lte=end_date,
                                                       ).order_by("job_shoot_date__date", "time")
        except KeyError:
            shoot_notes = ShootNote.objects.filter(job_shoot_date__job_id=job_id)
        return Response(self.serializer_class(shoot_notes, many=True).data, status=status.HTTP_200_OK)

    def delete_shoot_note_image(self, request, pk):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing pk.")
        try:
            shoot_note = ShootNote.objects.get(pk=pk)
        except ShootNote.DoesNotExist:
            return Response(f"ShootNote {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        index = request.data["index"]
        notes = shoot_note.notes
        shoot_note.notes = str(remove_image_in_note(notes, index))
        shoot_note.save()
        return Response(ShootNoteReadSerializer(instance=shoot_note).data, status=status.HTTP_200_OK)

    def list(self, request, job_id=None):
        results = ShootNote.objects.filter(job_shoot_date__job=Job.objects.get(pk=job_id))
        return Response(self.serializer_class(results, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing event id.")
        try:
            job = Job.objects.get(pk=job_id)
            date = request.data.pop("date")
            job_shoot_date = JobShootDate.objects.get(job=job, date=date)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        except JobShootDate.DoesNotExist:
            return Response("JobShootDate does not exist.", status=status.HTTP_400_BAD_REQUEST)
        add_field_in_request_data(request, "job_shoot_date", job_shoot_date.pk)
        try:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%H:%M:%S").strftime("%I:%M %p")
        except ValueError:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%I:%M %p").time()
        shoot_note_serializer = ShootNoteWriteSerializer(data=request.data)
        if shoot_note_serializer.is_valid(raise_exception=True):
            shoot_note = shoot_note_serializer.save()
        return Response(self.serializer_class(instance=shoot_note).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobShootNoteViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        try:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%H:%M:%S").strftime("%I:%M %p")
        except ValueError:
            request.data["time"] = datetime.datetime.strptime(request.data["time"], "%I:%M %p").time()
        return super(JobShootNoteViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(JobShootNoteViewSet, self).destroy(request=request, pk=pk)


@api_view(["GET"])  # noqa
@permission_classes((IsAuthenticated,))
def retrieve_hold_memos_in_a_user(request, user_id=None):
    if not user_id:
        raise NotImplementedError("This API doesn't support execution missing user id.")
    try:
        user = BenjiAccount.objects.get(pk=user_id)
    except BenjiAccount.DoesNotExist:
        return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    start_date = request.GET["start_date"]
    end_date = request.GET["end_date"]
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    job_memos = JobMemo.objects.filter(Q(memo_type=HOLD_MEMO) &
                                       Q(accepted=True) &
                                       Q(benji_account=user))
    results = []
    for job_memo in job_memos:
        job = job_memo.job_role.job_role_group.job
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        if job_memo.memo_type == memo_type:
            job_memo_shoot_dates = list(JobMemoShootDate.objects.filter(
                job_memo=job_memo).order_by("date").values_list("date", flat=True))
            shoot_notes = ShootNote.objects.filter(Q(job_shoot_date__job=job) &
                                                   Q(job_shoot_date__date__gte=start_date) &
                                                   Q(job_shoot_date__date__lte=end_date),
                                                   ).order_by("job_shoot_date__date", "time")
            for shoot_note in shoot_notes:
                if shoot_note.job_shoot_date.date in job_memo_shoot_dates:
                    shoot_note_data = ShootNoteReadSerializer(instance=shoot_note).data
                    shoot_note_data["company_title"] = shoot_note.job_shoot_date.job.company.title
                    shoot_note_data["job_title"] = shoot_note.job_shoot_date.job.title
                    results.append(shoot_note_data)
            shoot_notes_date_list = list(shoot_notes.values_list("job_shoot_date__date", flat=True).distinct())
            for i in shoot_notes_date_list:
                try:
                    job_memo_shoot_dates.remove(i)
                except ValueError:
                    pass
            for job_memo_shoot_date in job_memo_shoot_dates:
                shoot_note_data = {}
                shoot_note_data["company_title"] = job.company.title
                shoot_note_data["shoot_dates"] = get_job_memo_shoot_dates(job_memo)
                shoot_note_data["job_title"] = job.title
                shoot_note_data["date"] = job_memo_shoot_date
                results.append(shoot_note_data)
    results = [i for n, i in enumerate(results) if i not in results[n + 1:]]
    return Response(results)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_schedule_in_a_user(request, user_id=None):
    if not user_id:
        raise NotImplementedError("This API doesn't support execution missing user id.")
    try:
        user = BenjiAccount.objects.get(pk=user_id)
    except BenjiAccount.DoesNotExist:
        return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    start_date = request.GET["start_date"]
    end_date = request.GET["end_date"]
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    user_schedules = UserSchedule.objects.filter(benji_account=user,
                                                 schedule__date__gte=start_date,
                                                 schedule__date__lte=end_date,
                                                 ).order_by("schedule__date", "schedule__time")
    results = []
    for user_schedule in user_schedules:
        schedule = ScheduleReadSerializer(instance=user_schedule.schedule).data
        schedule["company_title"] = user_schedule.schedule.job.company.title
        schedule["job_title"] = user_schedule.schedule.job.title
        schedule["event_title"] = user_schedule.schedule.name
        results.append(schedule)
    return Response(results)


@api_view(["GET"])  # noqa
@permission_classes((IsAuthenticated,))
def retrieve_shoot_notes_in_a_user(request, user_id=None):
    if not user_id:
        raise NotImplementedError("This API doesn't support execution missing user id.")
    try:
        user = BenjiAccount.objects.get(pk=user_id)
    except BenjiAccount.DoesNotExist:
        return Response(f"BenjiAccount {user_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    start_date = request.GET["start_date"]
    end_date = request.GET["end_date"]
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    job_memos = JobMemo.objects.filter(Q(memo_type=DEAL_MEMO) &
                                       Q(accepted=True) &
                                       Q(benji_account=user))
    results = []
    for job_memo in job_memos:
        job = job_memo.job_role.job_role_group.job
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        if job_memo.memo_type == memo_type:
            job_memo_shoot_dates = list(JobMemoShootDate.objects.filter(
                job_memo=job_memo).order_by("date").values_list("date", flat=True))
            shoot_notes = ShootNote.objects.filter(Q(job_shoot_date__job=job) &
                                                   Q(job_shoot_date__date__gte=start_date) &
                                                   Q(job_shoot_date__date__lte=end_date),
                                                   ).order_by("job_shoot_date__date", "time")
            for shoot_note in shoot_notes:
                if shoot_note.job_shoot_date.date in job_memo_shoot_dates:
                    shoot_note_data = ShootNoteReadSerializer(instance=shoot_note).data
                    shoot_note_data["company_title"] = shoot_note.job_shoot_date.job.company.title
                    shoot_note_data["job_title"] = shoot_note.job_shoot_date.job.title
                    results.append(shoot_note_data)
            shoot_notes_date_list = list(shoot_notes.values_list("job_shoot_date__date", flat=True).distinct())
            for i in shoot_notes_date_list:
                try:
                    job_memo_shoot_dates.remove(i)
                except ValueError:
                    pass
            for job_memo_shoot_date in job_memo_shoot_dates:
                shoot_note_data = {}
                shoot_note_data["company_title"] = job.company.title
                shoot_note_data["shoot_dates"] = get_job_memo_shoot_dates(job_memo)
                shoot_note_data["job_title"] = job.title
                shoot_note_data["date"] = job_memo_shoot_date
                results.append(shoot_note_data)
    results = [i for n, i in enumerate(results) if i not in results[n + 1:]]
    return Response(results)
