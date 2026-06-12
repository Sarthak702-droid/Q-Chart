"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare, Instagram, Facebook, Send, Mail, Check, Shield } from "lucide-react";
import Link from "next/link";

export default function ChannelsOnboardingPage() {
  const router = useRouter();
  const [channels, setChannels] = useState({
    whatsapp: true,
    instagram: false,
    messenger: false,
    telegram: true,
    gmail: true,
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function handleSubmit() {
    router.push("/onboarding/integrations");
  }

  return (
    <main className="text-[#f8fafc] font-sans bg-[#0e1323] bg-grid-pattern min-h-screen flex flex-col overflow-x-hidden selection:bg-[#5b5ceb]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full h-16 bg-[#12182B]/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-[#5b5ceb]">Qchart</span>
          <span className="text-slate-400 text-sm ml-2 border-l border-white/10 pl-2">Setup</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-slate-400 text-sm">Step 2 of 3</div>
          <button 
            className="text-slate-300 hover:text-[#5b5ceb] transition-colors text-sm font-semibold"
            onClick={handleSubmit}
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-4xl w-full">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5b5ceb] to-[#2dd4bf] mb-3">
              Connect Your Communications
            </h1>
            <p className="font-sans text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Link your primary messaging channels to Qchart. We'll automatically route leads, aggregate messages, and apply AI insights across all your conversations.
            </p>
          </div>

          {/* Integration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* WhatsApp Business Card */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300 border ${channels.whatsapp ? "border-[#25D366]/40" : "border-white/10"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                    <MessageSquare className="text-[#25D366]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">WhatsApp Business</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-500 font-semibold uppercase">Direct Integration</span>
                    </div>
                  </div>
                </div>
                {/* Switch */}
                <button 
                  className="toggle"
                  data-checked={channels.whatsapp}
                  onClick={() => toggleChannel("whatsapp")}
                  type="button"
                >
                  <i />
                </button>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                Connect your business number to handle client inquiries and automate responses directly from Qchart.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1">Auto-sync</span>
                <span className="flex items-center gap-1">Official API</span>
              </div>
            </div>

            {/* Instagram DMs Card */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300 border ${channels.instagram ? "border-[#bc1888]/40" : "border-white/10"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-[1px] opacity-95">
                    <div className="w-full h-full bg-[#12182B] rounded-[11px] flex items-center justify-center">
                      <Instagram className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">Instagram DMs</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-500 font-semibold uppercase">Direct Integration</span>
                    </div>
                  </div>
                </div>
                {/* Switch */}
                <button 
                  className="toggle"
                  data-checked={channels.instagram}
                  onClick={() => toggleChannel("instagram")}
                  type="button"
                >
                  <i />
                </button>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                Manage direct messages, story replies, and comments from your connected Instagram Professional account.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1">Auto-sync</span>
                <span className="flex items-center gap-1">Meta Graph API</span>
              </div>
            </div>

            {/* Facebook Messenger */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300 border ${channels.messenger ? "border-[#0084FF]/40" : "border-white/10"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0084FF]/10 flex items-center justify-center border border-[#0084FF]/20">
                    <Facebook className="text-[#0084FF]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">Facebook Messenger</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="text-[10px] text-amber-500 font-semibold uppercase">Manual Setup</span>
                    </div>
                  </div>
                </div>
                {/* Switch */}
                <button 
                  className="toggle"
                  data-checked={channels.messenger}
                  onClick={() => toggleChannel("messenger")}
                  type="button"
                >
                  <i />
                </button>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                Route Messenger conversations from your company page directly into your unified operational queue.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1">Pull Sync</span>
                <span className="flex items-center gap-1">Facebook Page API</span>
              </div>
            </div>

            {/* Telegram Bot */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300 border ${channels.telegram ? "border-[#0088cc]/40" : "border-white/10"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center border border-[#0088cc]/20">
                    <Send className="text-[#0088cc]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">Telegram Bot</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-500 font-semibold uppercase">Direct Integration</span>
                    </div>
                  </div>
                </div>
                {/* Switch */}
                <button 
                  className="toggle"
                  data-checked={channels.telegram}
                  onClick={() => toggleChannel("telegram")}
                  type="button"
                >
                  <i />
                </button>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                Connect your Telegram support bot to handle custom alerts, chats, and lead updates immediately.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1">Real-time Webhook</span>
                <span className="flex items-center gap-1">BotFather Sync</span>
              </div>
            </div>

            {/* Gmail integration */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300 border ${channels.gmail ? "border-[#EA4335]/40" : "border-white/10"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EA4335]/10 flex items-center justify-center border border-[#EA4335]/20">
                    <Mail className="text-[#EA4335]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">Gmail</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-500 font-semibold uppercase">OAuth Connected</span>
                    </div>
                  </div>
                </div>
                {/* Switch */}
                <button 
                  className="toggle"
                  data-checked={channels.gmail}
                  onClick={() => toggleChannel("gmail")}
                  type="button"
                >
                  <i />
                </button>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                Sync your company Google Workspace to manage client emails alongside instant messaging threads.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1">Secure OAuth 2.0</span>
                <span className="flex items-center gap-1">Read/Write Access</span>
              </div>
            </div>

          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4">
            <button 
              className="app-action py-3 px-8 rounded-xl font-sans text-sm font-bold text-white flex items-center justify-center gap-2"
              onClick={handleSubmit}
            >
              <span>Continue to API Setup</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
