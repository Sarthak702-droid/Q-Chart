"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Command, LogOut, Search, Sparkles } from "lucide-react";

import { appNav } from "@/lib/app-data";
import { clearSession, getStoredPhone, getStoredToken } from "@/lib/auth";
import { AISidebar } from "@/components/ui";

type AppShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  aiPanel?: React.ReactNode;
  showAiPanel?: boolean;
};

export function AppShell({
  title,
  description,
  children,
  action,
  aiPanel,
  showAiPanel = false
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setPhone(getStoredPhone());
    setAuthorized(true);
  }, [pathname, router]);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  if (!authorized) {
    return (
      <main className="premium-bg auth-surface">
        <section className="auth-card glass-panel">
          <span className="brand-mark">
            <Sparkles size={22} />
          </span>
          <span className="eyebrow">Checking session</span>
          <h1>Opening Qchart</h1>
          <p>Verifying your workspace before loading the agency cockpit.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="premium-bg app-surface">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/dashboard">
          <span className="brand-mark">
            <Command size={23} />
          </span>
          <span className="brand-copy">
            <strong>Qchart</strong>
            <span>Agency OS</span>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Product navigation">
          {appNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link className="app-nav-link" data-active={active} href={item.href} key={item.href}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar-footer">
          <Link href="/onboarding/workspace">Setup Flow</Link>
          <Link href="/settings/roles">Role Permissions</Link>
          <button className="sidebar-button" onClick={handleLogout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="user-card">
          <span className="avatar" />
          <span className="user-copy">
            <strong>Alex Founder</strong>
            <span>{phone ?? "Pro Plan"}</span>
          </span>
        </div>
      </aside>

      <section className="app-main">
        <div className="app-content page-enter">
          <header className="app-header">
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <div className="topbar-actions">
              <label className="search-shell">
                <Search size={18} />
                <input placeholder="Search workspace..." />
              </label>
              <button className="icon-action" aria-label="Notifications" type="button">
                <Bell size={19} />
              </button>
              {action}
            </div>
          </header>
          {children}
        </div>

        {showAiPanel ? (
          <AISidebar>{aiPanel ?? <DefaultAiPanel />}</AISidebar>
        ) : null}
      </section>
    </main>
  );
}

function DefaultAiPanel() {
  return (
    <>
      <article className="ai-card">
        <span className="eyebrow">AI Daily Brief</span>
        <p>3 overdue leads, 2 Instagram DMs, and 1 proposal pending need attention today.</p>
        <Link className="ghost-action" href="/ai-assistant">
          Draft Response
        </Link>
      </article>
      <article className="ai-card">
        <span className="eyebrow">Recommended Action</span>
        <p>ABC Agency is nearing an SLA breach. Prioritize the revised contract reply.</p>
      </article>
    </>
  );
}
