#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$APP_DIR/.env.production"
OUTBOX_DIR="$APP_DIR/telegram-outbox"
PENDING_DIR="$OUTBOX_DIR/pending"
SENT_DIR="$OUTBOX_DIR/sent"
LOCK_FILE="/tmp/pride-telegram-outbox.lock"

if ! (set -o noclobber; printf '%s\n' "$$" >"$LOCK_FILE") 2>/dev/null; then
  echo "telegram outbox already running"
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

run_curl() {
  local label="$1"
  local stdout_file="$2"
  local stderr_file="$3"
  shift 3

  set +e
  curl -4 --connect-timeout 10 --max-time 60 -sS "$@" >"$stdout_file" 2>"$stderr_file"
  local code=$?
  set -e

  if [ "$code" -ne 0 ]; then
    echo "telegram outbox $label curl failed: code=$code stdout=$(cat "$stdout_file") stderr=$(cat "$stderr_file")"
    return 1
  fi

  if ! grep -q '"ok":true' "$stdout_file"; then
    echo "telegram outbox $label api failed: code=$code stdout=$(cat "$stdout_file") stderr=$(cat "$stderr_file")"
    return 1
  fi

  return 0
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

if [ ! -f "$ENV_FILE" ]; then
  echo "telegram outbox env file missing: $ENV_FILE"
  exit 1
fi

TELEGRAM_BOT_TOKEN="$(read_env_value TELEGRAM_BOT_TOKEN)"
TELEGRAM_CHAT_ID="$(read_env_value TELEGRAM_CHAT_ID)"

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "telegram outbox credentials missing"
  exit 1
fi

mkdir -p "$PENDING_DIR" "$SENT_DIR"

shopt -s nullglob
for text_file in "$PENDING_DIR"/*.txt; do
  id="$(basename "$text_file" .txt)"
  message_text="$(cat "$text_file")"
  photo_file="$(find_photo_file "$id" || true)"
  message_stdout="$(mktemp)"
  message_stderr="$(mktemp)"
  photo_stdout="$(mktemp)"
  photo_stderr="$(mktemp)"

  cleanup() {
    rm -f "$message_stdout" "$message_stderr" "$photo_stdout" "$photo_stderr"
  }

  if ! run_curl "sendMessage id=$id" "$message_stdout" "$message_stderr" \
    -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${message_text}" \
    -d "parse_mode=HTML"; then
    cleanup
    continue
  fi

  if [ -n "$photo_file" ]; then
    if ! run_curl "sendPhoto id=$id" "$photo_stdout" "$photo_stderr" \
      -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto" \
      -F "chat_id=${TELEGRAM_CHAT_ID}" \
      -F "photo=@${photo_file}"; then
      cleanup
      continue
    fi
  fi

  mv "$text_file" "$SENT_DIR/$id.txt"
  if [ -n "$photo_file" ]; then
    mv "$photo_file" "$SENT_DIR/$(basename "$photo_file")"
  fi
  echo "telegram outbox sent: $id"

  cleanup
done
