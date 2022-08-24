from django.urls import include, path

from apps.jobs.view.client_info import JobAgencyViewSet, JobClientViewSet

v1_urlpatterns = [
    path("job/<int:job_id>/agency/",
         JobAgencyViewSet.as_view({"post": "create", "get": "list"}),
         name="job-agency"),
    path("agency/<int:pk>/",
         JobAgencyViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-agency-detail"),
    path("job/<int:job_id>/client/",
         JobClientViewSet.as_view({"post": "create", "get": "list"}),
         name="job-client"),
    path("client/<int:pk>/",
         JobClientViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-client-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
