#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$APP_DIR/.env.production"
OUTBOX_DIR="$APP_DIR/email-outbox"
PENDING_DIR="$OUTBOX_DIR/pending"
SENT_DIR="$OUTBOX_DIR/sent"
LOCK_FILE="/tmp/pride-email-outbox.lock"

if ! (set -o noclobber; printf '%s\n' "$$" >"$LOCK_FILE") 2>/dev/null; then
  echo "email outbox already running"
  exit 0
fi
trap 'rm -f "$LOCK_FILE"' EXIT

read_env_value() {
  local key="$1"
  local value

  value="$(
    grep -E "^[[:space:]]*${key}=" "$ENV_FILE" \
      | tail -n 1 \
      | sed -E "s/^[[:space:]]*${key}=//; s/^[[:space:]]*//; s/[[:space:]]*$//"
  )" || value=""
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s' "$value"
}

find_photo_file() {
  local id="$1"
  local candidate

  for candidate in "$PENDING_DIR/$id".jpg "$PENDING_DIR/$id".jpeg "$PENDING_DIR/$id".png "$PENDING_DIR/$id".webp; do
    if [ -f "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done

  return 1
}

require_value() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "email outbox missing env: $name"
    exit 1
  fi
}

if [ ! -f "$ENV_FILE" ]; then
  echo "email outbox env file missing: $ENV_FILE"
  exit 1
fi

SMTP_HOST="$(read_env_value SMTP_HOST)"
SMTP_PORT="$(read_env_value SMTP_PORT)"
SMTP_USER="$(read_env_value SMTP_USER)"
SMTP_PASSWORD="$(read_env_value SMTP_PASSWORD)"
SMTP_FROM="$(read_env_value SMTP_FROM)"
LEADS_EMAIL_TO="$(read_env_value LEADS_EMAIL_TO)"

SMTP_PORT="${SMTP_PORT:-465}"

require_value SMTP_HOST "$SMTP_HOST"
require_value SMTP_PORT "$SMTP_PORT"
require_value SMTP_USER "$SMTP_USER"
require_value SMTP_PASSWORD "$SMTP_PASSWORD"
require_value SMTP_FROM "$SMTP_FROM"
require_value LEADS_EMAIL_TO "$LEADS_EMAIL_TO"

mkdir -p "$PENDING_DIR" "$SENT_DIR"

shopt -s nullglob
for text_file in "$PENDING_DIR"/*.txt; do
  id="$(basename "$text_file" .txt)"
  photo_file="$(find_photo_file "$id" || true)"
  message_file="$(mktemp)"
  stdout_file="$(mktemp)"
  stderr_file="$(mktemp)"

  cleanup() {
    rm -f "$message_file" "$stdout_file" "$stderr_file"
  }

  python3 - "$text_file" "$message_file" "$SMTP_FROM" "$LEADS_EMAIL_TO" "$photo_file" <<'PY'
import mimetypes
import sys
from email.message import EmailMessage
from pathlib import Path

text_path = Path(sys.argv[1])
message_path = Path(sys.argv[2])
smtp_from = sys.argv[3]
email_to = sys.argv[4]
photo_path = Path(sys.argv[5]) if sys.argv[5] else None

message = EmailMessage()
message["From"] = smtp_from
message["To"] = email_to
message["Subject"] = "Новая заявка PRIDE Forged"
message.set_content(text_path.read_text(encoding="utf-8"))

if photo_path and photo_path.exists():
    content_type, _ = mimetypes.guess_type(str(photo_path))
    maintype, subtype = (content_type or "application/octet-stream").split("/", 1)
    message.add_attachment(
        photo_path.read_bytes(),
        maintype=maintype,
        subtype=subtype,
        filename=photo_path.name,
    )

message_path.write_bytes(message.as_bytes())
PY

  set +e
  curl --connect-timeout 10 --max-time 60 -sS \
    --url "smtps://${SMTP_HOST}:${SMTP_PORT}" \
    --ssl-reqd \
    --mail-from "$SMTP_FROM" \
    --mail-rcpt "$LEADS_EMAIL_TO" \
    --user "${SMTP_USER}:${SMTP_PASSWORD}" \
    --upload-file "$message_file" >"$stdout_file" 2>"$stderr_file"
  code=$?
  set -e

  if [ "$code" -eq 0 ]; then
    mv "$text_file" "$SENT_DIR/$id.txt"
    if [ -n "$photo_file" ]; then
      mv "$photo_file" "$SENT_DIR/$(basename "$photo_file")"
    fi
    echo "email outbox sent: $id"
  else
    echo "email outbox failed: $id code=$code stdout=$(cat "$stdout_file") stderr=$(cat "$stderr_file")"
  fi

  cleanup
done
