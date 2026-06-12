from datetime import datetime
from uuid import uuid4

from app.models.entities import Contact, Conversation, Message, Platform, User

DEMO_USER_ID = uuid4()

users: dict[str, User] = {
    str(DEMO_USER_ID): User(
        id=DEMO_USER_ID,
        name="Demo Owner",
        email="owner@qchat.example.com",
        plan="starter"
    )
}

contacts: dict[str, Contact] = {}
conversations: dict[str, Conversation] = {}
messages: dict[str, list[Message]] = {}
otp_store: dict[str, str] = {}
gmail_oauth_states: set[str] = set()
gmail_tokens: dict[str, dict] = {}
telegram_messages: list[dict] = []
ai_suggestions: list[dict] = []


def seed_inbox() -> None:
    if conversations:
        return

    seed_data = [
        ("Anaya", Platform.whatsapp, "Is this product available?"),
        ("Rahul", Platform.telegram, "Can you send the price list?"),
        ("Maya", Platform.instagram, "Do you deliver in Pune?"),
        ("Kiran", Platform.email, "Need invoice for my order."),
        ("Sara", Platform.livechat, "I need help choosing a plan.")
    ]

    for index, (name, platform, text) in enumerate(seed_data, start=1):
        contact = Contact(
            user_id=DEMO_USER_ID,
            name=name,
            phone=f"+91999999999{index}",
            email=f"{name.lower()}@example.com",
            platform=platform,
            external_id=f"{platform.value}-{index}"
        )
        conversation = Conversation(
            user_id=DEMO_USER_ID,
            contact_id=contact.id,
            platform=platform,
            last_message_at=datetime.utcnow()
        )
        message = Message(
            conversation_id=conversation.id,
            sender_type="customer",
            message=text,
            platform_message_id=f"seed-{index}"
        )
        contacts[str(contact.id)] = contact
        conversations[str(conversation.id)] = conversation
        messages[str(conversation.id)] = [message]
