"use client";

import { Users, UserPlus, Mail, Shield, ShieldAlert, Sparkles, MessageSquare, Instagram, Send, Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/ui";
import { teamMembers } from "@/lib/app-data";

export default function TeamPage() {
  return (
    <AppShell
      title="Team Settings"
      description="Manage agency users, permissions, active communication channels, and responsiveness scores."
      showAiPanel
      aiPanel={<TeamAiPanel />}
      action={
        <button className="app-action text-xs font-bold py-1.5 px-4 rounded-xl flex items-center gap-1">
          <UserPlus size={14} /> Invite Member
        </button>
      }
    >
      <div className="space-y-6">
        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.name} 
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative group"
            >
              <div className="flex items-start justify-between">
                {/* Profile Copy */}
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-full bg-[#5b5ceb]/20 flex items-center justify-center font-display text-sm font-extrabold text-[#c1c1ff] border border-[#5b5ceb]/30">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-0.5">{member.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Mail size={12} />
                        {member.email}
                      </span>
                    </div>
                    {/* Role badge */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      member.role === "Admin"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : member.role === "Manager"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Team stats */}
                <div className="text-right">
                  <span className="text-lg font-bold font-display text-white">{member.value}</span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{member.metric}</p>
                </div>
              </div>

              {/* Connected channels */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    Monitored Queues
                  </span>
                  <div className="flex gap-2">
                    {member.channels.map((chan) => (
                      <span 
                        key={chan} 
                        className="text-[9px] bg-white/5 border border-white/10 text-slate-300 font-semibold px-2.5 py-1 rounded-lg"
                      >
                        {chan}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="ghost-action text-[10px] py-1 px-3 rounded-lg border border-white/10 font-bold">
                    Edit
                  </button>
                  <button className="ghost-action text-[10px] py-1 px-3 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold">
                    Revoke
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function TeamAiPanel() {
  return (
    <div className="space-y-6">
      <article className="ai-card border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 rounded-xl">
        <span className="font-display text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
          Team Diagnostics
        </span>
        <h3 className="font-display text-xs font-bold text-white mb-2">Average SLA Response Time</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Marcus Johnson maintains an average responsiveness score of 2m 14s (top 5% globally). Sarah Cooper's support ticket queue is currently experiencing peak load.
        </p>
        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-slate-400 leading-normal">
          AI Suggestion: Re-route overflow WhatsApp queries from Sarah to Marcus for the next hour to equalize queue times.
        </div>
      </article>
    </div>
  );
}
