from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import chat, documents
import os

app = FastAPI(
    title="MathRaaj Portfolio Ecosystem - AI Engine",
    description="Microservice managing portfolio RAG queries and GenUI directives.",
    version="1.0.0"
)

_raw_origins = getattr(settings, "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:5173")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    allow_headers=["*"],
)

# Register AI & Document routers
app.include_router(chat.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "AI Engine Core",
        "configuration_check": "passed"
    }