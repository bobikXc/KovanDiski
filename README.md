# PRIDE Forged Deployment Repository

Production/demo repository for PRIDE Forged. The application source lives in `pride-forged/`.

## Project Layout

```text
pride-forged/
├── frontend/      # Next.js 15, TypeScript, Tailwind CSS
├── backend/       # FastAPI, SQLAlchemy, Alembic
├── nginx/         # Local Docker reverse proxy
├── docs/          # API and deployment notes
└── docker-compose.yml
```

## Live Demo

- Frontend: https://pride-forged-frontend.onrender.com
- Backend health: https://pride-forged-backend.onrender.com/health
- Backend API: https://pride-forged-backend.onrender.com/api/wheels

## Local Docker Run

```bash
cd pride-forged
cp .env.example .env
docker compose up --build -d
```

Default local URLs:

- Site through Nginx: http://localhost
- Backend API through Nginx: http://localhost/api/wheels
- Backend docs: http://localhost/docs

Stop the stack:

```bash
cd pride-forged
docker compose down
```

## Development Commands

Frontend:

```bash
cd pride-forged/frontend
npm install
npm run dev
npm run build
```

Backend:

```bash
cd pride-forged/backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install .
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

## Deployment Notes

Deployment settings are documented in `pride-forged/docs/deploy.md`.

Do not commit `.env`, access tokens, database passwords, Render credentials, Vercel tokens, or raw source image files.
