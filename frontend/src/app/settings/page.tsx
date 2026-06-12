import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Workspace controls for team access, security, routing, and support hours."
      action={<Link className="app-action" href="/integrations">Manage Integrations</Link>}
    >
      <section className="app-grid-two">
        <article className="app-panel settings-panel">
          <h2>Workspace</h2>
          <label>
            Business name
            <input defaultValue="QChat Demo Store" />
          </label>
          <label>
            Support email
            <input defaultValue="support@qchat.example.com" />
          </label>
          <label>
            Default assignment
            <select defaultValue="round-robin">
              <option value="round-robin">Round robin</option>
              <option value="owner">Owner first</option>
            </select>
          </label>
        </article>
        <article className="app-panel settings-panel">
          <ShieldCheck size={28} />
          <h2>Security Posture</h2>
          <p>Keep OTP login for the MVP, then add role-based permissions before onboarding teams.</p>
          <p>Local API keys stay in the backend `.env`; Gmail, Telegram, and Gemini are configured from the integrations page.</p>
          <div className="matrix-list">
            <div className="matrix-row">
              <span>OTP Login</span>
              <em>ACTIVE</em>
            </div>
            <div className="matrix-row">
              <span>Audit Trail</span>
              <em>NEXT</em>
            </div>
            <div className="matrix-row">
              <span>Team Roles</span>
              <em>PLANNED</em>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
