"use client";

import { useEffect, useState } from "react";
import { Bot, BrainCircuit, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import {
  apiGet,
  generateReplySuggestion,
  getConversationInsights,
  improveReply,
  type AiConversationInsights,
  type AiStatus,
  type AiTone
} from "@/lib/api";

const toneOptions: AiTone[] = ["professional", "friendly", "short", "detailed"];

export default function AiAssistantPage() {
  const [status, setStatus] = useState<AiStatus>({ configured: false, provider: "gemini", model: "gemini-3.5-flash" });
  const [platform, setPlatform] = useState("telegram");
  const [tone, setTone] = useState<AiTone>("professional");
  const [customerMessage, setCustomerMessage] = useState("Is this product available?");
  const [draft, setDraft] = useState("");
  const [insights, setInsights] = useState<AiConversationInsights["insights"] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    apiGet<AiStatus>("/ai/status")
      .then(setStatus)
      .catch(() => setNotice("Unable to read AI status. Confirm the backend is running."));
  }, []);

  async function handleGenerateReply() {
    if (!customerMessage.trim()) {
      setNotice("Add a customer message before generating a reply.");
      return;
    }

    setBusy("reply");
    setNotice(null);
    try {
      const response = await generateReplySuggestion({
        platform,
        customer_message: customerMessage,
        tone
      });
      setDraft(response.suggestion);
      setNotice("Gemini generated a reply suggestion. Review it before sending.");
    } catch {
      setNotice("Unable to generate reply. Add GEMINI_API_KEY to the backend environment.");
    } finally {
      setBusy(null);
    }
  }

  async function handleImproveReply(nextTone = tone) {
    if (!draft.trim()) {
      setNotice("Add or generate a draft before improving it.");
      return;
    }

    setBusy(`improve-${nextTone}`);
    setNotice(null);
    try {
      const response = await improveReply({
        draft,
        customer_message: customerMessage,
        tone: nextTone
      });
      setDraft(response.improved_reply);
      setTone(nextTone);
      setNotice("Gemini improved the draft. Human approval is still required.");
    } catch {
      setNotice("Unable to improve reply. Confirm Gemini is configured.");
    } finally {
      setBusy(null);
    }
  }

  async function handleInsights() {
    if (!customerMessage.trim()) {
      setNotice("Add a customer message before generating insights.");
      return;
    }

    setBusy("insights");
    setNotice(null);
    try {
      const response = await getConversationInsights({
        platform,
        customer_message: customerMessage
      });
      setInsights(response.insights);
    } catch {
      setNotice("Unable to generate insights. Confirm Gemini is configured.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppShell
      title="AI Assistant"
      description="Use Gemini to draft, improve, summarize, and understand conversations while the agent stays in control."
      action={
        <span className="app-status-pill" data-ready={status.configured}>
          {status.configured ? "GEMINI READY" : "GEMINI DISCONNECTED"}
        </span>
      }
    >
      {notice ? <div className="app-alert">{notice}</div> : null}
      <section className="app-grid-two ai-workspace">
        <article className="app-panel assistant-composer">
          <Bot size={28} />
          <div className="panel-heading">
            <h2>Reply Generator</h2>
            <span>{status.model}</span>
          </div>
          <label>
            Platform
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              <option value="telegram">Telegram</option>
              <option value="gmail">Gmail</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="messenger">Messenger</option>
            </select>
          </label>
          <label>
            Customer Message
            <textarea
              onChange={(event) => setCustomerMessage(event.target.value)}
              value={customerMessage}
            />
          </label>
          <div className="ai-action-row">
            <select value={tone} onChange={(event) => setTone(event.target.value as AiTone)}>
              {toneOptions.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
            <button className="app-action" disabled={busy === "reply"} onClick={handleGenerateReply}>
              <Sparkles size={16} />
              {busy === "reply" ? "Generating..." : "Generate Reply"}
            </button>
          </div>
          <label>
            Agent Draft
            <textarea
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Gemini reply suggestion appears here..."
              value={draft}
            />
          </label>
          <div className="ai-action-row">
            <button className="ghost-action" disabled={!draft.trim() || busy !== null} onClick={() => handleImproveReply("friendly")}>
              <Wand2 size={16} />
              Friendlier
            </button>
            <button className="ghost-action" disabled={!draft.trim() || busy !== null} onClick={() => handleImproveReply("short")}>
              Shorter
            </button>
            <button className="ghost-action" disabled={!draft.trim() || busy !== null} onClick={() => handleImproveReply("detailed")}>
              Detailed
            </button>
          </div>
        </article>
        <article className="app-panel assistant-composer">
          <BrainCircuit size={28} />
          <div className="panel-heading">
            <h2>Conversation Insights</h2>
            <span>STRUCTURED</span>
          </div>
          <p>
            Generate summary, intent, sentiment, urgency, and the next action for Gmail, Telegram, and future Meta channels.
          </p>
          <button className="app-action" disabled={busy === "insights"} onClick={handleInsights}>
            <Sparkles size={16} />
            {busy === "insights" ? "Analyzing..." : "Analyze Conversation"}
          </button>
          {insights ? (
            <div className="ai-insight-grid">
              <div>
                <span>Summary</span>
                <p>{insights.summary}</p>
              </div>
              <div>
                <span>Intent</span>
                <p>{insights.intent}</p>
              </div>
              <div>
                <span>Sentiment</span>
                <p>{insights.sentiment}</p>
              </div>
              <div>
                <span>Urgency</span>
                <p>{insights.urgency}</p>
              </div>
              <div>
                <span>Next Action</span>
                <p>{insights.suggested_next_action}</p>
              </div>
            </div>
          ) : (
            <div className="conversation-card">
              <span>WAITING</span>
              <p>Insights appear here after Gemini analyzes the customer message.</p>
            </div>
          )}
        </article>
      </section>
    </AppShell>
  );
}
