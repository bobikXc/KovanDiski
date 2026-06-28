import logging
import os
import re
import uuid
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from app.services.telegram import TelegramFile

logger = logging.getLogger(__name__)

EMAIL_OUTBOX_DIR = Path("/email-outbox")
EMAIL_OUTBOX_PENDING_DIR = EMAIL_OUTBOX_DIR / "pending"
EMAIL_OUTBOX_SENT_DIR = EMAIL_OUTBOX_DIR / "sent"


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


def save_lead_email_outbox(messages: list[str], files: list[TelegramFile]) -> None:
    try:
        EMAIL_OUTBOX_PENDING_DIR.mkdir(parents=True, exist_ok=True)
        EMAIL_OUTBOX_SENT_DIR.mkdir(parents=True, exist_ok=True)

        notification_id = _outbox_id()
        photo_path: Path | None = None
        if files:
            upload = files[0]
            suffix = _safe_tmp_suffix(upload.filename)
            photo_path = EMAIL_OUTBOX_PENDING_DIR / f"{notification_id}{suffix}"
            _write_outbox_file(photo_path, upload.content)

        text = "\n\n".join(messages)
        text_path = EMAIL_OUTBOX_PENDING_DIR / f"{notification_id}.txt"
        _write_outbox_file(text_path, text.encode("utf-8"))

        logger.info("email outbox saved %s", notification_id)
    except Exception as exc:
        print("email task error:", repr(exc), flush=True)
        logger.warning("email outbox failed: %s", exc.__class__.__name__)
