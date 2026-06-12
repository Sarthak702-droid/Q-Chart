"use client";

import { useMemo, useState } from "react";
import { Calendar, Mail, Phone, Send, Sparkles } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { GhostButton, StatusBadge } from "@/components/ui";
import { channelStats, conversations } from "@/lib/app-data";

export default function InboxPage() {
  const [selectedName, setSelectedName] = useState(conversations[0].name);
  const selected = useMemo(
    () => conversations.find((conversation) => conversation.name === selectedName) ?? conversations[0],
    [selectedName]
  );

  return (
    <AppShell
      title="Unified Inbox"
      description="Email, Instagram, WhatsApp, Messenger, and internal notes in one agency command center."
      showAiPanel
      aiPanel={<LeadIntel selected={selected} />}
    >
      <section className="inbox-layout">
        <aside className="app-panel channel-filter">
          <div className="panel-heading">
            <h2>Inbox</h2>
            <span>{conversations.length} live</span>
          </div>
          {channelStats.map((channel) => (
            <button
              className="filter-row"
              data-active={channel.label === selected.platform}
              key={channel.label}
              type="button"
            >
              <span>{channel.label}</span>
              <StatusBadge tone={channel.tone as "success" | "warning" | "info"}>{channel.count}</StatusBadge>
            </button>
          ))}
        </aside>

        <div className="app-panel thread-list">
          <div className="thread-stack">
            {conversations.map((conversation) => (
              <button
                className="thread-row"
                data-active={conversation.name === selected.name}
                key={conversation.name}
                onClick={() => setSelectedName(conversation.name)}
                type="button"
              >
                <span>{conversation.platform}</span>
                <h3>{conversation.name}</h3>
                <p>{conversation.message}</p>
                <strong>{conversation.time}</strong>
              </button>
            ))}
          </div>
        </div>

        <article className="app-panel reply-panel">
          <span>{selected.platform} Thread</span>
          <h2>{selected.name}</h2>
          <p className="muted">{selected.company}</p>
          <div className="conversation-card">
            <span>Today</span>
            <h3>{selected.name}</h3>
            <p>{selected.message}</p>
          </div>
          <div className="conversation-card">
            <span>Internal Note</span>
            <p>
              Alex will handle the social assets timeline. The dev team needs one extra week, so
              manage expectations carefully.
            </p>
          </div>
          <textarea className="reply-box" placeholder="Type a message..." defaultValue="Thanks Sarah. I can send the revised scope and calendar link in the next 10 minutes." />
          <div className="reply-actions">
            <GhostButton>
              <Sparkles size={16} />
              Improve
            </GhostButton>
            <button className="app-action">
              Send <Send size={16} />
            </button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function LeadIntel({ selected }: { selected: (typeof conversations)[number] }) {
  return (
    <>
      <article className="ai-card" style={{ textAlign: "center" }}>
        <span className="avatar" style={{ width: 82, height: 82, margin: "0 auto 1rem" }} />
        <h2 style={{ margin: 0 }}>{selected.name}</h2>
        <p>{selected.company}</p>
        <div className="button-row" style={{ justifyContent: "center" }}>
          <button className="ghost-action">
            <Phone size={16} /> Call
          </button>
          <button className="ghost-action">
            <Calendar size={16} /> Meet
          </button>
        </div>
      </article>
      <article className="ai-card">
        <span className="eyebrow">Lead Score</span>
        <h2 style={{ margin: "0.5rem 0" }}>{selected.score}/100</h2>
        <div className="progress-line">
          <span style={{ width: `${selected.score}%` }} />
        </div>
        <p>High intent signal detected from recent document views and fast response times.</p>
      </article>
      <article className="ai-card">
        <span className="eyebrow">Deal Context</span>
        <p>Stage: Negotiation</p>
        <p>Value: {selected.value}</p>
        <p>
          <Mail size={15} /> Team notes are ready for internal handoff.
        </p>
      </article>
    </>
  );
}
