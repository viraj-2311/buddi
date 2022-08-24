import base64
import os
from urllib.request import urlopen

from celery import shared_task
from celery.utils.log import get_task_logger
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Attachment, Disposition, FileContent, FileName, FileType, Mail, SendGridException

logger = get_task_logger(__name__)


@shared_task(bind=True, max_retries=3)
def send_email_template(self, from_email, recipient_list, email_template_id, substitutions, sender_name,
                        attachments=None):
    message = Mail(from_email=(from_email, sender_name), to_emails=recipient_list)
    message.dynamic_template_data = substitutions
    message.template_id = email_template_id
    if attachments:
        results = []
        for attachment in attachments:
            file_path = attachment["path"].replace(" ", "%20")
            logger.info(f"{file_path}")
            data = urlopen(file_path).read()
            encoded = base64.b64encode(data).decode()
            attachment_file = Attachment()
            attachment_file.file_content = FileContent(encoded)
            attachment_file.file_type = FileType(attachment["type"])
            attachment_file.file_name = FileName(attachment["name"])
            attachment_file.disposition = Disposition("attachment")
            results.append(attachment_file)
        message.attachment = results
    try:
        sendgrid_client = SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sendgrid_client.send(message)
    except SendGridException as exc:
        print(str(exc))
        self.retry(exc=exc, countdown=2 ** self.request.retries)
