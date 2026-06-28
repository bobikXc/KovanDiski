# PRIDE Forged

Production-ready monorepo для PRIDE Forged — производителя и продавца премиальных кованых дисков.

## Стек

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, Shadcn UI-style primitives, Framer Motion, Axios, React Hook Form.
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic, PostgreSQL.
- **Infrastructure:** Docker, Docker Compose, Nginx.

## Структура

```text
pride-forged/
├── frontend/
├── backend/
├── nginx/
├── docker/
├── docs/
├── .env.example
├── docker-compose.yml
└── README.md
```

## Локальный запуск через Docker Compose

```bash
cd pride-forged
cp .env.local.example .env
docker compose down
docker compose up --build -d
```

После запуска:

- Сайт: <http://localhost>
- Backend healthcheck: <http://localhost/health>
- API brands: <http://localhost/api/brands>
- API wheels: <http://localhost/api/wheels>
- OpenAPI UI: <http://localhost/docs>
- OpenAPI JSON: <http://localhost/openapi.json>

Локальные значения API:

```text
NEXT_PUBLIC_API_URL=/api
INTERNAL_API_URL=http://backend:8000/api
DATABASE_URL=postgresql+psycopg://pride:pride_password@postgres:5432/pride_forged
```

Удобные команды:

```bash
make local-env
make up
make ps
make logs
make down
make restart
make clean
```

## Локальная разработка без Docker

### Backend

```bash
cd pride-forged/backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install .
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

Для запуска backend без Docker нужен PostgreSQL и локальные переменные из `backend/.env.local.example`, адаптированные под вашу базу.

### Frontend

```bash
cd pride-forged/frontend
npm install
npm run dev
```

Для локального frontend укажите API:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run dev
```

## API

- `GET /api/brands`
- `GET /api/brands/{slug}`
- `GET /api/models`
- `GET /api/wheels`
- `GET /api/wheels/{slug}`
- `GET /api/fitment`

## Seed data

При старте backend выполняет миграции Alembic и идемпотентный seed:

- BMW: M3, M4, M5, X5M, X6M
- Mercedes-Benz: C63 AMG, E63 AMG, G63 AMG
- Audi: RS6, RS7, RSQ8
- Porsche: 911, Panamera, Cayenne Coupe
- Tesla: Model 3, Model S, Model X
- 12 моделей дисков: PRIDE Apex, Vector, Storm, Blade, Mono, R-Line, GT, Evo, RS, Vortex, Titan, Nero

## Возможные ошибки и исправления

### Порт 80 занят

Измените порт Nginx в `docker-compose.yml`:

```yaml
ports:
  - "8080:80"
```

Затем откройте <http://localhost:8080>.

### PostgreSQL не успел стартовать

В compose настроен `healthcheck`, но при медленном диске можно перезапустить backend:

```bash
docker compose restart backend
```

### Изменили `.env`, но сервисы используют старые значения

Пересоздайте контейнеры:

```bash
docker compose up -d --force-recreate
```

### Нужно пересоздать базу с нуля

```bash
docker compose down -v
docker compose up -d
```

## Production deploy

Один и тот же код работает в production через переменные окружения. Реальные секреты храните только в Render/Vercel dashboards, не в Git.

### Render backend

- Root Directory: `pride-forged/backend`
- Build Command: `pip install .`
- Start Command: `sh start.sh`
- Env:

```text
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB
BACKEND_CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend.onrender.com
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

### Frontend Vercel/Render

- Root Directory: `pride-forged/frontend`
- Build Command: `npm run build`
- Start Command для Render frontend: `npm run start`
- Env:

```text
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
INTERNAL_API_URL=https://your-backend.onrender.com/api
```

Разница local/prod:

```text
Local:
NEXT_PUBLIC_API_URL=/api
INTERNAL_API_URL=http://backend:8000/api

Production:
NEXT_PUBLIC_API_URL=https://backend-domain/api
INTERNAL_API_URL=https://backend-domain/api
```

## Production notes

- Не коммитьте `.env`, `.env.local`, `.env.production`, `frontend/.env.local`, `frontend/.env.production`, `backend/.env.local`, `backend/.env.production`.
- Добавьте домен и TLS termination перед Nginx или в отдельном reverse proxy.
- Подключите реальные изображения дисков в `frontend/public` или CDN.

### Telegram outbox cron

Backend writes Telegram notifications to `telegram-outbox/pending`. Send them from the VPS host with cron:

```cron
* * * * * /opt/KovanDiski/pride-forged/scripts/send-telegram-outbox.sh >> /var/log/pride-telegram-outbox.log 2>&1
```

### Email outbox cron

Backend writes email notifications to `email-outbox/pending`. Send them from the VPS host with cron:

```cron
*/5 * * * * /opt/KovanDiski/pride-forged/scripts/send-email-outbox.sh >> /var/log/pride-email-outbox.log 2>&1
```
