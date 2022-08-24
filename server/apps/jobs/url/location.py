from django.urls import include, path

from apps.jobs.view.location import LocationViewSet

v1_urlpatterns = [
    # Location
    path("job/<int:job_id>/location/",
         LocationViewSet.as_view({"post": "create", "get": "list"}),
         name="location"),
    path("location/<int:pk>/",
         LocationViewSet.as_view({"put": "update", "delete": "destroy", "get": "retrieve",
                                  "patch": "partial_update"}),
         name="location-detail"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
