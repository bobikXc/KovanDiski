import logging
import re
import smtplib
from email.message import EmailMessage
from html import unescape

from app.core.config import settings
from app.services.telegram import TelegramFile

logger = logging.getLogger(__name__)

SMTP_PLACEHOLDER_VALUES = {
    "put_smtp_host_here",
    "put_smtp_user_here",
    "put_smtp_password_here",
    "put_sender_email_here",
    "put_recipient_email_here",
    "your_email_login",
    "your_email_app_password",
    "your_email_login@yandex.ru",
}


def _is_config_value_present(value: str | None) -> bool:
    normalized = value.strip() if value else ""
    return bool(normalized) and normalized not in SMTP_PLACEHOLDER_VALUES


def _strip_html(value: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", value, flags=re.IGNORECASE)
    text = re.sub(r"</p\s*>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    return unescape(text)


def _html_body(messages: list[str]) -> str:
    body = "\n\n".join(messages)
    return body.replace("\n", "<br>")


def _plain_body(messages: list[str]) -> str:
    return _strip_html("\n\n".join(messages))


def _smtp_configured() -> bool:
    return all(
        (
            _is_config_value_present(settings.smtp_host),
            _is_config_value_present(settings.smtp_user),
            _is_config_value_present(settings.smtp_password),
            _is_config_value_present(settings.smtp_from),
            _is_config_value_present(settings.leads_email_to),
        )
    )


def send_lead_email(messages: list[str], files: list[TelegramFile]) -> None:
    try:
        if not _smtp_configured():
            logger.warning("email notification skipped: SMTP settings are not configured")
            return

        email = EmailMessage()
        email["Subject"] = "Новая заявка PRIDE Forged"
        email["From"] = settings.smtp_from or ""
        email["To"] = settings.leads_email_to or ""
        email.set_content(_plain_body(messages))
        email.add_alternative(
            f"<html><body>{_html_body(messages)}</body></html>",
            subtype="html",
        )

        for file in files:
            maintype, _, subtype = (
                file.content_type or "application/octet-stream"
            ).partition("/")
            if not maintype or not subtype:
                maintype = "application"
                subtype = "octet-stream"
            email.add_attachment(
                file.content,
                maintype=maintype,
                subtype=subtype,
                filename=file.filename,
            )

        smtp_class = smtplib.SMTP_SSL if settings.smtp_port == 465 else smtplib.SMTP
        with smtp_class(settings.smtp_host or "", settings.smtp_port, timeout=30) as smtp:
            if settings.smtp_port != 465:
                smtp.starttls()
            smtp.login(settings.smtp_user or "", settings.smtp_password or "")
            smtp.send_message(email)

        logger.info("lead email sent")
    except Exception as exc:
        logger.warning("lead email failed: %s", exc.__class__.__name__)
