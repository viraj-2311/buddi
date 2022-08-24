from django.urls import include, path

from apps.jobs.view.bid import JobBidViewSet

v1_urlpatterns = [
    path("job/<int:job_id>/bid/",
         JobBidViewSet.as_view({"post": "create", "get": "list"}),
         name="job-bid"),
    path("bid/<int:pk>/",
         JobBidViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-bid-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
