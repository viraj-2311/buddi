from enum import Enum
from itertools import chain

from django.db.models import F, Exists, OuterRef, QuerySet, Value, CharField, Q

from apps.company_network.models import Favorites as CompanyFavorites
from apps.personal_network.models import SocialNetwork, \
    Favorites as PersonalFavorites
from apps.user.models import BenjiAccount


class SearchType(Enum):
    invitor = "invitor"
    invitee = "invitee"


class NoneSearchType(Enum):
    invitor = "invitor"
    invitee = "invitee"


class PersonalNetworkConnections:

    def __init__(self, benji_account: BenjiAccount, q=None):
        self.benji_account = benji_account
        self.q = q
        if not q:
            self.q = Q(accepted=True)

    def get_all(self):
        invitor_people_personal_network = self.get_invitor_people_from_personal_network()
        invitee_people_personal_network = self.get_invitee_people_from_personal_network()

        personal_network_connections = (
                invitor_people_personal_network |
                invitee_people_personal_network
        ).exclude(
            email=self.benji_account.email
        ).distinct(
            'email'
        )

        company_network_connections = self.get_invitee_people_from_corporate_network()

        # union results from different models
        return list(chain(
            personal_network_connections,
            company_network_connections
        ))

    def get_invitor_people_from_personal_network(self):
        return self.get_people_from_personal_network(
            SearchType.invitor, NoneSearchType.invitee
        )

    def get_invitee_people_from_personal_network(self):
        return self.get_people_from_personal_network(
            SearchType.invitee, NoneSearchType.invitor
        )

    def get_invitor_people_from_corporate_network(self):
        return self.get_people_from_company_network(
            SearchType.invitor
        )

    def get_invitee_people_from_corporate_network(self):
        return self.get_people_from_company_network(
            SearchType.invitee
        )

    def get_people_from_personal_network(
            self, search_type: SearchType, none_search_type: NoneSearchType
    ) -> 'QuerySet[SocialNetwork]':
        search_type = search_type.value
        none_search_type = f"{none_search_type.value}_company"

        if search_type == SearchType.invitee.value:
            annotate_type = SearchType.invitor.value
        else:
            annotate_type = SearchType.invitee.value

        return SocialNetwork.objects.filter(
            self.q,
            **{search_type: self.benji_account, none_search_type: None}
        ).annotate(
            name=F(annotate_type + '__full_name'),
            email=F(annotate_type + '__email'),
            friend_id=F(annotate_type + '_id'),
            job_name=F(annotate_type + '__job_title'),
            company_name=F(annotate_type + '__company_name'),
            favorite=Exists(
                PersonalFavorites.objects.filter(
                    poster_id=self.benji_account.id,
                    friend_id=OuterRef(annotate_type + '_id')
                )
            ),
            profile_photo=F(annotate_type + '__profile_photo_s3_url'),
            source=Value('personal_network', output_field=CharField()),
        ).values(
            'id',
            'name',
            'email',
            'friend_id',
            'favorite',
            'profile_photo',
            'source',
            'created_date',
        ).distinct(
            'email'
        )

    def get_people_from_company_network(self, search_type: SearchType):
        search_type = search_type.value

        if search_type == SearchType.invitee.value:
            friend_type = SearchType.invitor.value
            none_search_type = SearchType.invitor.value
            company_type = SearchType.invitor.value
        else:
            friend_type = SearchType.invitee.value
            none_search_type = 'invitor_company'
            company_type = SearchType.invitee.value

        return SocialNetwork.objects.filter(
            self.q,
            **{search_type: self.benji_account, none_search_type: None}
        ).annotate(
            name=F(f'{company_type}_company__title'),
            email=F(f'{company_type}_company__email'),
            company_id=F(f'{company_type}_company__id'),
            favorite=Exists(
                CompanyFavorites.objects.filter(
                    poster_id=self.benji_account.id,
                    friend_id=OuterRef(friend_type + '_id')
                )
            ),
            profile_photo=F('invitee_company__profile_photo_s3_url'),
            source=Value('personal_network', output_field=CharField()),
        ).values(
            'id',
            'name',
            'email',
            'company_id',
            'favorite',
            'profile_photo',
            'source',
            'created_date',
        )
