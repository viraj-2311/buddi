from django.urls import include, path

from .views import CompanyNetworkViewSet

v1_urlpatterns = [
    # Company Network
    path("company/<int:pk>/view_company_network/",
         CompanyNetworkViewSet.as_view({"get": "view_company_network"}),
         name="view-company-network"),
    path("company/<int:pk>/company_network/sent/",
         CompanyNetworkViewSet.as_view({"get": "sent_company_networks"}),
         name="company-network-sent"),
    path("company/<int:pk>/company_network/received/",
         CompanyNetworkViewSet.as_view({"get": "received_company_networks"}),
         name="company-network-received"),
    path("company/<int:pk>/company_network/invite/",
         CompanyNetworkViewSet.as_view({"post": "invite_professional"}),
         name="company-network-invite"),
    path("company_network/connection/<int:pk>/",
         CompanyNetworkViewSet.as_view({"put": "update", "delete": "destroy", "get": "retrieve"}),
         name="company-network-detail"),
    path("company_network/connection/<int:pk>/accept/",
         CompanyNetworkViewSet.as_view({"post": "accept_network_invitation"}),
         name="accept-network-invitation"),
    path("company_network/connection/<int:pk>/reject/",
         CompanyNetworkViewSet.as_view({"post": "reject_network_invitation"}),
         name="reject-network-invitation"),
    path("company/<int:pk>/company_network/like_unlike/",
         CompanyNetworkViewSet.as_view({"post": "like_unlike"}),
         name="like-unlike"),
    path("company_network/user/<int:pk>/",
         CompanyNetworkViewSet.as_view({"get": "company_network_user_profile"}),
         name="company-network-user-profile"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
