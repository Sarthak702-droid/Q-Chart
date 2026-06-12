from __future__ import annotations

import json
import re
from typing import Any, Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.storage import repository

router = APIRouter(prefix="/ai", tags=["ai"])

Tone = Literal["professional", "friendly", "short", "detailed", "helpful"]


class AiStatus(BaseModel):
    configured: bool
    provider: str
    model: str


class ReplySuggestionBody(BaseModel):
    platform: str = Field(min_length=1)
    customer_message: str = Field(min_length=1)
    recent_context: list[str] = Field(default_factory=list)
    tone: Tone = "professional"


class ReplySuggestionResponse(BaseModel):
    provider: str
    model: str
    suggestion: str


class ImproveReplyBody(BaseModel):
    draft: str = Field(min_length=1)
    customer_message: str = Field(min_length=1)
    tone: Tone = "professional"


class ImproveReplyResponse(BaseModel):
    provider: str
    model: str
    improved_reply: str


class ConversationInsightsBody(BaseModel):
    platform: str = Field(min_length=1)
    customer_message: str = Field(min_length=1)
    recent_context: list[str] = Field(default_factory=list)


class ConversationInsights(BaseModel):
    summary: str
    intent: str
    sentiment: str
    urgency: str
    suggested_next_action: str


class ConversationInsightsResponse(BaseModel):
    provider: str
    model: str
    insights: ConversationInsights


def _clean_text(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Text cannot be empty")
    return cleaned


def _context_block(recent_context: list[str]) -> str:
    cleaned = [item.strip() for item in recent_context if item.strip()]
    if not cleaned:
        return "No additional context."
    return "\n".join(f"- {item}" for item in cleaned[:5])


def _extract_json(text: str) -> dict[str, Any]:
    stripped = text.strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)```", stripped, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        stripped = fenced.group(1).strip()
    try:
        payload = json.loads(stripped)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider returned invalid structured output",
        ) from exc
    if not isinstance(payload, dict):
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI provider returned invalid insight shape")
    return payload


class GeminiProvider:
    provider = "gemini"

    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model

    def _generate(self, prompt: str) -> str:
        try:
            from google import genai
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="google-genai is not installed",
            ) from exc

        client = genai.Client(api_key=self.api_key)
        response = client.models.generate_content(model=self.model, contents=prompt)
        text = getattr(response, "text", "") or ""
        return text.strip()

    def reply_suggestion(
        self,
        *,
        platform: str,
        customer_message: str,
        recent_context: list[str],
        tone: str,
    ) -> str:
        prompt = f"""
You are QChat's AI reply assistant for a small business inbox.
Draft one concise, human-approved reply. Do not claim actions are completed unless the context says so.

Platform: {platform}
Tone: {tone}
Recent context:
{_context_block(recent_context)}

Customer message:
{customer_message}

Return only the reply text.
""".strip()
        return self._generate(prompt)

    def improve_reply(self, *, draft: str, customer_message: str, tone: str) -> str:
        prompt = f"""
Improve this agent draft for a customer conversation. Keep it accurate and ready for a human agent to review.

Tone: {tone}
Customer message:
{customer_message}

Agent draft:
{draft}

Return only the improved reply.
""".strip()
        return self._generate(prompt)

    def conversation_insights(
        self,
        *,
        platform: str,
        customer_message: str,
        recent_context: list[str],
    ) -> dict[str, Any]:
        prompt = f"""
Analyze this customer conversation for a small business support inbox.

Platform: {platform}
Recent context:
{_context_block(recent_context)}

Customer message:
{customer_message}

Return JSON only with these string keys:
summary, intent, sentiment, urgency, suggested_next_action.
""".strip()
        return _extract_json(self._generate(prompt))


def get_ai_provider() -> GeminiProvider:
    settings = get_settings()
    if settings.ai_provider != "gemini":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only Gemini AI is configured for this MVP")
    if not settings.gemini_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="GEMINI_API_KEY is not configured")
    return GeminiProvider(api_key=settings.gemini_api_key, model=settings.gemini_model)


@router.get("/status", response_model=AiStatus)
def ai_status() -> AiStatus:
    settings = get_settings()
    return AiStatus(
        configured=bool(settings.gemini_api_key),
        provider=settings.ai_provider,
        model=settings.gemini_model,
    )


@router.post("/reply-suggestion", response_model=ReplySuggestionResponse)
def reply_suggestion(body: ReplySuggestionBody) -> ReplySuggestionResponse:
    customer_message = _clean_text(body.customer_message)
    provider = get_ai_provider()
    suggestion = provider.reply_suggestion(
        platform=body.platform,
        customer_message=customer_message,
        recent_context=body.recent_context,
        tone=body.tone,
    )
    response = ReplySuggestionResponse(provider=provider.provider, model=provider.model, suggestion=suggestion)
    repository.add_ai_suggestion(
        {
            "kind": "reply_suggestion",
            "platform": body.platform,
            "input": {"customer_message": customer_message, "recent_context": body.recent_context, "tone": body.tone},
            "output": response.model_dump(),
        }
    )
    return response


@router.post("/suggest-reply", response_model=ReplySuggestionResponse)
def suggest_reply_legacy(body: ReplySuggestionBody) -> ReplySuggestionResponse:
    return reply_suggestion(body)


@router.post("/improve-reply", response_model=ImproveReplyResponse)
def improve_reply(body: ImproveReplyBody) -> ImproveReplyResponse:
    draft = _clean_text(body.draft)
    customer_message = _clean_text(body.customer_message)
    provider = get_ai_provider()
    improved = provider.improve_reply(draft=draft, customer_message=customer_message, tone=body.tone)
    response = ImproveReplyResponse(provider=provider.provider, model=provider.model, improved_reply=improved)
    repository.add_ai_suggestion(
        {
            "kind": "improve_reply",
            "platform": "agent_draft",
            "input": {"draft": draft, "customer_message": customer_message, "tone": body.tone},
            "output": response.model_dump(),
        }
    )
    return response


@router.post("/conversation-insights", response_model=ConversationInsightsResponse)
def conversation_insights(body: ConversationInsightsBody) -> ConversationInsightsResponse:
    customer_message = _clean_text(body.customer_message)
    provider = get_ai_provider()
    insights_payload = provider.conversation_insights(
        platform=body.platform,
        customer_message=customer_message,
        recent_context=body.recent_context,
    )
    insights = ConversationInsights(**insights_payload)
    response = ConversationInsightsResponse(provider=provider.provider, model=provider.model, insights=insights)
    repository.add_ai_suggestion(
        {
            "kind": "conversation_insights",
            "platform": body.platform,
            "input": {"customer_message": customer_message, "recent_context": body.recent_context},
            "output": response.model_dump(),
        }
    )
    return response
