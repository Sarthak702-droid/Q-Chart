from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.ai.router import router as ai_router
from app.services.auth.router import router as auth_router
from app.services.conversations.router import router as conversations_router
from app.services.gmail.router import router as gmail_router
from app.services.integrations.router import router as integrations_router
from app.services.livechat.router import router as livechat_router
from app.services.telegram.router import router as telegram_router
from app.services.webhooks.router import router as webhooks_router

app = FastAPI(
    title="QChat API",
    version="0.1.0",
    description="FastAPI MVP backend for a unified AI-assisted customer inbox."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(conversations_router)
app.include_router(gmail_router)
app.include_router(livechat_router)
app.include_router(telegram_router)
app.include_router(integrations_router)
app.include_router(webhooks_router)
app.include_router(ai_router)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "qchat-api"}
