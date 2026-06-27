import logging
import os
import re
import uuid
from dataclasses import dataclass
from datetime import datetime
from html import escape
from pathlib import Path
from zoneinfo import ZoneInfo

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
TELEGRAM_OUTBOX_PENDING_DIR = Path("/telegram-outbox/pending")
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


def _safe_tmp_suffix(filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if re.fullmatch(r"\.[a-z0-9]{1,10}", suffix):
        return suffix

    return ".bin"


def _outbox_id() -> str:
    created_at = datetime.now(ZoneInfo("Europe/Moscow")).strftime("%Y%m%d%H%M%S")
    return f"{created_at}-{uuid.uuid4().hex}"


def _write_outbox_file(path: Path, content: bytes) -> None:
    tmp_path = path.with_suffix(f"{path.suffix}.tmp")
    tmp_path.write_bytes(content)
    os.chmod(tmp_path, 0o644)
    tmp_path.replace(path)


def send_contact_to_telegram(messages: list[str], files: list[TelegramFile]) -> None:
    print(
        "telegram background task started",
        len(messages),
        len(files),
        flush=True,
    )

    try:
        TELEGRAM_OUTBOX_PENDING_DIR.mkdir(parents=True, exist_ok=True)
        notification_id = _outbox_id()
        photo_path: Path | None = None
        if files:
            upload = files[0]
            suffix = _safe_tmp_suffix(upload.filename)
            photo_path = TELEGRAM_OUTBOX_PENDING_DIR / f"{notification_id}{suffix}"
            _write_outbox_file(photo_path, upload.content)

        text = "\n\n".join(messages)
        text_path = TELEGRAM_OUTBOX_PENDING_DIR / f"{notification_id}.txt"
        _write_outbox_file(text_path, text.encode("utf-8"))

        logger.info(
            "telegram outbox queued id=%s text=%s photo=%s",
            notification_id,
            text_path,
            photo_path or "",
        )
    except Exception as exc:
        print("telegram task error:", repr(exc), flush=True)
        logger.warning("Telegram outbox write failed: %s", exc.__class__.__name__)
        return
