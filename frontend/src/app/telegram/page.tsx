"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Send, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import {
  apiGet,
  apiPost,
  generateReplySuggestion,
  improveReply,
  type TelegramMessage,
  type TelegramStatus
} from "@/lib/api";

export default function TelegramPage() {
  const [status, setStatus] = useState<TelegramStatus>({ connected: false });
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selected = useMemo(
    () => messages.find((message) => message.chat_id === selectedChatId) ?? messages[0],
    [messages, selectedChatId]
  );

  async function loadTelegram() {
    setLoading(true);
    setNotice(null);
    try {
      const telegramStatus = await apiGet<TelegramStatus>("/telegram/status");
      setStatus(telegramStatus);
      if (telegramStatus.connected) {
        const telegramMessages = await apiGet<TelegramMessage[]>("/telegram/messages");
        setMessages(telegramMessages);
        setSelectedChatId(telegramMessages[0]?.chat_id ?? null);
      }
    } catch {
      setNotice("Unable to load Telegram. Confirm the backend is running and TELEGRAM_BOT_TOKEN is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTelegram();
  }, []);

  async function sendReply() {
    if (!selected || !reply.trim()) {
      return;
    }

    setSending(true);
    setNotice(null);
    try {
      await apiPost(`/telegram/messages/${selected.chat_id}/reply`, { message: reply });
      setReply("");
      setNotice("Reply sent through Telegram.");
    } catch {
      setNotice("Unable to send Telegram reply. Check the bot token and whether the user has started the bot.");
    } finally {
      setSending(false);
    }
  }

  async function generateAiReply() {
    if (!selected) {
      return;
    }

    setAiBusy("generate");
    setNotice(null);
    try {
      const response = await generateReplySuggestion({
        platform: "telegram",
        customer_message: selected.text,
        recent_context: [`Customer: ${selected.from_name}`, `Chat: ${selected.chat_id}`],
        tone: "friendly"
      });
      setReply(response.suggestion);
      setNotice("Gemini drafted a Telegram reply. Review it before sending.");
    } catch {
      setNotice("Unable to generate AI reply. Confirm GEMINI_API_KEY is configured.");
    } finally {
      setAiBusy(null);
    }
  }

  async function improveAiReply(tone: "friendly" | "short") {
    if (!selected || !reply.trim()) {
      return;
    }

    setAiBusy(tone);
    setNotice(null);
    try {
      const response = await improveReply({
        draft: reply,
        customer_message: selected.text,
        tone
      });
      setReply(response.improved_reply);
      setNotice("Gemini improved the Telegram draft. Review it before sending.");
    } catch {
      setNotice("Unable to improve AI draft. Confirm Gemini is configured.");
    } finally {
      setAiBusy(null);
    }
  }

  return (
    <AppShell
      title="Telegram"
      description="Manage Telegram bot chats from QChat with the same operator workflow as Gmail."
      action={
        <button className="app-action" onClick={loadTelegram}>
          <RefreshCw size={16} />
          Sync
        </button>
      }
    >
      {notice ? <div className="app-alert">{notice}</div> : null}
      {!status.connected && !loading ? (
        <section className="app-panel gmail-empty">
          <h2>Configure Telegram Bot</h2>
          <p>Add TELEGRAM_BOT_TOKEN to the backend environment, then restart FastAPI.</p>
        </section>
      ) : (
        <section className="gmail-layout">
          <aside className="app-panel gmail-thread-list">
            <div className="panel-heading">
              <h2>Telegram Chats</h2>
              <span>{loading ? "SYNCING" : `${messages.length} CHATS`}</span>
            </div>
            {messages.map((message) => (
              <button
                className="gmail-thread"
                data-active={message.chat_id === selected?.chat_id}
                key={`${message.chat_id}-${message.message_id}`}
                onClick={() => setSelectedChatId(message.chat_id)}
              >
                <span>{message.from_name}</span>
                <strong>CHAT {message.chat_id}</strong>
                <small>{message.text}</small>
              </button>
            ))}
          </aside>

          <article className="app-panel gmail-preview">
            {selected ? (
              <>
                <span>MESSAGE {selected.message_id}</span>
                <h2>{selected.from_name}</h2>
                <p>{selected.text}</p>
                <div className="gmail-meta">
                  <strong>Chat</strong>
                  <span>{selected.chat_id}</span>
                  <strong>Date</strong>
                  <span>{selected.date ? new Date(selected.date * 1000).toLocaleString() : "Unknown"}</span>
                </div>
              </>
            ) : (
              <>
                <span>NO CHATS</span>
                <h2>{loading ? "Syncing Telegram..." : "No Telegram messages yet"}</h2>
                <p>Messages appear here after Telegram sends webhook updates to QChat.</p>
              </>
            )}
          </article>

          <article className="app-panel gmail-reply">
            <span>REPLY FROM QCHAT</span>
            <textarea
              disabled={!selected || sending}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Type a Telegram reply..."
              value={reply}
            />
            <div className="ai-action-row">
              <button className="ghost-action" disabled={!selected || aiBusy !== null} onClick={generateAiReply}>
                <Sparkles size={16} />
                {aiBusy === "generate" ? "Generating..." : "Generate Reply"}
              </button>
              <button className="ghost-action" disabled={!selected || !reply.trim() || aiBusy !== null} onClick={() => improveAiReply("short")}>
                <Wand2 size={16} />
                Make Shorter
              </button>
              <button className="ghost-action" disabled={!selected || !reply.trim() || aiBusy !== null} onClick={() => improveAiReply("friendly")}>
                Friendlier
              </button>
            </div>
            <button className="app-action" disabled={!selected || !reply.trim() || sending} onClick={sendReply}>
              <Send size={16} />
              {sending ? "Sending..." : "Send Telegram Reply"}
            </button>
          </article>
        </section>
      )}
    </AppShell>
  );
}
