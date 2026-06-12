"use client";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import type { Lead, LeadStage } from "@qchart/shared";
import { AppShell } from "@/components/app-shell";
import { Badge, Button, GlassCard, SectionHeader } from "@/components/ui";
import { useLeads } from "@/lib/api";
const stages: Array<{ id: LeadStage; label: string }> = [{ id: "new", label: "New" }, { id: "contacted", label: "Contacted" }, { id: "qualified", label: "Qualified" }, { id: "proposal", label: "Proposal" }, { id: "won", label: "Won" }];
export default function PipelinePage() {
  const { data = [] } = useLeads(); const [items, setItems] = useState<Lead[]>([]);
  const visible = items.length ? items : data; const move = (id: string, stage: LeadStage) => setItems(visible.map((lead) => lead.id === id ? { ...lead, stage } : lead));
  return <AppShell><SectionHeader title="Q3 Sales Pipeline" description="Manage active prospects with AI smart prioritization." action={<div className="flex gap-3"><Button variant="ghost"><Sparkles className="mr-2 inline" size={18} />AI Smart Prioritization</Button><Button><Plus className="mr-2 inline" size={18} />New Lead</Button></div>} /><section className="grid gap-5 overflow-x-auto pb-4 lg:grid-cols-5">{stages.map((stage) => { const stageLeads = visible.filter((l) => l.stage === stage.id); return <GlassCard key={stage.id} className="min-h-[520px] min-w-[280px] p-5"><div className="mb-5 flex justify-between"><h2 className="font-bold uppercase tracking-[.14em] text-textSecondary">{stage.label}</h2><Badge>{stageLeads.length}</Badge></div><div className="space-y-4">{stageLeads.map((lead) => <div key={lead.id} draggable onDragEnd={() => move(lead.id, stage.id)} className="cursor-grab rounded-3xl border border-white/10 bg-white/[.06] p-5 hover:bg-white/[.1]"><div className="flex justify-between"><span><h3 className="text-xl font-bold">{lead.name}</h3><p className="text-textMuted">{lead.company}</p></span><i className={`mt-1 size-3 rounded-full ${lead.status === "hot" ? "bg-success" : "bg-warning"}`} /></div><div className="mt-5 flex gap-3"><Badge tone="indigo">Score: {lead.score}</Badge><span className="text-sm text-textMuted">{lead.lastActivity}</span></div><div className="mt-5 border-t border-white/10 pt-4 text-textSecondary">${lead.value.toLocaleString()} Est. Value</div></div>)}{!stageLeads.length ? <div className="grid min-h-52 place-items-center rounded-3xl border border-dashed border-white/15 text-textMuted">Drop cards here</div> : null}</div></GlassCard>; })}</section></AppShell>;
}
