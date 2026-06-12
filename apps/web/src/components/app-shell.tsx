"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, Grid3X3, Inbox, Moon, Search, Settings, Sparkles, Sun, Users, Workflow, Zap, ChevronLeft, ChevronRight, Send, ArrowRight, Bot } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui";
import { setupRealtimeSync } from "@/lib/api";

const nav = [
  ["/dashboard", "Dashboard", Grid3X3],
  ["/inbox", "Inbox", Inbox],
  ["/workspace", "Workspace", Workflow],
  ["/pipeline", "Pipeline", Zap],
  ["/analytics", "Analytics", BarChart3],
  ["/team", "Team", Users],
  ["/settings", "Settings", Settings]
] as const;

export function AppShell({ children, aiPanel }: { children: ReactNode; aiPanel?: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  useEffect(() => {
    const cleanup = setupRealtimeSync();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className={`min-h-screen lg:grid ${collapsed ? "lg:grid-cols-[80px_minmax(0,1fr)_360px]" : "lg:grid-cols-[280px_minmax(0,1fr)_360px]"} transition-all duration-300`}>
      {/* Sidebar */}
      <aside className="glass-panel fixed inset-x-4 bottom-4 z-40 rounded-3xl p-2 lg:sticky lg:inset-y-0 lg:top-0 lg:h-screen lg:rounded-none lg:p-5 flex flex-col justify-between">
        <div>
          {/* Logo Section */}
          <div className="hidden items-center justify-between gap-3 lg:flex mb-8">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] font-black text-white shadow-[0_0_15px_rgba(91,92,235,0.3)]">Q</div>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <p className="text-xl font-bold tracking-tight">Qchart</p>
                  <p className="text-xs text-textMuted font-bold uppercase tracking-wider">Agency OS</p>
                </motion.div>
              )}
            </div>
            
            {/* Collapse Button */}
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="hover:bg-white/10 rounded-lg p-1 text-textMuted hover:text-textPrimary transition-all hidden lg:block"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex justify-between gap-1 lg:mt-6 lg:block lg:space-y-2">
            {nav.map(([href, label, Icon]) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 font-semibold transition-all ${
                    active
                      ? "bg-white/[.12] text-[#c1c1ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-textSecondary hover:bg-white/[.06] hover:text-textPrimary"
                  } ${collapsed ? "justify-center" : "lg:justify-start lg:px-4"}`}
                >
                  <Icon size={22} className={active ? "text-[#c1c1ff]" : "text-textSecondary"} />
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:inline">
                      {label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme Toggle & Footer */}
        <div className="hidden lg:block space-y-4">
          <button
            onClick={() => setDark((v) => !v)}
            className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] py-3 text-textPrimary hover:bg-white/[.08] transition-all w-full justify-center ${collapsed ? "px-2" : "px-4"}`}
          >
            {dark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-indigo" />}
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {dark ? "Light mode" : "Dark mode"}
              </motion.span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 px-4 pb-28 pt-5 md:px-8 lg:px-10 lg:pb-10 bg-background/30">
        <header className="mb-8 flex gap-3">
          <div className="glass-panel flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-textMuted border-white/10">
            <Search size={20} />
            <span className="truncate text-sm">Search across Email, IG, WhatsApp, leads...</span>
          </div>
          <button className="glass-panel grid size-12 place-items-center rounded-2xl hover:bg-white/5 transition-all">
            <Bell size={20} />
          </button>
        </header>
        {children}
      </main>

      {/* Right AI Sidebar */}
      <aside className="floating-panel hidden min-h-screen rounded-none border-y-0 border-r-0 p-6 lg:flex flex-col justify-between sticky top-0 right-0 h-screen border-l border-white/10">
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan animate-pulse">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="font-bold uppercase tracking-[.18em] text-cyan text-sm">Qchart AI</p>
              <p className="text-xs text-textSecondary font-bold">Autonomous Briefing</p>
            </div>
          </div>
          {aiPanel ?? <DefaultAi />}
        </div>
      </aside>
    </div>
  );
}

function DefaultAi() {
  const [ask, setAsk] = useState("");
  return (
    <div className="flex-1 flex flex-col justify-between gap-6">
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4 flex items-center gap-2 text-cyan font-bold">
          <Bot size={16} /> AI Daily Brief
        </div>

        <div className="glass-card rounded-3xl p-5 border-cyan/20 space-y-4">
          <p className="text-base font-semibold leading-relaxed text-textPrimary">
            You have:
          </p>
          <ul className="space-y-2 text-sm text-textSecondary">
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-danger"></span>
              <strong>3</strong> overdue leads
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-warning"></span>
              <strong>2</strong> Instagram DMs
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan"></span>
              <strong>1</strong> proposal pending
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-textMuted">Suggested actions</p>
          <div className="space-y-2">
            {[
              "Reply to ABC Agency",
              "Follow up with XYZ",
              "Schedule demo"
            ].map((action, i) => (
              <button 
                key={i} 
                className="w-full text-left rounded-xl bg-white/[.04] hover:bg-white/[.08] border border-white/5 p-3.5 text-sm font-semibold flex items-center justify-between text-textSecondary hover:text-textPrimary transition-all group"
              >
                <span>{action}</span>
                <ArrowRight size={14} className="text-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ask AI Input at bottom */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="relative flex items-center bg-white/[.03] border border-white/10 rounded-xl p-1 focus-within:ring-1 focus-within:ring-cyan focus-within:border-cyan transition-all">
          <input 
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-textPrimary px-3 py-2.5 focus:outline-none focus:ring-0 placeholder-text-muted" 
            placeholder="Ask AI..." 
            type="text"
          />
          <button 
            disabled={!ask.trim()}
            className="w-9 h-9 rounded-lg bg-cyan/15 text-cyan flex items-center justify-center hover:bg-cyan/25 disabled:opacity-40 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
