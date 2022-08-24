import json
import logging
import sys

from apps.jobs.models import BenjiAccount
from apps.tests.constants import (PRODUCER_INFO, SENIOR_PRODUCER_INFO, SUPPLIER_INFO, TOKEN_API_URL,
                                  TOKEN_REFRESH_API_URL, USER_SIGNUP_API_URL)
from rest_framework import status
from rest_framework.test import APITestCase

logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)


class UserSignUpToken(APITestCase):
    def setUP(self):
        super().setUp()
        self.benji_account = self.token = None

    def test_user_signup_token(self):
        self.supplier_signup()
        self.producer_signup()
        self.senior_producer_signup()
        self.approve_benji_account()
        self.token = self.get_token()
        self.refresh_token()

    def api_authentication(self):
        """Setup token."""
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

    def log_test_results(self, response, msg):
        logging.info(f"\nRESPONSE: {json.dumps(response, indent=2)}"
                     f"\n{msg}")

    def log_invoke_api(self, test_title, endpoint, type="POST", data=None):
        logging.info("\n\n")
        logging.info(f"\n{test_title}"
                     f"\nENDPOINT: {endpoint}"
                     f"\nTYPE: {type}"
                     f"\nDATA: {json.dumps(data, indent=2)}")

    def approve_benji_account(self):
        self.assertIsNotNone(self.benji_account,
                             "Benji account was not created in this unit test. Please create it first.")
        self.benji_account.is_active = True
        self.benji_account.save()

    def get_token(self):
        """Generate token from user login info."""
        self.assertIsNotNone(self.benji_account,
                             "Benji account was not created in this unit test. Please create it first.")
        login_info = {"email": SUPPLIER_INFO.get("email"), "password": SUPPLIER_INFO.get("password")}
        self.log_invoke_api("Get token",
                            TOKEN_API_URL,
                            "GET",
                            login_info)
        response = self.client.post(TOKEN_API_URL, login_info, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.log_test_results(response.data,
                              "Successfully generated token!")
        return response.json()

    def refresh_token(self):
        """Refresh token using refresh token."""
        self.assertIsNotNone(self.token,
                             "Token was not created in this unit test. Please create it first.")
        refresh_token = {"refresh": self.token.get("refresh")}
        self.log_invoke_api("Refresh token",
                            TOKEN_REFRESH_API_URL,
                            "GET",
                            refresh_token)
        response = self.client.post(TOKEN_REFRESH_API_URL, refresh_token, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.log_test_results(response.data,
                              "Successfully refreshed token!")
        return response.json()

    def supplier_signup(self):
        """Signup as a supplier."""
        self.log_invoke_api("Supplier signup",
                            USER_SIGNUP_API_URL,
                            "POST",
                            SUPPLIER_INFO)
        response = self.client.post(USER_SIGNUP_API_URL, SUPPLIER_INFO, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.benji_account = BenjiAccount.objects.get(pk=response.json()["id"])
        self.log_test_results(response.data,
                              "Successfully registered a supplier.")

    def producer_signup(self):
        """Signup as a producer."""
        self.log_invoke_api("Producer signup",
                            USER_SIGNUP_API_URL,
                            "POST",
                            PRODUCER_INFO)
        response = self.client.post(USER_SIGNUP_API_URL, PRODUCER_INFO, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.log_test_results(response.data,
                              "Successfully registered a producer.")

    def senior_producer_signup(self):
        """Signup as a senior producer."""
        self.log_invoke_api("Senior producer signup",
                            USER_SIGNUP_API_URL,
                            "POST",
                            SENIOR_PRODUCER_INFO)
        response = self.client.post(USER_SIGNUP_API_URL, SENIOR_PRODUCER_INFO, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.log_test_results(response.data,
                              "Successfully registered a senior producer.")
