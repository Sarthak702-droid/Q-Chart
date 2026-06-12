import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, Send, Sparkles, Zap } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { MetricCard, StatusBadge } from "@/components/ui";
import { dashboardMetrics, priorities } from "@/lib/app-data";

export default function DashboardPage() {
  return (
    <AppShell
      title="Good morning!"
      description="AI has prioritized your agency pipeline so the team can act before leads go cold."
      action={<Link className="app-action" href="/workspace">Open Workspace</Link>}
      showAiPanel
      aiPanel={<DashboardAiPanel />}
    >
      <section className="app-card hero-card" style={{ marginBottom: "1rem" }}>
        <span className="eyebrow">
          <Sparkles size={18} /> Daily Brief
        </span>
        <h1>
          You have <span className="gradient-text">4 pending replies</span>,{" "}
          <span style={{ color: "var(--warning)" }}>2 overdue leads</span>, and 3 meetings today.
        </h1>
      </section>

      <section className="metric-grid" style={{ marginBottom: "1rem" }}>
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="app-grid-two">
        <article className="app-panel">
          <div className="panel-heading">
            <h2>Today's Priorities</h2>
            <Link className="ghost-action" href="/inbox">View All</Link>
          </div>
          <div className="conversation-stack">
            {priorities.map((item) => (
              <Link className="conversation-card" href="/inbox" key={item.title}>
                <div className="topbar-actions">
                  {item.tone === "danger" ? <AlertTriangle color="var(--danger)" /> : <Clock color="var(--warning)" />}
                  <h3>{item.title}</h3>
                  <StatusBadge tone={item.tone as "warning" | "danger" | "info"}>{item.wait}</StatusBadge>
                </div>
                <p>{item.detail}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="app-panel">
          <div className="panel-heading">
            <h2>Pipeline Health</h2>
            <span className="topbar-actions">
              <i style={{ color: "var(--success)" }}>●</i>
              <i style={{ color: "var(--warning)" }}>●</i>
              <i style={{ color: "var(--danger)" }}>●</i>
            </span>
          </div>
          <div className="matrix-list">
            {["Acme Corp", "TechStart Inc", "Global Media"].map((name, index) => (
              <Link className="matrix-row" href="/pipeline" key={name}>
                <span>
                  <strong>{name}</strong>
                  <br />
                  <small className="muted">{["Enterprise Tier", "Growth Tier", "Agency Tier"][index]}</small>
                </span>
                {index === 2 ? <CheckCircle2 color="var(--success)" /> : <Zap color="var(--text-secondary)" />}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function DashboardAiPanel() {
  return (
    <>
      <article className="ai-card">
        <span className="eyebrow">AI Daily Brief</span>
        <p>Based on your patterns, I have prioritized your morning pipeline. ABC Agency is nearing SLA breach.</p>
        <Link className="ghost-action" href="/ai-assistant">
          Draft Response <Send size={16} />
        </Link>
      </article>
      <article className="ai-card">
        <span className="eyebrow" style={{ color: "var(--warning)" }}>Attention</span>
        <p>2 overdue leads require immediate follow-up to maintain your 24% conversion rate.</p>
      </article>
    </>
  );
}
