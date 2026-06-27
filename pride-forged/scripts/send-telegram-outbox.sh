#!/bin/sh
set -eu

APP_DIR="/opt/KovanDiski/pride-forged"
ENV_FILE="$APP_DIR/.env.production"
OUTBOX_DIR="$APP_DIR/telegram-outbox"
PENDING_DIR="$OUTBOX_DIR/pending"
SENT_DIR="$OUTBOX_DIR/sent"

if [ ! -f "$ENV_FILE" ]; then
  echo "telegram outbox env file missing: $ENV_FILE"
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "telegram outbox credentials missing"
  exit 1
fi

mkdir -p "$PENDING_DIR" "$SENT_DIR"

find "$PENDING_DIR" -maxdepth 1 -type f -name '*.txt' | sort | while IFS= read -r text_file; do
  id="$(basename "$text_file" .txt)"
  photo_file=""

  for candidate in "$PENDING_DIR/$id".jpg "$PENDING_DIR/$id".jpeg "$PENDING_DIR/$id".png "$PENDING_DIR/$id".webp; do
    if [ -f "$candidate" ]; then
      photo_file="$candidate"
      break
    fi
  done

  response_file="$(mktemp)"
  if [ -n "$photo_file" ]; then
    if curl -4 -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
      --data-urlencode "text=$(cat "$text_file")" \
      -d "parse_mode=HTML" >/tmp/telegram_text_response.json \
      && curl -4 -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto" \
        -F "chat_id=${TELEGRAM_CHAT_ID}" \
        -F "photo=@${photo_file}" >"$response_file"; then
      curl_ok=1
    else
      curl_ok=0
    fi
  else
    if curl -4 -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=$(cat "$text_file")" \
      -d "parse_mode=HTML" >"$response_file"; then
      curl_ok=1
    else
      curl_ok=0
    fi
  fi

  if [ "$curl_ok" = "1" ] && grep -q '"ok":true' "$response_file"; then
    mv "$text_file" "$SENT_DIR/$id.txt"
    if [ -n "$photo_file" ]; then
      mv "$photo_file" "$SENT_DIR/$(basename "$photo_file")"
    fi
    echo "telegram outbox sent: $id"
  else
    echo "telegram outbox failed: $id response=$(cat "$response_file")"
  fi

  rm -f "$response_file"
done
