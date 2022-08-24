from django.urls import include, path

from .views import PersonalNetworkViewSet

v1_urlpatterns = [
    # Personal Network
    path("user/<int:pk>/view_personal_network/",
         PersonalNetworkViewSet.as_view({"get": "view_personal_network"}),
         name="view-personal-network"),
    path("user/<int:pk>/personal_network/sent/",
         PersonalNetworkViewSet.as_view({"get": "sent_personal_networks"}),
         name="personal-network-sent"),
    path("user/<int:pk>/personal_network/received/",
         PersonalNetworkViewSet.as_view({"get": "received_personal_networks"}),
         name="personal-network-received"),
    path("user/<int:pk>/personal_network/invite/",
         PersonalNetworkViewSet.as_view({"post": "invite_professional"}),
         name="personal-network-invite"),
    path("personal_network/connection/<int:pk>/",
         PersonalNetworkViewSet.as_view({"put": "update", "delete": "destroy", "get": "retrieve"}),
         name="personal-network-detail"),
    path("personal_network/connection/<int:pk>/accept/",
         PersonalNetworkViewSet.as_view({"post": "accept_network_invitation"}),
         name="accept-network-invitation"),
    path("personal_network/connection/<int:pk>/reject/",
         PersonalNetworkViewSet.as_view({"post": "reject_network_invitation"}),
         name="reject-network-invitation"),
    path("user/<int:pk>/personal_network/like_unlike/",
         PersonalNetworkViewSet.as_view({"post": "like_unlike"}),
         name="like-unlike"),
    path("personal_network/user/<int:pk>/",
         PersonalNetworkViewSet.as_view({"get": "personal_network_user_profile"}),
         name="personal-network-user-profile"),
]

urlpatterns = [
    path("", include(v1_urlpatterns)),
]
