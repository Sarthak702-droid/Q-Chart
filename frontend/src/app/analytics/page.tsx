"use client";

import { BarChart3, TrendingUp, Sparkles, Smartphone, Mail, Instagram, Send, Globe, MessageSquare } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { GlassPanel, MetricCard } from "@/components/ui";
import { dashboardMetrics } from "@/lib/app-data";

export default function AnalyticsPage() {
  return (
    <AppShell
      title="Analytics"
      description="Deep intelligence across your agency communications, conversions, and SLA responsiveness."
      showAiPanel
      aiPanel={<AnalyticsAiPanel />}
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Charts & Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Weekly Conversions SVG Chart */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between min-h-[360px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-white mb-1">Weekly Lead Conversions</h3>
                <p className="text-xs text-slate-400">Aggregated won deals across connected channels</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-lg">
                <TrendingUp size={14} /> +12.4% vs last week
              </div>
            </div>

            {/* SVG Area Chart */}
            <div className="flex-grow w-full min-h-[180px] relative mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b5ceb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                {/* Area Path */}
                <path
                  d="M0 160 C 50 140, 100 150, 150 110 C 200 70, 250 120, 300 80 C 350 40, 400 90, 450 50 L 500 60 L 500 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line Path */}
                <path
                  d="M0 160 C 50 140, 100 150, 150 110 C 200 70, 250 120, 300 80 C 350 40, 400 90, 450 50 L 500 60"
                  fill="none"
                  stroke="#5b5ceb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="150" cy="110" r="4" fill="#2dd4bf" stroke="#12182B" strokeWidth="2" />
                <circle cx="300" cy="80" r="4" fill="#2dd4bf" stroke="#12182B" strokeWidth="2" />
                <circle cx="450" cy="50" r="4" fill="#2dd4bf" stroke="#12182B" strokeWidth="2" />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4 px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Right Column: Channels Share */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-white mb-1">Channel Volume</h3>
              <p className="text-xs text-slate-400">Aggregated queries by messaging platform</p>
            </div>

            <div className="space-y-4 my-6">
              {[
                { label: "WhatsApp", share: 45, count: 2020, color: "#25D366", icon: <MessageSquare size={14} className="text-[#25D366]" /> },
                { label: "Instagram", share: 22, count: 984, color: "#E1306C", icon: <Instagram size={14} className="text-[#E1306C]" /> },
                { label: "Gmail", share: 15, count: 681, color: "#EA4335", icon: <Mail size={14} className="text-[#EA4335]" /> },
                { label: "Telegram", share: 10, count: 440, color: "#0088cc", icon: <Send size={14} className="text-[#0088cc]" /> },
                { label: "Live Chat", share: 8, count: 350, color: "#2dd4bf", icon: <Globe size={14} className="text-[#2dd4bf]" /> }
              ].map((channel) => (
                <div key={channel.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      {channel.icon}
                      {channel.label}
                    </span>
                    <span className="text-slate-400 font-bold">{channel.share}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${channel.share}%`, backgroundColor: channel.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Updated in real-time through connected Meta Graph webhooks.
            </p>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

function AnalyticsAiPanel() {
  return (
    <div className="space-y-6">
      <article className="ai-card border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 rounded-xl">
        <span className="font-display text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
          AI Insights
        </span>
        <h3 className="font-display text-xs font-bold text-white mb-2">Platform Trend Detected</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          WhatsApp query volume increased by 28% after your recent ad campaign. AI automated reply suggestions successfully drafted 82% of responses.
        </p>
        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-slate-400 leading-normal">
          Suggest allocation of additional support agents to WhatsApp queue from 2:00 PM to 5:00 PM to protect response SLA metrics.
        </div>
      </article>
    </div>
  );
}
