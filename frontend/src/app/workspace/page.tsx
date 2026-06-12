"use client";

import { useState } from "react";
import { 
  Mail, MessageSquare, Instagram, Send, Phone, Calendar, 
  Sparkles, Bot, Clock, AlertTriangle, CheckCircle2, User, Zap, 
  Trash, PushPin, Minimize2, Maximize2, ShieldAlert
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { GlassPanel, GradientButton, GhostButton, MetricCard, StatusBadge } from "@/components/ui";
import { conversations, supportTickets, dashboardMetrics, teamMembers } from "@/lib/app-data";

type Mode = "Sales" | "Support" | "Founder";

export default function WorkspacePage() {
  const [mode, setMode] = useState<Mode>("Sales");
  const [pinned, setPinned] = useState<string[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);

  const togglePin = (windowName: string) => {
    setPinned(prev => 
      prev.includes(windowName) ? prev.filter(w => w !== windowName) : [...prev, windowName]
    );
  };

  const toggleMinimize = (windowName: string) => {
    setMinimized(prev => 
      prev.includes(windowName) ? prev.filter(w => w !== windowName) : [...prev, windowName]
    );
  };

  return (
    <AppShell
      title="Workspace"
      description="Multi-window agency operations center. Select a mode to partition your workflow."
      showAiPanel
      aiPanel={<WorkspaceAiPanel mode={mode} />}
      action={
        <div className="flex items-center bg-[#12182B] rounded-xl p-1 border border-white/5">
          {(["Sales", "Support", "Founder"] as Mode[]).map((m) => (
            <button
              key={m}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === m
                  ? "bg-white/10 text-[#5b5ceb] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        {mode === "Sales" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Window 1: Gmail Lead Pipeline */}
            <WindowCard 
              title="Gmail Inbox" 
              icon={<Mail className="text-rose-500" size={18} />} 
              badge={<StatusBadge tone="danger">3 New</StatusBadge>}
              onPin={() => togglePin("gmail")}
              onMinimize={() => toggleMinimize("gmail")}
              isPinned={pinned.includes("gmail")}
              isMinimized={minimized.includes("gmail")}
            >
              <div className="space-y-4">
                <div className="ai-widget-glow rounded-xl p-4 bg-[#2dd4bf]/5 border border-[#2dd4bf]/20 flex items-start gap-3">
                  <Sparkles className="text-[#2dd4bf] shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">AI Recommendation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sarah Jenkins (TechFlow) is requesting a pricing upgrade. High intent detected. Suggest scheduling a call today.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {conversations.slice(0, 2).map((item) => (
                    <div key={item.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-white">{item.name} ({item.company})</span>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                      <h4 className="text-xs text-[#c1c1ff] font-semibold mb-1">{item.message.slice(0, 40)}...</h4>
                      <p className="text-xs text-slate-400">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </WindowCard>

            {/* Window 2: Instagram DM Lead Monitor */}
            <WindowCard 
              title="Instagram Sales" 
              icon={<Instagram className="text-purple-500" size={18} />}
              badge={<StatusBadge tone="success">Active</StatusBadge>}
              onPin={() => togglePin("instagram")}
              onMinimize={() => toggleMinimize("instagram")}
              isPinned={pinned.includes("instagram")}
              isMinimized={minimized.includes("instagram")}
            >
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#c1c1ff]">NS</span>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">Neon Studios</span>
                      <span className="text-[10px] text-slate-500">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">Loved the moodboard! Can we tweak the launch assets?</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#5b5ceb]/5 border border-[#5b5ceb]/20">
                  <div className="flex items-center gap-1 text-[#2dd4bf] text-xs font-bold mb-2">
                    <Bot size={14} /> AI Draft Reply
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    "We'd love to tweak the assets for you. Can you specify which elements of the moodboard you'd like adjusted?"
                  </p>
                  <div className="flex gap-2">
                    <button className="app-action py-1.5 px-4 rounded-lg text-xs font-semibold text-white">Send</button>
                    <button className="ghost-action py-1.5 px-4 rounded-lg text-xs font-semibold text-slate-400 border border-white/10">Edit</button>
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        )}

        {mode === "Support" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Window 1: Live Chat Widget Queue */}
            <WindowCard 
              title="Live Chat Queue" 
              icon={<MessageSquare className="text-emerald-500" size={18} />}
              badge={<StatusBadge tone="info">3 Online</StatusBadge>}
              onPin={() => togglePin("livechat")}
              onMinimize={() => toggleMinimize("livechat")}
              isPinned={pinned.includes("livechat")}
              isMinimized={minimized.includes("livechat")}
            >
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{ticket.customer}</span>
                        <span className="text-[10px] text-slate-500">{ticket.id}</span>
                      </div>
                      <p className="text-xs text-slate-400">{ticket.title}</p>
                    </div>
                    <StatusBadge tone={ticket.priority === "High" ? "danger" : "warning"}>
                      {ticket.priority}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </WindowCard>

            {/* Window 2: SLA Monitor */}
            <WindowCard 
              title="SLA Alert Stream" 
              icon={<ShieldAlert className="text-amber-500" size={18} />}
              onPin={() => togglePin("sla")}
              onMinimize={() => toggleMinimize("sla")}
              isPinned={pinned.includes("sla")}
              isMinimized={minimized.includes("sla")}
            >
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-3 items-start">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">SLA Breach Warning</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Marcus Vance (Global Media) has been waiting 2 hours for a campaign brief response. Time remaining: 15m.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-2">Recent Resolution Rates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Today's Target SLA</span>
                      <span className="text-white font-semibold">95%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[91%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        )}

        {mode === "Founder" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {dashboardMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Window 1: Team Availability */}
              <WindowCard 
                title="Active Team Status" 
                icon={<User className="text-[#5b5ceb]" size={18} />}
                onPin={() => togglePin("team")}
                onMinimize={() => toggleMinimize("team")}
                isPinned={pinned.includes("team")}
                isMinimized={minimized.includes("team")}
              >
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#5b5ceb]/20 flex items-center justify-center text-xs font-bold text-[#c1c1ff]">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{member.name}</h4>
                          <span className="text-[10px] text-slate-500">{member.role}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-300">{member.value}</span>
                        <p className="text-[10px] text-slate-500">{member.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </WindowCard>

              {/* Window 2: Executive Summary */}
              <WindowCard 
                title="System Diagnostic Overview" 
                icon={<Zap className="text-[#2dd4bf]" size={18} />}
                onPin={() => togglePin("diag")}
                onMinimize={() => toggleMinimize("diag")}
                isPinned={pinned.includes("diag")}
                isMinimized={minimized.includes("diag")}
              >
                <div className="space-y-4 text-xs text-slate-400">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Server Latency</span>
                      <span className="text-emerald-500 font-semibold">42ms (Operational)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Synchronizer</span>
                      <span className="text-emerald-500 font-semibold">Active (5/5 Synced)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gemini LLM Agent</span>
                      <span className="text-emerald-500 font-semibold">Online (Model 3.5 Flash)</span>
                    </div>
                  </div>
                </div>
              </WindowCard>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function WindowCard({ 
  title, 
  icon, 
  badge, 
  children,
  onPin,
  onMinimize,
  isPinned,
  isMinimized
}: { 
  title: string; 
  icon: React.ReactNode; 
  badge?: React.ReactNode; 
  children: React.ReactNode;
  onPin: () => void;
  onMinimize: () => void;
  isPinned: boolean;
  isMinimized: boolean;
}) {
  return (
    <article className="glass-panel w-full rounded-2xl flex flex-col overflow-hidden relative border border-white/10 shadow-lg">
      {/* Header */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display text-sm font-bold text-white">{title}</h2>
          {badge}
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onPin}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              isPinned ? "text-[#5b5ceb] bg-white/10" : "text-slate-400 hover:text-white"
            }`}
            aria-label="Pin window"
          >
            <PushPin size={13} />
          </button>
          <button 
            onClick={onMinimize}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              isMinimized ? "text-[#5b5ceb] bg-white/10" : "text-slate-400 hover:text-white"
            }`}
            aria-label="Minimize window"
          >
            <Minimize2 size={13} />
          </button>
        </div>
      </div>
      {/* Body */}
      {!isMinimized && (
        <div className="p-6 flex-1 overflow-y-auto">
          {children}
        </div>
      )}
    </article>
  );
}

function WorkspaceAiPanel({ mode }: { mode: Mode }) {
  return (
    <div className="space-y-6">
      <article className="ai-card border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 rounded-xl">
        <span className="font-display text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
          Workspace AI Brief
        </span>
        {mode === "Sales" && (
          <>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              I am monitoring your sales channel. Sarah Jenkins (TechFlow) is ready for contract generation.
            </p>
            <GhostButton className="w-full text-xs py-2 rounded-lg font-bold">
              Draft Proposal
            </GhostButton>
          </>
        )}
        {mode === "Support" && (
          <>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Warning: 1 support thread in Messenger is nearing SLA breach. Drafted auto replies are waiting for your approval.
            </p>
            <GhostButton className="w-full text-xs py-2 rounded-lg font-bold">
              Review Support Drafts
            </GhostButton>
          </>
        )}
        {mode === "Founder" && (
          <>
            <p className="text-xs text-slate-300 leading-relaxed">
              Agency health index is 94%. Your conversion rates are up 12% this week, well within the top 10% target thresholds.
            </p>
          </>
        )}
      </article>
    </div>
  );
}
