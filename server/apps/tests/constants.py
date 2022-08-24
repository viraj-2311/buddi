from apps.jobs.constants import (AUTHORIZATION_TYPE_CODE, EMAIL, FULL_NAME, PASSWORD, PHONE, PRODUCER_SUMMARY,
                                 PRODUCER_TITLE, PRODUCTION_COMPANY_BRAND, PRODUCTION_COMPANY_EMAIL,
                                 PRODUCTION_COMPANY_PHONE, PRODUCTION_COMPANY_TITLE, PRODUCTION_COMPANY_WEBSITE,
                                 SUPPLIER_SKILL_SETS, SUPPLIER_SUMMARY, SUPPLIER_TITLE, ZIP_CODE, AuthorizationTypeCode)
from apps.tests.utils import id_generator

USER_SIGNUP_API_URL = "/api/v1/registrations/"
TOKEN_API_URL = "/api/v1/token/"
TOKEN_REFRESH_API_URL = "/api/v1/token/refresh/"

BENJI_ACCOUNT_REGISTRATION_INFO = {
    FULL_NAME: id_generator(),
    PHONE: "8056664444",
    ZIP_CODE: "10001",
    PASSWORD: id_generator(),
}

SUPPLIER_INFO = {
    EMAIL: f"{id_generator()}@benji.com",
    SUPPLIER_TITLE: "Senior photographer",
    SUPPLIER_SUMMARY: "I worked in photographing for 10 years.",
    SUPPLIER_SKILL_SETS: "photograph, narrator, photoshop",
    AUTHORIZATION_TYPE_CODE: AuthorizationTypeCode.SUPPLIER,
}
SUPPLIER_INFO.update(BENJI_ACCOUNT_REGISTRATION_INFO)

PRODUCER_INFO = {
    EMAIL: f"{id_generator()}@benji.com",
    PRODUCER_TITLE: "Director",
    PRODUCER_SUMMARY: "I worked in film directing for 10 years.",
    AUTHORIZATION_TYPE_CODE: AuthorizationTypeCode.PRODUCER,
}
PRODUCER_INFO.update(BENJI_ACCOUNT_REGISTRATION_INFO)

SENIOR_PRODUCER_INFO = {
    EMAIL: f"{id_generator()}@benji.com",
    PRODUCTION_COMPANY_TITLE: "CocaCola Inc",
    PRODUCTION_COMPANY_EMAIL: "director@cocacola.com",
    PRODUCTION_COMPANY_PHONE: "8056664444",
    PRODUCTION_COMPANY_WEBSITE: "https://www.cocacola.com",
    PRODUCTION_COMPANY_BRAND: "cocacola",
    AUTHORIZATION_TYPE_CODE: AuthorizationTypeCode.SENIOR_PRODUCER,
}
SENIOR_PRODUCER_INFO.update({k: v for (k, v) in PRODUCER_INFO.items() if k not in [EMAIL, AUTHORIZATION_TYPE_CODE]})
