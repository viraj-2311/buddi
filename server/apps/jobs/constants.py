from enum import IntEnum

JOB_STATUS_PENDING = "PENDING"
JOB_STATUS_ACTIVE = "ACTIVE"
JOB_STATUS_WRAPPED = "WRAPPED"

ACCOUNT_COMPANY_RELATION_OWNER = "OWNER"
ACCOUNT_COMPANY_BUSINESS_MEMBER = "BUSINESS MEMBER"
ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF = "PRIVILEGED STAFF"
ACCOUNT_COMPANY_RELATION_COMMON_STAFF = "COMMON STAFF"
ACCOUNT_COMPANY_RELATION_CONTRACTOR = "CONTRACTOR"
ACCOUNT_COMPANY_NO_RELATION = "NO RELATION"
ACCOUNT_COMPANY_OWN_RELATIONS = [ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF, ACCOUNT_COMPANY_RELATION_OWNER,
                                 ACCOUNT_COMPANY_RELATION_COMMON_STAFF, ACCOUNT_COMPANY_NO_RELATION, ACCOUNT_COMPANY_BUSINESS_MEMBER]
ACCOUNT_COMPANY_CONTRACTOR_RELATIONS = [ACCOUNT_COMPANY_RELATION_CONTRACTOR]
ACCOUNT_COMPANY_RELATIONS = [
    ACCOUNT_COMPANY_RELATION_OWNER, ACCOUNT_COMPANY_RELATION_PRIVILEGED_STAFF,
    ACCOUNT_COMPANY_RELATION_COMMON_STAFF, ACCOUNT_COMPANY_RELATION_CONTRACTOR,
    ACCOUNT_COMPANY_NO_RELATION,
]

HOLD_MEMO = "HOLD"
DEAL_MEMO = "DEAL"
CONTRACTOR_W2_MEMO = "CONTRACTOR W2"
CONTRACTOR_W9_MEMO = "CONTRACTOR W9"
EMPLOYEE_MEMO = "EMPLOYEE"
AGENCY_MEMO = "AGENCY"

HOURLY = "HOURLY"
FIXED = "FIXED"

INVOICE_STATUS_REQUESTED = "Requested"
INVOICE_STATUS_IN_DISPUTE = "In Dispute"
INVOICE_STATUS_APPROVED = "Approved"
INVOICE_STATUS_RECEIVED = "Received"
PAYMENT_STATUS_PAYMENT_SENT = "Paid"
INVOICE_STATUS_OVERDUE = "Payment overdue"
PAYMENT_STATUS_PROCESSING = "Processing"
INVOICE_STATUS_ARCHIVE = "Payment archive"
PAYMENT_STATUS_PAYMENT_FAILED = "Failed"

# Below three options were deprecated
USE_BUDDI_TO_PAY_YOUR_CREW = 1
REQUEST_INVOICES_AND_DOWNLOAD_PDF = 2
DOWNLOAD_REPORT_AND_COMPLETE_JOB = 3

PAY_WITHOUT_INVOICING = 1
PAY_WITH_INVOICING = 2


class ContractorAcceptanceLevel(IntEnum):
    FIRST = 1
    SECOND = 2
    THIRD = 3
    DECLINED = 4


class MemoChoiceLevelInJob(IntEnum):
    FIRST = 1
    SECOND = 2
    THIRD = 3


class CompanyDashboardLevel(IntEnum):
    CONTRACTOR = 0
    PRODUCER = 1


# Error Messages
CAN_NOT_ACTIVATE_JOB_MSG = "Cannot Activate a Gig without an approved Deal Memo."
CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_ACTIVE = "Can not move a Gig to Active once it's Wrapped"
CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_HOLD = "Can not move a Gig to Hold once it's Wrapped"
CAN_NOT_MOVE_JOB_FROM_ACTIVE_TO_HOLD = "Can not move a Gig to Hold once it's Active"
PPB_COVER_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
}
PPB_TITLE_PAGE = {
    "page_title_style": {
        "font_size": "30",
        "font_weight": "700",
    },
    "client_name_style": {
        "font_size": "30",
        "font_weight": "700",
    },
    "project_name_style": {
        "font_size": "14",
        "font_weight": "600",
    },
    "pre_production_book_label_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "shoot_dates_style": {
        "font_size": "10",
        "font_weight": "600",
    },
}
PPB_ATTENDEES_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "agency_name_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "agency_contact_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "client_name_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "client_contact_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "client_attendee_contact_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "client_attendee_contact_title_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "agency_attendee_contact_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "agency_attendee_contact_title_style": {
        "font_size": "10",
        "font_weight": "400",
    },
}
PPB_BOARDS_SCRIPTS_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
}
PPB_SCHEDULE_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "time_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "notes_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "shoot_day_style": {
        "font_size": "20",
        "font_weight": "400",
    },
}
PPB_CAST_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "role_title_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "full_name_style": {
        "font_size": "10",
        "font_weight": "700",
    },
}
PPB_WARDROBE_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "role_title_style": {
        "font_size": "15",
        "font_weight": "700",
    },
    "full_name_style": {
        "font_size": "15",
        "font_weight": "700",
    },
}
PPB_CALLSHEET_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "production_contact_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "production_contact_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "production_contact_phone_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "production_contact_phone_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "location_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "location_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "directions_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "directions_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "hospital_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "hospital_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "parking_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "parking_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "date_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "date_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "time_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "time_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "notes_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "notes_style": {
        "font_size": "8",
        "font_weight": "400",
    },
}
PPB_LOCATION_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "location_title_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "location_title_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "address_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "address_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "directions_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "directions_style": {
        "font_size": "8",
        "font_weight": "400",
    },
    "notes_label_style": {
        "font_size": "8",
        "font_weight": "700",
    },
    "notes_style": {
        "font_size": "8",
        "font_weight": "400",
    },
}
PPB_WEATHER_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
}
PPB_THANK_YOU_PAGE = {
    "page_title_style": {
        "font_size": "20",
        "font_weight": "700",
    },
    "company_name_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "address_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "phone_style": {
        "font_size": "10",
        "font_weight": "400",
    },
    "email_style": {
        "font_size": "10",
        "font_weight": "400",
    },
}

MAJOR_FOUR_ROLES_DELETE_MESSAGE = "Deleting this position/department is not allowed"
MAJOR_FOUR_ROLES_GROUP_DELETE_MESSAGE = "Deleting this position/department is not allowed"
MAJOR_FOUR_ROLES_GROUP_UPDATE_MESSAGE = "Updating this position/department is not allowed"
