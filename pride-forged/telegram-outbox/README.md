# Telegram Outbox

Backend writes Telegram notifications to:

```text
/opt/KovanDiski/pride-forged/telegram-outbox/pending
```

The host sends pending notifications with:

```sh
chmod +x /opt/KovanDiski/pride-forged/scripts/send-telegram-outbox.sh
```

Cron example:

```cron
* * * * * /opt/KovanDiski/pride-forged/scripts/send-telegram-outbox.sh >> /var/log/pride-telegram-outbox.log 2>&1
```

The script reads `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from:

```text
/opt/KovanDiski/pride-forged/.env.production
```

Do not commit Telegram tokens.
