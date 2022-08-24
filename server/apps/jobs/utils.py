import base64
import datetime
import logging
import os
import shutil
import tempfile
import time
from tempfile import mkdtemp

import boto3
import requests
from django.conf import settings
from django.forms.models import model_to_dict
from django.utils import timezone
from googlegeocoder import GoogleGeocoder
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.finance.models import Invoice, InvoiceReceipt, InvoiceLineItem
from apps.finance.render import Render
from apps.jobs.constants import AGENCY_MEMO, CONTRACTOR_W2_MEMO, CONTRACTOR_W9_MEMO, DEAL_MEMO, EMPLOYEE_MEMO, HOURLY, \
    HOLD_MEMO
from apps.jobs.models import (Job, JobMemoAttachment, JobMemoInvitationToken, JobMemoShootDate, JobRole, JobRoleGroup,
                              JobRoleGroupId, JobRoleId, JobShootDate, JobMemo, JobMemoRate)
from apps.notification.backends.benji_email_backend import send_email_template
from apps.user.constants import VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.models import BenjiAccount

logger = logging.getLogger(__name__)


def get_dashboard_access_role_ids(job):
    result = []
    job_role, created = JobRoleId.objects.get_or_create(job=job)
    result.append(job_role.exec_producer_id)
    result.append(job_role.line_producer_id)
    result.append(job_role.production_manager_id)
    result.append(job_role.production_coordinator_id)
    return result


def get_chief_role_ids(job):
    result = []
    job_role, created = JobRoleId.objects.defer('job_id', 'production_manager_id',
                                                'production_coordinator_id').get_or_create(job=job)
    result.append(job_role.exec_producer_id)
    result.append(job_role.line_producer_id)
    result.append(job_role.director_id)
    return result


def get_exec_producer_id(job):
    job_role, created = JobRoleId.objects.get_or_create(job=job)
    return job_role.exec_producer_id


def get_line_producer_id(job):
    job_role, created = JobRoleId.objects.get_or_create(job=job)
    return job_role.line_producer_id


def get_director_id(job):
    job_role, created = JobRoleId.objects.get_or_create(job=job)
    return job_role.director_id


def get_talent_id(job):
    job_role_group, created = JobRoleGroupId.objects.get_or_create(job=job)
    return job_role_group.talent_id


def set_chief_roles_by_memo(job_memo):
    benji_account = job_memo.benji_account
    job_role_id = job_memo.job_role.pk
    job = job_memo.job_role.job_role_group.job
    job_role, created = JobRoleId.objects.defer('job_id', 'production_manager_id',
                                                'production_coordinator_id').get_or_create(job=job)
    if job_role_id in get_chief_role_ids(job):
        if job_role_id == job_role.exec_producer_id:
            job.exec_producer_name = job_memo.full_name
            job.exec_producer = benji_account
        if job_role_id == job_role.line_producer_id:
            job.line_producer_name = job_memo.full_name
            job.line_producer = benji_account
        if job_role_id == job_role.director_id:
            job.director_name = job_memo.full_name
            job.director = benji_account
        job.save()


def remove_chief_roles_by_memo(job_memo):
    job_role_id = job_memo.job_role.pk
    job = job_memo.job_role.job_role_group.job
    job_role, created = JobRoleId.objects.get_or_create(job=job)
    if job_role_id in get_chief_role_ids(job):
        if job_role_id == job_role.exec_producer_id:
            job.exec_producer_name = ""
            job.exec_producer = None
        if job_role_id == job_role.line_producer_id:
            job.line_producer_name = ""
            job.line_producer = None
        if job_role_id == job_role.director_id:
            job.director_name = ""
            job.director = None
        job.save()


def get_memo_activation_expiry_time():
    return timezone.now() + datetime.timedelta(hours=settings.MEMO_INVITATION_TOKEN_EXPIRY)


def consecutiveRanges(dates, n):
    length = 1
    dates_list = []
    if n == 0:
        return dates_list
    for i in range(1, n + 1):
        if i == n or (dates[i] - dates[i - 1]).days != 1:
            if length == 1:
                dates_list.append(custom_strftime("%B {S} %Y", dates[i - length]))
            else:
                if dates[i - length].year == dates[i - 1].year:
                    if dates[i - length].month == dates[i - 1].month:
                        temp = (custom_strftime("%B {S}", dates[i - length]) +
                                "-" + custom_strftime("{S}, ", dates[i - 1]) + " " + str(dates[i - length].year))
                    else:
                        temp = (custom_strftime("%B {S}", dates[i - length]) +
                                "-" + custom_strftime("%B {S}, ", dates[i - 1]) + " " + str(dates[i - length].year))
                else:
                    temp = (custom_strftime("%B {S} %Y", dates[i - length]) +
                            " - " + custom_strftime("%B {S} %Y", dates[i - 1]))
                dates_list.append(temp)
            length = 1
        else:
            length += 1
    return dates_list


def get_max_job_memo_date(job_memo):
    dates_list = []
    job_memo_shoot_dates = JobMemoShootDate.objects.filter(job_memo=job_memo)
    for job_memo_shoot_date in job_memo_shoot_dates:
        dates_list.append(job_memo_shoot_date.date)
    if dates_list:
        return custom_strftime("%b {S} %Y", max(dates_list))
    else:
        return custom_strftime("%b {S} %Y", timezone.now())


def get_min_job_memo_date(job_memo):
    dates_list = []
    job_memo_shoot_dates = JobMemoShootDate.objects.filter(job_memo=job_memo)
    for job_memo_shoot_date in job_memo_shoot_dates:
        dates_list.append(job_memo_shoot_date.date)
    if dates_list:
        return custom_strftime("%b {S} %Y", min(dates_list))
    else:
        return custom_strftime("%b {S} %Y", timezone.now())


def suffix(d):
    return "th" if 11 <= d <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(d % 10, "th")


def custom_strftime(format, t):
    return t.strftime(format).replace("{S}", str(t.day) + suffix(t.day))


def get_all_job_memo_dates(job_memo):
    job_memo_shoot_dates = JobMemoShootDate.objects.filter(
        job_memo=job_memo
    ).order_by("date").values_list('date', flat=True)
    return ", ".join(consecutiveRanges(job_memo_shoot_dates, len(job_memo_shoot_dates)))


def get_all_job_dates(job):
    job_shoot_dates = JobShootDate.objects.filter(job=job).order_by("date").values_list('date', flat=True)
    _count = len(job_shoot_dates)
    return ", ".join(consecutiveRanges(job_shoot_dates, _count))


def get_all_individual_job_dates(job):
    job_shoot_dates = JobShootDate.objects.filter(job=job).order_by("date")
    return ", ".join([custom_strftime("%b {S} %Y", job_shoot_date.date) for job_shoot_date in job_shoot_dates])


def get_job_shoot_dates(job):
    job_shoot_dates = JobShootDate.objects.filter(job=job)
    response_data = []
    for job_shoot_date in job_shoot_dates:
        response_data.append(job_shoot_date.date)
    return response_data


def get_job_memo_shoot_dates(job_memo):
    job_memo_shoot_dates = JobMemoShootDate.objects.filter(job_memo=job_memo)
    response_data = []
    for job_memo_shoot_date in job_memo_shoot_dates:
        response_data.append(job_memo_shoot_date.date)
    return response_data


def send_updated_memo_notification(job_memo: JobMemo):
    """
    This will send email to the talent when band leader updates the memo
    """

    job = job_memo.job

    # to get the sender's full name and send it in the email
    benji_account = BenjiAccount.objects.only('full_name').get(email=job.company.owner_email)

    token = JobMemoInvitationToken.objects.get(job_memo=job_memo).token

    substitutions = {
        "company_name": job.company.title,
        "gig_name": job.agency,
        "band_name": job.client,
        "venue": job.title,
        "sound_check_time": job.sound_check_time,
        "set_time": job.set_time,
        "gigs_dashboard_url": f"{settings.FRONTEND_BASE_URL}/view-memo/?token={token}&email={job_memo.email}"
    }

    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=[job_memo.email],
        email_template_id=os.getenv("EMAIL_TEMPLATE_EDIT_MEMO_NOTIFICATION_ID"),
        substitutions=substitutions,
        sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}"
    )


def send_memo_notification(job_memo: JobMemo):
    job_memo.booked = True
    job_memo.save(update_fields=['booked'])
    job = job_memo.job_role.job_role_group.job

    # to get the sender's full name and send it in the email
    benji_account = BenjiAccount.objects.only('full_name').get(email=job.company.owner_email)

    token = JobMemoInvitationToken.objects.get(job_memo=job_memo).token
    full_name = job_memo.full_name
    email = job_memo.email
    dates = get_all_job_memo_dates(job_memo)
    attachments = JobMemoAttachment.objects.filter(job_memo=job_memo)
    results = []
    for attachment in attachments:
        results.append({
            "name": attachment.name,
            "path": attachment.path,
            "type": attachment.type,
            "size": attachment.size,
        })
    job_memo_patch_url = f"{settings.FRONTEND_BASE_URL}/view-memo/?token={token}&email={email}"
    full_name = f"{full_name}"

    substitutions = {
        "company_name": f"{job_memo.job.company.title}",
        "full_name": full_name,
        "position": f"{job_memo.job_role.job_role_type.title}",
        "dates": f"{dates}",
        "job_name": job_memo.job.title,
        "city": f"{job_memo.city}",
        "state": f"{job_memo.state}",
        "show_time": f"{job_memo.job.set_time}",
        "working_days": "N/A",
        "working_rate": "N/A",
        "sound_check": f"{job_memo.job.sound_check_time}",
        "band_leaders": f"{get_job_exec_producer_name(job)}, {get_job_director_name(job)}, {get_job_line_producer_name(job)}",
        "job_memo_patch_url": job_memo_patch_url,
        "headline": job_memo.headline,
        "total_amount": f"{job_memo.contract_value+job_memo.added_rates_value:,.2f}",
    }

    if (job_memo.memo_staff == CONTRACTOR_W2_MEMO or
            job_memo.memo_staff == CONTRACTOR_W9_MEMO or
            job_memo.memo_staff == AGENCY_MEMO):

        memo_title_tag = None
        if job_memo.memo_type == "HOLD":
            substitutions.update({
                "memo_type": "hold",
            })
            memo_title_tag = job_memo.memo_type
        elif job_memo.memo_type == "DEAL":
            substitutions.update({
                "memo_type": "booking",
            })
            memo_title_tag = "BOOKING"

        if job_memo.price_type == HOURLY:
            substitutions.update({
                "memo_title": f"{memo_title_tag.lower().capitalize()} Memo",
                "daily_hours": f"{job_memo.daily_hours}",
                "working_days": f"{job_memo.working_days} days",
                "working_rate": "${:,.2f}".format(job_memo.working_rate),
                "kit_fee": f"${job_memo.kit_fee}",
            })
        else:
            substitutions.update({
                "memo_title": f"{memo_title_tag.lower().capitalize()} Memo",
                "daily_hours": f"{job_memo.daily_hours}",
                "project_rate": "${:,.2f}".format(job_memo.project_rate),
                "kit_fee": f"${job_memo.kit_fee}",
            })
    elif job_memo.memo_staff == EMPLOYEE_MEMO:
        _type = 'Booking' if job_memo.memo_type == DEAL_MEMO else HOLD_MEMO
        substitutions.update({
            "memo_title": f"Company Staff {_type.lower().capitalize()} Memo",
        })
    recipients = [email]
    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=recipients,
        email_template_id=os.getenv("EMAIL_TEMPLATE_MEMO_NOTIFICATION_ID"),
        substitutions=substitutions,
        attachments=results,
        sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}"
    )
    if job_memo.memo_staff == AGENCY_MEMO:
        recipients = [job_memo.agency_email]
        job_memo_patch_url = (f"{settings.FRONTEND_BASE_URL}/view-memo/?"
                              f"token={token}&type=agency&email={job_memo.agency_email}")
        substitutions.update({
            "job_memo_patch_url": job_memo_patch_url,
            "full_name": job_memo.agency_full_name,
        })
        send_email_template.delay(
            from_email=os.getenv("INFO_FROM_EMAIL"),
            recipient_list=recipients,
            email_template_id=os.getenv("EMAIL_TEMPLATE_MEMO_NOTIFICATION_ID"),
            substitutions=substitutions,
            attachments=results,
            sender_name=f"{BUDDI_ADMIN if not benji_account.full_name else benji_account.full_name} {VIA_BUDDISYSTEMS}"
        )


def send_memo_cancel_notification(job_memo):
    full_name = job_memo.full_name
    email = job_memo.email
    if job_memo.memo_staff == AGENCY_MEMO:
        recipients = [email, job_memo.agency_email]
    else:
        recipients = [email]
    send_email_template.delay(
        from_email=os.getenv("INFO_FROM_EMAIL"),
        recipient_list=recipients,
        email_template_id=os.getenv("EMAIL_TEMPLATE_MEMO_CANCEL_NOTIFICATION_ID"),
        substitutions={
            "name": full_name,
            "memo_type": job_memo.memo_type.lower(),
            "position": f"{job_memo.job_role.job_role_type.title}",
        },
        sender_name=f"{BUDDI_ADMIN if not full_name else full_name} {VIA_BUDDISYSTEMS}"
    )


def upload_image_to_s3(image, s3_file_name):
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    location = settings.AWS_REGION
    s3 = boto3.resource("s3")
    obj = s3.Object(bucket_name, s3_file_name)
    obj.put(Body=base64.b64decode(image))
    object_url = "https://%s.s3.%s.amazonaws.com/%s" % (bucket_name, location, s3_file_name)
    return object_url


def add_field_in_request_data(request, key, value):
    data = request.data
    data[key] = value
    return request


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def retrieve_all_job_roles(job_role_group_id):
    try:
        JobRoleGroup.objects.get(pk=job_role_group_id)
    except JobRoleGroup.DoesNotExist:
        return Response(f"Department {job_role_group_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    job_roles_list = JobRole.objects.filter(job_role_group=job_role_group_id).select_related('job_role_type')
    results = []
    for job_role in job_roles_list:
        job_role_dict = model_to_dict(job_role)
        job_role_dict["job_role_type"] = model_to_dict(job_role.job_role_type)
        results.append(job_role_dict)
    return results


def retrieve_all_departments(job_id):
    try:
        Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    job_role_groups_list = JobRoleGroup.objects.filter(job=job_id).prefetch_related(
        'jobrole_set', 'jobrole_set__job_role_type',
    ).select_related(
        'job_role_group_type',
    )
    results = []
    for job_role_group in job_role_groups_list:
        job_role_group_dict = model_to_dict(job_role_group)
        job_role_group_dict["job_role_group_type"] = model_to_dict(job_role_group.job_role_group_type)
        job_roles_list = job_role_group.jobrole_set.all()
        sub_results = []
        for job_role in job_roles_list:
            job_role_dict = model_to_dict(job_role)
            job_role_dict["job_role_type"] = model_to_dict(job_role.job_role_type)
            sub_results.append(job_role_dict)
        job_role_group_dict["job_roles_list"] = sub_results
        results.append(job_role_group_dict)
    return results


def get_job_exec_producer_name(job):
    if not job.exec_producer:
        exec_producer_name = job.exec_producer_name
    else:
        exec_producer_name = job.exec_producer.get_full_name()
    return exec_producer_name


def get_job_director_name(job):
    if not job.director:
        director_name = job.director_name
    else:
        director_name = job.director.get_full_name()
    return director_name


def get_job_line_producer_name(job):
    if not job.line_producer:
        line_producer_name = job.line_producer_name
    else:
        line_producer_name = job.line_producer.get_full_name()
    return line_producer_name


def get_unique_job_number():
    jobs = Job.objects.all().order_by("-created_at")
    try:
        return int(jobs[0].job_number.replace("BEN", "")) + 1
    except IndexError:
        return 1


def get_memo_status(job_memo):
    if job_memo.memo_staff == EMPLOYEE_MEMO:
        return "Internal Staff"
    if job_memo.accepted:
        return "Confirm"
    elif job_memo.decline:
        return "Decline"
    elif job_memo.booked and job_memo.memo_type == DEAL_MEMO:
        return "Sent"
    else:
        return ""


def get_timezone_name(lat, lng):
    try:
        google_map_api_key = os.getenv("GOOGLE_MAP_API_KEY")
        timestamp = time.time()
        api_response = (requests.get(
            "https://maps.googleapis.com/maps/api/timezone/json?location={0},{1}&timestamp={2}&key={3}".format(
                lat, lng, timestamp, google_map_api_key)))
        api_response_dict = api_response.json()
        if api_response_dict["status"] == "OK":
            timezone_id = api_response_dict["timeZoneId"]
            return timezone_id
        return "America/New_York"
    except Exception:
        return "America/New_York"


def get_location(lat, lng):
    city, state, zip_code, address_line1 = "", "", "", ""
    try:
        google_map_api_key = os.getenv("GOOGLE_MAP_API_KEY")
        geocoder = GoogleGeocoder(google_map_api_key)
        results = geocoder.get((lat, lng))
        for component in results[0].address_components:
            if "street_number" in component.types:
                address_line1 += component.short_name
            if "route" in component.types:
                if address_line1:
                    address_line1 += " " + component.short_name
                else:
                    address_line1 = component.short_name
            if "locality" in component.types or "sublocality" in component.types:
                city = component.long_name
            if "administrative_area_level_1" in component.types:
                state = component.short_name
            if "postal_code" in component.types:
                zip_code = component.short_name
        return city, state, zip_code, address_line1
    except Exception:
        return city, state, zip_code, address_line1


def dump_files_in_dir_to_zip(tempdir, zip_file_name):
    shutil.make_archive(zip_file_name, 'zip', tempdir)


def get_all_documents_for_job_zipped(job_id):
    tmpdirname = mkdtemp()
    temp_name = next(tempfile._get_candidate_names())
    temp_zip_file_name = f"/tmp/invoice_and_w9_{temp_name}.zip"
    download_w9_for_job_to_dir(job_id, tmpdirname)
    create_and_zip_all_invoice_for_job(job_id, temp_zip_file_name, tmpdirname, False)
    dump_files_in_dir_to_zip(tmpdirname, temp_zip_file_name)
    return temp_zip_file_name


def create_and_zip_all_invoice_for_job(job_id, temp_zip_file_name, tmpdirname, zip=True, invoice_memo_ids=None):
    job = Job.objects.get(id=job_id, status="WRAPPED")
    shoot_dates = JobShootDate.objects.filter(job=job)

    # Dhruval: I have added select related in the below query, so it will not make separate queries
    invoices = Invoice.objects.select_related('invoice_memo__job_memo__job_role__job_role_type', 'invoice_memo',
                                              'invoice_memo__job_memo', 'invoice_memo__job_memo__job_role', ).filter(
        invoice_memo__job_memo__job=job, invoice_memo__job_memo__memo_type="DEAL")

    for invoice in invoices:
        if (not invoice_memo_ids) or (invoice.invoice_memo.id in invoice_memo_ids):
            user = invoice.benji_account
            job_memo_rates = JobMemoRate.objects.only('title', 'number_of_days', 'day_rate').filter(
                job_memo=invoice.invoice_memo.job_memo.id)
            receipts = InvoiceReceipt.objects.only('title', 'payment_due', 'notes', 'amount', 'document').filter(
                invoice=invoice)
            line_items = InvoiceLineItem.objects.only('title', 'units', 'number_of_days', 'rate').filter(
                invoice=invoice)
            file_name = f"Invoice_{user.full_name}.pdf"

            # Dhruval: Need to check if the file with same name is exists or not
            # otherwise it will override the existing pdf
            if os.path.isfile(f"{tmpdirname}/{file_name}"):
                title = invoice.invoice_memo.job_memo.job_role.job_role_type.title
                file_name = f"Invoice_{user.full_name}_{title}.pdf"

            params = {
                "invoice": invoice,
                "job": invoice.invoice_memo.job_memo.job,
                "job_memo_rates": job_memo_rates,
                "receipts": receipts,
                "line_items": line_items,
                "shoot_dates": shoot_dates
            }

            file_data = Render.render_to_string("invoice_pdf_template.html", params)
            with open(f"{tmpdirname}/{file_name}", "wb") as fh:
                fh.write(file_data)

    if zip:
        dump_files_in_dir_to_zip(tmpdirname, temp_zip_file_name)


def get_invoice_documents_for_job(job_id, invoice_memo_ids=None):
    tmpdirname = mkdtemp()
    temp_name = next(tempfile._get_candidate_names())
    temp_zip_file_name = f"/tmp/invoice_{temp_name}.zip"
    create_and_zip_all_invoice_for_job(job_id, temp_zip_file_name, tmpdirname, invoice_memo_ids=invoice_memo_ids)
    return temp_zip_file_name


def get_w9_documents_for_job(job_id):
    tmpdirname = mkdtemp()
    temp_name = next(tempfile._get_candidate_names())
    temp_zip_file_name = f"/tmp/w9_{temp_name}.zip"
    download_and_zip_all_w9_for_job(job_id, temp_zip_file_name, tmpdirname)
    return temp_zip_file_name


def get_w9list_documents_for_job(job_id, doc_ids):
    tmpdirname = mkdtemp()
    temp_name = next(tempfile._get_candidate_names())
    temp_zip_file_name = f"/tmp/w9_{temp_name}.zip"
    download_and_zip_all_w9_for_job(job_id, temp_zip_file_name, tmpdirname, doc_ids)
    return temp_zip_file_name


def download_file_from_s3_to_dir(tempdir, filename):
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    session = boto3.Session(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)
    s3 = session.resource("s3")
    key = f"{filename}"
    s3.Bucket(bucket_name).download_file(key, f'{tempdir}/{filename}')

def download_w9_for_job_to_dir(job_id, tmpdirname, doc_ids=None):
    job = Job.objects.get(id=job_id)
    job_memos_deal = job.job_memos.filter(memo_type="DEAL")
    users = (memo.benji_account for memo in job_memos_deal)
    w9_docs = (user.user_documents.filter(purpose="w9").first() for user in users)
    w9_docs = [i for i in w9_docs if i]
    s3_filenames = set([doc.path.split("/")[-1] for doc in w9_docs if doc_ids is None or doc.id in doc_ids])
    for filename in s3_filenames:
        try:
            download_file_from_s3_to_dir(tmpdirname, filename)
        except Exception:
            logger.critical(f"Error downloading {filename}", exc_info=True)


def download_and_zip_all_w9_for_job(job_id, zip_file_name, tmpdirname=None, zip=True, doc_ids=None):
    download_w9_for_job_to_dir(job_id, tmpdirname, doc_ids=None)
    if zip:
        dump_files_in_dir_to_zip(tmpdirname, zip_file_name)

