"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, ShieldCheck, X, Sparkles, Check, UserCheck, Bot } from "lucide-react";
import Link from "next/link";

type Role = "Admin" | "Manager" | "Agent";

export default function RolePermissionsPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("Admin");
  
  const [permissions, setPermissions] = useState({
    Admin: {
      dash: true,
      analytics: true,
      pipeline: true,
      whatsapp: true,
      instagram: true,
      gmail: true,
      suggest: true,
      sla: true,
    },
    Manager: {
      dash: true,
      analytics: false,
      pipeline: true,
      whatsapp: true,
      instagram: true,
      gmail: false,
      suggest: true,
      sla: true,
    },
    Agent: {
      dash: true,
      analytics: false,
      pipeline: false,
      whatsapp: true,
      instagram: true,
      gmail: false,
      suggest: true,
      sla: false,
    },
  });

  const togglePermission = (role: Role, key: keyof typeof permissions["Admin"]) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }));
  };

  const handleSave = () => {
    router.push("/settings");
  };

  return (
    <main className="text-[#f8fafc] font-sans bg-[#0e1323] min-h-screen overflow-hidden selection:bg-[#5b5ceb]/30 selection:text-white">
      {/* Background atmospheric glows */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none flex">
        <div className="w-[280px] h-screen bg-[#12182B] border-r border-white/5 p-8 opacity-20">
          <div className="h-8 w-32 bg-slate-800 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-slate-800 rounded"></div>
            <div className="h-10 w-full bg-slate-800 rounded"></div>
            <div className="h-10 w-full bg-slate-800 rounded"></div>
          </div>
        </div>
        <div className="flex-1 p-10 opacity-20">
          <div className="h-12 w-64 bg-slate-800 rounded mb-8"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 bg-slate-800 rounded-2xl"></div>
            <div className="h-64 bg-slate-800 rounded-2xl"></div>
            <div className="h-64 bg-slate-800 rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Modal Overlay Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 md:p-10">
        
        {/* Modal Container */}
        <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden relative border border-white/10 bg-[#161b2b]/90 backdrop-blur-2xl shadow-2xl">
          
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/5">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white">Role Permissions</h2>
              <p className="font-sans text-xs text-slate-400 mt-1">Manage access levels and capabilities across your agency workspace.</p>
            </div>
            <button 
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </header>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden h-[500px]">
            
            {/* Left Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/20 overflow-y-auto p-4 flex flex-col gap-2">
              {(["Admin", "Manager", "Agent"] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-all border ${
                    selectedRole === role
                      ? "bg-[#5b5ceb]/15 border-[#5b5ceb]/30 text-white font-bold"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {role === "Admin" ? <Shield size={16} /> : role === "Manager" ? <UserCheck size={16} /> : <Check size={16} />}
                    <span>{role}</span>
                  </div>
                  {selectedRole === role && (
                    <span className="w-2 h-2 rounded-full bg-[#5b5ceb] shadow-[0_0_8px_rgba(193,193,255,0.8)]" />
                  )}
                </button>
              ))}

              <div className="mt-auto pt-6 border-t border-white/5 px-2">
                <button className="flex items-center gap-1.5 text-slate-400 hover:text-[#5b5ceb] transition-colors text-xs font-bold uppercase tracking-wider">
                  + Create Custom Role
                </button>
              </div>
            </aside>

            {/* Permissions Panel */}
            <div className="flex-1 overflow-y-auto p-8 bg-white/[0.01]">
              <div className="max-w-2xl mx-auto space-y-8">
                
                {/* Workspace Access */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <ShieldCheck size={18} className="text-[#5b5ceb]" />
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Workspace Access</h3>
                  </div>

                  <div className="glass-panel rounded-2xl bg-white/[0.02] border border-white/5 divide-y divide-white/5">
                    <PermissionItem 
                      label="Dashboard Overview"
                      desc="View high-level agency metrics and active campaigns."
                      checked={permissions[selectedRole].dash}
                      onChange={() => togglePermission(selectedRole, "dash")}
                    />
                    <PermissionItem 
                      label="Advanced Analytics"
                      desc="Access detailed performance reports and export raw metrics data."
                      checked={permissions[selectedRole].analytics}
                      onChange={() => togglePermission(selectedRole, "analytics")}
                    />
                    <PermissionItem 
                      label="Sales Pipeline"
                      desc="Update, drag, and manage deal columns inside the Q3 sales board."
                      checked={permissions[selectedRole].pipeline}
                      onChange={() => togglePermission(selectedRole, "pipeline")}
                    />
                  </div>
                </section>

                {/* Channel Access */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <ShieldCheck size={18} className="text-[#5b5ceb]" />
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Channel Access</h3>
                  </div>

                  <div className="glass-panel rounded-2xl bg-white/[0.02] border border-white/5 divide-y divide-white/5">
                    <PermissionItem 
                      label="Direct WhatsApp API"
                      desc="Manage official Meta broadcasts, lists, and active sync settings."
                      checked={permissions[selectedRole].whatsapp}
                      onChange={() => togglePermission(selectedRole, "whatsapp")}
                    />
                    <PermissionItem 
                      label="Instagram DMs"
                      desc="View and reply to Instagram direct messages and comment sections."
                      checked={permissions[selectedRole].instagram}
                      onChange={() => togglePermission(selectedRole, "instagram")}
                    />
                    <PermissionItem 
                      label="Gmail Sync"
                      desc="View renewal threads and perform Google OAuth operations."
                      checked={permissions[selectedRole].gmail}
                      onChange={() => togglePermission(selectedRole, "gmail")}
                    />
                  </div>
                </section>

                {/* AI Control */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Bot size={18} className="text-[#2dd4bf]" />
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">AI Operations</h3>
                  </div>

                  <div className="glass-panel rounded-2xl bg-white/[0.02] border border-white/5 divide-y divide-white/5">
                    <PermissionItem 
                      label="Reply Suggestion Generation"
                      desc="Allow Gemini to generate draft support and sales responses."
                      checked={permissions[selectedRole].suggest}
                      onChange={() => togglePermission(selectedRole, "suggest")}
                    />
                    <PermissionItem 
                      label="SLA Breach Analysis"
                      desc="Access predictive analytics for potential support SLA failures."
                      checked={permissions[selectedRole].sla}
                      onChange={() => togglePermission(selectedRole, "sla")}
                    />
                  </div>
                </section>

              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button 
              onClick={() => router.back()}
              className="ghost-action px-6 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="app-action px-6 py-2.5 rounded-xl text-xs font-bold text-white"
            >
              Save Changes
            </button>
          </footer>

        </div>
      </div>
    </main>
  );
}

function PermissionItem({ 
  label, 
  desc, 
  checked, 
  onChange 
}: { 
  label: string; 
  desc: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <div className="p-4 flex items-start justify-between gap-4 hover:bg-white/[0.01] transition-colors">
      <div>
        <h4 className="text-xs font-bold text-white">{label}</h4>
        <p className="text-[11px] text-slate-400 mt-1">{desc}</p>
      </div>
      <button 
        className="toggle"
        data-checked={checked}
        onClick={onChange}
        type="button"
      >
        <i />
      </button>
    </div>
  );
}
