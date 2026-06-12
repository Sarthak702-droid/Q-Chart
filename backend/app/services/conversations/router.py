from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.models.entities import Message, Platform
from app.storage.memory import contacts, conversations, messages, seed_inbox

router = APIRouter(prefix="/inbox", tags=["inbox"])


class ConversationSummary(BaseModel):
    id: UUID
    contact_name: str
    platform: Platform
    status: str
    last_message: str
    last_message_at: str


class ReplyBody(BaseModel):
    message: str


@router.get("/conversations", response_model=list[ConversationSummary])
def list_conversations(platform: Platform | None = None) -> list[ConversationSummary]:
    seed_inbox()
    rows: list[ConversationSummary] = []
    for conversation in conversations.values():
        if platform and conversation.platform != platform:
            continue
        contact = contacts[str(conversation.contact_id)]
        latest = messages[str(conversation.id)][-1]
        rows.append(
            ConversationSummary(
                id=conversation.id,
                contact_name=contact.name,
                platform=conversation.platform,
                status=conversation.status.value,
                last_message=latest.message,
                last_message_at=conversation.last_message_at.isoformat()
            )
        )
    return rows


@router.get("/conversations/{conversation_id}/messages", response_model=list[Message])
def list_messages(conversation_id: UUID) -> list[Message]:
    seed_inbox()
    thread = messages.get(str(conversation_id))
    if thread is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return thread


@router.post("/conversations/{conversation_id}/reply", response_model=Message)
def reply(conversation_id: UUID, body: ReplyBody) -> Message:
    seed_inbox()
    key = str(conversation_id)
    if key not in messages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    message = Message(conversation_id=conversation_id, sender_type="agent", message=body.message)
    messages[key].append(message)
    return message
