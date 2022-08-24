import datetime
import os

from django.conf import settings
from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import DEAL_MEMO, HOLD_MEMO, JOB_STATUS_ACTIVE
from apps.jobs.models import (
    Agency,
    BenjiAccount,
    CallSheet,
    CallSheetJobMemo,
    Client,
    ClientCallSheet,
    Job,
    JobMemo,
    JobRole,
    JobRoleGroupType,
    Location,
    PreProductionBook,
    ShootNote,
)
from apps.jobs.serializers import (
    CallSheetSerializer,
    JobReadSerializer,
    LocationReadSerializer,
    ShootNoteReadSerializer,
)
from apps.jobs.utils import get_location
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.serializers import BenjiAccountSerializer, CompanySerializer
from apps.user.utils import get_all_internal_staffs_in_the_company


def add_callsheet_to_ppb(callsheet):
    ppb = PreProductionBook.objects.get(job=callsheet.job)
    ppb_data = ppb.data
    callsheet = {
        "callsheet_id": callsheet.id,
        "production_contact_label": "",
        "production_contact_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "production_contact": "",
        "production_contact_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "production_contact_phone_label": "",
        "production_contact_phone_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "production_contact_phone": "",
        "production_contact_phone_style": {
            "font-size": "8px",
            "font-weight": "40",
        },
        "location_label": "",
        "location_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "location": "",
        "location_style": {
            "font-size": "8px",
            "font-weight": "40",
        },
        "directions_label": "",
        "directions_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "directions": "",
        "directions_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "hospital_label": "",
        "hospital_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "hospital": "",
        "hospital_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "parking_label": "",
        "parking_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "parking": "",
        "parking_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "date_label": "",
        "date_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "date": "",
        "date_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "time_label": "",
        "time_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "time": "",
        "time_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
        "notes_label": "",
        "notes_label_style": {
            "font-size": "8px",
            "font-weight": "700",
        },
        "notes": "",
        "notes_style": {
            "font-size": "8px",
            "font-weight": "400",
        },
    }
    try:
        ppb_data["Pages"]["Callsheet"]["callsheets"].append(callsheet)
    except KeyError:
        ppb_data["Pages"]["Callsheet"]["callsheets"] = []
        ppb_data["Pages"]["Callsheet"]["callsheets"].append(callsheet)
    ppb.data = ppb_data
    ppb.save()


def remove_callsheet_from_ppb(callsheet):
    ppb = PreProductionBook.objects.get(job=callsheet.job)
    ppb_data = ppb.data
    callsheets = ppb_data["Pages"]["Callsheet"]["callsheets"]
    for i in range(len(callsheets)):
        if callsheets[i]["callsheet_id"] == callsheet.id:
            del callsheets[i]
    ppb.data = ppb_data
    ppb.save()


def send_call_sheet_notification(call_sheet_job_memo):
    email = call_sheet_job_memo.job_memo.benji_account.email
    sunrise_sunset = "6:45AM 7:12PM"
    weather_forecast = "42/69 8%"
    directions = "https://goo.gl/maps/SE1NVNCQeCnZRrMY9"

    # to get the sender's full name and send it in the email
    user = call_sheet_job_memo.job_memo.memo_sender

    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_CALL_SHEET_NOTIFICATION_ID"),
        substitutions={
            "date": f"Date - {call_sheet_job_memo.call_sheet.date.strftime('%b %d, %Y')}",
            "time": f"{call_sheet_job_memo.time.strftime('%I:%M %p')} "
            f"{call_sheet_job_memo.call_sheet.location.timezone}",
            "job_for": f"{call_sheet_job_memo.name}",
            "department": f"{call_sheet_job_memo.job_memo.job_role.job_role_group.job_role_group_type.title}",
            "position": f"{call_sheet_job_memo.job_memo.job_role.job_role_type.title}",
            "city": f"{call_sheet_job_memo.job_memo.state}, {call_sheet_job_memo.job_memo.city}",
            "total_hours": f"{call_sheet_job_memo.job_memo.daily_hours} Per Day",
            "location": f"{call_sheet_job_memo.call_sheet.location}",
            "directions": f"{directions}",
            "schedule": "Check your schedule here",
            "parking": f"{call_sheet_job_memo.call_sheet.parking}",
            "hospital": f"{call_sheet_job_memo.call_sheet.hospital}",
            "production_contact": f"{call_sheet_job_memo.call_sheet.production_contact.get_full_name()} "
            f"- {call_sheet_job_memo.call_sheet.production_contact_phone}",
            "sunrise_sunset": f"{sunrise_sunset}",
            "weather_forecast": f"{weather_forecast}",
            "notes": f"{call_sheet_job_memo.call_sheet.notes}",
            "call_sheet_patch_url": f"{settings.FRONTEND_BASE_URL}/jobs/callsheet/{call_sheet_job_memo.id}",
        },
        sender_name=f"{BUDDI_ADMIN if not user.full_name else user.full_name} {VIA_BUDDISYSTEMS}"
    )


def get_call_sheet_job_memo(call_sheet_job_memo):
    call_sheet_data = {}
    call_sheet_data["id"] = call_sheet_job_memo.id
    call_sheet_data[
        "department"
    ] = (
        call_sheet_job_memo.job_memo.job_role.job_role_group.job_role_group_type.title
    )  # noqa
    call_sheet_data[
        "job_role"
    ] = call_sheet_job_memo.job_memo.job_role.job_role_type.title
    call_sheet_data["name"] = call_sheet_job_memo.name
    call_sheet_data["time"] = call_sheet_job_memo.time
    if call_sheet_job_memo.sent:
        if call_sheet_job_memo.accepted:
            call_sheet_status = "Confirm"
        else:
            call_sheet_status = "Sent"
    else:
        call_sheet_status = "Saved"
    call_sheet_data["status"] = call_sheet_status
    call_sheet_data["call_sheet"] = CallSheetSerializer(
        instance=call_sheet_job_memo.call_sheet
    ).data
    return call_sheet_data


def get_preview_call_sheet(call_sheet_job_memo):
    call_sheet_data = {}
    call_sheet_data[
        "position"
    ] = call_sheet_job_memo.job_memo.job_role.job_role_type.title
    call_sheet_data["name"] = call_sheet_job_memo.job_memo.benji_account.get_full_name()
    call_sheet_data["cell"] = call_sheet_job_memo.job_memo.benji_account.phone
    call_sheet_data["call"] = call_sheet_job_memo.time
    call_sheet_data["wrap"] = call_sheet_job_memo.time
    return call_sheet_data


class JobCallSheetViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = CallSheet.objects.all()
    serializer_class = CallSheetSerializer

    def send_callsheet(self, request, job_id):
        callsheet_ids = request.data["callsheet_ids"]
        call_sheet_job_memos = CallSheetJobMemo.objects.filter(pk__in=callsheet_ids)
        response_data = []
        for call_sheet_job_memo in call_sheet_job_memos:
            data = {}
            data["id"] = call_sheet_job_memo.id
            try:
                # if not call_sheet_job_memo.sent:
                send_call_sheet_notification(call_sheet_job_memo)
                call_sheet_job_memo.sent = True
                call_sheet_job_memo.save()
                data["status"] = "Sent"
            except Exception:
                data["status"] = "Saved"
            response_data.append(data)
        return Response(response_data, status=status.HTTP_200_OK)

    def list_call_sheet_all_dates(self, request, job_id):
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(
                f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        dates = []
        call_sheet_job_memos = CallSheetJobMemo.objects.filter(
            call_sheet__job_id=job_id, job_memo__memo_type=memo_type
        )
        for call_sheet_job_memo in call_sheet_job_memos:
            if call_sheet_job_memo.call_sheet.date not in dates:
                dates.append(call_sheet_job_memo.call_sheet.date)
        return Response(dates, status=status.HTTP_200_OK)

    def get_production_contact(self, request, job_id):
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(
                f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        contractors_with_accepted_memo = (
            JobMemo.objects.filter(
                memo_type=memo_type, accepted=True, job_role__job_role_group__job=job
            )
            .values_list("benji_account", flat=True)
            .distinct()
        )
        all_internal_staffs = get_all_internal_staffs_in_the_company(job.company)
        benji_accounts = BenjiAccount.objects.filter(
            pk__in=list(contractors_with_accepted_memo) + list(all_internal_staffs)
        )
        return Response(
            BenjiAccountSerializer(benji_accounts, many=True).data,
            status=status.HTTP_200_OK,
        )

    def list_specific_date(self, request, job_id):
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        try:
            date = request.GET["date"]
            date = datetime.datetime.strptime(date, "%Y%m%d").date()
            call_sheet_job_memos = CallSheetJobMemo.objects.filter(
                call_sheet__date=date, call_sheet__job_id=job_id
            )
        except KeyError:
            call_sheet_job_memos = CallSheetJobMemo.objects.all(
                call_sheet__job_id=job_id
            )
        response_data = {}
        call_sheets = []
        for call_sheet_job_memo in call_sheet_job_memos:
            call_sheet_data = get_call_sheet_job_memo(call_sheet_job_memo)
            call_sheets.append(call_sheet_data)
        response_data["departments"] = call_sheets
        shoot_notes = ShootNote.objects.filter(
            job_shoot_date__job_id=job_id,
            job_shoot_date__date__gte=date,
            job_shoot_date__date__lte=date,
        ).order_by("job_shoot_date__date", "time")
        response_data["schedule"] = ShootNoteReadSerializer(shoot_notes, many=True).data
        notes = []
        call_sheet_ids = call_sheet_job_memos.values_list(
            "call_sheet", flat=True
        ).distinct()
        call_sheets = CallSheet.objects.filter(pk__in=call_sheet_ids)
        for call_sheet in call_sheets:
            if call_sheet.notes != "":
                notes.append(call_sheet.notes)
        response_data["notes"] = notes
        return Response(response_data, status=status.HTTP_200_OK)

    def preview_callsheet(self, request, job_id):  # noqa
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        response_data = {}
        try:
            date = request.GET["date"]
            date = datetime.datetime.strptime(date, "%Y%m%d").date()
            call_sheet_job_memos = CallSheetJobMemo.objects.filter(
                call_sheet__date=date, call_sheet__job_id=job_id
            )
        except KeyError:
            call_sheet_job_memos = CallSheetJobMemo.objects.all(
                call_sheet__job_id=job_id
            )
        try:
            job = Job.objects.get(pk=job_id)
            response_data["job"] = JobReadSerializer(instance=job).data
        except Job.DoesNotExist:
            return Response(
                f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        client_info = {}
        try:
            client = Client.objects.get(job=job)
            client_info["logo"] = client.get_profile_photo()
            client_info["title"] = client.client_contact_title
        except Client.DoesNotExist:
            client_info["logo"] = job.client_logo_s3_url
            client_info["title"] = ""
        response_data["client"] = client_info
        agency_info = {}
        try:
            agency = Agency.objects.get(job=job)
            agency_info["logo"] = agency.profile_photo
            agency_info["title"] = agency.agency_contact_title
        except Agency.DoesNotExist:
            agency_info["logo"] = None
            agency_info["title"] = ""
        response_data["agency"] = agency_info
        response_data["company"] = CompanySerializer(instance=job.company).data
        call_sheets = {}
        for call_sheet_job_memo in call_sheet_job_memos:
            department = (
                call_sheet_job_memo.job_memo.job_role.job_role_group.job_role_group_type.title
            )
            if department not in call_sheets:
                call_sheets[department] = []
            call_sheet_data = get_preview_call_sheet(call_sheet_job_memo)
            call_sheets[department].append(call_sheet_data)
        response_data["departments"] = call_sheets
        shoot_notes = ShootNote.objects.filter(
            job_shoot_date__job_id=job_id,
            job_shoot_date__date__gte=date,
            job_shoot_date__date__lte=date,
        ).order_by("job_shoot_date__date", "time")
        response_data["schedule"] = ShootNoteReadSerializer(shoot_notes, many=True).data
        notes = []
        locations = []
        hospitals = []
        production_contacts = []
        call_sheet_ids = call_sheet_job_memos.values_list(
            "call_sheet", flat=True
        ).distinct()
        call_sheets = CallSheet.objects.filter(pk__in=call_sheet_ids)
        for call_sheet in call_sheets:
            locations.append(LocationReadSerializer(instance=call_sheet.location).data)
            hospitals.append(
                {
                    "name": call_sheet.hospital,
                    "city": call_sheet.hospital_city,
                    "state": call_sheet.hospital_state,
                    "zip_code": call_sheet.hospital_zip_code,
                    "address_line_1": call_sheet.hospital_address_line1,
                }
            )
            production_contacts.append(
                {
                    "name": call_sheet.production_contact.get_full_name(),
                    "phone": call_sheet.production_contact_phone,
                }
            )
            if call_sheet.notes != "":
                notes.append(call_sheet.notes)
        response_data["notes"] = notes
        response_data["locations"] = locations
        response_data["hospitals"] = hospitals
        response_data["production_contacts"] = production_contacts
        return Response(response_data, status=status.HTTP_200_OK)

    def list(self, request, job_id):
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        results = CallSheet.objects.filter(job_id=job_id)
        return Response(
            self.serializer_class(results, many=True).data, status=status.HTTP_200_OK
        )

    def create(self, request, job_id):  # noqa
        production_contact = request.data["production_contact"]
        production_contact_phone = request.data["production_contact_phone"]
        departments = request.data["departments"]
        location = request.data["location"]
        hospital = request.data["hospital"]
        hospital_lat = request.data["hospital_lat"]
        hospital_lng = request.data["hospital_lng"]
        parking = request.data["parking"]
        date = request.data["date"]
        time = request.data["time"]
        notes = request.data["notes"]
        h_city, h_state, h_zip_code, h_address_line1 = get_location(
            hospital_lat, hospital_lng
        )
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        try:
            job = Job.objects.get(pk=job_id)
            company = job.company
            if job.status == JOB_STATUS_ACTIVE:
                memo_type = DEAL_MEMO
            else:
                memo_type = HOLD_MEMO
        except Job.DoesNotExist:
            return Response(
                f"Gig {job_id} does not exist.", status=status.HTTP_404_NOT_FOUND
            )
        try:
            production_contact = BenjiAccount.objects.get(pk=production_contact)
        except BenjiAccount.DoesNotExist:
            return Response(
                f"Benji Account {production_contact} does not exist.",
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        except Exception:
            return Response(
                "Date should be in '%Y-%m-%d' format.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            time = datetime.datetime.strptime(time, "%I:%M %p").time()
        except Exception:
            return Response(
                "Time should be in 'HH:MM AM|PM' format.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        call_sheet = CallSheet(
            job=job,
            production_contact=production_contact,
            production_contact_phone=production_contact_phone,
            location=Location.objects.get(pk=location),
            parking=parking,
            hospital=hospital,
            hospital_city=h_city,
            hospital_state=h_state,
            hospital_zip_code=h_zip_code,
            hospital_address_line1=h_address_line1,
            date=date,
            time=time,
            notes=notes,
        )
        call_sheet.save()
        for department in departments:
            if department.lower() == "client":
                try:
                    client_callsheet = ClientCallSheet.objects.get(job=job, date=date)
                    client_callsheet.production_contact = production_contact
                    client_callsheet.production_contact_phone = production_contact_phone
                    client_callsheet.location = Location.objects.get(pk=location)
                    client_callsheet.parking = parking
                    client_callsheet.hospital = hospital
                    client_callsheet.hospital_city = h_city
                    client_callsheet.hospital_state = h_state
                    client_callsheet.hospital_zip_code = h_zip_code
                    client_callsheet.hospital_address_line1 = h_address_line1
                    client_callsheet.time = time
                    client_callsheet.notes = notes
                    client_callsheet.save()
                except ClientCallSheet.DoesNotExist:
                    client_callsheet = ClientCallSheet(
                        job=job,
                        production_contact=production_contact,
                        production_contact_phone=production_contact_phone,
                        location=Location.objects.get(pk=location),
                        parking=parking,
                        hospital=hospital,
                        hospital_city=h_city,
                        hospital_state=h_state,
                        hospital_zip_code=h_zip_code,
                        hospital_address_line1=h_address_line1,
                        date=date,
                        time=time,
                        notes=notes,
                    )
                    client_callsheet.save()
                    add_callsheet_to_ppb(client_callsheet)
                continue
            try:
                JobRoleGroupType.objects.get(title=department, company=company, job=job)
            except JobRoleGroupType.DoesNotExist:
                return Response(
                    f"The department {department} does not exist.",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            job_roles = JobRole.objects.filter(
                job_role_group__job=job,
                job_role_group__job_role_group_type__title=department,
                job_role_group__job_role_group_type__company=company,
            )
            for job_role in job_roles:
                try:
                    job_memo = JobMemo.objects.get(
                        Q(job_role=job_role) & Q(accepted=True) & Q(memo_type=memo_type)
                    )
                except JobMemo.DoesNotExist:
                    continue
                call_sheet_job_memos = CallSheetJobMemo.objects.filter(
                    job_memo=job_memo
                )
                can_update_call_sheet = False
                for call_sheet_job_memo in call_sheet_job_memos:
                    if call_sheet_job_memo.call_sheet.date == call_sheet.date:
                        call_sheet_job_memo.call_sheet = call_sheet
                        call_sheet_job_memo.sent = False
                        call_sheet_job_memo.accepted = False
                        call_sheet_job_memo.save()
                        can_update_call_sheet = True
                if not can_update_call_sheet:
                    CallSheetJobMemo(
                        call_sheet=call_sheet,
                        job_memo=job_memo,
                        name=job_memo.full_name,
                        time=time,
                    ).save()
        return Response({"Success": True}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, id):
        try:
            call_sheet_job_memo = CallSheetJobMemo.objects.get(pk=id)
        except CallSheetJobMemo.DoesNotExist:
            return Response(
                f"CallSheetJobMemo {id} does not exist.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {}
        data["callsheet"] = CallSheetSerializer(
            instance=call_sheet_job_memo.call_sheet
        ).data
        data["time"] = call_sheet_job_memo.time
        data["name"] = call_sheet_job_memo.name
        data[
            "department"
        ] = (
            call_sheet_job_memo.job_memo.job_role.job_role_group.job_role_group_type.title
        )
        data["position"] = call_sheet_job_memo.job_memo.job_role.job_role_type.title
        data["state"] = call_sheet_job_memo.job_memo.state
        data["city"] = call_sheet_job_memo.job_memo.city
        data["rate"] = call_sheet_job_memo.job_memo.working_rate
        data["total_hours"] = call_sheet_job_memo.job_memo.daily_hours
        data["accepted"] = call_sheet_job_memo.accepted
        data["job"] = JobReadSerializer(
            instance=call_sheet_job_memo.job_memo.job_role.job_role_group.job
        ).data
        return Response(data, status=status.HTTP_200_OK)

    def destroy(self, request, id):
        try:
            call_sheet_job_memo = CallSheetJobMemo.objects.get(pk=id)
            call_sheet_job_memo.delete()
        except CallSheetJobMemo.DoesNotExist:
            return Response(
                f"CallSheetJobMemo {id} does not exist.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response([], status=status.HTTP_200_OK)


class JobCallSheetJobMemoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = CallSheetJobMemo.objects.all()
    serializer_class = CallSheetSerializer

    def partial_update(self, request, job_id, pk):
        time = request.data["time"]
        try:
            time = datetime.datetime.strptime(time, "%I:%M %p").time()
        except Exception:
            return Response(
                "Time should be in 'HH:MM AM|PM' format.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        call_sheet_job_memo = CallSheetJobMemo.objects.get(pk=pk)
        call_sheet_job_memo.name = request.data["name"]
        call_sheet_job_memo.time = time
        call_sheet_job_memo.save()
        call_sheet_data = get_call_sheet_job_memo(call_sheet_job_memo)
        return Response(call_sheet_data, status=status.HTTP_200_OK)

    def destroy(self, request, job_id, pk):
        return super(JobCallSheetJobMemoViewSet, self).destroy(request=request, pk=pk)

    def remove_callsheet_jobmemos(self, request, job_id):
        if not job_id:
            raise NotImplementedError(
                "This API doesn't support execution missing gig id."
            )
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(
                f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST
            )
        CallSheetJobMemo.objects.filter(pk__in=request.data["ids"]).delete()
        return Response({"Success": True}, status=status.HTTP_200_OK)


class CallSheetAcceptViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = CallSheetSerializer

    def create(self, request, pk=None):
        call_sheet_job_memo_id = pk
        call_sheet_job_memo = CallSheetJobMemo.objects.get(pk=call_sheet_job_memo_id)
        call_sheet_job_memo.accepted = True
        call_sheet_job_memo.save()
        data = {}
        data["callsheet"] = CallSheetSerializer(
            instance=call_sheet_job_memo.call_sheet
        ).data
        data["time"] = call_sheet_job_memo.time
        data["name"] = call_sheet_job_memo.name
        data[
            "department"
        ] = (
            call_sheet_job_memo.job_memo.job_role.job_role_group.job_role_group_type.title
        )
        data["position"] = call_sheet_job_memo.job_memo.job_role.job_role_type.title
        data["state"] = call_sheet_job_memo.job_memo.state
        data["city"] = call_sheet_job_memo.job_memo.city
        data["rate"] = call_sheet_job_memo.job_memo.working_rate
        data["total_hours"] = call_sheet_job_memo.job_memo.daily_hours
        data["accepted"] = call_sheet_job_memo.accepted
        data["job"] = JobReadSerializer(
            instance=call_sheet_job_memo.job_memo.job_role.job_role_group.job
        ).data
        return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_callsheets_in_a_user(request, user_id=None):
    if not user_id:
        raise NotImplementedError("This API doesn't support execution missing user id.")
    try:
        user = BenjiAccount.objects.get(pk=user_id)
    except BenjiAccount.DoesNotExist:
        return Response(
            f"BenjiAccount {user_id} does not exist.",
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        callsheet_status = request.GET["status"]
        if callsheet_status.lower() == "accepted":
            accepted = True
        else:
            accepted = False
        call_sheet_job_memos = CallSheetJobMemo.objects.filter(
            job_memo__benji_account=user, sent=True, accepted=accepted
        ).order_by("call_sheet__date", "call_sheet__time")
    except KeyError:
        call_sheet_job_memos = CallSheetJobMemo.objects.filter(
            job_memo__benji_account=user,
            sent=True,
        ).order_by("call_sheet__date", "call_sheet__time")
    results = []
    for call_sheet_job_memo in call_sheet_job_memos:
        job = call_sheet_job_memo.job_memo.job_role.job_role_group.job
        if job.status == JOB_STATUS_ACTIVE:
            memo_type = DEAL_MEMO
        else:
            memo_type = HOLD_MEMO
        if (
            call_sheet_job_memo.job_memo.memo_type == memo_type
            and call_sheet_job_memo.job_memo.accepted
        ):
            data = {}
            data["id"] = call_sheet_job_memo.id
            data["accepted"] = call_sheet_job_memo.accepted
            data["job"] = JobReadSerializer(
                instance=call_sheet_job_memo.job_memo.job_role.job_role_group.job
            ).data
            data["callsheet"] = CallSheetSerializer(
                instance=call_sheet_job_memo.call_sheet
            ).data
            results.append(data)
    return Response(results)
