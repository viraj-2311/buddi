JOB_TITLE = "job_title"
FIRST_NAME = "first_name"
LAST_NAME = "last_name"
FULL_NAME = "full_name"
USERNAME = "username"
NICKNAME = "nickname"
EMAIL = "email"
PHONE = "phone"
BIRTHDAY = "birthday"
PASSWORD = "password"
CITY = "city"
STATE = "state"
ZIP_CODE = "zip_code"
STREET = "street"
COMPANY_NAME = "company_name"
UNION = "union"
VIMEO = "vimeo"
WEBSITE = "website"
PROFILE_PHOTO_S3_URL = "profile_photo_s3_url"
REG_SR_FIELDS = [
    JOB_TITLE,
    FIRST_NAME,
    LAST_NAME,
    FULL_NAME,
    NICKNAME,
    PASSWORD,
    EMAIL,
    PHONE,
    BIRTHDAY,
    CITY,
    STATE,
    ZIP_CODE,
    STREET,
    COMPANY_NAME,
    UNION,
    VIMEO,
    WEBSITE,
    PROFILE_PHOTO_S3_URL,
    USERNAME,
]

PASSWORD_REG_EX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]){8}.*$"
INVALID_PASSWORD_MSG = "Password does not meet the minimum requirements"
PHONE_REG_EX = r"^([0-9\- +]*)$"
INVALID_PHONE_MSG = "The entered phone is invalid"

EXECUTIVE_PRODUCER = "Exec Producer"
LINE_PRODUCER = "Line Producer"
DIRECTOR = "Director"
PRODUCTION_MANAGER = "Production Manager"
PRODUCTION_COORDINATOR = "Production Coordinator"
TALENT = "Talent"

BAND_LEADER = "Band Leader"
SECOND_BAND_LEADER = "2nd Band Leader"
THIRD_BAND_LEADER = "3rd Band Leader"

COMPANY_USER_TYPE = "Company"
PRODUCER_USER_TYPE = "Producer"
CREW_USER_TYPE = "Crew"

PRODUCTION_COMPANY_TYPE = "Production Company"
INHOUSE_PRODUCTION_COMPANY_TYPE = "In-house Production Company"
COMPANY_TYPES = [
    (x.upper(), x) for x in [PRODUCTION_COMPANY_TYPE, INHOUSE_PRODUCTION_COMPANY_TYPE]
]

BAND_TYPE = "Musical Groups and Artists"
DEFAULT_BUSINESS_TYPES = "CORPORATION"
BUSINESS_TYPES = [
    (x.upper(), x)
    for x in [
        "Corporation",
        "LLC",
        "LLP",
        "LP",
        "Non-Profit",
        "Partnership",
        "Public Corporation",
        "Sole Proprietorship",
        "Trust",
        "Unincorporated Association",
    ]
]


I_HAVE_DUPLICATE_ACCOUNT = 1
GETTING_TO_MANY_MAILS = 2
NOT_GETTING_ANY_VALUE_FOR_MY_MEMBERSHIP = 3
PRIVACY_CONCERN = 4
RECEIVING_UNWANTED_CONTACT = 5
OTHER = 6

BUDDI_ADMIN = "Buddi Admin"
VIA_BUDDISYSTEMS = "via Buddisystems"
