from django.db.models import Q

from rest_framework import permissions

from apps.jobs.constants import AGENCY_MEMO, DEAL_MEMO, HOLD_MEMO
from apps.jobs.models import JobMemo
from apps.jobs.utils import get_dashboard_access_role_ids, get_exec_producer_id, get_line_producer_id
from apps.user.utils import is_user_internal_staff


class MemoPermission(permissions.BasePermission):
    message = "You don't have permission to update this memo. Please wait until an agency handles it."

    def has_permission(self, request, view):
        if view.action == "update_hold":
            job_memo_pk = view.kwargs.get("pk", None)
            if not job_memo_pk:
                return False
            try:
                job_memo = JobMemo.objects.get(pk=job_memo_pk)
            except JobMemo.DoesNotExist:
                return False
            user = request.user
            if job_memo.memo_staff != AGENCY_MEMO and job_memo.benji_account == user:
                return True
            elif job_memo.memo_staff == AGENCY_MEMO:
                if job_memo.agency == user:
                    return True
                else:
                    return False
            else:
                return False
        else:
            return True


class MemoAcceptDeclinePermission(permissions.BasePermission):
    message = "You don't have permission to accept/decline this memo. Please wait until an agency handles it."

    def has_permission(self, request, view):
        job_memo_pk = view.kwargs.get("pk", None)
        if not job_memo_pk:
            return False
        try:
            job_memo = JobMemo.objects.get(pk=job_memo_pk)
        except JobMemo.DoesNotExist:
            return False
        user = request.user
        if job_memo.memo_staff != AGENCY_MEMO and job_memo.benji_account == user:
            return True
        elif job_memo.memo_staff == AGENCY_MEMO:
            if job_memo.agency == user:
                return True
            else:
                return False
        else:
            return False


def can_activate_job(user, job):
    if is_user_internal_staff(user, job.company):
        return True
    job_memos = JobMemo.objects.filter(Q(job_role__job_role_group__job=job) &
                                       Q(benji_account=user) &
                                       Q(accepted=True))
    for job_memo in job_memos:
        if job_memo.job_role.pk in [get_exec_producer_id(job), get_line_producer_id(job)]:
            return True
    return False


def can_access_job(user, job_memo):
    job_role = job_memo.job_role
    job = job_role.job_role_group.job
    if job_role.pk in [get_exec_producer_id(job), get_line_producer_id(job)]:
        if job_memo.accepted:
            return True
        else:
            if job_memo.memo_type == DEAL_MEMO and not job_memo.decline:
                try:
                    hold_memo = JobMemo.objects.get(job_role=job_role,
                                                    memo_type=HOLD_MEMO,
                                                    benji_account=user)
                    if hold_memo.accepted:
                        return True
                except JobMemo.DoesNotExist:
                    return False
    elif job_role.pk in get_dashboard_access_role_ids(job):
        if job_memo.accepted:
            return True
    return False
