import asyncio
import base64
import os
import io
import subprocess
import pytz
from tempfile import NamedTemporaryFile
import uuid
import datetime
from typing import Union, List
import hashlib

import logging

from django.db import transaction
from django.conf import settings
from faker import Faker
from silasdk import (
    App,
    User,
    Wallet,
    EthWallet,
    Documents,
    BusinessOperations,
    Transaction,
)
from silasdk.registrationFields import RegistrationFields

from apps.help.utils import get_default_event_loop
from apps.sila_adapter.models import (
    SilaCorporate,
    SilaUser,
    CorporateWallet,
    UserWallet,
    FiatToSilaTx,
    SilaToSilaTx,
    SilaToFiatTx,
    PlaidLinkedAccount,
    PlaidLinkedCorporateAccount,
)

from apps.sila_adapter.models import KYC_History, SilaCorporateMember
from apps.sila_adapter.serializers import (
    PlaidLinkedAccountSerializer,
    PlaidLinkedCorporateAccountSerializer,
)
from apps.sila_adapter.utils import make_pending_tx_in_force
from apps.user.models import Company

logger = logging.getLogger(__name__)
BLOCK_SIZE = 8192
fake = Faker()


class SilaAdapter:
    business_uuid = None
    _app = None

    @classmethod
    def setup(cls, config):
        environment = config.get("ENVIRONMENT")
        sila_benji_app_handle = config.get("SILA_BENJI_APP_HANDLE")
        private_key = config["PRIVATE_KEY"]
        is_private_key_encrypted = config["IS_PRIVATE_KEY_ENCRYPTED"]
        if is_private_key_encrypted:
            encryption_key_path = config["ENCRYPTION_KEY_PATH"]
            b64_encoded_and_encrypted_private_key = private_key
            cmd = (
                "openssl rsautl -verify -pubin -inkey {encryption_key_path} "
                "-in {encrypted_file}"
            )
            with NamedTemporaryFile(delete=False) as f:
                encrypted_private_key = base64.b64decode(
                    b64_encoded_and_encrypted_private_key.encode()
                )
                f.write(encrypted_private_key)

            cmd = cmd.format(
                encryption_key_path=encryption_key_path, encrypted_file=f.name
            )
            private_key = subprocess.check_output(cmd, shell=True).decode().strip()

            os.remove(f.name)
        if not private_key:
            config.get()
        cls._app = App(environment, private_key, sila_benji_app_handle)
        cls.business_uuid = config.get("SILA_BUSINESS_UUID")
        return cls

    @classmethod
    def register_user(cls, sila_user: SilaUser):
        default_wallet = sila_user.wallets.get(is_default=True)
        header = {
            "created": datetime.datetime.utcnow().timestamp(),
            "app_handle": cls._app.app_handle,
            "user_handle": sila_user.user_handle,
            "reference": uuid.uuid4().hex,
        }
        entity = {
            "type": "individual",
            "entity_name": sila_user.user.full_name,
            "business_type": "corporation",
            "naics_code": 5418,
            "first_name": sila_user.first_name,
            "last_name": sila_user.last_name,
            "birthdate": sila_user.date_of_birth.strftime("%Y-%m-%d"),
        }
        crypto_entry = {
            "crypto_code": "ETH",
            "crypto_address": default_wallet.public_key,
        }
        identity = {
            "identity_alias": "SSN",
            "identity_value": sila_user.social_security_number,
        }
        address = {
            "address_alias": "home",
            "street_address_1": sila_user.home_address,
            "city": sila_user.city,
            "state": sila_user.state,
            "country": "US",
            "postal_code": sila_user.zip,
        }
        contact = {
            "phone": sila_user.phone_number,
            "email": sila_user.user.email,
        }

        payload = {
            "header": header,
            "entity": entity,
            "crypto_entry": crypto_entry,
            "identity": identity,
            "contact": contact,
            "address": address,
        }
        response = User.register(cls._app, payload)

        return response

    @classmethod
    def register_user_wallet(cls, user_wallet: UserWallet):
        wallet_verification_signature = EthWallet.signMessage(
            user_wallet.public_key, user_wallet.private_key
        )
        header = {
            "created": datetime.datetime.utcnow().timestamp(),
            "app_handle": cls._app.app_handle,
            "user_handle": user_wallet.sila_user.user_handle,
            "crypto": "ETH",
            "reference": uuid.uuid4().hex,
        }
        wallet = {
            "blockchain_address": user_wallet.public_key,
            "blockchain_network": "ETH",
            "nickname": user_wallet.nickname,
            "default": True,
        }
        payload = {
            "wallet_verification_signature": wallet_verification_signature,
            "header": header,
            "wallet": wallet,
            "user_handle": user_wallet.sila_user.user_handle,
            "app_handle": cls._app.app_handle,
        }
        response = Wallet.registerWallet(
            cls._app, payload, user_wallet.sila_user.private_key
        )

        return response

    @classmethod
    def register_business_user(cls, sila_corporate: SilaCorporate):
        """An wallet will be created upon user registration"""
        default_wallet = sila_corporate.wallets.get(is_default=True)
        business_type_in_db = sila_corporate.business_type
        business_type = business_type_in_db.lower()
        business_type = business_type.replace("-", "_").replace(" ", "_")
        header = {
            "created": datetime.datetime.utcnow().timestamp(),
            "app_handle": cls._app.app_handle,
            "user_handle": sila_corporate.user_handle,
            "reference": uuid.uuid4().hex,
        }
        entity = {
            "type": "business",
            "entity_name": sila_corporate.legal_company_name,
            "business_type": business_type,
            "naics_code": 5418,
        }
        crypto_entry = {
            "crypto_code": "ETH",
            "crypto_address": default_wallet.public_key,
        }
        identity = {
            "identity_alias": "EIN",
            "identity_value": sila_corporate.employer_id_number,
        }
        contact = {"phone": sila_corporate.phone_number}
        if sila_corporate.business_email:
            contact["email"] = sila_corporate.business_email

        address = {
            "address_alias": "Office",
            "street_address_1": sila_corporate.business_address,
            "city": sila_corporate.city,
            "state": sila_corporate.state,
            "country": "US",
            "postal_code": sila_corporate.zip,
        }
        payload = {
            "header": header,
            "entity": entity,
            "crypto_entry": crypto_entry,
            "identity": identity,
            "contact": contact,
            "address": address,
        }
        response = User.register(cls._app, payload)

        return response

    @classmethod
    def get_entity(cls, sila_entity: Union[SilaUser, SilaCorporate]):
        response = User.getEntity(
            cls._app, {"user_handle": sila_entity.user_handle}, sila_entity.private_key
        )

        return response

    @classmethod
    async def get_entity_sections_uuid(
        cls, sila_entity: Union[SilaUser, SilaCorporate]
    ):
        res = cls.get_entity(sila_entity)
        mapping = {}
        section_mapping = {
            "phone": "phones",
            "email": "emails",
            "address": "addresses",
            "identity": "identities",
        }
        for attribute, key in section_mapping.items():
            mapping[attribute] = res[key][0]["uuid"]

        return mapping

    @classmethod
    def register_corporate_wallet(cls, corporate_wallet: CorporateWallet):
        wallet_verification_signature = EthWallet.signMessage(
            corporate_wallet.public_key, corporate_wallet.private_key
        )
        header = {
            "created": datetime.datetime.utcnow().timestamp(),
            "app_handle": cls._app.app_handle,
            "user_handle": corporate_wallet.sila_corporate.user_handle,
            "crypto": "ETH",
            "reference": uuid.uuid4().hex,
        }
        wallet = {
            "blockchain_address": corporate_wallet.public_key,
            "blockchain_network": "ETH",
            "nickname": corporate_wallet.nickname,
            "default": True,
        }
        payload = {
            "wallet_verification_signature": wallet_verification_signature,
            "header": header,
            "wallet": wallet,
            "user_handle": corporate_wallet.sila_corporate.user_handle,
            "app_handle": cls._app.app_handle,
        }
        response = Wallet.registerWallet(
            cls._app, payload, corporate_wallet.sila_corporate.private_key
        )

        return response

    @classmethod
    def update_wallet(cls, wallet: Union[CorporateWallet, Wallet]) -> dict:
        if isinstance(wallet, CorporateWallet):
            user_handle = wallet.sila_corporate.user_handle
            private_key = wallet.sila_corporate.private_key
        else:
            user_handle = wallet.sila_user.user_handle
            private_key = wallet.sila_user.private_key

        payload = {
            "user_handle": user_handle,
            "nickname": wallet.nickname,
            "default": True,
        }
        response = Wallet.update_wallet(cls._app, payload, private_key)
        return response

    # Sila plaid linkup
    @classmethod
    def get_plaid_token(cls, sila_user_handle: str):
        response = User.plaid_link_token(cls._app, sila_user_handle)
        return response["link_token"]

    # Link Account with Plaid
    @classmethod
    def link_plaid_account(
        cls, account_payload: dict, sila_user: SilaUser, company_id: int = None
    ):
        sila_user_handle = sila_user.user_handle
        user_private_key = sila_user.private_key
        payload = {
            "user_handle": sila_user_handle,
        }
        payload.update(
            account_payload
        )
        response = User.linkAccount(cls._app, payload, user_private_key, plaid=True)
        return response

    @classmethod
    def link_account_manually(
        cls,
        sila_user: SilaUser,
        account_number: str,
        routing_number: str,
        account_name: str,
        account_type: str = "CHECKING",
    ):
        if not account_name:
            account_name = f"Account: <{account_number}>"
        payload = {
            "user_handle": sila_user.user_handle,
            "account_number": account_number,
            "routing_number": routing_number,
            "account_type": account_type,
            "account_name": account_name,
        }
        response = User.linkAccount(cls._app, payload, sila_user.private_key)

        return response

    @classmethod
    def request_kyc(cls, sila_entity: Union[SilaUser, SilaCorporate]):
        payload = {"user_handle": sila_entity.user_handle}
        if isinstance(sila_entity, SilaUser):
            payload["kyc_level"] = KYC_History.KYC_LevelChoice.DOC_KYC
        else:
            payload["kyc_level"] = KYC_History.KYC_LevelChoice.KYB_STANDARD

        response = User.requestKyc(
            cls._app, payload, sila_entity.private_key, use_kyc_level=True
        )

        return response

    @classmethod
    def check_kyc(cls, sila_entity: Union[SilaUser, SilaCorporate]):
        payload = {"user_handle": sila_entity.user_handle}
        response = User.checkKyc(cls._app, payload, sila_entity.private_key)

        return response

    @classmethod
    def upload_document(
        cls, sila_entity: Union[SilaUser, SilaCorporate], file_object: io.BufferedReader
    ):
        hashed = hashlib.sha256()
        file_block = file_object.read(BLOCK_SIZE)
        while len(file_block) > 0:
            hashed.update(file_block)
            file_block = file_object.read(BLOCK_SIZE)
        file_object.seek(0)
        hashed_value = hashed.hexdigest()
        file_extension = os.path.splitext(file_object.name)[-1]
        file_extension_mapping = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".pdf": "application/pdf",
        }

        payload = {
            "name": "doc passed",
            "filename": "/home/kant/Downloads/benji/sila/doc passed",
            "hash": hashed_value,
            "mime_type": file_extension_mapping[file_extension],
            "document_type": "tax_w2",
            "identity_type": "other",
            "description": "my verification",
            "user_handle": sila_entity.user_handle,
        }
        response = Documents.uploadDocument(
            cls._app, payload, file_object.read(), sila_entity.private_key
        )

        return response

    @classmethod
    async def link_business_mamber(
        cls,
        sila_corporate: SilaCorporate,
        sila_user: SilaUser,
        role: SilaCorporateMember.BusinessRoleChoice,
    ):
        payload = {
            "user_handle": sila_user.user_handle,
            "business_handle": sila_corporate.user_handle,
            "role": role,
        }

        # check the value for ownership_stake it should to be between 0 to 100
        if role == SilaCorporateMember.BusinessRoleChoice.BENEFICIAL_OWNER:
            payload['ownership_stake'] = 10

        response = BusinessOperations.linkBusinessMember(
            cls._app,
            payload,
            sila_user.private_key,
            sila_corporate.private_key,
        )

        return response

    @classmethod
    async def unlink_business_mamber(
        cls,
        sila_corporate: SilaCorporate,
        sila_user: SilaUser,
        role: SilaCorporateMember.BusinessRoleChoice,
    ):
        payload = {
            "user_handle": sila_user.user_handle,
            "business_handle": sila_corporate.user_handle,
            "role": role,
        }

        response = BusinessOperations.unlinkBusinessMember(
            cls._app,
            payload,
            sila_user.private_key,
            sila_corporate.private_key,
        )

        return response

    @classmethod
    async def link_owner_to_roles(
        cls, sila_corporate: SilaCorporate, sila_user: SilaUser
    ):
        tasks = []
        for role in [
            SilaCorporateMember.BusinessRoleChoice.ADMINISTRATOR,
            SilaCorporateMember.BusinessRoleChoice.CONTROLLING_OFFICER,
        ]:
            task = asyncio.create_task(
                cls.link_business_mamber(sila_corporate, sila_user, role.value)
            )
            tasks.append(task)

        responses = await asyncio.gather(*tasks)
        response = {"success": True}
        for res in responses:
            if res["success"] is False:
                response.update(
                    success=False,
                    message=response.get("message", "") + res["message"] + "\n",
                )
        if response.get("message") is not None:
            response["message"] = response["message"].strip()

        return response

    @classmethod
    def get_business_roles(cls):
        data = []
        for role in SilaCorporateMember.BusinessRoleChoice:
            _role = {
                "name": role.value,
                "label": role.name.replace("_", " ").capitalize(),
            }
            data.append(_role)
        return data

    @classmethod
    def certifiy_business(cls, sila_corporate: SilaCorporate, sila_user: SilaUser):
        """Certify the business entity with business owner sila account"""
        payload = {
            "user_handle": sila_user.user_handle,
            "business_handle": sila_corporate.user_handle,
        }
        response = BusinessOperations.certifyBusiness(
            cls._app, payload, sila_user.private_key, sila_corporate.private_key
        )

        return response

    @classmethod
    def get_supported_documents(cls):
        document_types = [
            {"name": "id_nyc_id", "label": "NYC ID Card", "identity_type": "other"},
            {"name": "id_passport", "label": "Passport", "identity_type": "passport"},
            {
                "name": "doc_lease",
                "label": "Lease agreement",
                "identity_type": "contract",
            },
            {
                "name": "doc_utility",
                "label": "Utility bill",
                "identity_type": "utility",
            },
            {"name": "id_state", "label": "State ID card", "identity_type": "other"},
            {"name": "other_doc", "label": "Other Document", "identity_type": "other"},
            {"name": "other_id", "label": "Other ID", "identity_type": "other"},
            {"name": "id_military", "label": "Military ID", "identity_type": "other"},
            {
                "name": "doc_green_card",
                "label": "Permanent Resident Card (or Green Card)",
                "identity_type": "other",
            },
            {
                "name": "doc_mortgage",
                "label": "Mortgage agreement",
                "identity_type": "contract",
            },
            {
                "name": "doc_name_change",
                "label": "Court Order for Name Change",
                "identity_type": "other",
            },
            {
                "name": "doc_paystub",
                "label": "Pay Stub Documentation",
                "identity_type": "other",
            },
            {
                "name": "doc_ssa",
                "label": "Social Security Administration documentation (includes 4029)",
                "identity_type": "other",
            },
            {
                "name": "doc_ss_card",
                "label": "Social Security Card",
                "identity_type": "other",
            },
            {
                "name": "doc_tuition",
                "label": "Tuition Statement",
                "identity_type": "other",
            },
            {
                "name": "doc_uo_benefits",
                "label": "Unemployment Benefits Letter",
                "identity_type": "other",
            },
            {
                "name": "id_drivers_license",
                "label": "State-issued driver's license",
                "identity_type": "license",
            },
            {
                "name": "id_drivers_permit",
                "label": "Driver's permit",
                "identity_type": "license",
            },
            {
                "name": "id_military_dependent",
                "label": "Military Dependent's ID Card",
                "identity_type": "other",
            },
            {
                "name": "id_passport_card",
                "label": "US Passport Card",
                "identity_type": "passport",
            },
        ]

        return document_types

    @classmethod
    async def update_registration_field(
        cls,
        field: RegistrationFields,
        payload: dict,
        sila_entity: Union[SilaUser, SilaCorporate],
    ):
        payload.update(user_handle=sila_entity.user_handle)
        loop = get_default_event_loop()

        response = await loop.run_in_executor(
            None,
            User.update_registration_data,
            cls._app,
            field,
            payload,
            sila_entity.private_key,
        )

        return response

    @classmethod
    async def update_registration_data(
        cls, request_data: dict, sila_entity: Union[SilaUser, SilaCorporate]
    ) -> List[str]:
        # user_info_maaping example
        # {
        #    "key name on `request_data`":
        #       ("Sila RegistrationField", "field_name to be set on payload")
        # }
        user_info_maaping = {
            "first_name": (RegistrationFields.ENTITY, "first_name"),
            "last_name": (RegistrationFields.ENTITY, "last_name"),
            "social_security_number": (RegistrationFields.IDENTITY, "identity_value"),
            "date_of_birth": (RegistrationFields.ENTITY, "birthdate"),
            "phone_number": (RegistrationFields.PHONE, "phone"),
            "home_address": (RegistrationFields.ADDRESS, "street_address_1"),
            "city": (RegistrationFields.ADDRESS, "city"),
            "state": (RegistrationFields.ADDRESS, "state"),
            "zip": (RegistrationFields.ADDRESS, "postal_code"),
            "business_address": (RegistrationFields.ADDRESS, "street_address_1"),
            "business_email": (RegistrationFields.EMAIL, "email"),
            "legal_company_name": (RegistrationFields.ENTITY, "entity_name"),
            "business_type": (RegistrationFields.ENTITY, "business_type"),
            "employer_id_number": (RegistrationFields.IDENTITY, "identity_value"),
        }
        sections_uuid = await cls.get_entity_sections_uuid(sila_entity)
        data_for_update_list = []
        unique_fields = set()
        for key, value in request_data.items():
            data_for_update = {
                "field": user_info_maaping[key][0],
                "attribute": user_info_maaping[key][1],
                "value": value,
            }
            unique_fields.add(data_for_update["field"])
            data_for_update_list.append(data_for_update)

        tasks = []
        # For attributes belong to same field, put it together and only make a
        #   single request
        for field in unique_fields:
            same_field_attributes = filter(
                lambda x: x["field"] == field, data_for_update_list
            )
            payload = {x["attribute"]: x["value"] for x in same_field_attributes}
            payload.update(
                uuid=sections_uuid.get(field.value),
            )
            task = asyncio.create_task(
                cls.update_registration_field(field, payload, sila_entity)
            )
            tasks.append(task)

        result = await asyncio.gather(*tasks)

        return result

    # Sync plaid account via sila
    @classmethod
    def sync_plaid_accounts(cls, sila_entity: Union[SilaUser, SilaCorporate]):
        payload = {"user_handle": sila_entity.user_handle}
        if isinstance(sila_entity, SilaCorporate):
            is_corporate = True
        else:
            is_corporate = False

        response = User.getAccounts(cls._app, payload, sila_entity.private_key)
        for account in response:
            plaid_account = None
            if is_corporate:
                plaid_account, _ = PlaidLinkedCorporateAccount.objects.update_or_create(
                    company=sila_entity.company,
                    routing_number=account["routing_number"],
                    account_number=account["account_number"],
                    account_type=account["account_type"],
                    account_name=account["account_name"],
                    defaults={
                        "active": account["active"],
                        "account_status": account["account_status"],
                        "account_link_status": account["account_link_status"],
                        "match_score": account["match_score"],
                        "entity_name": account["entity_name"],
                        "account_owner_name": account["account_owner_name"],
                    },
                )
            else:
                plaid_account, _ = PlaidLinkedAccount.objects.update_or_create(
                    user=sila_entity.user,
                    routing_number=account["routing_number"],
                    account_number=account["account_number"],
                    account_type=account["account_type"],
                    account_name=account["account_name"],
                    defaults={
                        "active": account["active"],
                        "account_status": account["account_status"],
                        "account_link_status": account["account_link_status"],
                        "match_score": account["match_score"],
                        "entity_name": account["entity_name"],
                        "account_owner_name": account["account_owner_name"],
                    },
                )

    # Sync plaid account via sila
    @classmethod
    def transfer_sila_to_sila(cls, amount, sila_user, destination_handle):
        payload = {
            "amount": amount,
            "user_handle": sila_user.user_handle,
            "destination_handle": destination_handle,
        }
        response = Transaction.transferSila(cls._app, payload, sila_user.private_key)
        return response

    # Sync plaid account via sila
    @classmethod
    def transfer_fiat_to_sila(cls, amount, sila_user, account):
        payload = {
            "amount": amount,
            "user_handle": sila_user.user_handle,
            "account_name": account.account_name,
            "business_uuid": cls.business_uuid,
            "processing_type": 'SAME_DAY_ACH',
        }
        response = Transaction.issue_sila(cls._app, payload, sila_user.private_key)
        return response

    # Sync plaid account via sila
    @classmethod
    def transfer_sila_to_fiat(cls, amount, sila_user, account):
        payload = {
            "amount": amount,
            "user_handle": sila_user.user_handle,
            "account_name": account.account_name,
            "business_uuid": cls.business_uuid,
            "processing_type": 'SAME_DAY_ACH',
        }
        response = Transaction.redeemSila(cls._app, payload, sila_user.private_key)
        return response

    @classmethod
    @transaction.atomic
    def update_pending_fiat_to_sila(cls, fiat_to_sila_tx: FiatToSilaTx):
        account = fiat_to_sila_tx.account_user
        if not account:
            account = fiat_to_sila_tx.account_corporate
            sila_user = account.company.sila_corporate
        else:
            sila_user = account.user.sila_user

        search_filters = {"transaction_id": str(fiat_to_sila_tx.request_transaction_id)}
        payload = {
            "user_handle": sila_user.user_handle,
            "search_filters": search_filters,
        }
        resp = User.get_transactions(cls._app, payload, sila_user.private_key)
        loop = get_default_event_loop()
        if resp["success"]:
            loop.run_in_executor(None, cls.update_user_balances, sila_user)
            txs = resp["transactions"]
            for tx in txs:
                if tx["status"] == "success":
                    fiat_to_sila_tx.processed = True
                    fiat_to_sila_tx.sila_status = tx["status"]
                    fiat_to_sila_tx.save()

                    cls.execute_back_to_back_transactions(fiat_parent=fiat_to_sila_tx)

    @classmethod
    @transaction.atomic
    def update_pending_sila_to_sila(cls, sila_to_sila_tx: SilaToSilaTx):
        sila_user = None
        from_sila_user = None
        to_user, from_user = sila_to_sila_tx.to_user, sila_to_sila_tx.from_user
        to_company, from_company = (
            sila_to_sila_tx.to_company,
            sila_to_sila_tx.from_company,
        )
        if to_user:
            sila_user = to_user.sila_user
        elif to_company:
            sila_user = to_company.sila_corporate
        if from_user:
            from_sila_user = from_user.sila_user
        elif from_company:
            from_sila_user = from_company.sila_corporate
        if not sila_to_sila_tx.request_transaction_id:
            destination_handle = to_user.sila_user.user_handle
            amount = sila_to_sila_tx.amount
            response = cls.transfer_sila_to_sila(
                amount, from_sila_user, destination_handle
            )
            if not response["success"]:
                sila_to_sila_tx.processed = True
                sila_to_sila_tx.sila_status = response["status"]
                sila_to_sila_tx.error_msg = response["message"]
                sila_to_sila_tx.save()

        search_filters = {"transaction_id": str(sila_to_sila_tx.request_transaction_id)}
        payload = {
            "user_handle": sila_user.user_handle,
            "search_filters": search_filters,
        }
        resp = User.get_transactions(cls._app, payload, sila_user.private_key)
        loop = get_default_event_loop()
        if resp["success"]:
            txs = resp["transactions"]
            loop.run_in_executor(None, cls.update_user_balances, sila_user)
            for tx in txs:
                if tx["status"] in ["success", "reversed", "failed", "rollback"]:
                    sila_to_sila_tx.processed = True
                    sila_to_sila_tx.sila_status = tx["status"]
                    sila_to_sila_tx.save()
                    if sila_to_sila_tx.from_user:
                        loop.run_in_executor(
                            None,
                            cls.update_user_balances,
                            from_sila_user,
                        )
        else:
            sila_to_sila_tx.processed = True
            sila_to_sila_tx.sila_status = resp["status"]
            sila_to_sila_tx.error_msg = resp["message"]
            sila_to_sila_tx.save()

    @classmethod
    @transaction.atomic
    def update_pending_sila_to_fiat(cls, sila_to_fiat_tx: SilaToFiatTx):
        user = sila_to_fiat_tx.from_user
        sila_user = None
        if user:
            sila_user = sila_to_fiat_tx.from_user.sila_user
        else:
            sila_user = sila_to_fiat_tx.from_company.sila_corporate
        search_filters = {"transaction_id": str(sila_to_fiat_tx.request_transaction_id)}
        payload = {
            "user_handle": sila_user.user_handle,
            "search_filters": search_filters,
        }
        loop = get_default_event_loop()
        resp = User.get_transactions(cls._app, payload, sila_user.private_key)
        if resp["success"]:
            txs = resp["transactions"]
            loop.run_in_executor(None, cls.update_user_balances, sila_user)
            for tx in txs:
                if tx["status"] in ["success", "reversed", "failed", "rollback"]:
                    sila_to_fiat_tx.processed = True
                    sila_to_fiat_tx.sila_status = tx["status"]
                    sila_to_fiat_tx.save()

    @classmethod
    def update_user_balances(
        cls, sila_entity: Union[SilaUser, SilaCorporate], skip_interval=0
    ):
        """
        * Skipping balance update if the wallet has been updated in the last
            `skip_interval` seconds
        If 2 threads are tring to update at the same time, skip
        """
        now = datetime.datetime.now(tz=pytz.UTC)
        last_update_time = now - datetime.timedelta(seconds=skip_interval)
        wallets = sila_entity.wallets.filter(
            updated_at__lte=last_update_time
        ).select_for_update(
            skip_locked=True
        )
        with transaction.atomic():
            for wallet in wallets:
                response = User.getSilaBalance(cls._app, wallet.public_key)
                if not response["success"]:
                    raise Exception("Error updating balance from Sila")
                wallet.balance = response["sila_balance"]
                wallet.save()

        return sila_entity.wallets.all()

    @classmethod
    def unlink_account(
        cls,
        sila_entity: Union[SilaUser, SilaCorporate],
        plaid_account: Union[PlaidLinkedAccount, PlaidLinkedCorporateAccount],
    ):
        payload = {
            "user_handle": sila_entity.user_handle,
            "account_name": plaid_account.account_name,
        }
        response = User.delete_account(cls._app, payload, sila_entity.private_key)

        return response

    @classmethod
    def execute_back_to_back_transactions(cls, fiat_parent: FiatToSilaTx):
        # Let's update pending transaction if we have
        # Probably should move this code to separate method

        pending: SilaToSilaTx = SilaToSilaTx.objects.filter(
            fiat_parent=fiat_parent
        ).first()

        _from_sila: Union[SilaUser, SilaCorporate, None] = None
        _to_sila: Union[SilaUser, SilaCorporate, None] = None

        if pending:

            # Get sender sila user
            if pending.from_user:
                _from_sila = pending.from_user.sila_user
            elif pending.from_company:
                _from_sila = pending.from_company.sila_corporate

            # Get receiver sila user
            if pending.to_user:
                _to_sila = pending.to_user.sila_user
            elif pending.to_company:
                _to_sila = pending.from_company.sila_corporate

        if _from_sila and _to_sila:
            response = cls.transfer_sila_to_sila(pending.amount, _from_sila, _to_sila.user_handle)
            if response['success']:
                pending.request_transaction_id = response["transaction_id"]
                pending.save()
