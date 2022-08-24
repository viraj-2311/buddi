from django.urls import include, path

from apps.jobs.view.pre_production import PPBViewSet, update_ppb_settings

v1_urlpatterns = [
    # Location
    path("job/<int:job_id>/ppb_settings/",
         update_ppb_settings, name="update-ppb-settings"),
    path("job/<int:job_id>/ppb_pages/",
         PPBViewSet.as_view({"post": "create", "get": "list"}),
         name="ppb-pages"),
    path("job/<int:job_id>/ppb_pages/reset/",
         PPBViewSet.as_view({"post": "reset"}),
         name="ppb-pages-reset"),
    path("job/<int:job_id>/ppb_pages/<int:pk>/",
         PPBViewSet.as_view({"get": "retrieve"}),
         name="ppb-pages-detail"),
    path("job/<int:job_id>/ppb_pages/ordering/",
         PPBViewSet.as_view({"post": "ordering"}),
         name="ppb-pages-ordering"),
    path("job/<int:job_id>/ppb_pages/watermark/",
         PPBViewSet.as_view({"post": "watermark"}),
         name="ppb-pages-watermark"),
    path("job/<int:job_id>/ppb_pages/delete/",
         PPBViewSet.as_view({"post": "delete"}),
         name="ppb-pages-delete"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
