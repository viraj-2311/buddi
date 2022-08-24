from itertools import permutations

from rest_framework import serializers

from apps.personal_network.models import SocialNetwork, Favorites
from apps.user.models import BenjiAccount
from apps.user.serializers import BenjiAccountSerializer


class ViewCompanyNetworkInviteeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.CharField(source="invitee.email", read_only=True)
    created_date = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    company_title = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(source="invitee.id", read_only=True)
    favorite = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    source = serializers.ReadOnlyField(default='company_network')

    class Meta:
        model = SocialNetwork
        fields = (
            "id",
            "name",
            "email",
            "created_date",
            "accepted",
            "rejected",
            "job_title",
            "company_title",
            "friend_id",
            "favorite",
            "profile_photo",
            "source",
        )

    def get_favorite(self, obj):
        try:
            Favorites.objects.get(poster=obj.invitor, friend=obj.invitee)
            return True
        except Favorites.DoesNotExist:
            return False

    def get_job_title(self, obj):
        return obj.invitee.job_title

    def get_company_title(self, obj):
        return obj.invitee.company_name

    def get_name(self, obj):
        return obj.invitee.get_full_name()

    def get_created_date(self, obj):
        return obj.created_date

    def get_profile_photo(self, obj):
        return obj.invitee.profile_photo_s3_url


class ViewCompanyNetworkInvitorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.CharField(source="invitor.email", read_only=True)
    created_date = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    company_title = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(source="invitor.id", read_only=True)
    favorite = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    source = serializers.ReadOnlyField(default='company_network')

    class Meta:
        model = SocialNetwork
        fields = (
            "id",
            "name",
            "email",
            "created_date",
            "accepted",
            "rejected",
            "job_title",
            "company_title",
            "friend_id",
            "favorite",
            "profile_photo",
            "source",
        )

    def get_favorite(self, obj):
        try:
            Favorites.objects.get(poster=obj.invitee, friend=obj.invitor)
            return True
        except Favorites.DoesNotExist:
            return False

    def get_job_title(self, obj):
        return obj.invitor.job_title

    def get_company_title(self, obj):
        return obj.invitor.company_name

    def get_name(self, obj):
        return obj.invitor.get_full_name()

    def get_created_date(self, obj):
        return obj.created_date

    def get_profile_photo(self, obj):
        return obj.invitor.profile_photo_s3_url


class CNInviteeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.CharField(source="invitee.email", read_only=True)
    created_date = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    user_job_title = serializers.CharField(source="invitee.job_title", read_only=True)
    user_id = serializers.IntegerField(source="invitee.id", read_only=True)
    mutual_friends = serializers.SerializerMethodField()
    source = serializers.ReadOnlyField(default='company_network')

    class Meta:
        model = SocialNetwork
        fields = (
            "id",
            "name",
            "email",
            "created_date",
            "accepted",
            "rejected",
            "profile_photo",
            "user_id",
            "user_job_title",
            "mutual_friends",
            "source",
        )

    def get_name(self, obj):
        return obj.invitee.get_full_name()

    def get_created_date(self, obj):
        return obj.created_date

    def get_profile_photo(self, obj):
        return obj.invitee.profile_photo_s3_url

    def get_mutual_friends(self, obj):
        associated_users = [obj.invitor_obj, obj.invitee_obj]

        social_networks = set()
        friends = set()
        for user in associated_users:
            social_networks = social_networks.union(user.social_network_invitor.all())
            social_networks = social_networks.union(user.social_network_invitee.all())

        for social_network in social_networks:
            if social_network.invitee:
                friends.add(social_network.invitee)

            if social_network.invitor:
                friends.add(social_network.invitor)

        return BenjiAccountSerializer(friends, many=True).data


class CNInvitorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.CharField(source="invitor.email", read_only=True)
    created_date = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    user_job_title = serializers.CharField(source="invitor.job_title", read_only=True)
    user_id = serializers.IntegerField(source="invitor.id", read_only=True)
    mutual_friends = serializers.SerializerMethodField()
    source = serializers.ReadOnlyField(default='company_network')

    class Meta:
        model = SocialNetwork
        fields = (
            "id",
            "name",
            "email",
            "created_date",
            "accepted",
            "rejected",
            "profile_photo",
            "user_id",
            "user_job_title",
            "mutual_friends",
            "source",
        )

    def get_name(self, obj):
        return obj.invitor.get_full_name()

    def get_created_date(self, obj):
        return obj.created_date

    def get_profile_photo(self, obj):
        return obj.invitor.profile_photo_s3_url

    def get_mutual_friends(self, obj):
        network1 = obj.invitee.company_network_invitor.filter(accepted=True)
        network2 = obj.invitee.company_network_invitee.filter(accepted=True)
        network3 = obj.invitor.company_network_invitor.filter(accepted=True)
        network4 = obj.invitor.company_network_invitee.filter(accepted=True)
        network = network1 | network2 | network3 | network4
        connection_tuples = [(o.invitee.id,o.invitor.id) for o in network]
        friends = []
        my_id = obj.id
        endpoints = {obj.invitor.id, obj.invitee.id}
        for n in network:
            if n.id == my_id:
                continue
            endpoints_n = {n.invitor.id,n.invitee.id}
            diff = endpoints_n ^ endpoints
            for t in permutations(diff):
                if t in connection_tuples:
                    for side in t:
                        if side not in endpoints:
                            friends.append(BenjiAccount.objects.get(id=side))
        return BenjiAccountSerializer(list(set(friends)), many=True).data


class CompanyNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialNetwork
        fields = "__all__"
