from django.conf import settings
import logging
import requests
import time
from typing import Callable, Union
import urllib.parse

import jwt
from oauth2client.client import OAuth2WebServerFlow

from apps.user.models import UserContact, BenjiAccount, Company

logger = logging.getLogger(__name__)


class BuddiOAuth:
    @classmethod
    def get_client(
        cls,
        oauth_provider: UserContact.ContactSourceChoice,
        entity: Union[BenjiAccount, Company],
        state: str = None,
    ) -> OAuth2WebServerFlow:
        """
        Get a instance of oauth2client.client.OAuth2WebServerFlow
        * To get auth URL, call `.flow.step1_get_authorize_url()`
        * To exchange authorization_code, call `.flow.step2_exchange()`
        """
        provider_class_mapping = {"GOOGLE": GoogleOAuthClient}
        if oauth_provider not in provider_class_mapping.keys():
            raise Exception(
                (f"OAuth provider: {oauth_provider} is not supported, expecting "
                 f"{', '.join(provider_class_mapping.keys())}")
            )

        OAuthClientClass = provider_class_mapping[oauth_provider]
        if not state:
            state = cls.generate_state(oauth_provider, entity)

        return OAuthClientClass.get_client(state=state)

    @classmethod
    def generate_state(
        cls,
        oauth_provider: UserContact.ContactSourceChoice,
        entity: Union[BenjiAccount, Company],
    ):
        """
        Use JWT key to sign email address and oauth_provider. This token should be
            attached to the auth url, and will be sent back from the Oauth callback
            as well.
        The purpose of ding so is to veirfy the authentication was initialized by
             the backend server and get the identiy from the Oauth callback
        """
        expire_time = int(time.time()) + 3600  # (1 hour)
        payload = {
            "entity_id": entity.id,
            "oauth_provider": oauth_provider,
            "exp": expire_time,
        }
        if isinstance(entity, BenjiAccount):
            account_type = "user"
        else:
            account_type = "company"

        payload.update(account_type=account_type)
        logger.info(f"oauth_generate_payload: {payload}")
        state = jwt.encode(
            payload,
            settings.SECRET_KEY,
        ).decode()

        return state

    @classmethod
    def parse_and_validate_state(cls, state: str) -> dict:
        """
        Validate JWT signature and parse the JWT paylaod
        """
        try:
            payload = jwt.decode(state, key=settings.SECRET_KEY)
        except jwt.ExpiredSignatureError:
            logger.error(f"JWT token has expired. jwt_token={state}")
            raise

        except jwt.InvalidSignatureError:
            logger.error(f"JWT token's signature is not valid. jwt_token={state}")
            raise

        return payload

    @classmethod
    def get_client_by_state(cls, state: str) -> OAuth2WebServerFlow:
        payload = cls.parse_and_validate_state(state)
        entity_id = payload.get("entity_id")
        oauth_provider = payload.get("oauth_provider")
        account_type = payload.get("account_type")
        if account_type == "user":
            entity = BenjiAccount.objects.filter(id=entity_id).first()
        else:
            entity = Company.objects.filter(id=entity_id).first()

        return cls.get_client(oauth_provider, entity, state=state)

    @classmethod
    def get_eneity_by_state(cls, state: str) -> Union[BenjiAccount, Company]:
        payload = cls.parse_and_validate_state(state)
        entity_id = payload.get("entity_id")
        account_type = payload.get("account_type")
        if account_type == "user":
            entity = BenjiAccount.objects.filter(id=entity_id).first()
        else:
            entity = Company.objects.filter(id=entity_id).first()

        return entity

    @classmethod
    def get_oauth_provider_by_state(cls, state: str) -> str:
        payload = cls.parse_and_validate_state(state)
        oauth_provider = payload.get("oauth_provider")

        return oauth_provider


class GoogleOAuthClient:
    @classmethod
    def get_client(cls, state=None) -> OAuth2WebServerFlow:
        return OAuth2WebServerFlow(
            settings.GOOGLE_OAUTH_CLIENT_ID,
            client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET,
            scope=settings.GOOGLE_OAUTH_SCOPE,
            redirect_uri=settings.GOOGLE_OAUTH_REDIRECT_URL,
            state=state,
        )


class ServiceCallerClient:
    """Third party service caller
    This is a base class that provides RESTful API call.
    How to use?
    1. Simply inherit this class and define these variables:
        `API_ENDPOINT_MAPPING`, `OAUTH_PROVIDER`, `API_BASE_URL`
    2. Put the new class onto `SERVICE_CALLER_MAPPING`
    """
    API_ENDPOINT_MAPPING = {}
    OAUTH_PROVIDER = ""
    API_BASE_URL = ""

    def __init__(self, access_token: str,  *args, **kwargs):
        self.api_base_url = self.API_BASE_URL
        self.oauth_provider = self.OAUTH_PROVIDER
        self.access_token = access_token
        for _kwarg in kwargs:
            self.setattr(_kwarg, kwargs[_kwarg])

    @classmethod
    def get_client(cls, oauth_provider: UserContact.ContactSourceChoice):
        if oauth_provider not in SERVICE_CALLER_MAPPING:
            raise Exception(
                (f"OAuth provider: {oauth_provider} is not supported, expecting "
                 f"{SERVICE_CALLER_MAPPING.keys()}")
            )
        return SERVICE_CALLER_MAPPING.get(oauth_provider)

    def call_api(
        self,
        api_name: str,
        caller_method: Callable = requests.get,
        headers: dict = None,
        json_data: dict = None,
        params: dict = None,
        callback: Callable = None,
    ):
        callback_return_value = None
        api_endpoint = self.API_ENDPOINT_MAPPING.get(api_name)
        if not api_endpoint:
            raise Exception(
                f"ServiceCallerClient cannot find api_endpoint of: {api_name}"
            )

        url = urllib.parse.urljoin(self.api_base_url, api_endpoint)
        if headers:
            headers.update(authorization=f"Bearer {self.access_token}")
        else:
            headers = {"authorization": f"Bearer {self.access_token}"}

        res = caller_method(url, json=json_data, headers=headers, params=params)
        if callback:
            callback_return_value = callback(res)

        return res, callback_return_value


class GoogleServiceCallerClient(ServiceCallerClient):
    OAUTH_PROVIDER = "GOOGLE"
    API_BASE_URL = "https://people.googleapis.com"
    API_ENDPOINT_MAPPING = {
        "contact_info": "v1/people/me/connections",
    }


SERVICE_CALLER_MAPPING = {
    "GOOGLE": GoogleServiceCallerClient
}
