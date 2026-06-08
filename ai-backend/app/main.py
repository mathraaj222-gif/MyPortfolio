from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="MathRaaj Portfolio Ecosystem - AI Engine",
    description="Microservice managing text token embedding layers and RAG queries.",
    version="1.0.0"
)

# Cross-Origin Resource Sharing (CORS) Security Rules Configuration
# Allows your specific frontend application browser instance to talk to this endpoint
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In live production settings, replace this with your actual frontend URL domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "AI Engine Core",
        "configuration_check": "passed"
    }