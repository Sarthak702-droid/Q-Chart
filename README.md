# QChat

QChat is an MVP scaffold for a unified customer conversation inbox with AI assistance.

## Apps

- `frontend/`: Next.js landing page and future dashboard.
- `backend/`: FastAPI backend organized as microservice-style domains.

## Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
pip install -r backend/requirements.txt
python -m uvicorn app.main:app --reload --app-dir backend
```

MongoDB local setup:

```bash
set MONGODB_URI=mongodb://127.0.0.1:27017
set MONGODB_DATABASE=qchat
```

The backend stores Gmail tokens, Gmail OAuth state, Telegram messages, and OTP state in MongoDB when Mongo is reachable. For local development, it falls back to in-memory storage if MongoDB is not running.

Gmail local setup:

```bash
set GOOGLE_CLIENT_SECRET_FILE=C:\Users\91891\Downloads\client_secret_464962628043-ulc6bg5asld898ubo3rvj00tmrj50au6.apps.googleusercontent.com.json
set GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/integrations/gmail/callback
set FRONTEND_GMAIL_CONNECTED_URL=http://127.0.0.1:3000/integrations?gmail=connected
```

Add this redirect URI in Google Cloud Console:

```text
http://127.0.0.1:8000/integrations/gmail/callback
```

Telegram local setup:

```bash
set TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

Telegram MVP endpoints:

```text
GET  /telegram/status
GET  /telegram/messages
POST /telegram/messages/{chat_id}/reply
POST /telegram/webhook
```

Gemini AI local setup:

```bash
set AI_PROVIDER=gemini
set GEMINI_MODEL=gemini-3.5-flash
set GEMINI_API_KEY=your-fresh-gemini-api-key
```

The pasted Gemini key should be rotated and replaced with a fresh key before real use. AI suggestions are human-approved only; QChat never auto-sends Gemini output.

## Dummy OTP

Use the default dummy number `+919999999999` with:

```bash
curl -X POST http://127.0.0.1:8000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+919999999999\"}"
```

The OTP is printed in the backend terminal.
