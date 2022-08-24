from django.urls import include, path

from apps.jobs.view.script import JobScriptViewSet

v1_urlpatterns = [
    path("job/<int:job_id>/script/",
         JobScriptViewSet.as_view({"post": "create", "get": "list"}),
         name="job-script"),
    path("script/<int:pk>/",
         JobScriptViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-script-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
