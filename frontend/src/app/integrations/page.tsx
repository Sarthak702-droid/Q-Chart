"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, PlugZap } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { integrations } from "@/lib/app-data";
import { apiGet, connectGmail, type AiStatus, type GmailStatus, type TelegramStatus } from "@/lib/api";

export default function IntegrationsPage() {
  const [gmailStatus, setGmailStatus] = useState<GmailStatus>({ connected: false });
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus>({ connected: false });
  const [aiStatus, setAiStatus] = useState<AiStatus>({ configured: false, provider: "gemini", model: "gemini-3.5-flash" });
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    apiGet<GmailStatus>("/gmail/status")
      .then(setGmailStatus)
      .catch(() => setGmailStatus({ connected: false }));
    apiGet<TelegramStatus>("/telegram/status")
      .then(setTelegramStatus)
      .catch(() => setTelegramStatus({ connected: false }));
    apiGet<AiStatus>("/ai/status")
      .then(setAiStatus)
      .catch(() => setAiStatus({ configured: false, provider: "gemini", model: "gemini-3.5-flash" }));
  }, []);

  async function handleGmailConnect() {
    setConnecting(true);
    setError(null);
    try {
      await connectGmail();
    } catch {
      setConnecting(false);
      setError("Unable to start Gmail connection. Check the backend env and Google OAuth setup.");
    }
  }

  return (
    <AppShell
      title="Integrations"
      description="Connect the easy channels first, then unlock Meta and WhatsApp after verification."
      action={<Link className="app-action" href="/ai-assistant">Open AI Assistant</Link>}
    >
      {error ? <div className="app-alert">{error}</div> : null}
      <section className="integration-grid">
        {integrations.map((integration) => (
          <article className="app-panel integration-card" key={integration.label}>
            <PlugZap size={22} />
            <span>
              {integration.label === "Gmail" && gmailStatus.connected
                ? "CONNECTED"
                : integration.label === "Telegram Bot" && telegramStatus.connected
                  ? "CONNECTED"
                  : integration.label === "Gemini AI" && aiStatus.configured
                    ? "READY"
                    : integration.status}
            </span>
            <h2>{integration.label}</h2>
            <p>{integration.note}</p>
            {integration.status === "LOCKED" ? (
              <div className="locked-state">
                <Lock size={16} />
                <span>Business credentials required</span>
              </div>
            ) : integration.label === "Gmail" ? (
              gmailStatus.connected ? (
                <Link className="app-action" href="/gmail">
                  <CheckCircle2 size={16} />
                  Manage Gmail
                </Link>
              ) : (
                <button className="app-action" disabled={connecting} onClick={handleGmailConnect}>
                  {connecting ? "Opening Google..." : "Connect Gmail"}
                </button>
              )
            ) : integration.label === "Telegram Bot" ? (
              telegramStatus.connected ? (
                <Link className="app-action" href="/telegram">
                  <CheckCircle2 size={16} />
                  Manage Telegram
                </Link>
              ) : (
                <Link className="app-action" href="/telegram">
                  Configure Telegram
                </Link>
              )
            ) : integration.label === "Gemini AI" ? (
              <Link className="app-action" href="/ai-assistant">
                {aiStatus.configured ? "Use AI Assistant" : "Configure Gemini"}
              </Link>
            ) : integration.label === "Website Live Chat" ? (
              <Link className="app-action" href="/inbox">
                Preview Inbox
              </Link>
            ) : null}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
