"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

export default function WorkspaceOnboardingPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push("/onboarding/channels");
  }

  return (
    <main className="text-[#f8fafc] font-sans selection:bg-[#5b5ceb]/30 selection:text-white">
      {/* Split Screen Container */}
      <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-[#0e1323]">
        
        {/* Left Side: Visual */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#12182B] items-center justify-center overflow-hidden">
          {/* Decorative Gradient Meshes */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-screen" 
            style={{ 
              background: "radial-gradient(circle at 20% 30%, rgba(91, 92, 235, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(45, 212, 191, 0.3) 0%, transparent 50%)" 
            }}
          ></div>
          <div className="relative z-10 max-w-md px-6 text-center">
            <div className="glass-panel p-8 rounded-2xl shadow-2xl mb-8 border-t border-white/20">
              <Rocket className="w-16 h-16 text-[#c1c1ff] mx-auto mb-6" />
              <h2 className="font-display text-3xl text-white font-bold mb-4">Accelerate Agency Growth</h2>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Join the next generation of high-velocity agencies. Precision engineering meets spatial intelligence.
              </p>
            </div>
            {/* Abstract UI Representation */}
            <div className="flex gap-6 justify-center opacity-80">
              <div className="w-24 h-32 rounded-xl bg-[#1a1f30] border border-white/10 flex items-end p-3">
                <div className="w-full h-1/2 bg-[#5b5ceb]/20 rounded"></div>
              </div>
              <div className="w-24 h-40 rounded-xl bg-[#1a1f30] border border-white/10 flex items-end p-3 -translate-y-4">
                <div className="w-full h-3/4 bg-[#2dd4bf]/20 rounded"></div>
              </div>
              <div className="w-24 h-24 rounded-xl bg-[#1a1f30] border border-white/10 flex items-end p-3">
                <div className="w-full h-1/3 bg-amber-500/20 rounded"></div>
              </div>
            </div>
          </div>
          {/* Branding Logo Overlay */}
          <div className="absolute top-10 left-10 flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-[#5b5ceb] tracking-tight">Qchart</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 relative z-20 bg-[#0e1323] md:bg-transparent overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-xs font-semibold text-[#5b5ceb] uppercase tracking-wider">Step 1 of 3</span>
                <span className="font-sans text-xs text-slate-400">Account Setup</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                <div className="h-full w-1/3 bg-[#5b5ceb] rounded-full"></div>
                <div className="h-full w-1/3 bg-slate-700 rounded-full"></div>
                <div className="h-full w-1/3 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-white mb-2">Create Your Agency OS</h1>
              <p className="font-sans text-sm text-slate-400">Set up your workspace to begin orchestrating your agency operations.</p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block font-sans text-xs font-semibold text-slate-300" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-[#12182B] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#c1c1ff] focus:ring-2 focus:ring-[#c1c1ff]/20 transition-all" 
                    id="fullName" 
                    placeholder="Jane Doe" 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-sans text-xs font-semibold text-slate-300" htmlFor="workEmail">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-[#12182B] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#c1c1ff] focus:ring-2 focus:ring-[#c1c1ff]/20 transition-all" 
                    id="workEmail" 
                    placeholder="jane@agency.com" 
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-sans text-xs font-semibold text-slate-300" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-[#12182B] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#c1c1ff] focus:ring-2 focus:ring-[#c1c1ff]/20 transition-all" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="font-sans text-[11px] text-slate-400">Must be at least 8 characters.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="block font-sans text-xs font-semibold text-slate-300" htmlFor="agencyName">Agency Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-[#12182B] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#c1c1ff] focus:ring-2 focus:ring-[#c1c1ff]/20 transition-all" 
                    id="agencyName" 
                    placeholder="Acme Digital" 
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  className="app-action w-full rounded-xl py-3 px-4 font-sans text-sm font-bold text-white flex items-center justify-center gap-2" 
                  type="submit"
                >
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            <p className="font-sans text-xs text-slate-400 text-center mt-8">
              Already have an account? <Link className="text-[#5b5ceb] hover:text-[#2dd4bf] transition-colors" href="/login">Log in</Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
