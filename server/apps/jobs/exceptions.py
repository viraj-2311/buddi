# exceptions.py
from rest_framework.exceptions import APIException


class UserCredentialWrongError(APIException):
    status_code = 400
    default_detail = "Your email or password was incorrect. Please try again."
    default_code = "user_credential_wrong"


class UserNotActivatedError(APIException):
    status_code = 400
    default_detail = "Your account has not been activated yet"
    default_code = "user_not_activated"


class CompanyTitleExist(APIException):
    status_code = 400
    default_detail = "Band with same title already exists."
    default_code = "company_title_exist"


class CompanyEmailExist(APIException):
    status_code = 400
    default_detail = "Band with same email already exists."
    default_code = "company_email_exist"


class EmployeeMemoNotSetupError(APIException):
    status_code = 400
    default_detail = "Oops! You can not setup a Employee memo with a contractor."
    default_code = "employee_memo_not_setup_error"


class ContractorMemoNotSetupError(APIException):
    status_code = 400
    default_detail = "Oops! You can not setup a Contractor memo with a Band staff"
    default_code = "contractor_memo_not_setup_error"


class AgencyMemoNotSetupError(APIException):
    status_code = 400
    default_detail = "Oops! You can not setup a Agency memo with a Band staff"
    default_code = "agency_memo_not_setup_error"


class MemoNotSetupError(APIException):
    status_code = 400
    default_detail = ("Oops! You can not setup a memo with "
                      "this option because you already setup memo with another option.")
    default_code = "memo_not_setup_error"


class StaffCompanyAccessRequestError(APIException):
    status_code = 400
    default_detail = "Ooops! You are a Band staff."
    default_code = "staff_company_access_request_error"


class CompanyAccessRequestDuplicateError(APIException):
    status_code = 400
    default_detail = "Ooops! You already sent request to an owner."
    default_code = "company_access_request_duplicate_error"


class CanNotHandleApprovedInvoiceError(APIException):
    status_code = 400
    default_detail = "Oops! You can do nothing against the approved invoice."
    default_code = "can_not_handle_approved_invoice_error"
