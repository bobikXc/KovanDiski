# PRIDE Forged — deploy на VPS Ubuntu 24.04 LTS

Цель: запустить PRIDE Forged на VPS `176.124.218.117` с доменом `prideforged.ru`.

Production-схема:

- `https://prideforged.ru/` → Next.js frontend
- `https://prideforged.ru/api/*` → FastAPI backend
- `https://prideforged.ru/health` → FastAPI healthcheck
- PostgreSQL работает только внутри Docker network
- frontend/backend наружу не публикуются, наружу открыт только Nginx `80/443`

## 1. DNS

В DNS домена добавьте записи:

```txt
A     prideforged.ru       176.124.218.117
A     www.prideforged.ru   176.124.218.117
```

Дождитесь распространения DNS перед выпуском SSL.

## 2. Подключение к серверу

```bash
ssh root@176.124.218.117
```

## 3. Установка Docker и базовых пакетов

```bash
apt update
apt install -y ca-certificates curl gnupg git ufw
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin
```

## 4. Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

## 5. Клонирование проекта

```bash
git clone https://github.com/bobikXc/KovanDiski.git
cd KovanDiski/pride-forged
```

## 6. Production env

```bash
cp .env.production.example .env.production
nano .env.production
```

Обязательно замените:

- `POSTGRES_PASSWORD`
- `DATABASE_URL` — пароль должен совпадать с `POSTGRES_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Production API значения:

```env
NEXT_PUBLIC_API_URL=https://prideforged.ru/api
INTERNAL_API_URL=http://backend:8000/api
BACKEND_CORS_ORIGINS=https://prideforged.ru,https://www.prideforged.ru
```

Важно: `TELEGRAM_BOT_TOKEN` хранится только в `.env.production` на сервере и не должен попадать во frontend или GitHub.

## 7. SSL сертификат Let's Encrypt

Nginx production-конфиг ожидает сертификаты в `certbot/conf`, поэтому сначала выпустите сертификат standalone-режимом:

```bash
mkdir -p certbot/conf certbot/www
docker run --rm \
  -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d prideforged.ru \
  -d www.prideforged.ru \
  --email admin@prideforged.ru \
  --agree-tos \
  --no-eff-email
```

Если на сервере уже занят порт `80`, остановите сервис, который его занимает, и повторите команду.

## 8. Запуск production compose

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Проверка контейнеров:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f backend
```

Backend `start.sh` автоматически выполняет:

```bash
alembic upgrade head
python -m app.seed
```

Если нужно повторно применить миграции вручную:

```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## 9. Проверка

На сервере:

```bash
curl http://localhost/health
curl -I https://prideforged.ru/
curl https://prideforged.ru/health
curl https://prideforged.ru/api/wheels
```

В браузере проверьте:

- `https://prideforged.ru/`
- `https://prideforged.ru/catalog`
- `https://prideforged.ru/contact`
- отправку формы заявки

## 10. Обновление проекта

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

## 11. Продление SSL

Для ручного продления:

```bash
docker run --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot renew --webroot -w /var/www/certbot

docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

Для автоматизации можно добавить cron:

```bash
0 4 * * * cd /root/KovanDiski/pride-forged && docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" -v "$(pwd)/certbot/www:/var/www/certbot" certbot/certbot renew --webroot -w /var/www/certbot && docker compose -f docker-compose.prod.yml exec -T nginx nginx -s reload
```

## 12. Быстрый rollback

```bash
git log --oneline -5
git checkout <commit_sha>
docker compose -f docker-compose.prod.yml up -d --build
```

После rollback вернитесь на `main`, когда проблема исправлена:

```bash
git checkout main
git pull
```
