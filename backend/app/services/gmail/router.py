import base64
import json
from email.message import EmailMessage
from pathlib import Path
from secrets import token_urlsafe
from typing import Any
from urllib.parse import urlencode

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.storage import repository

router = APIRouter(tags=["gmail"])

GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]
DEMO_USER_KEY = "demo"


class GmailAuthUrl(BaseModel):
    auth_url: str
    state: str


class GmailStatus(BaseModel):
    connected: bool
    email: str | None = None


class GmailMessage(BaseModel):
    id: str
    thread_id: str
    from_email: str
    subject: str
    snippet: str
    date: str


class GmailReplyBody(BaseModel):
    message: str = Field(min_length=1)
    to_email: str | None = None
    subject: str | None = None


def _load_client_id() -> str:
    settings = get_settings()
    if not settings.google_client_secret_file:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_SECRET_FILE is not configured",
        )

    secret_path = Path(settings.google_client_secret_file)
    if not secret_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google client secret file was not found",
        )

    payload = json.loads(secret_path.read_text(encoding="utf-8"))
    client = payload.get("web") or payload.get("installed") or {}
    client_id = client.get("client_id")
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google client secret file is missing client_id",
        )
    return client_id


def build_google_auth_url(state: str) -> str:
    settings = get_settings()
    params = {
        "client_id": _load_client_id(),
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": " ".join(GMAIL_SCOPES),
        "access_type": "offline",
        "include_granted_scopes": "true",
        "prompt": "consent",
        "state": state,
    }
    return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"


def _flow_from_secret_file(state: str | None = None):
    try:
        from google_auth_oauthlib.flow import Flow
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth dependencies are not installed",
        ) from exc

    settings = get_settings()
    if not settings.google_client_secret_file:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_SECRET_FILE is not configured",
        )

    return Flow.from_client_secrets_file(
        settings.google_client_secret_file,
        scopes=GMAIL_SCOPES,
        state=state,
        redirect_uri=settings.google_redirect_uri,
    )


def _credentials_from_token_info():
    token_info = repository.get_gmail_token(DEMO_USER_KEY)
    if not token_info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Gmail is not connected")

    if "token" in token_info and len(token_info) == 1:
        return token_info

    try:
        from google.oauth2.credentials import Credentials
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google auth dependencies are not installed",
        ) from exc

    return Credentials(
        token=token_info.get("token"),
        refresh_token=token_info.get("refresh_token"),
        token_uri=token_info.get("token_uri"),
        client_id=token_info.get("client_id"),
        client_secret=token_info.get("client_secret"),
        scopes=token_info.get("scopes"),
    )


def get_gmail_service():
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google API dependencies are not installed",
        ) from exc

    return build("gmail", "v1", credentials=_credentials_from_token_info())


def _headers_by_name(message: dict[str, Any]) -> dict[str, str]:
    headers = message.get("payload", {}).get("headers", [])
    return {item.get("name", "").lower(): item.get("value", "") for item in headers}


def _raw_email(body: GmailReplyBody) -> str:
    email = EmailMessage()
    if body.to_email:
        email["To"] = body.to_email
    if body.subject:
        email["Subject"] = body.subject
    email.set_content(body.message)
    return base64.urlsafe_b64encode(email.as_bytes()).decode("utf-8")


@router.get("/integrations/gmail/auth-url", response_model=GmailAuthUrl)
def gmail_auth_url() -> GmailAuthUrl:
    state = token_urlsafe(24)
    repository.add_gmail_oauth_state(state)
    return GmailAuthUrl(auth_url=build_google_auth_url(state), state=state)


@router.get("/integrations/gmail/callback")
def gmail_callback(code: str | None = Query(default=None), state: str | None = Query(default=None)):
    if not state or not repository.consume_gmail_oauth_state(state):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OAuth state")
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing OAuth code")

    flow = _flow_from_secret_file(state=state)
    flow.fetch_token(code=code)
    credentials = flow.credentials
    repository.set_gmail_token(DEMO_USER_KEY, {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    })
    return RedirectResponse(get_settings().frontend_gmail_connected_url)


@router.get("/gmail/status", response_model=GmailStatus)
def gmail_status() -> GmailStatus:
    return GmailStatus(connected=repository.has_gmail_token(DEMO_USER_KEY))


@router.get("/gmail/messages", response_model=list[GmailMessage])
def gmail_messages(limit: int = Query(default=10, ge=1, le=20)) -> list[GmailMessage]:
    service = get_gmail_service()
    messages_resource = service.users().messages()
    listed = messages_resource.list(userId="me", maxResults=limit).execute()
    rows: list[GmailMessage] = []

    for item in listed.get("messages", []):
        message = messages_resource.get(userId="me", id=item["id"], format="metadata").execute()
        headers = _headers_by_name(message)
        rows.append(
            GmailMessage(
                id=message.get("id", item["id"]),
                thread_id=message.get("threadId", item.get("threadId", "")),
                from_email=headers.get("from", ""),
                subject=headers.get("subject", "(No subject)"),
                snippet=message.get("snippet", ""),
                date=headers.get("date", ""),
            )
        )

    return rows


@router.post("/gmail/messages/{thread_id}/reply")
def gmail_reply(thread_id: str, body: GmailReplyBody) -> dict[str, str]:
    service = get_gmail_service()
    result = (
        service.users()
        .messages()
        .send(userId="me", body={"raw": _raw_email(body), "threadId": thread_id})
        .execute()
    )
    return {
        "status": "sent",
        "message_id": result.get("id", ""),
        "thread_id": result.get("threadId", thread_id),
    }
