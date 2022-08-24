from django.urls import include, path

from apps.jobs.view.callsheet import (CallSheetAcceptViewSet, JobCallSheetJobMemoViewSet, JobCallSheetViewSet,
                                      retrieve_callsheets_in_a_user)

v1_urlpatterns = [
    path("job/<int:job_id>/callsheet/",
         JobCallSheetViewSet.as_view({"post": "create", "get": "list"}),
         name="job-call-sheet"),
    path("callsheet/<int:id>/",
         JobCallSheetViewSet.as_view({"delete": "destroy", "get": "retrieve"}),
         name="job-call-sheet-detail"),
    path("job/<int:job_id>/callsheet_by_date/",
         JobCallSheetViewSet.as_view({"get": "list_specific_date"}),
         name="job-call-sheet-list-specific-date"),
    path("job/<int:job_id>/preview_callsheet/",
         JobCallSheetViewSet.as_view({"get": "preview_callsheet"}),
         name="job-call-sheet-preview"),
    path("job/<int:job_id>/callsheet/dates/",
         JobCallSheetViewSet.as_view({"get": "list_call_sheet_all_dates"}),
         name="job-call-sheet-all-dates"),
    path("job/<int:job_id>/send_callsheet/",
         JobCallSheetViewSet.as_view({"post": "send_callsheet"}),
         name="job-send-call-sheet"),
    path("job/<int:job_id>/production_contact/",
         JobCallSheetViewSet.as_view({"get": "get_production_contact"}),
         name="job-call-sheet-production-contact"),
    path("job/<int:job_id>/callsheet_jobmemo/<int:pk>/",
         JobCallSheetJobMemoViewSet.as_view({"delete": "destroy", "patch": "partial_update"}),
         name="job-call-sheet-job-memo"),
    path("job/<int:job_id>/remove_callsheet_jobmemos/",
         JobCallSheetJobMemoViewSet.as_view({"post": "remove_callsheet_jobmemos"}),
         name="job-remove-call-sheet-job-memos"),
    path("callsheet/<int:pk>/accept/",
         CallSheetAcceptViewSet.as_view({"post": "create"}),
         name="call-sheet-accept-decline"),
    path("user/<int:user_id>/callsheets/",
         retrieve_callsheets_in_a_user,
         name="retrieve-callsheets-in-a-user"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
