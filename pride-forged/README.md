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

## Быстрый запуск

```bash
cd pride-forged
cp .env.example .env
docker compose up -d
```

После запуска:

- Сайт: <http://localhost>
- Backend healthcheck: <http://localhost/health> через контейнер backend или <http://localhost/api/brands> через Nginx
- OpenAPI UI: <http://localhost/docs>
- OpenAPI JSON: <http://localhost/openapi.json>

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

## Production notes

- Замените значения `.env` на безопасные секреты.
- Добавьте домен и TLS termination перед Nginx или в отдельном reverse proxy.
- Подключите реальные изображения дисков в `frontend/public` или CDN.
