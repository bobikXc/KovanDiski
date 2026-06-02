# PRIDE Forged API

FastAPI serves OpenAPI at `/docs` and `/openapi.json`.

## Endpoints

- `GET /api/brands` — list vehicle brands.
- `GET /api/brands/{slug}` — brand by slug with models.
- `GET /api/models` — list vehicle models, optionally filtered by `brand_slug`.
- `GET /api/wheels` — list wheels.
- `GET /api/wheels/{slug}` — wheel card with images.
- `GET /api/fitment` — wheel fitment, optionally filtered by `brand_slug`, `model_slug`, `wheel_slug`.
