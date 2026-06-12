"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Send, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import {
  apiGet,
  apiPost,
  connectGmail,
  generateReplySuggestion,
  improveReply,
  type GmailMessage,
  type GmailStatus
} from "@/lib/api";

function replySubject(subject: string) {
  return subject.toLowerCase().startsWith("re:") ? subject : `Re: ${subject}`;
}

export default function GmailPage() {
  const [status, setStatus] = useState<GmailStatus>({ connected: false });
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selected = useMemo(
    () => messages.find((message) => message.id === selectedId) ?? messages[0],
    [messages, selectedId]
  );

  async function loadGmail() {
    setLoading(true);
    setNotice(null);
    try {
      const gmailStatus = await apiGet<GmailStatus>("/gmail/status");
      setStatus(gmailStatus);
      if (gmailStatus.connected) {
        const gmailMessages = await apiGet<GmailMessage[]>("/gmail/messages");
        setMessages(gmailMessages);
        setSelectedId(gmailMessages[0]?.id ?? null);
      }
    } catch {
      setNotice("Unable to load Gmail. Connect Gmail again or confirm the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGmail();
  }, []);

  async function sendReply() {
    if (!selected || !reply.trim()) {
      return;
    }

    setSending(true);
    setNotice(null);
    try {
      await apiPost(`/gmail/messages/${selected.thread_id}/reply`, {
        message: reply,
        to_email: selected.from_email,
        subject: replySubject(selected.subject)
      });
      setReply("");
      setNotice("Reply sent through Gmail.");
    } catch {
      setNotice("Unable to send Gmail reply. Check the connected Google account permissions.");
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
        platform: "gmail",
        customer_message: selected.snippet || selected.subject,
        recent_context: [`Subject: ${selected.subject}`, `From: ${selected.from_email}`],
        tone: "professional"
      });
      setReply(response.suggestion);
      setNotice("Gemini drafted a Gmail reply. Review it before sending.");
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
        customer_message: selected.snippet || selected.subject,
        tone
      });
      setReply(response.improved_reply);
      setNotice("Gemini improved the Gmail draft. Review it before sending.");
    } catch {
      setNotice("Unable to improve AI draft. Confirm Gemini is configured.");
    } finally {
      setAiBusy(null);
    }
  }

  return (
    <AppShell
      title="Gmail"
      description="Read Gmail conversations and reply from QChat without adding full mailbox controls."
      action={
        <button className="app-action" onClick={loadGmail}>
          <RefreshCw size={16} />
          Sync
        </button>
      }
    >
      {notice ? <div className="app-alert">{notice}</div> : null}
      {!status.connected && !loading ? (
        <section className="app-panel gmail-empty">
          <h2>Connect Gmail First</h2>
          <p>Sign in with Google to sync recent Gmail conversations and send replies from QChat.</p>
          <button className="app-action" onClick={connectGmail}>
            Connect Gmail
          </button>
        </section>
      ) : (
        <section className="gmail-layout">
          <aside className="app-panel gmail-thread-list">
            <div className="panel-heading">
              <h2>Recent Gmail</h2>
              <span>{loading ? "SYNCING" : `${messages.length} THREADS`}</span>
            </div>
            {messages.map((message) => (
              <button
                className="gmail-thread"
                data-active={message.id === selected?.id}
                key={message.id}
                onClick={() => setSelectedId(message.id)}
              >
                <span>{message.from_email || "Unknown sender"}</span>
                <strong>{message.subject}</strong>
                <small>{message.snippet}</small>
              </button>
            ))}
          </aside>

          <article className="app-panel gmail-preview">
            {selected ? (
              <>
                <span>{selected.date || "GMAIL THREAD"}</span>
                <h2>{selected.subject}</h2>
                <p>{selected.snippet}</p>
                <div className="gmail-meta">
                  <strong>From</strong>
                  <span>{selected.from_email}</span>
                  <strong>Thread</strong>
                  <span>{selected.thread_id}</span>
                </div>
              </>
            ) : (
              <>
                <span>NO MESSAGES</span>
                <h2>{loading ? "Syncing Gmail..." : "No Gmail threads found"}</h2>
                <p>Recent Gmail messages will appear here after the account is connected.</p>
              </>
            )}
          </article>

          <article className="app-panel gmail-reply">
            <span>REPLY FROM QCHAT</span>
            <textarea
              disabled={!selected || sending}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Type a Gmail reply..."
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
              {sending ? "Sending..." : "Send Gmail Reply"}
            </button>
          </article>
        </section>
      )}
    </AppShell>
  );
}
