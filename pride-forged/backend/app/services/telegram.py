import logging
import json
import os
import re
import subprocess
import tempfile
from dataclasses import dataclass
from datetime import datetime
from html import escape
from pathlib import Path
from time import sleep
from typing import Callable
from zoneinfo import ZoneInfo

from app.core.config import settings

logger = logging.getLogger(__name__)


class TelegramNotConfiguredError(RuntimeError):
    """Raised when Telegram credentials are absent."""


class TelegramDeliveryError(RuntimeError):
    """Raised when Telegram rejects or cannot receive a request."""


@dataclass(frozen=True)
class TelegramFile:
    filename: str
    content_type: str
    content: bytes


TELEGRAM_MESSAGE_LIMIT = 3900
TELEGRAM_PLACEHOLDER_VALUES = {"put_token_here", "put_chat_id_here"}
TELEGRAM_REQUEST_ATTEMPTS = 5
TELEGRAM_RETRY_DELAYS_SECONDS = (2, 4, 6, 8)
CONTACT_METHOD_LABELS = {
    "call": "Звонок",
    "telegram": "Telegram",
    "whatsapp": "WhatsApp",
    "max": "MAX",
}
SOURCE_LABELS = {
    "contacts_form": "Форма контактов",
    "call_request": "Заказать звонок",
    "calculator_request": "Калькулятор",
    "visualization_request": "Визуализация",
    "home-fitment-form": "Главная — подбор дисков",
    "home_fitment_form": "Главная — подбор дисков",
    "manual_test": "Ручной тест",
}


def _display(value: str | None) -> str:
    normalized = value.strip() if value else ""
    return escape(normalized) if normalized else "не указано"


def _is_config_value_present(value: str | None) -> bool:
    normalized = value.strip() if value else ""
    return bool(normalized) and normalized not in TELEGRAM_PLACEHOLDER_VALUES


def _source_label(source: str | None) -> str:
    normalized = source.strip() if source else ""
    return SOURCE_LABELS.get(normalized, _display(normalized))


def _has_value(value: str | None) -> bool:
    return bool(value and value.strip())


def _calculator_line(label: str, value: str | None) -> str:
    return f"{label}: {_display(value)}\n" if _has_value(value) else ""


def _axis_value(width: str | None, et: str | None) -> str | None:
    parts: list[str] = []
    if _has_value(width):
        parts.append(f"{_display(width)}J")
    if _has_value(et):
        parts.append(f"ET{_display(et)}")
    return " ".join(parts) if parts else None


def _escaped_chunks(value: str, max_length: int) -> list[str]:
    chunks: list[str] = []
    current = ""
    for character in value:
        escaped_character = escape(character)
        if current and len(current) + len(escaped_character) > max_length:
            chunks.append(current)
            current = ""
        current += escaped_character
    if current:
        chunks.append(current)
    return chunks


def format_lead_message(
    *,
    name: str,
    phone: str,
    car: str | None = None,
    message: str | None = None,
    source: str | None = None,
) -> str:
    created_at = datetime.now(ZoneInfo("Europe/Moscow")).strftime("%Y-%m-%d %H:%M")
    return (
        "🔥 <b>Новая заявка PRIDE Forged</b>\n\n"
        f"👤 <b>Имя:</b> {_display(name)}\n"
        f"📞 <b>Телефон:</b> {_display(phone)}\n"
        f"🚗 <b>Авто:</b> {_display(car)}\n"
        "💬 <b>Комментарий:</b>\n"
        f"{_display(message)}\n\n"
        f"🌐 <b>Источник:</b> {_source_label(source)}\n"
        f"🕒 <b>Время:</b> {created_at}"
    )


def format_contact_messages(
    *,
    name: str,
    phone: str,
    car: str | None,
    comment: str | None,
    source: str | None,
    request_type: str | None = None,
    preferred_time: str | None = None,
    calculator_type: str | None = None,
    calculator_diameter: str | None = None,
    calculator_is_staggered: str | None = None,
    calculator_width: str | None = None,
    calculator_et: str | None = None,
    calculator_front_width: str | None = None,
    calculator_front_et: str | None = None,
    calculator_rear_width: str | None = None,
    calculator_rear_et: str | None = None,
    calculator_estimated_price: str | None = None,
    preferred_contact_method: str | None = None,
    fitment_car: str | None = None,
    fitment_year_generation: str | None = None,
    fitment_current_wheels: str | None = None,
    fitment_wishes: str | None = None,
) -> list[str]:
    contact_method_label = CONTACT_METHOD_LABELS.get(
        preferred_contact_method or "call", "Звонок"
    )
    is_callback = request_type == "callback" or source in {"header-callback", "call_request"}
    if is_callback:
        return [
            "<b>Новая заявка на звонок PRIDE Forged</b>\n\n"
            f"<b>Имя:</b> {_display(name)}\n"
            f"<b>Телефон:</b> {_display(phone)}\n"
            f"<b>Предпочитаемый способ связи:</b> {contact_method_label}\n"
            f"<b>Удобное время:</b> {_display(preferred_time)}\n"
            "<b>Комментарий:</b>\n"
            f"{_display(comment)}\n\n"
            "<b>Источник:</b> Заказать звонок\n"
            "<b>Согласие на обработку ПДн:</b> получено"
        ]

    has_calculator = source in {"calculator", "calculator_request"} or any(
        value and value.strip()
        for value in (
            calculator_type,
            calculator_diameter,
            calculator_is_staggered,
            calculator_width,
            calculator_et,
            calculator_front_width,
            calculator_front_et,
            calculator_rear_width,
            calculator_rear_et,
            calculator_estimated_price,
        )
    )
    is_staggered = (calculator_is_staggered or "").strip().lower() == "true"
    calculator_lines = ""
    if has_calculator:
        calculator_lines += "<b>Параметры из калькулятора:</b>\n"
        calculator_lines += _calculator_line("Тип дисков", calculator_type)
        calculator_lines += _calculator_line("Диаметр", calculator_diameter)
        if is_staggered:
            calculator_lines += "Посадка: разноширокая\n"
            calculator_lines += _calculator_line("Передняя ось", _axis_value(calculator_front_width, calculator_front_et))
            calculator_lines += _calculator_line("Задняя ось", _axis_value(calculator_rear_width, calculator_rear_et))
        else:
            if _has_value(calculator_width):
                calculator_lines += f"Ширина: {_display(calculator_width)}J\n"
            if _has_value(calculator_et):
                calculator_lines += f"Вылет: ET{_display(calculator_et)}\n"
        calculator_lines += _calculator_line("Примерная стоимость", calculator_estimated_price)
        calculator_lines += "\n"

    calculator_block = (
        calculator_lines if has_calculator else ""
    )

    has_fitment = any(
        value and value.strip()
        for value in (
            fitment_car,
            fitment_year_generation,
            fitment_current_wheels,
            fitment_wishes,
        )
    )

    if has_fitment:
        message_start = (
            "<b>Новая заявка с подбора дисков PRIDE Forged</b>\n\n"
            f"<b>Имя:</b> {_display(name)}\n"
            f"<b>Телефон:</b> {_display(phone)}\n"
            f"<b>Предпочитаемый способ связи:</b> {contact_method_label}\n"
            f"<b>Источник:</b> {_source_label(source)}\n\n"
            "<b>Параметры автомобиля:</b>\n"
            f"Автомобиль: {_display(fitment_car)}\n"
            f"Год / поколение: {_display(fitment_year_generation)}\n"
            f"Текущие параметры: {_display(fitment_current_wheels)}\n"
            f"Пожелания: {_display(fitment_wishes)}\n\n"
            f"{calculator_block}"
            "<b>Согласие на обработку ПДн:</b> получено\n\n"
            "<b>Комментарий клиента:</b>\n"
        )
    else:
        message_start = (
            "<b>Новая заявка с сайта PRIDE Forged</b>\n\n"
            f"<b>Имя:</b> {_display(name)}\n"
            f"<b>Телефон:</b> {_display(phone)}\n"
            f"<b>Предпочитаемый способ связи:</b> {contact_method_label}\n"
            f"<b>Автомобиль:</b> {_display(car)}\n"
            f"<b>Источник:</b> {_source_label(source)}\n\n"
            f"{calculator_block}"
            "<b>Согласие на обработку ПДн:</b> получено\n\n"
            "<b>Комментарий:</b>\n"
        )
    normalized_comment = comment.strip() if comment else ""
    if not normalized_comment:
        return [f"{message_start}не указано"]

    first_chunk_limit = max(1, TELEGRAM_MESSAGE_LIMIT - len(message_start))
    comment_chunks = _escaped_chunks(normalized_comment, first_chunk_limit)
    messages = [f"{message_start}{comment_chunks[0]}"]

    continuation_prefix = "<b>Комментарий (продолжение):</b>\n"
    continuation_limit = TELEGRAM_MESSAGE_LIMIT - len(continuation_prefix)
    remaining_text = normalized_comment
    first_raw_length = 0
    escaped_length = 0
    for character in normalized_comment:
        token_length = len(escape(character))
        if escaped_length + token_length > first_chunk_limit:
            break
        escaped_length += token_length
        first_raw_length += 1
    remaining_text = remaining_text[first_raw_length:]

    for chunk in _escaped_chunks(remaining_text, continuation_limit):
        messages.append(f"{continuation_prefix}{chunk}")
    return messages


def _telegram_error_name(exc: Exception) -> str:
    cause = exc.__cause__
    return cause.__class__.__name__ if cause else exc.__class__.__name__


def _telegram_request_with_retry(method: str, operation: Callable[[], None]) -> None:
    last_error: Exception | None = None

    for attempt in range(1, TELEGRAM_REQUEST_ATTEMPTS + 1):
        logger.info("telegram %s attempt %s/%s", method, attempt, TELEGRAM_REQUEST_ATTEMPTS)
        try:
            operation()
            return
        except TelegramDeliveryError as exc:
            last_error = exc
            logger.warning(
                "telegram %s failed attempt %s/%s: %s",
                method,
                attempt,
                TELEGRAM_REQUEST_ATTEMPTS,
                _telegram_error_name(exc),
            )
            if attempt < TELEGRAM_REQUEST_ATTEMPTS:
                sleep(TELEGRAM_RETRY_DELAYS_SECONDS[attempt - 1])

    logger.warning("telegram %s failed after retries", method)
    raise TelegramDeliveryError from last_error


def _telegram_config() -> tuple[str, str]:
    token = settings.telegram_bot_token
    chat_id = settings.telegram_chat_id
    if not _is_config_value_present(token) or not _is_config_value_present(chat_id):
        raise TelegramNotConfiguredError

    return token or "", chat_id or ""


def _validate_curl_result(method: str, result: subprocess.CompletedProcess[str]) -> None:
    try:
        payload = json.loads(result.stdout)
    except ValueError as exc:
        logger.warning(
            "telegram curl %s failed: returncode=%s stdout=%s stderr=%s",
            method,
            result.returncode,
            result.stdout[:1000],
            result.stderr[:1000],
        )
        raise TelegramDeliveryError from exc

    if result.returncode == 0 and payload.get("ok"):
        return

    logger.warning(
        "telegram curl %s failed: returncode=%s stdout=%s stderr=%s",
        method,
        result.returncode,
        result.stdout[:1000],
        result.stderr[:1000],
    )
    raise TelegramDeliveryError


def _run_telegram_curl(method: str, args: list[str], timeout: int) -> None:
    try:
        result = subprocess.run(
            args,
            capture_output=True,
            check=False,
            text=True,
            timeout=timeout,
        )
    except (OSError, subprocess.SubprocessError) as exc:
        logger.warning(
            "telegram curl %s failed: returncode=%s stdout=%s stderr=%s",
            method,
            "n/a",
            "",
            repr(exc),
        )
        raise TelegramDeliveryError from exc

    _validate_curl_result(method, result)


def _send_telegram_message_once(text: str) -> None:
    token, chat_id = _telegram_config()
    _run_telegram_curl(
        "sendMessage",
        [
            "curl",
            "-4",
            "-sS",
            "-X",
            "POST",
            f"https://api.telegram.org/bot{token}/sendMessage",
            "-d",
            f"chat_id={chat_id}",
            "-d",
            f"text={text}",
            "-d",
            "parse_mode=HTML",
        ],
        timeout=70,
    )
    logger.info("telegram curl sendMessage sent")


def _safe_tmp_suffix(filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if re.fullmatch(r"\.[a-z0-9]{1,10}", suffix):
        return suffix

    return ".bin"


def _send_telegram_file_once(
    method: str,
    field_name: str,
    caption: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> None:
    token, chat_id = _telegram_config()
    tmp_path = ""
    try:
        tmp_file = tempfile.NamedTemporaryFile(
            delete=False,
            dir="/tmp",
            suffix=_safe_tmp_suffix(filename),
        )
        try:
            tmp_path = tmp_file.name
            tmp_file.write(file_bytes)
            tmp_file.flush()
            os.fsync(tmp_file.fileno())
        finally:
            tmp_file.close()

        os.chmod(tmp_path, 0o644)
        if not os.path.exists(tmp_path) or os.path.getsize(tmp_path) <= 0:
            logger.warning(
                "telegram curl %s temp file invalid: path=%s size=%s",
                method,
                tmp_path,
                os.path.getsize(tmp_path) if os.path.exists(tmp_path) else "missing",
            )
            raise TelegramDeliveryError

        tmp_size = os.path.getsize(tmp_path)
        print(
            "telegram tmp debug",
            tmp_path,
            os.path.exists(tmp_path),
            os.path.getsize(tmp_path),
            oct(os.stat(tmp_path).st_mode),
            flush=True,
        )
        logger.info(
            "telegram curl %s temp file ready: path=%s size=%s",
            method,
            tmp_path,
            tmp_size,
        )
        print("telegram curl file arg", f"{field_name}=@{tmp_path}", flush=True)

        _run_telegram_curl(
            method,
            [
                "curl",
                "-4",
                "-sS",
                "-X",
                "POST",
                f"https://api.telegram.org/bot{token}/{method}",
                "-F",
                f"chat_id={chat_id}",
                "-F",
                f"caption={caption}",
                "-F",
                "parse_mode=HTML",
                "-F",
                f"{field_name}=@{tmp_path}",
            ],
            timeout=130,
        )
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                logger.warning("telegram temp file cleanup failed: %s", tmp_path)


def _send_telegram_photo_once(
    caption: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> None:
    _send_telegram_file_once(
        "sendPhoto",
        "photo",
        caption,
        filename,
        content_type,
        file_bytes,
    )

    logger.info("telegram curl sendPhoto sent")


def _send_telegram_document_once(
    caption: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> None:
    _send_telegram_file_once(
        "sendDocument",
        "document",
        caption,
        filename,
        content_type,
        file_bytes,
    )

    logger.info("telegram curl sendDocument sent")


def send_telegram_message_sync(text: str) -> None:
    _telegram_request_with_retry(
        "sendMessage",
        lambda: _send_telegram_message_once(text),
    )


def send_telegram_photo_sync(
    caption: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> None:
    _telegram_request_with_retry(
        "sendPhoto",
        lambda: _send_telegram_photo_once(caption, filename, content_type, file_bytes),
    )


def send_telegram_document_sync(
    caption: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> None:
    _telegram_request_with_retry(
        "sendDocument",
        lambda: _send_telegram_document_once(caption, filename, content_type, file_bytes),
    )


def _send_text_messages(messages: list[str]) -> None:
    for message in messages:
        send_telegram_message_sync(message)


def send_contact_to_telegram(messages: list[str], files: list[TelegramFile]) -> None:
    print(
        "telegram background task started",
        len(messages),
        len(files),
        flush=True,
    )

    try:
        token = settings.telegram_bot_token
        chat_id = settings.telegram_chat_id
        if not _is_config_value_present(token) or not _is_config_value_present(chat_id):
            logger.warning(
                "Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID "
                "is not configured"
            )
            return

        if files:
            upload = files[0]
            try:
                send_telegram_photo_sync(
                    messages[0],
                    upload.filename,
                    upload.content_type,
                    upload.content,
                )
            except TelegramDeliveryError as exc:
                print("telegram task error:", repr(exc), flush=True)
                try:
                    send_telegram_document_sync(
                        messages[0],
                        upload.filename,
                        upload.content_type,
                        upload.content,
                    )
                except TelegramDeliveryError as document_exc:
                    print("telegram task error:", repr(document_exc), flush=True)
                    send_telegram_message_sync(
                        "Заявка получена, "
                        "но фото не удалось отправить."
                    )
                    logger.info("telegram fallback sendMessage sent")
                else:
                    _send_text_messages(messages[1:])
            else:
                _send_text_messages(messages[1:])
            return

        _send_text_messages(messages)
    except Exception as exc:
        print("telegram task error:", repr(exc), flush=True)
        logger.warning("Telegram notification failed: %s", exc.__class__.__name__)
        return

    logger.info("Telegram notification sent")
