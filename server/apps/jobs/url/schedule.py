from django.urls import include, path

from apps.jobs.view.schedule import (JobScheduleViewSet, JobShootNoteViewSet, retrieve_hold_memos_in_a_user,
                                     retrieve_schedule_in_a_user, retrieve_shoot_notes_in_a_user)

v1_urlpatterns = [
    # Event & Event Note
    path("job/<int:job_id>/schedule/",
         JobScheduleViewSet.as_view({"post": "create", "get": "list"}),
         name="job-schedule"),
    path("job/<int:job_id>/schedule_group/",
         JobScheduleViewSet.as_view({"get": "get_schedule_group"}),
         name="job-schedule-group"),
    path("schedule/<int:pk>/",
         JobScheduleViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-schedule-detail"),
    path("schedule/<int:pk>/delete_image/",
         JobScheduleViewSet.as_view({"post": "delete_schedule_image"}),
         name="job-schedule-delete-image"),
    path("job/<int:job_id>/schedule_by_date/",
         JobScheduleViewSet.as_view({"get": "schedule_by_date"}),
         name="job-schedule-by-date"),
    # Shoot Note
    path("job/<int:job_id>/shoot_note/",
         JobShootNoteViewSet.as_view({"post": "create", "get": "list"}),
         name="job-shoot-note"),
    path("shoot_note/<int:pk>/",
         JobShootNoteViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-shoot-note-detail"),
    path("shoot_note/<int:pk>/delete_image/",
         JobShootNoteViewSet.as_view({"post": "delete_shoot_note_image"}),
         name="job-shoot-note-delete-image"),
    path("job/<int:job_id>/shoot_note_by_date/",
         JobShootNoteViewSet.as_view({"get": "shoot_note_by_date"}),
         name="job-shoot-note-by-date"),
    # Retrieve Event Notes
    path("user/<int:user_id>/schedule/",
         retrieve_schedule_in_a_user,
         name="retrieve-event-notes-in-a-user"),
    # Retrieve Shoot Notes
    path("user/<int:user_id>/shoot_notes/",
         retrieve_shoot_notes_in_a_user,
         name="retrieve-shoot-notes-in-a-user"),
    # Retrieve Hold Memos
    path("user/<int:user_id>/hold_memos/",
         retrieve_hold_memos_in_a_user,
         name="retrieve-hold-memos-in-a-user"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
