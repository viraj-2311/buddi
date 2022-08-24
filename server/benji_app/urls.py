"""benji_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path("", views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path("", Home.as_view(), name="home")
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path("blog/", include("blog.urls"))
"""
import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("api/v1/", include("apps.sila_adapter.urls")),
    path("api/v1/", include("apps.company_network.urls")),
    path("api/v1/", include("apps.finance.urls")),
    path("api/v1/", include("apps.help.urls")),
    path("api/v1/", include("apps.jobs.urls")),
    path("api/v1/", include("apps.message.urls")),
    path("api/v1/", include("apps.notification.urls")),
    path("api/v1/", include("apps.permission.urls")),
    path("api/v1/", include("apps.personal_network.urls")),
    path("api/v1/", include("apps.user.urls")),
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('health/', include("health_check.urls")),
]


if os.getenv('BENJI_ENVIRONMENT') in {'local', 'local_noserver', 'development', 'staging'}:
    # urlpatterns += [path('api/v1/silk/', include('silk.urls', namespace='silk'))]
    pass


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
