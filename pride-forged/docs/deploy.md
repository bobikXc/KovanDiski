# Deployment

This document describes the current demo/prod deployment layout. Store real secrets only in provider dashboards, never in Git.

## Render PostgreSQL

- Provider: Render PostgreSQL
- Database: `pride-forged-db`
- Used by: Render backend service
- Connection variable: `DATABASE_URL`

Use the external/internal connection string provided by Render. Do not copy the password into repository files.

## Render Backend

- Service type: Web Service
- Runtime: Native Python or Docker
- Repository: `https://github.com/bobikXc/KovanDiski`
- Branch: `main`
- Root directory: `pride-forged/backend`
- Build command: `pip install .`
- Start command: `sh start.sh`
- Public URL: `https://pride-forged-backend.onrender.com`
- Health check: `https://pride-forged-backend.onrender.com/health`

Backend environment variables:

```text
DATABASE_URL=postgresql+psycopg://...
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000,https://pride-forged-frontend.onrender.com
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are optional until Telegram notifications are enabled.

## Render Frontend

- Service type: Web Service
- Runtime: Node or Docker
- Repository: `https://github.com/bobikXc/KovanDiski`
- Branch: `main`
- Root directory: `pride-forged/frontend`
- Build command: `npm run build`
- Start command: `npm run start`
- Public URL: `https://pride-forged-frontend.onrender.com`
- Exposed container port: `3000`

Frontend environment variables:

```text
NEXT_PUBLIC_API_URL=https://pride-forged-backend.onrender.com/api
INTERNAL_API_URL=https://pride-forged-backend.onrender.com/api
```

`NEXT_PUBLIC_API_URL` is used in the browser bundle and must be available at frontend build time. `INTERNAL_API_URL` is used for server-side rendering.
When deploying the frontend with Docker, pass the same values as Docker build args as well as runtime environment variables.

## Vercel Frontend

Vercel can host the frontend only. Use the same GitHub repository and set the project root to `pride-forged/frontend`.

Recommended settings:

- Framework preset: Next.js
- Root directory: `pride-forged/frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Next.js default

Required Vercel environment variables:

```text
NEXT_PUBLIC_API_URL=https://pride-forged-backend.onrender.com/api
INTERNAL_API_URL=https://pride-forged-backend.onrender.com/api
```

After adding a Vercel domain, add it to `BACKEND_CORS_ORIGINS` on the backend service and redeploy the backend.

## Local Docker

Local Docker uses `pride-forged/docker-compose.yml`:

- `postgres`: PostgreSQL 16
- `backend`: FastAPI backend
- `frontend`: Next.js standalone server
- `nginx`: local reverse proxy on port `80`

Run:

```bash
cd pride-forged
cp .env.local.example .env
docker compose up --build -d
```

Stop:

```bash
cd pride-forged
docker compose down
```

Local environment:

```text
NEXT_PUBLIC_API_URL=/api
INTERNAL_API_URL=http://backend:8000/api
DATABASE_URL=postgresql+psycopg://pride:pride_password@postgres:5432/pride_forged
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000
```

Production environment:

```text
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
INTERNAL_API_URL=https://your-backend.onrender.com/api
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB
BACKEND_CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend.onrender.com
```

## Production Checks

Use these URLs after each deployment:

```text
https://pride-forged-backend.onrender.com/health
https://pride-forged-backend.onrender.com/api/wheels
https://pride-forged-frontend.onrender.com/
https://pride-forged-frontend.onrender.com/catalog
https://pride-forged-frontend.onrender.com/catalog/pride-apex
https://pride-forged-frontend.onrender.com/fitment
https://pride-forged-frontend.onrender.com/tools/wheel-calculator
```
