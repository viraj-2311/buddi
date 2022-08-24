from django.utils import timezone

from celery import task

from apps.jobs.models import JobMemo


@task(name="check_memo_status")
def check_memo_status():
    JobMemo.objects.filter(
        booked=True,
        accepted=False,
        decline=False,
        invitation_tokens__expiry__lte=timezone.now(),
    ).update(
        decline=True
    )
