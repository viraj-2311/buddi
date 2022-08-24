import uuid
from typing import Union, Dict, List
import glob
from PIL import Image
from PyPDF2 import PdfFileMerger
import logging

from django.conf import settings

from apps.sila_adapter.models import KYC_Request, SilaToSilaTx


logger = logging.getLogger(__name__)


def generate_sila_user_handle() -> str:
    serial_num = uuid.uuid4().hex

    return f"{serial_num}.{settings.SILA_CONFIG['SILA_BENJI_APP_HANDLE']}"


def parse_error_message_from_sila(sila_response: dict) -> str:
    """
    The sample return message will be like:
        User handle: This field is required.\nFirst name:
        This field is required.\nLast name:
        This field is required.\nCrypto address: This field is required.
    """
    message = sila_response["message"]
    validation_details = sila_response.get("validation_details", {})
    msg = ""
    for err_category in validation_details.values():
        if isinstance(err_category, dict):
            for k, v in err_category.items():
                msg += f"\n{k.replace('_', ' ').capitalize()}: {v}"
        else:
            msg += f"\n{err_category}"

    if msg and len(msg) > 2:
        return msg[2:]  # remove '\n'

    return message


def parse_register_field_error_from_sila(sila_response: dict) -> Dict:
    """
    The sample return message will be like:
        User handle: This field is required.\nFirst name:
        This field is required.\nLast name:
        This field is required.\nCrypto address: This field is required.
    """
    message = sila_response["message"]
    validation_details = sila_response.get("validation_details", {})
    field_name_mapping = {
        "first_name": "first_name",
        "last_name": "last_name",
        "birthdate": "date_of_birth",
        "phone": "phone_number",
        "street_address_1": "home_address",
        "city": "city",
        "state": "state",
        "postal_code": "zip",
        "email": "email",
    }
    dict_msg = {}
    for key, value in validation_details.items():
        if isinstance(value, dict):
            for sub_key, sub_value in value.items():
                _sub_key = field_name_mapping.get(sub_key, sub_key)
                dict_msg[_sub_key] = sub_value
        else:
            _key = field_name_mapping.get(key, key)
            dict_msg[_key] = value

    if len(dict_msg) > 0:
        return dict_msg
    else:
        return {"error": message}


IMAGE_FILE_EXTENTIONS = ["png", "jpeg", "jpg"]


def concatenate_image_files_to_pdf(dirname):
    imagelist = []
    for extension in IMAGE_FILE_EXTENTIONS:
        filenames = glob.glob(f"dirname/*.{extension}")
        for imagefile in filenames:
            im = Image.open(imagefile)
            imagelist.append(im)
    if len(imagelist) > 0:
        pdf_out_filename = f"{dirname}/allnonpdf.pdf"
        first_image, *rest_images = imagelist
        first_image.save(
            pdf_out_filename,
            "PDF",
            resolution=100.0,
            save_all=True,
            append_images=rest_images,
        )


def concatenate_all_pdfs(dirname):
    merger = PdfFileMerger()
    for pdf in glob.glob(f"{dirname}/*.pdf"):
        merger.append(pdf)
    merger.write(f"{dirname}/result.pdf")
    merger.close()
    return f"{dirname}/result.pdf"


def make_pending_tx_in_force(
    adapter, sila_user, local_tx, sila_tx, parent_user, parent_corporate
):
    child_tx = None
    try:
        child_tx = SilaToSilaTx.objects.get(
            parent_request_transaction_id=sila_tx["transaction_id"]
        )
        amount = sila_tx["sila_amount"]
        assert amount == local_tx.amount
        to_user = local_tx.to_user
        to_company = local_tx.to_company
        destination_handle = None
        if to_user:
            if (not parent_user) or (parent_user.id != to_user.id):
                destination_handle = to_user.sila_user.user_handle
        elif to_company:
            if (not parent_corporate) or (parent_corporate.id != to_company.id):
                destination_handle = to_company.sila_corporate.user_handle
        if destination_handle:
            resp = adapter.transfer_sila_to_sila(amount, sila_user, destination_handle)
            if not resp["success"]:
                raise Exception(f"Error creating back to back transaction {local_tx}")
            child_tx_id = resp["transaction_id"]
            child_tx.request_transaction_id = child_tx_id
            child_tx.save()
    except SilaToSilaTx.DoesNotExist:
        logger.info(f"Not a back to back tx {local_tx} ")
        pass
    return child_tx


def get_kyc_request_fail_result_detail(tags: List[str]):
    reasons = set()
    reason_mapping = {
        "Address Not Matched": "address",
        "Address Not Verified": "address",
        "Name Mismatch": "name",
        "Name Not Verified": "name",
        "DOB Miskey": "date_of_birth",
        "DOB Not Verified": "date_of_birth",
        "SSN Miskey": "social_security_number",
        "SSN Not Verified": "social_security_number",
        "Company Name Not Matched": "name",
        "FEIN Unmatched": "employer_id_number",
        "FEIN Document Required": "employer_id_number",
    }
    for tag in tags:
        reason = reason_mapping.get(tag, "general")
        reasons.add(reason)

    return list(reasons)


def get_kyc_verification_status_mapping(original_status: str) -> str:
    """Only show either passed, pending or failed to the frontend"""
    passed = KYC_Request.VerificationStatusChoice.PASSED
    pending = KYC_Request.VerificationStatusChoice.PENDING
    failed = KYC_Request.VerificationStatusChoice.FAILED
    status_mapping = {
        KYC_Request.VerificationStatusChoice.UNVERIFIED: failed,
        KYC_Request.VerificationStatusChoice.PASSED: passed,
        KYC_Request.VerificationStatusChoice.PENDING: pending,
        KYC_Request.VerificationStatusChoice.REVIEW: pending,
        KYC_Request.VerificationStatusChoice.FAILED: failed,
        KYC_Request.VerificationStatusChoice.MEMBER_UNVERIFIED: pending,
        KYC_Request.VerificationStatusChoice.MEMBER_FAILED: failed,
        KYC_Request.VerificationStatusChoice.MEMBER_REVIEW: pending,
        KYC_Request.VerificationStatusChoice.MEMBER_PENDING: pending,
        KYC_Request.VerificationStatusChoice.DOCUMENTS_REQUIRED: failed,
        KYC_Request.VerificationStatusChoice.DOCUMENTS_RECEIVED: pending,
        KYC_Request.VerificationStatusChoice.WEBHOOK_PENDING: pending,
    }

    return status_mapping[original_status]
