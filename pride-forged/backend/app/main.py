import logging

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

logger = logging.getLogger("pride_forged.rate_limit")

app = FastAPI(
    title="PRIDE Forged API",
    description="Catalog, vehicle and forged wheel fitment API for PRIDE Forged.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.middleware("http")
async def log_rate_limited_responses(request: Request, call_next):
    response = await call_next(request)

    if response.status_code == 429:
        forwarded_for = request.headers.get("x-forwarded-for")
        client_ip = forwarded_for.split(",", 1)[0].strip() if forwarded_for else None
        client_ip = client_ip or (request.client.host if request.client else "unknown")
        logger.warning(
            "429 response generated",
            extra={
                "endpoint": request.url.path,
                "method": request.method,
                "client_ip": client_ip,
                "reason": response.headers.get("x-ratelimit-reason", "unknown"),
                "limit": response.headers.get("x-ratelimit-limit", "unknown"),
                "remaining": response.headers.get("x-ratelimit-remaining", "unknown"),
            },
        )

    return response


@app.get("/health", tags=["system"])
def health(response: Response) -> dict[str, str]:
    response.headers["Cache-Control"] = "public, max-age=30"
    return {"status": "ok"}


@app.head("/health", tags=["system"])
def health_head() -> None:
    return None
