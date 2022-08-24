import datetime
import asyncio
import os

from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.finance.models import InvoiceMemo, Invoice
from apps.jobs.constants import (
    ACCOUNT_COMPANY_NO_RELATION,
    ACCOUNT_COMPANY_RELATION_CONTRACTOR,
    ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    AGENCY_MEMO,
    CONTRACTOR_W2_MEMO,
    CONTRACTOR_W9_MEMO,
    DEAL_MEMO,
    EMPLOYEE_MEMO,
    HOLD_MEMO,
    JOB_STATUS_ACTIVE,
    MemoChoiceLevelInJob,
    ACCOUNT_COMPANY_RELATION_OWNER,
    PAYMENT_STATUS_PAYMENT_SENT,
    JOB_STATUS_PENDING,
)
from apps.jobs.exceptions import (
    AgencyMemoNotSetupError,
    ContractorMemoNotSetupError,
    EmployeeMemoNotSetupError,
    MemoNotSetupError,
)
from apps.jobs.models import (
    Cast,
    CompanyDashboardJobRoles,
    Job,
    JobMemo,
    JobMemoAttachment,
    JobMemoInvitationToken,
    JobMemoShootDate,
    JobRole,
    VirtualMemo,
    JobMemoRate,
    JobRoleId,
)
from apps.jobs.permissions import MemoAcceptDeclinePermission, MemoPermission
from apps.jobs.serializers import (
    BenjiAccountSerializer,
    JobMemoSerializer,
    JobReadSerializer,
    VirtualMemoReadSerializer,
    VirtualMemoSerializer,
    JobReadSerializerChild,
)
from apps.jobs.utils import (
    add_field_in_request_data,
    get_all_job_memo_dates,
    get_dashboard_access_role_ids,
    get_max_job_memo_date,
    get_memo_activation_expiry_time,
    get_memo_status,
    get_min_job_memo_date,
    get_talent_id,
    remove_chief_roles_by_memo,
    retrieve_all_departments,
    retrieve_all_job_roles,
    send_memo_cancel_notification,
    send_memo_notification,
    set_chief_roles_by_memo, send_updated_memo_notification,
)
from apps.jobs.view.cast import add_cast_to_ppb
from apps.user.constants import DIRECTOR, EXECUTIVE_PRODUCER, LINE_PRODUCER, VIA_BUDDISYSTEMS, BUDDI_ADMIN
from apps.user.models import (
    BenjiAccount, BenjiAccountInvitationToken, CompanyBenjiAccountEntry
)
from apps.user.utils import (
    get_account_company_relationship,
    get_token,
    get_user_activation_expiry_time,
    is_user_contractor,
    is_user_internal_staff,
)
from apps.notification.backends.benji_email_backend import send_email_template

from apps.sila_adapter.sila_adapter import SilaAdapter
from apps.sila_adapter.models import SilaCorporateMember

from apps.company_network.utils import (
    can_invite_to_company_network,
    add_to_company_network,
    send_invitation_to_professional,
)
from logging import getLogger
logger = getLogger(__name__)
adapter = SilaAdapter.setup(settings.SILA_CONFIG)


def add_contractor_to_network(job_memo):
    sender = job_memo.memo_sender
    reciever = job_memo.benji_account
    company = job_memo.job_role.job_role_group.job.company
    if can_invite_to_company_network(sender, reciever, company):
        add_to_company_network(sender, reciever, company)
    else:
        logger.warn(
            (
                f"Invite to company failed from {sender} to {reciever} for company "
                f"{company}"
            )
        )


def set_rates(request, job_memo):
    job_memo.rates.all().delete()
    for rate in request.data["rates"]:
        title = rate["title"]
        price_type = rate["price_type"]
        day_rate = rate.get("day_rate")
        if day_rate is not None:
            day_rate = float(day_rate)
            number_of_days = int(rate["number_of_days"])
            JobMemoRate.objects.create(job_memo=job_memo, day_rate=day_rate, number_of_days=number_of_days, title=title,
                                       price_type=price_type)
        else:
            project_rate = rate.get("project_rate")
            if project_rate is not None:
                project_rate = float(project_rate)
                JobMemoRate.objects.create(job_memo=job_memo, project_rate=project_rate, title=title,
                                           price_type=price_type)


def set_job_memo_shoot_dates(job_memo, shoot_dates):
    JobMemoShootDate.objects.filter(job_memo=job_memo).delete()
    for shoot_date in shoot_dates:
        shoot_date = datetime.datetime.strptime(shoot_date, "%Y-%m-%d").date()

        # Dhruval: Remove unnecessary try/except block and reduce database query.
        #  No need to check if job_memo_shoot_date exist because we are already deleting it above
        JobMemoShootDate(job_memo=job_memo, date=shoot_date).save()


def get_full_view(job):
    full_view_memos = list(JobMemo.objects.filter(Q(job_role__job_role_group__job=job) &
                                             (Q(memo_type=DEAL_MEMO) |
                                              (Q(memo_type=HOLD_MEMO) &
                                               Q(booked=True) &
                                               Q(accepted=False) &
                                               Q(decline=False)))))
    # full_view_memos = get_crews_to_book(job.pk)
    response_data = []
    for job_memo in full_view_memos:
        data = {}
        data["id"] = job_memo.pk
        data["department"] = job_memo.job_role.job_role_group.job_role_group_type.title
        data["position"] = job_memo.job_role.job_role_type.title
        data["name"] = job_memo.full_name
        data["date"] = get_min_job_memo_date(job_memo) + " - " + get_max_job_memo_date(job_memo)
        data["daily_hours"] = str(job_memo.daily_hours) + " hours"
        data["total_pay"] = job_memo.get_total_price
        data["status"] = get_memo_status(job_memo)
        data["choice_level"] = job_memo.choice_level
        data["memo_type"] = job_memo.memo_type
        data["accepted"] = job_memo.accepted
        data["memo_staff"] = job_memo.memo_staff
        data["decline"] = job_memo.decline
        data["booked"] = job_memo.booked
        data["canceled"] = job_memo.canceled
        data["job_role"] = job_memo.job_role.id
        response_data.append(data)
    return response_data


def get_next_eligible_deal_memo(job, job_role_type):
    deal_memos = job.job_memos.filter(memo_type="DEAL", job_role__job_role_type=job_role_type).order_by('choice_level')
    next_deal_memo = None
    for deal_memo in deal_memos:
        if (not deal_memo.accepted) and (not deal_memo.decline):
            next_deal_memo = deal_memo
            break
    return next_deal_memo, deal_memos


def send_email_to_first_in_type(job, job_role_type):
    sent_email = False
    next_eligible_deal_memo, all_deal_memos = get_next_eligible_deal_memo(job,job_role_type)
    if next_eligible_deal_memo:
        send_memo_notification_to_crews(job, [next_eligible_deal_memo])
        sent_email = True
        next_eligible_deal_memo.booked = True
        next_eligible_deal_memo.save()
        try:
            benji_account = next_eligible_deal_memo.benji_account
            parent_hold_memo = JobMemo.objects.get(job_role__job_role_type=job_role_type,job_role__job_role_group__job=job, memo_type=HOLD_MEMO, benji_account=benji_account)
            parent_hold_memo.booked = False
            parent_hold_memo.save()
        except JobMemo.DoesNotExist:
            pass
    elif all_deal_memos != []:
        producer = job.line_producer
        pass
    return sent_email,next_eligible_deal_memo



def send_memo_notification_to_next_choice(job_memo):
    job_role = job_memo.job_role
    job = job_role.job_role_group.job
    memo_type = job_memo.memo_type
    # producer_email = job.exec_producer.email
    if job_memo.choice_level == MemoChoiceLevelInJob.THIRD:
        pass
    else:
        next_choice_level = job_memo.choice_level + 1
        try:
            job_memo = JobMemo.objects.get(Q(choice_level=next_choice_level) &
                                           Q(memo_type=memo_type) &
                                           Q(job=job) &
                                           Q(job_role=job_role) &
                                           (Q(accepted=False) | (Q(booked=False) & Q(decline=False))))
            send_memo_notification_to_crews(job, [job_memo])
        except JobMemo.DoesNotExist:
            pass


def send_memo_notification_to_crews(job, job_memos):
    for job_memo in job_memos:
        if (job_memo.booked and job_memo.memo_type == HOLD_MEMO) or (job_memo.memo_type == DEAL_MEMO and job_memo.booked == False):
            try:
                job_memo_invitation_token = JobMemoInvitationToken.objects.get(job_memo=job_memo)
                job_memo_invitation_token.expiry = get_memo_activation_expiry_time()
                job_memo_invitation_token.save()
            except JobMemoInvitationToken.DoesNotExist:
                JobMemoInvitationToken.objects.create(job_memo=job_memo,
                                                      expiry=get_memo_activation_expiry_time(),
                                                      token=get_token())
            job_memo.memo_type = DEAL_MEMO
            job_memo.save()
            send_memo_notification(job_memo)


def get_crews_to_book(job_id):  # noqa
    full_view_memos = []
    unanswered_hold_memos = JobMemo.objects.filter(Q(memo_type=HOLD_MEMO) &
                                                   Q(booked=True) &
                                                   Q(accepted=False) &
                                                   Q(decline=False))
    for job_memo in unanswered_hold_memos:
        job_memo.memo_type = DEAL_MEMO
        job_memo.booked = True
        job_memo.save()
    departments = retrieve_all_departments(job_id)
    for department in departments:
        job_roles = retrieve_all_job_roles(department["id"])
        for job_role in job_roles:
            booked_memos_per_job_role = JobMemo.objects.filter(Q(job_role=job_role["id"]) &
                                                               Q(booked=True) &
                                                               Q(decline=False) &
                                                               Q(memo_type=DEAL_MEMO))
            if booked_memos_per_job_role.count():
                continue
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.FIRST) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=True) | (Q(booked=True) & Q(decline=False))))
                continue
            except JobMemo.DoesNotExist:
                pass
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.FIRST) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=False) & Q(decline=False) & Q(booked=False)))
                full_view_memos.append(job_memo)
                continue
            except JobMemo.DoesNotExist:
                pass
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.SECOND) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=True) | (Q(booked=True) & Q(decline=False))))
                continue
            except JobMemo.DoesNotExist:
                pass
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.SECOND) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=False) & Q(decline=False) & Q(booked=False)))
                full_view_memos.append(job_memo)
                continue
            except JobMemo.DoesNotExist:
                pass
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.THIRD) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=True) | (Q(booked=True) & Q(decline=False))))
                continue
            except JobMemo.DoesNotExist:
                pass
            try:
                job_memo = JobMemo.objects.get(Q(choice_level=MemoChoiceLevelInJob.THIRD) &
                                               Q(memo_type=DEAL_MEMO) &
                                               Q(job_role=job_role["id"]) &
                                               (Q(accepted=False) & Q(decline=False) & Q(booked=False)))
                full_view_memos.append(job_memo)
                continue
            except JobMemo.DoesNotExist:
                pass
    return full_view_memos


def validate_memo_creation(user, job, data):
    company = job.company
    if (is_user_internal_staff(user, company, False) and
            (data["memo_staff"] == CONTRACTOR_W2_MEMO or
             data["memo_staff"] == CONTRACTOR_W9_MEMO)):
        pass
        # raise ContractorMemoNotSetupError()
    if (is_user_internal_staff(user, company) and
            (data["memo_staff"] == AGENCY_MEMO)):
        raise AgencyMemoNotSetupError()
    if is_user_contractor(user, company) and data["memo_staff"] == EMPLOYEE_MEMO:
        raise EmployeeMemoNotSetupError()
    if job.status == JOB_STATUS_ACTIVE:
        memo_type = DEAL_MEMO
    else:
        memo_type = HOLD_MEMO

    memo_staffs = JobMemo.objects.only('id').filter(Q(benji_account=user) &
                                                    Q(job_role__job_role_group__job=job) &
                                                    ~Q(job_role=data["job_role"]) &
                                                    Q(memo_type=memo_type)).values_list("memo_staff",
                                                                                        flat=True).distinct()
    if memo_staffs.count() > 0 and data["memo_staff"] not in list(memo_staffs):
        raise MemoNotSetupError()


def update_username_and_email(user, full_name, email, position, created):
    if created:
        user.is_active = False
        first_name = full_name.split()[0]
        try:
            last_name = full_name.split()[1]
        except IndexError:
            last_name = ""
        user.first_name = first_name
        user.last_name = last_name
        user.full_name = full_name
    user.job_title = position
    user.email = email
    user.save()


def remove_virtual_memo(job_memo):
    job_role = job_memo.job_role
    choice_level = job_memo.choice_level
    VirtualMemo.objects.filter(job_role=job_role, choice_level=choice_level).delete()


def remove_hold_memo(job_memo):
    job_role = job_memo.job_role
    choice_level = job_memo.choice_level
    JobMemo.objects.filter(job_role=job_role, choice_level=choice_level, memo_type=HOLD_MEMO).delete()


def add_attachment_to_memo(job_memo, attachments, from_user: BenjiAccount):
    JobMemoAttachment.objects.filter(job_memo=job_memo).delete()
    for attachment in attachments:
        # Dhruval: Removed the variable assignment and add .save() directly
        JobMemoAttachment(
            job_memo=job_memo,
            name=attachment["name"],
            path=attachment["path"],
            size=attachment["size"],
            type=attachment["type"],
            uploaded_by=from_user
        ).save()


def get_production_crews(job_memo):
    job = job_memo.job_role.job_role_group.job
    job_memos = JobMemo.objects.filter(job_role__job_role_group__job=job,
                                       job_role__job_role_type__title__in=[EXECUTIVE_PRODUCER, DIRECTOR, LINE_PRODUCER],
                                       accepted=True).prefetch_related("benji_account", "job_role__job_role_type")
    production_crews = []
    for job_memo in job_memos:
        production_crews.append({
            "id": job_memo.benji_account.pk,
            "avatar": job_memo.benji_account.profile_photo_s3_url,
            "full_name": job_memo.benji_account.full_name,
            "position": job_memo.job_role.job_role_type.title,
        })
    return production_crews


def can_handle_memo(user, job_memo):
    if job_memo.memo_staff == AGENCY_MEMO:
        if job_memo.agency == user:
            return True
        if job_memo.benji_account == user:
            return False
    else:
        if job_memo.benji_account == user:
            return True
        else:
            return False


class JobMemoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, MemoPermission)
    queryset = JobMemo.objects.all()
    serializer_class = JobMemoSerializer

    def create(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.select_related('company', 'director', 'line_producer', 'exec_producer').get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        email = request.data["email"]
        full_name = request.data["full_name"]
        position = request.data["position"]
        attachments = request.data["attachments"]
        if request.data["memo_staff"] == AGENCY_MEMO:
            agency_email = request.data["agency_email"]
            agency_full_name = request.data["agency_full_name"]
            agency, created = BenjiAccount.objects.only('is_active', 'first_name', 'last_name', 'full_name',
                                                        'job_title', 'email').get_or_create(
                defaults={"email": agency_email},
                email__iexact=agency_email)
            update_username_and_email(agency, agency_full_name, agency_email, position + " - Agency", created)
            add_field_in_request_data(request, "agency", agency.pk)
        user, created = BenjiAccount.objects.only('is_active', 'first_name', 'last_name', 'full_name', 'job_title',
                                                  'email').get_or_create(defaults={"email": email}, email__iexact=email)
        validate_memo_creation(user, job, request.data)
        update_username_and_email(user, full_name, email, position, created)
        add_field_in_request_data(request, "benji_account", user.pk)
        add_field_in_request_data(request, "memo_sender", request.user.pk)
        add_field_in_request_data(request, "booked", False)
        request.data["job"] = job.id
        job_memo_serializer = JobMemoSerializer(data=request.data)
        if job_memo_serializer.is_valid(raise_exception=True):
            job_memo = job_memo_serializer.save()
            add_attachment_to_memo(job_memo, attachments, request.user)
            remove_virtual_memo(job_memo)
        set_chief_roles_by_memo(job_memo)
        if "shoot_dates" in request.data:
            shoot_dates = request.data["shoot_dates"]
            set_job_memo_shoot_dates(job_memo, shoot_dates)
        if "rates" in request.data:
            set_rates(request, job_memo)
        if job_memo.memo_type == HOLD_MEMO:
            JobMemoInvitationToken.objects.create(job_memo=job_memo,
                                                  expiry=get_memo_activation_expiry_time(),
                                                  token=get_token())
            send_memo_notification(job_memo)
        job_memo = JobMemoSerializer(instance=job_memo).data
        job_memo["contractor_name"] = full_name
        job_memo["job_role_id"] = job_memo["job_role"]
        job_memo["company_relationship"] = get_account_company_relationship(job.company,
                                                                            user)
        job_memo["client"] = job.client
        job_memo["set_time"] = job.set_time
        job_memo["sound_check_time"] = job.sound_check_time
        return Response(job_memo, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobMemoViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):  # noqa
        email_changed = False
        jobmemo = JobMemo.objects.get(pk=pk)
        if jobmemo.accepted:
            job_memo = JobMemo.objects.get(pk=pk)
            job_memo.pk = None
            jobmemo.delete()
            job_memo.save()

        else:
            job_memo = JobMemo.objects.get(pk=pk)

        acceptance_level, email, full_name = None, None, None
        if request.data.get("acceptance_level"):
            acceptance_level = request.data.pop("acceptance_level")
        email = request.data.get("email", None)
        full_name = request.data.get("full_name")
        user, created = request.user, False
        job_role = request.data.get("job_role")
        position = request.data.get("position")

        if email:
            user, created = BenjiAccount.objects.get_or_create(defaults={"email": email}, email__iexact=email)
        if job_role:
            validate_memo_creation(user, job_memo.job_role.job_role_group.job, request.data)
        if email and full_name and position:
            update_username_and_email(user, full_name, email, request.data["position"], created)
        if user.email != job_memo.benji_account.email:
            email_changed = True
            send_memo_cancel_notification(job_memo)
        if "id" in request.data:
            request.data.pop("id")

        job_memo.save()

        if not job_memo.accepted:
            super(JobMemoViewSet, self).partial_update(request=request, pk=pk)
            job_memo = JobMemo.objects.get(pk=pk)
            job_memo.decline = False

        else:
            job_memo.email = user.email
            job_memo.city = request.data.get("city")
            job_memo.state = request.data.get("state")
            job_memo.pay_terms = request.data.get("pay_terms")
            job_memo.full_name = full_name
            job_memo.daily_hours = request.data.get("daily_hours")
            job_memo.project_rate = request.data.get("project_rate")
            job_memo.accepted = False
            job_memo.booked = False
            job_memo.is_memo = True

        if acceptance_level:
            job_memo.acceptance_level = acceptance_level
        if "kit_fee" in request.data:
            job_memo.kit_fee = request.data["kit_fee"]
        if "project_rate" in request.data:
            job_memo.project_rate = request.data["project_rate"]
        if "working_day" in request.data:
            job_memo.working_day = request.data["working_day"]
        if "working_rate" in request.data:
            job_memo.working_rate = request.data["working_rate"]
        if "daily_hours" in request.data:
            job_memo.daily_hours = request.data["daily_hours"]
        job_memo.benji_account = user
        job_memo.memo_sender = request.user
        job_memo.save()
        set_chief_roles_by_memo(job_memo)
        if "attachments" in request.data:
            attachments = request.data["attachments"]
            add_attachment_to_memo(job_memo, attachments, request.user)
        if "shoot_dates" in request.data:
            shoot_dates = request.data["shoot_dates"]
            set_job_memo_shoot_dates(job_memo, shoot_dates)
        if "rates" in request.data:
            set_rates(request, job_memo)
        try:
            job_memo_invitation_token = JobMemoInvitationToken.objects.get(job_memo=job_memo)
            if email_changed:
                job_memo_invitation_token.token = get_token()
            job_memo_invitation_token.expiry = get_memo_activation_expiry_time()
            job_memo_invitation_token.save()
        except JobMemoInvitationToken.DoesNotExist:
            JobMemoInvitationToken.objects.create(job_memo=job_memo,
                                                  expiry=get_memo_activation_expiry_time(),
                                                  token=get_token())
        if job_memo.memo_type == HOLD_MEMO:
            send_updated_memo_notification(job_memo)
        if job_memo.memo_type == DEAL_MEMO and job_memo.booked and not job_memo.accepted and not job_memo.decline:
            send_updated_memo_notification(job_memo)
        job_memo = JobMemoSerializer(instance=job_memo).data
        job_memo["job_role_id"] = job_memo["job_role"]
        return Response(job_memo, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        try:
            job_memo = JobMemo.objects.get(pk=pk)
        except JobMemo.DoesNotExist:
            return Response(f"GigMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        remove_chief_roles_by_memo(job_memo)
        return super(JobMemoViewSet, self).destroy(request=request, pk=pk)

    def bulk_delete(self, request):
        ids = request.data["ids"]
        JobMemo.objects.filter(pk__in=ids).delete()
        return Response({"Success": True}, status=status.HTTP_200_OK)

    def cancel_memo(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        try:
            job_memo = JobMemo.objects.get(pk=pk)
        except JobMemo.DoesNotExist:
            return Response(f"GigMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        remove_chief_roles_by_memo(job_memo)
        if job_memo.booked:
            send_memo_cancel_notification(job_memo)
        job_memo.delete()
        return Response({"Success": True}, status=status.HTTP_200_OK)

    def update_hold(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        try:
            job_memo = JobMemo.objects.get(pk=pk)
        except JobMemo.DoesNotExist:
            return Response(f"GigMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        if "acceptance_level" in request.data:
            job_memo.acceptance_level = request.data["acceptance_level"]
        if "optional_message" in request.data:
            job_memo.optional_message = request.data["optional_message"]
        if "attachments" in request.data:
            attachments = request.data["attachments"]
            add_attachment_to_memo(job_memo, attachments, request.user)
        job_memo.save()
        result = JobMemoSerializer(instance=job_memo).data
        result["job_role"] = job_memo.job_role.job_role_type.title
        result["job_role_group"] = job_memo.job_role.job_role_group.job_role_group_type.title
        result["job"] = JobReadSerializer(instance=job_memo.job_role.job_role_group.job).data
        result["production_crews"] = get_production_crews(job_memo)
        result["can_handle_memo"] = can_handle_memo(request.user, job_memo)
        return Response(result, status=status.HTTP_200_OK)

    def update_headline(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        try:
            job_memo = JobMemo.objects.get(pk=pk)
        except JobMemo.DoesNotExist:
            return Response(f"JobMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        # headline = request.data["headline"]
        result = JobMemoSerializer(instance=job_memo).data
        result["job_role"] = job_memo.job_role.job_role_type.title
        result["job_role_group"] = job_memo.job_role.job_role_group.job_role_group_type.title
        result["job"] = JobReadSerializer(instance=job_memo.job_role.job_role_group.job).data
        return Response(result, status=status.HTTP_200_OK)

    def update_rates(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        try:
            job_memo = JobMemo.objects.get(pk=pk)
        except JobMemo.DoesNotExist:
            return Response(f"JobMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        if "rates" in request.data:
            set_rates(request,job_memo)
        result = JobMemoSerializer(instance=job_memo).data
        return Response(result, status=status.HTTP_200_OK)


class VirtualMemoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = VirtualMemo.objects.all()
    serializer_class = VirtualMemoSerializer

    def create(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        if "benji_account" not in request.data:
            add_field_in_request_data(request, "benji_account", None)
        virtual_memo_serializer = VirtualMemoSerializer(data=request.data)
        if virtual_memo_serializer.is_valid(raise_exception=True):
            virtual_memo = virtual_memo_serializer.save()
        virtual_memo = VirtualMemoReadSerializer(instance=virtual_memo).data
        if virtual_memo["benji_account"]:
            benji_account = BenjiAccount.objects.get(pk=virtual_memo["benji_account"]["id"])
            virtual_memo["company_relationship"] = get_account_company_relationship(job.company,
                                                                                    benji_account)
        else:
            virtual_memo["company_relationship"] = ACCOUNT_COMPANY_NO_RELATION
        virtual_memo["job_role_id"] = virtual_memo["job_role"]
        return Response(virtual_memo, status=status.HTTP_201_CREATED)

    def list(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        results = []
        virtual_memos = VirtualMemo.objects.filter(job_role__job_role_group__job=job)
        for memo in virtual_memos:
            memo = VirtualMemoSerializer(instance=memo).data
            if memo["benji_account"]:
                benji_account = BenjiAccount.objects.get(pk=memo["benji_account"]["id"])
                memo["company_relationship"] = get_account_company_relationship(job.company, benji_account)
            else:
                memo["company_relationship"] = ACCOUNT_COMPANY_NO_RELATION
            memo["job_role_id"] = memo["job_role"]
            results.append(memo)
        return Response(results, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        return super(VirtualMemoViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        super(VirtualMemoViewSet, self).partial_update(request=request, pk=pk)
        virtual_memo = VirtualMemo.objects.get(pk=pk)
        job = virtual_memo.job_role.job_role_group.job
        virtual_memo = VirtualMemoReadSerializer(instance=virtual_memo).data
        if virtual_memo["benji_account"]:
            benji_account = BenjiAccount.objects.get(pk=virtual_memo["benji_account"]["id"])
            virtual_memo["company_relationship"] = get_account_company_relationship(job.company,
                                                                                    benji_account)
        else:
            virtual_memo["company_relationship"] = ACCOUNT_COMPANY_NO_RELATION
        virtual_memo["job_role_id"] = virtual_memo["job_role"]
        return Response(virtual_memo, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(VirtualMemoViewSet, self).destroy(request=request, pk=pk)


class ReplaceMemoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = JobMemoSerializer
    def replace_memo(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        from_memo = request.data["from"]
        from_choice_level = request.data["from_choice_level"]
        to_memo = request.data["to"]
        to_choice_level = request.data["to_choice_level"]
        # Replace Real Memo
        try:
            from_memo_id = from_memo["id"]
            if from_memo["is_memo"]:
                from_real_memo = JobMemo.objects.get(pk=from_memo_id)
                from_virtual_memo = None
            else:
                from_virtual_memo = VirtualMemo.objects.get(pk=from_memo_id)
                from_real_memo = None
        except (JobMemo.DoesNotExist, VirtualMemo.DoesNotExist, TypeError):
            from_real_memo = None
            from_virtual_memo = None
        try:
            to_memo_id = to_memo["id"]
            if to_memo["is_memo"]:
                to_real_memo = JobMemo.objects.get(pk=to_memo_id)
                to_virtual_memo = None
            else:
                to_virtual_memo = VirtualMemo.objects.get(pk=to_memo_id)
                to_real_memo = None
        except (JobMemo.DoesNotExist, VirtualMemo.DoesNotExist, TypeError):
            to_real_memo = None
            to_virtual_memo = None
        try:
            from_real_memo.choice_level = to_choice_level
            from_real_memo.save()
        except AttributeError:
            pass
        try:
            from_virtual_memo.choice_level = to_choice_level
            from_virtual_memo.save()
        except AttributeError:
            pass
        try:
            to_real_memo.choice_level = from_choice_level
            to_real_memo.save()
        except AttributeError:
            pass
        try:
            to_virtual_memo.choice_level = from_choice_level
            to_virtual_memo.save()
        except AttributeError:
            pass
        if from_memo:
            if from_memo["is_memo"]:
                from_memo = JobMemoSerializer(instance=from_real_memo).data
            else:
                from_memo = VirtualMemoReadSerializer(instance=from_virtual_memo).data
        if to_memo:
            if to_memo["is_memo"]:
                to_memo = JobMemoSerializer(instance=to_real_memo).data
            else:
                to_memo = VirtualMemoReadSerializer(instance=to_virtual_memo).data
        return Response({"from": from_memo, "to": to_memo}, status=status.HTTP_200_OK)


class BookCrewViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = JobMemoSerializer

    def create(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        job = Job.objects.get(pk=job_id)
        crews = request.data["crews"]
        # job_memos = get_crews_to_book(job_id)
        job_memos = JobMemo.objects.filter(pk__in=crews)
        job_role_types = set()
        for memo in job_memos:
            job_role_type = memo.job_role.job_role_type
            job_role_types.add(job_role_type)
        for job_role_type in job_role_types:
            sent_email, job_memo = send_email_to_first_in_type(job, job_role_type)
            if sent_email:
                professional = job_memo.benji_account
                invitor  = request.user
                company = job.company
                # add an invitation for corporate network to user
                try:
                    pass
                    #send_invitation_to_professional(invitor, professional, False, company)
                except Exception as e:
                    pass
            #send_memo_notification_to_crews(job, job_memos)
            ##send_memo_notification_to_next_choice(job_memos)
        return Response(get_full_view(job), status=status.HTTP_200_OK)


class JobMemoAcceptDeclineViewSet(viewsets.ModelViewSet):
    permission_classes = (MemoAcceptDeclinePermission,)
    serializer_class = JobMemoSerializer

    def create(self, request, pk=None):  # noqa
        accepted = request.data["accepted"]
        decline = request.data["decline"]

        try:
            job_memo = JobMemo.objects.get(pk=pk)
            job_role_group = job_memo.job_role.job_role_group
            job = job_role_group.job
        except JobMemo.DoesNotExist:
            return Response("This memo does not exist.", status=status.HTTP_400_BAD_REQUEST)

        if accepted and job_memo.memo_type == DEAL_MEMO:
            w9 = request.user.user_documents.filter(purpose="w9")
            if not w9:
                return Response("you haven't uploaded your documents yet", status=status.HTTP_400_BAD_REQUEST)

        try:
            job_memo_invitation_token = JobMemoInvitationToken.objects.get(job_memo=job_memo)
        except JobMemoInvitationToken.DoesNotExist:
            return Response("This memo invitation is invalid.", status=status.HTTP_400_BAD_REQUEST)
        if job_memo_invitation_token.expiry <= timezone.now():
            job_memo_invitation_token.job_memo.decline = True
            job_memo_invitation_token.job_memo.save()
            return Response("This memo invitation is expired.", status=status.HTTP_400_BAD_REQUEST)
        job_memo.accepted = accepted
        job_memo.decline = decline
        if "acceptance_level" in request.data:
            job_memo.acceptance_level = request.data["acceptance_level"]
        else:
            job_memo.acceptance_level = job_memo.choice_level

        if "optional_message" in request.data:
            job_memo.optional_message = request.data["optional_message"]
        job_memo.save()
        if job_memo.accepted:
            #add_contractor_to_network(job_memo)
            pass #TODO PA needs to get the logic correct
        if job_memo.memo_type == HOLD_MEMO and job.status == JOB_STATUS_ACTIVE:
            if accepted:
                new_job_memo = job_memo
                new_job_memo.memo_type = DEAL_MEMO
                new_job_memo.accepted = False
                new_job_memo.decline = False
                new_job_memo.booked = False
                new_job_memo.pk = None
                new_job_memo.save()
            if decline:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[job_memo.job.company.email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_HOLD_MEMO_DECLINED_ID"),
                    substitutions={
                            "producer_name": job_memo.job.company.email,
                            "crew_name": job_memo.full_name,
                            "memo_for": job_memo.job.title,
                            "position": job_memo.job_role.job_role_type.title,
                            "job_memo_patch_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                        },
                    sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
                )
        if decline and job.status == JOB_STATUS_ACTIVE and job_memo.memo_type == DEAL_MEMO:
            company = job_memo.job_role.job_role_type.company
            benji_account = request.user

            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[job_memo.job.company.email or job_memo.job.company.owner_email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_DEAL_MEMO_DECLINED_ID"),
                substitutions={
                    "producer_name": company.company_owner.full_name,
                    "crew_name": benji_account.full_name,
                    "memo_for": job_memo.job.title,
                    "position": job_memo.job_role.job_role_type.title,
                    "job_memo_patch_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                },
                sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
            )

            sent_email,jm = send_email_to_first_in_type(job,job_memo.job_role.job_role_type)
            if sent_email:
                professional = jm.benji_account
                invitor = request.user
                company = job.company
                # add an invitation for corporate network to user
                try:
                    send_invitation_to_professional(invitor, professional, False, company)
                except Exception as e:
                    pass
            else:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[job_memo.job.company.email or job_memo.job.company.owner_email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_ALL_MEMO_DECLINED_ID"),
                    substitutions={
                        "invitor_name": company.company_owner.full_name,
                        "position": job_memo.job_role.job_role_type.title,
                        "job_title": job_memo.job.title,
                        "company_name": job_memo.job.company.title,
                        "job_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                    },
                    sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
                )
        if accepted:
            # company_owner = get_company_owner(job.company)
            # if can_invite_to_company_network(job_memo.memo_sender, job_memo.benji_account, job.company):
            #     add_company_network(job_memo.memo_sender, job_memo.benji_account, job.company)
            # if can_invite_to_company_network(company_owner, job_memo.benji_account, job.company):
            #     add_company_network(company_owner, job_memo.benji_account, job.company)
            company = job_memo.job_role.job_role_type.company
            if job_memo.job_role.job_role_group.pk == get_talent_id(job):
                try:
                    Cast.objects.get(job=job_memo.job_role.job_role_group.job,
                                     job_role=job_memo.job_role,
                                     benji_account=job_memo.benji_account)
                except Cast.DoesNotExist:
                    cast = Cast(job=job_memo.job_role.job_role_group.job,
                                job_role=job_memo.job_role,
                                role_title=job_memo.job_role.job_role_type.title,
                                full_name=job_memo.full_name,
                                profile_photo=job_memo.benji_account.profile_photo_s3_url,
                                benji_account=job_memo.benji_account)
                    cast.save()
                    add_cast_to_ppb(cast)
            if job_memo.job_role.pk in get_dashboard_access_role_ids(job):
                CompanyDashboardJobRoles.objects.get_or_create(company=company,
                                                               job_role=job_memo.job_role)
            # pcbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
            #     benji_account=job_memo.benji_account, company=company)
            # if job_memo.memo_staff == EMPLOYEE_MEMO:
            if not job_memo.benji_account == request.user:
                pcbae, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    benji_account=job_memo.benji_account, company=company)
            if job_memo.memo_staff == EMPLOYEE_MEMO and not job_memo.benji_account == request.user:
                if created:
                    pcbae.relationship = ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF
                    pcbae.dashboard_access = True
                    pcbae.company = company
                    pcbae.save()
            elif not job_memo.benji_account == request.user:
                if job_memo.job_role.pk in get_dashboard_access_role_ids(job) and hasattr(company, 'sila_corporate'):
                    pcbae.dashboard_access = True
                    sila_user = job_memo.benji_account.sila_user
                    sila_corporate = company.sila_corporate
                    res = asyncio.run(
                        adapter.link_business_mamber(
                            sila_corporate,
                            sila_user,
                            SilaCorporateMember.BusinessRoleChoice.ADMINISTRATOR,
                        )
                    )
                    if res["success"] is False:
                        logger.info(
                            (
                                "link_business_member failed: sila_corporate="
                                f"{sila_corporate.id}, sila_user={sila_user.id} reason:"
                                f" {res['message']}"
                            )
                        )
                    else:
                        logger.info(
                                f"adding member {sila_user.user.email} to company={company.id}"
                        )
                        member, _ = SilaCorporateMember.objects.get_or_create(
                            sila_user=sila_user,
                            sila_corporate=sila_corporate,
                            role=SilaCorporateMember.BusinessRoleChoice.ADMINISTRATOR,
                            title=sila_user.user.full_name,
                        )
                        logger.info(f"member {member.id} added successfully")
                pcbae.relationship = ACCOUNT_COMPANY_RELATION_CONTRACTOR
                pcbae.company = company
                pcbae.save()
            if job_memo.memo_type == DEAL_MEMO:
                remove_hold_memo(job_memo)

            benji_account = request.user
            wallet_registered = hasattr(benji_account, 'sila_user') and hasattr(benji_account.sila_user, 'wallets')
            if not wallet_registered:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[benji_account.email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_SETUP_BUDDI_WALLET_NOTIFICATION_ID"),
                    substitutions={
                        "account_name": benji_account.full_name,
                        "accept_url": settings.FRONTEND_BASE_URL + '/wallet',
                    },
                    sender_name=f"{BUDDI_ADMIN} {VIA_BUDDISYSTEMS}"
                )
            if job_memo.memo_type == HOLD_MEMO:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[job_memo.job.company.email or job_memo.job.company.owner_email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_HOLD_MEMO_ACCEPT_COMPANY_NOTIFICATION_ID"),
                    substitutions={
                        "talent_name": benji_account.full_name,
                        "gig_name": job_memo.job.agency,
                        "band_name": job_memo.job.client,
                        "venue": job_memo.job.title,
                        "sound_check_time": job_memo.job.sound_check_time,
                        "set_time": job_memo.job.set_time,
                        "gigs_dashboard_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                    },
                    sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
                )
            if job_memo.memo_type == DEAL_MEMO:
                send_email_template.delay(
                    from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                    recipient_list=[job_memo.job.company.email or job_memo.job.company.owner_email],
                    email_template_id=os.getenv("EMAIL_TEMPLATE_BOOKING_MEMO_ACCEPT_COMPANY_NOTIFICATION_ID"),
                    substitutions={
                        "talent_name": benji_account.full_name,
                        "gig_name": job_memo.job.agency,
                        "band_name": job_memo.job.client,
                        "venue": job_memo.job.title,
                        "sound_check_time": job_memo.job.sound_check_time,
                        "set_time": job_memo.job.set_time,
                        "gigs_dashboard_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                    },
                    sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
                )
        if decline and job.status == JOB_STATUS_PENDING and job_memo.memo_type == HOLD_MEMO:
            company = job_memo.job_role.job_role_type.company
            benji_account = request.user
            send_email_template.delay(
                from_email=os.getenv("NO_REPLY_FROM_EMAIL"),
                recipient_list=[job_memo.job.company.email or job_memo.job.company.owner_email],
                email_template_id=os.getenv("EMAIL_TEMPLATE_HOLD_MEMO_DECLINED_ID"),
                substitutions={
                    "producer_name": company.company_owner.full_name,
                    "crew_name": benji_account.full_name,
                    "memo_for": company.title,
                    "position": job_memo.job_role.job_role_type.title,
                    "job_memo_patch_url": settings.FRONTEND_BASE_URL + f"/companies/{job.company_id}/jobs"
                },
                sender_name=f"{BUDDI_ADMIN if not job_memo.full_name else job_memo.full_name} {VIA_BUDDISYSTEMS}"
            )
        return Response({"Success": True}, status=status.HTTP_200_OK)


class CancelBookedJobMemoViewSet(viewsets.ModelViewSet):
    serializer_class = JobMemoSerializer

    def cancel_booked_memo(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        cancel = request.data["cancel"]
        if cancel:
            try:
                job_memo = JobMemo.objects.get(pk=pk)
                if job_memo.memo_type == DEAL_MEMO and job_memo.accepted == True:
                    job_memo.canceled = True
                    job_memo.save()
                    send_memo_cancel_notification(job_memo)
                return Response({"Success": True}, status=status.HTTP_200_OK)
            except JobMemo.DoesNotExist:
                return Response("This memo does not exist.", status=status.HTTP_400_BAD_REQUEST)

    def delete_booked_memo(self, request, pk=None):
        if not pk:
            raise NotImplementedError("This API doesn't support execution missing gig memo id.")
        try:
            job_memo = JobMemo.objects.get(pk=pk)
            if job_memo.memo_type == DEAL_MEMO and job_memo.accepted == True and job_memo.canceled == True:
                 job_memo.delete()
                 return Response({"Success": True}, status=status.HTTP_200_OK)
        except JobMemo.DoesNotExist:
            return Response(f"JobMemo {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def validate_memo_invitation_token(request):
    if not request.query_params.get("token"):
        return Response("Token does not exist.", status=status.HTTP_400_BAD_REQUEST)
    if not request.query_params.get("type"):
        is_agency = False
    else:
        is_agency = True
    try:
        job_memo_invitation_token = JobMemoInvitationToken.objects.get(token=request.query_params.get("token"))
        if job_memo_invitation_token.expiry <= timezone.now():
            job_memo = job_memo_invitation_token.job_memo
            job_memo.decline = True
            job_memo.save()
            return Response("Token is expired.", status=status.HTTP_400_BAD_REQUEST)
    except JobMemoInvitationToken.DoesNotExist:
        return Response("This page does not exist, please go back to your dashboard",
                        status=status.HTTP_400_BAD_REQUEST)
    job_memo = job_memo_invitation_token.job_memo
    job = job_memo.job_role.job_role_group.job
    company = job.company
    if is_agency:
        user = job_memo.agency
    else:
        user = job_memo.benji_account
    if not user.is_active:
        baat, created = BenjiAccountInvitationToken.objects.get_or_create(
            user=user,
            company=company)
        if created:
            baat.token = get_token()
            if job_memo.memo_staff == EMPLOYEE_MEMO:
                baat.relationship = ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF
            else:
                baat.relationship = ACCOUNT_COMPANY_RELATION_CONTRACTOR
        baat.expiry = get_user_activation_expiry_time()
        baat.save()
        return Response(f"{settings.FRONTEND_BASE_URL}/signup/?token={baat.token}", status=status.HTTP_200_OK)
    else:
        return Response(f"{settings.FRONTEND_BASE_URL}/jobs/{job_memo.id}/", status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_job_memos_in_a_job(request, job_id=None):
    job = get_object_or_404(Job.objects.only('status', 'company').select_related('company'), pk=job_id)
    if job.status == JOB_STATUS_ACTIVE:
        job_memos = JobMemo.objects.filter(Q(job_role__job_role_group__job_id=job_id) &
                                           (Q(memo_type=DEAL_MEMO) |
                                            (Q(memo_type=HOLD_MEMO) &
                                             Q(booked=True) &
                                             Q(accepted=False) &
                                             Q(decline=False))))
    else:
        job_memos = JobMemo.objects.filter(Q(job_role__job_role_group__job_id=job_id) & Q(memo_type=HOLD_MEMO))

    job_memos = job_memos.prefetch_related(
        'jobmemoattachment_set', 'shoot_dates', 'rates'
    ).select_related(
        'benji_account', 'job', 'agency',
    )

    results = []
    for memo in job_memos:
        memo = JobMemoSerializer(instance=memo).data
        memo["job_role_id"] = memo["job_role"]
        memo["contractor_name"] = memo["full_name"]
        try:
            benji_account = BenjiAccount.objects.only('id').get(pk=memo["benji_account"])
            memo["company_relationship"] = get_account_company_relationship(job.company,
                                                                            benji_account)
        except BenjiAccount.DoesNotExist:
            memo["company_relationship"] = ACCOUNT_COMPANY_RELATION_CONTRACTOR
        memo["client"] = job.client
        memo["set_time"] = job.set_time
        memo["sound_check_time"] = job.sound_check_time
        results.append(memo)
    virtual_memos = VirtualMemo.objects.filter(job_role__job_role_group__job=job)
    for memo in virtual_memos:
        memo = VirtualMemoReadSerializer(instance=memo).data
        if memo["benji_account"]:
            benji_account = BenjiAccount.objects.only('id').get(pk=memo["benji_account"]["id"])
            memo["company_relationship"] = get_account_company_relationship(job.company, benji_account)
        else:
            memo["company_relationship"] = ACCOUNT_COMPANY_NO_RELATION
        memo["job_role_id"] = memo["job_role"]
        memo["client"] = job.client
        memo["set_time"] = job.set_time
        memo["sound_check_time"] = job.sound_check_time
        results.append(memo)
    return Response(results)


@api_view(["DELETE"])
@permission_classes((IsAuthenticated,))
def remove_job_memo_attachment(request, job_id: int, job_memo_id: int, attachment_id: int):
    job = get_object_or_404(Job, pk=job_id)
    job_memo = get_object_or_404(JobMemo, pk=job_memo_id, job=job)
    relation = CompanyBenjiAccountEntry.objects.filter(
        company=job.company,
        benji_account=request.user,
        relationship__in=[ACCOUNT_COMPANY_RELATION_OWNER, ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF]
    ).exists()

    if relation:
        JobMemoAttachment.objects.filter(
            id=attachment_id,
            job_memo=job_memo
        ).delete()
        return Response({"status": "ok"}, status=status.HTTP_204_NO_CONTENT)
    return Response({"status": "error"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])  # noqa
@permission_classes((IsAuthenticated,))
def retrieve_job_memos_in_a_user(request, user_id=None):
    user = get_object_or_404(BenjiAccount, pk=user_id)
    try:
        job_memo_status = request.GET["status"]
        if job_memo_status == "PENDING":
            job_memos = JobMemo.objects.filter(
                (Q(benji_account=user) | Q(agency=user)) & Q(booked=True) & Q(accepted=False) & Q(
                    decline=False))
        elif job_memo_status == "ACCEPTED":
            job_memos = JobMemo.objects.filter(
                (Q(benji_account=user) | Q(agency=user)) & Q(accepted=True) & Q(decline=False))
        elif job_memo_status == "DECLINED":
            job_memos = JobMemo.objects.filter(
                (Q(benji_account=user) | Q(agency=user)) & Q(accepted=False) & Q(decline=True))
        else:
            job_memos = []
    except KeyError:
        job_memos = JobMemo.objects.filter((Q(benji_account=user) | Q(agency=user)))

    # prevent select related for the list on the else block
    if job_memos:
        job_memos = job_memos.select_related(
            'job_role', 'job_role__job_role_group__job'
        ).values()

    results = []
    for memo in job_memos:
        job_role = JobRole.objects.get(pk=memo["job_role_id"])
        job_memo = JobMemo.objects.get(pk=memo["id"])

        memo["paid_status"] = False
        try:
            invoice = Invoice.objects.get(invoice_memo__job_memo=job_memo)
            if invoice and invoice.payment_status == PAYMENT_STATUS_PAYMENT_SENT:
                memo["paid_status"] = True
        except Invoice.DoesNotExist:
            memo["paid_status"] = False

        job = JobReadSerializer(instance=job_role.job_role_group.job).data

        memo["job"] = job
        memo["dates"] = get_all_job_memo_dates(job_memo)
        memo["total_price"] = job_memo.get_total_price
        try:
            benji_account = BenjiAccount.objects.get(pk=memo["benji_account_id"])
            memo["contractor_name"] = benji_account.get_full_name()
        except BenjiAccount.DoesNotExist:
            memo["contractor_name"] = memo["full_name"]
        results.append(memo)
    return Response(results)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_job_memo_and_job(request, job_memo_id=None):
    if not job_memo_id:
        raise NotImplementedError("This API doesn't support execution missing Gig Memo id.")
    try:
        job_memo = JobMemo.objects.get(pk=job_memo_id)
    except JobMemo.DoesNotExist:
        return Response(f"JobMemo {job_memo_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    result = JobMemoSerializer(instance=job_memo).data
    result["total_price"] = job_memo.get_total_price
    result["job_role"] = job_memo.job_role.job_role_type.title
    result["job_role_group"] = job_memo.job_role.job_role_group.job_role_group_type.title
    result["job"] = JobReadSerializerChild(
        instance=job_memo.job_role.job_role_group.job,
    ).data
    result["production_crews"] = get_production_crews(job_memo)
    result["can_handle_memo"] = can_handle_memo(request.user, job_memo)
    result["paid_status"] = False
    try:
        invoice = Invoice.objects.get(invoice_memo__job_memo=job_memo)
        if invoice and invoice.payment_status == PAYMENT_STATUS_PAYMENT_SENT:
            result["paid_status"] = True
    except Invoice.DoesNotExist:
        result["paid_status"] = False
    return Response(result)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_full_view_memos_in_a_job(request, job_id=None):
    if not job_id:
        raise NotImplementedError("This API doesn't support execution missing job id.")
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    response_data = get_full_view(job)
    return Response(response_data)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_crews_accepted_memo_in_a_job(request, job_id=None):
    if not job_id:
        raise NotImplementedError("This API doesn't support execution missing job id.")
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    if job.status == JOB_STATUS_ACTIVE:
        memo_type = DEAL_MEMO
    else:
        memo_type = HOLD_MEMO
    job_memos = JobMemo.objects.filter(
        accepted=True, job_role__job_role_group__job=job, memo_type=memo_type,
    ).values_list("benji_account", "job_role__job_role_group__job_role_group_type__title").distinct()
    response_data = []
    for job_memo in job_memos:
        benji_account = BenjiAccount.objects.get(pk=job_memo[0])
        data = BenjiAccountSerializer(instance=benji_account).data
        data["department"] = job_memo[1]
        response_data.append(data)
    return Response(response_data)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_all_departments_in_a_job(request, job_id=None):
    if not job_id:
        raise NotImplementedError("This API doesn't support execution missing job id.")
    results = retrieve_all_departments(job_id)
    return Response(results)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def retrieve_all_job_roles_in_a_department(request, job_role_group_id=None):
    if not job_role_group_id:
        raise NotImplementedError("This API doesn't support execution missing job role group id.")
    results = retrieve_all_job_roles(job_role_group_id)
    return Response(results)


# @api_view(["GET"])
# @permission_classes((IsAuthenticated,))
# def retrieve_contractors_by_filter_in_a_job(request, job_id=None, filter=None):
#     if not job_id:
#         raise NotImplementedError("This API doesn't support execution missing job id.")
#     try:
#         job = Job.objects.get(pk=job_id)
#         company = job.company
#     except Job.DoesNotExist:
#         return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
#     contractors_with_memo = JobMemo.objects.filter(
#         job_role__job_role_group__job_id=job_id,
#     ).values_list("benji_account", flat=True)
#     # all_contractors = get_all_accounts_in_the_system()
#     if filter == "NO_MEMO":
#         # benji_accounts = BenjiAccount.objects.filter(pk__in=all_contractors.difference(contractors_with_memo))
#         benji_accounts = BenjiAccount.objects.all()
#         results = []
#         for benji_account in benji_accounts:
#             data = BenjiAccountSerializer(instance=benji_account).data
#             data["company_relationship"] = get_account_company_relationship(company, benji_account)
#             results.append(data)
#         return Response(results)
#     elif filter == "MEMO":
#         benji_accounts = BenjiAccount.objects.filter(pk__in=contractors_with_memo)
#         results = []
#         for benji_account in benji_accounts:
#             data = BenjiAccountSerializer(instance=benji_account).data
#             data["company_relationship"] = get_account_company_relationship(company, benji_account)
#             results.append(data)
#         return Response(results)
#     return Response("Filter value should be one of ['NO_MEMO', 'MEMO']", status=status.HTTP_400_BAD_REQUEST)
