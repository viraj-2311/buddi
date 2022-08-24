from django.urls import include, path

from apps.jobs.view.documents import JobDocumentViewSet

v1_urlpatterns = [
    path("job/<int:job_id>/document/",
         JobDocumentViewSet.as_view({"post": "create", "get": "list"}),
         name="job-document"),
    path("document/<int:pk>/",
         JobDocumentViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-document-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
