from django.urls import include, path

from apps.jobs.view.cast import JobCastViewSet, JobWardrobeViewSet

v1_urlpatterns = [
    path("job/<int:job_id>/cast/",
         JobCastViewSet.as_view({"post": "create", "get": "list"}),
         name="job-cast"),
    path("cast/<int:pk>/",
         JobCastViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-cast-detail"),
    path("cast/<int:cast_id>/wardrobe/",
         JobWardrobeViewSet.as_view({"post": "create"}),
         name="job-wardrobe"),
    path("wardrobe/<int:pk>/",
         JobWardrobeViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "destroy"}),
         name="job-wardrobe-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
