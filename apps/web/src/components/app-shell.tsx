"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, Grid3X3, Inbox, Moon, Search, Settings, Sparkles, Sun, Users, Workflow, Zap } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); document.documentElement.classList.toggle("light", !dark); }, [dark]);

  return <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)_360px]">
    <aside className="glass-panel fixed inset-x-4 bottom-4 z-40 rounded-3xl p-2 lg:sticky lg:inset-y-0 lg:top-0 lg:h-screen lg:rounded-none lg:p-5">
      <div className="hidden items-center gap-3 lg:flex"><div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo to-cyan font-black">Q</div><div><p className="text-xl font-bold">Qchart</p><p className="text-sm text-textMuted">Agency OS</p></div></div>
      <nav className="flex justify-between gap-1 lg:mt-14 lg:block lg:space-y-2">{nav.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex items-center justify-center gap-3 rounded-2xl px-3 py-3 font-semibold lg:justify-start lg:px-4 ${pathname.startsWith(href) ? "bg-white/[.11] text-[#c1c1ff]" : "text-textSecondary hover:bg-white/[.06]"}`}><Icon size={22} /><span className="hidden lg:inline">{label}</span></Link>)}</nav>
      <button onClick={() => setDark((v) => !v)} className="absolute bottom-8 left-5 right-5 hidden items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 lg:flex">{dark ? <Sun size={18} /> : <Moon size={18} />} {dark ? "Light mode" : "Dark mode"}</button>
    </aside>
    <main className="min-w-0 px-4 pb-28 pt-5 md:px-8 lg:px-10 lg:pb-10">
      <header className="mb-8 flex gap-3"><div className="glass-panel flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-textMuted"><Search size={20} /><span className="truncate">Search across Email, IG, WhatsApp, leads...</span></div><button className="glass-panel grid size-12 place-items-center rounded-2xl"><Bell size={20} /></button></header>
      {children}
    </main>
    <aside className="floating-panel hidden min-h-screen rounded-none border-y-0 border-r-0 p-6 lg:block"><div className="mb-8 flex items-center gap-3"><div className="grid size-12 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan"><Sparkles /></div><div><p className="font-bold uppercase tracking-[.18em] text-cyan">AI Assistant</p><p className="text-sm text-textSecondary">Intelligent Briefing</p></div></div>{aiPanel ?? <DefaultAi />}</aside>
  </div>;
}

function DefaultAi() {
  return <div className="space-y-5"><div className="border-b border-cyan pb-4 text-cyan">AI Daily Brief</div><div className="glass-card rounded-3xl p-5"><p className="text-lg font-semibold">You have 3 overdue leads, 2 Instagram DMs, and 1 proposal pending.</p><button className="mt-5 font-semibold text-cyan">Draft next action →</button></div></div>;
}
