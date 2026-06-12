"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Key, Star, ShoppingCart, Send, Mail, CheckCircle, Sparkles } from "lucide-react";

export default function IntegrationsOnboardingPage() {
  const router = useRouter();
  const [telegramToken, setTelegramToken] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [whatsappKey, setWhatsappKey] = useState("");

  const [whatsappStatus, setWhatsappStatus] = useState("DISCONNECTED");
  const [telegramStatus, setTelegramStatus] = useState("DISCONNECTED");
  const [geminiStatus, setGeminiStatus] = useState("DISCONNECTED");

  function handleConnectTelegram() {
    if (telegramToken.trim()) {
      setTelegramStatus("CONNECTED");
    }
  };

  function handleConnectGemini() {
    if (geminiKey.trim()) {
      setGeminiStatus("CONNECTED");
    }
  };

  function handleConnectWhatsapp() {
    if (whatsappKey.trim()) {
      setWhatsappStatus("CONNECTED");
    }
  };

  function handleFinish() {
    // Navigate to dashboard after completing onboarding steps
    router.push("/dashboard");
  }

  return (
    <main className="text-[#f8fafc] font-sans bg-[#0B1020] min-h-screen flex flex-col antialiased selection:bg-[#5b5ceb]/30 selection:text-white">
      {/* Background Atmospheric Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#5b5ceb]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#2dd4bf]/5 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="w-full flex items-center justify-between p-6 absolute top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#5b5ceb]" size={28} />
          <span className="font-display text-2xl font-bold text-[#5b5ceb]">Qchart</span>
        </div>
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Step 3 of 3
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 w-full max-w-7xl mx-auto mt-16 md:mt-0 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Setup Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-extrabold text-white">Power Up Your Integrations</h1>
              <p className="font-sans text-slate-300">Connect your essential tools. Some premium APIs require a license or your own key.</p>
            </div>

            {/* Premium Integrations */}
            <div className="space-y-6">
              <h2 className="font-sans text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Star size={16} className="text-[#2dd4bf]" />
                Premium API Access
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* WhatsApp API Card */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                        <MessageSquareIcon />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white">WhatsApp Official API</h3>
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-semibold uppercase">Paid License</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                    Official meta integration for high-volume broadcast messaging and automation.
                  </p>
                  
                  {whatsappStatus === "CONNECTED" ? (
                    <div className="text-emerald-500 font-sans text-xs flex items-center gap-2 py-2 mt-auto">
                      <CheckCircle size={16} /> Key connected
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-auto">
                      <input 
                        type="text" 
                        placeholder="Enter API Key" 
                        value={whatsappKey}
                        onChange={(e) => setWhatsappKey(e.target.value)}
                        className="bg-[#12182B] border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#5b5ceb]"
                      />
                      <button 
                        className="ghost-action py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 transition-colors"
                        onClick={handleConnectWhatsapp}
                      >
                        <Key size={14} /> Enter Own Key
                      </button>
                      <button className="app-action py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <ShoppingCart size={14} /> Purchase License
                      </button>
                    </div>
                  )}
                </div>

                {/* Gemini AI Card */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5b5ceb]/10 flex items-center justify-center border border-[#5b5ceb]/20">
                        <Bot className="text-[#5b5ceb]" size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white">Gemini AI Assistant</h3>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold uppercase">API Ready</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                    Generate reply suggestions, summaries, intent analysis, and context metrics.
                  </p>

                  {geminiStatus === "CONNECTED" ? (
                    <div className="text-emerald-500 font-sans text-xs flex items-center gap-2 py-2 mt-auto">
                      <CheckCircle size={16} /> Key connected
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-auto">
                      <input 
                        type="password" 
                        placeholder="Enter API Key (Optional)" 
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="bg-[#12182B] border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#5b5ceb]"
                      />
                      <button 
                        className="app-action py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                        onClick={handleConnectGemini}
                      >
                        <Key size={14} /> Save API Key
                      </button>
                    </div>
                  )}
                </div>

                {/* Telegram Bot Card */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center border border-[#0088cc]/20">
                        <Send className="text-[#0088cc]" size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white">Telegram Bot</h3>
                        <span className="text-[9px] bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 px-2 py-0.5 rounded font-semibold uppercase">BotFather</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                    Set webhook notifications and receive client alerts directly in your dashboard workspace.
                  </p>

                  {telegramStatus === "CONNECTED" ? (
                    <div className="text-emerald-500 font-sans text-xs flex items-center gap-2 py-2 mt-auto">
                      <CheckCircle size={16} /> Connected
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-auto">
                      <input 
                        type="text" 
                        placeholder="Bot Token (e.g. 123456:ABC...)" 
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        className="bg-[#12182B] border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-[#5b5ceb]"
                      />
                      <button 
                        className="app-action py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                        onClick={handleConnectTelegram}
                      >
                        <Key size={14} /> Connect Bot
                      </button>
                    </div>
                  )}
                </div>

                {/* Google Workspace OAuth Card */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EA4335]/10 flex items-center justify-center border border-[#EA4335]/20">
                        <Mail className="text-[#EA4335]" size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white">Google OAuth</h3>
                        <span className="text-[9px] bg-[#EA4335]/10 text-[#EA4335] border border-[#EA4335]/20 px-2 py-0.5 rounded font-semibold uppercase">Gmail Sync</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-slate-400 mb-6 flex-grow leading-relaxed">
                    Connect customer support email queues through Google Workspace OAuth authentication.
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <button className="app-action py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#EA4335]/90 border-0">
                      Sign in with Google
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Setup Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h2 className="font-display text-base font-bold text-white mb-4">Setup Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Account Configuration</span>
                  <span className="text-emerald-500 font-semibold">Done</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Channels Linked</span>
                  <span className="text-emerald-500 font-semibold">Done</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">API Keys Verified</span>
                  <span className="text-[#5b5ceb] font-semibold">Step 3/3</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button 
                  className="app-action w-full py-3 rounded-xl font-sans text-sm font-bold text-white flex items-center justify-center gap-2"
                  onClick={handleFinish}
                >
                  <span>Complete Setup</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function MessageSquareIcon() {
  return (
    <svg 
      className="text-[#25D366]" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
