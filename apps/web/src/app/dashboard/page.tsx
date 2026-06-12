"use client";
import Link from "next/link";
import { AlertTriangle, Send, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge, GlassCard, MetricCard } from "@/components/ui";
import { useDashboardSummary } from "@/lib/api";

export default function DashboardPage() {
  const { data } = useDashboardSummary();
  return <AppShell aiPanel={<AiPanel />}>
    <GlassCard className="mb-8 p-8 md:p-10"><div className="flex items-center gap-2 text-cyan"><Sparkles /><span className="font-bold uppercase tracking-[.2em]">Daily Brief</span></div><h1 className="mt-7 max-w-3xl font-display text-5xl font-bold leading-tight md:text-6xl">Good morning!<br /><span className="text-[#c1c1ff]">You have 4 pending replies, </span><span className="text-warning">2 overdue leads, </span>and 3 meetings today.</h1></GlassCard>
    <section className="mb-8 grid gap-5 md:grid-cols-4">{data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
    <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]"><GlassCard className="p-6"><div className="mb-5 flex justify-between"><h2 className="text-2xl font-bold">Today's Priorities</h2><Link className="text-cyan" href="/inbox">View All →</Link></div>{data.priorities.map((item) => <Link key={item.id} href="/inbox" className="grid gap-4 border-t border-white/10 py-5 md:grid-cols-[48px_1fr_auto]"><span className={`grid size-12 place-items-center rounded-full ${item.tone === "danger" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"}`}>{item.tone === "danger" ? <AlertTriangle /> : <Zap />}</span><span><strong className="text-xl">{item.title}</strong><p className="text-textSecondary">{item.detail}</p></span><Badge tone={item.tone === "danger" ? "red" : "amber"}>{item.tone}</Badge></Link>)}</GlassCard><GlassCard className="p-6"><h2 className="mb-5 text-2xl font-bold">Pipeline Health</h2>{data.pipelineHealth.map((item) => <Link key={item.name} href="/pipeline" className="mb-4 flex items-center justify-between rounded-2xl bg-white/[.04] p-4"><span><strong>{item.name}</strong><br /><small className="text-textMuted">{item.tier}</small></span><Zap className="text-warning" /></Link>)}</GlassCard></section>
  </AppShell>;
}

function AiPanel() { return <div className="space-y-5"><div className="border-b border-cyan pb-4 font-semibold text-cyan">AI Daily Brief</div><GlassCard className="border-cyan/30 p-5"><p>Based on your patterns, I prioritized your morning pipeline. ABC Agency is nearing SLA breach.</p><Link href="/inbox" className="mt-5 flex gap-2 font-semibold text-cyan">Draft Response <Send size={16} /></Link></GlassCard></div>; }
