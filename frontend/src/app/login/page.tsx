"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogIn, Smartphone, Sparkles } from "lucide-react";

import { DUMMY_PHONE_NUMBER, getStoredToken, saveSession } from "@/lib/auth";
import { requestOtp, verifyOtp } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState(DUMMY_PHONE_NUMBER);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await requestOtp(phone);
      setStep("otp");
      setNotice("OTP sent to the backend terminal. Copy it from the FastAPI console.");
    } catch {
      setNotice(`Use the local dummy number ${DUMMY_PHONE_NUMBER} for this MVP login.`);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const response = await verifyOtp(phone, otp);
      saveSession(response.access_token, phone);
      router.replace("/dashboard");
    } catch {
      setNotice("Invalid OTP. Request a new OTP and check the backend terminal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-surface premium-bg min-h-screen flex items-center justify-center relative p-6">
      {/* Ambient background glow elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#5b5ceb]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2dd4bf]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="font-display text-5xl font-extrabold text-white tracking-tighter flex items-center gap-2">
            <Sparkles className="text-[#2dd4bf]" size={36} />
            Qchart
          </h1>
        </div>

        {/* Login Card */}
        <div className="glass-panel w-full p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-white mb-2 text-center">
            Welcome back
          </h2>
          <p className="font-sans text-sm text-slate-400 text-center mb-8">
            Enter your details to access your workspace
          </p>

          {notice ? (
            <div className="mb-6 border border-[#2dd4bf]/20 rounded-xl bg-[#2dd4bf]/5 text-slate-300 p-4 text-xs leading-relaxed">
              {notice}
            </div>
          ) : null}

          {step === "phone" ? (
            <form className="flex flex-col gap-6" onSubmit={handleRequestOtp}>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-slate-300 uppercase tracking-widest" htmlFor="phone">
                  Phone Number
                </label>
                <div className="auth-input-wrap relative flex items-center pl-3">
                  <Smartphone className="text-slate-400" size={18} />
                  <input
                    id="phone"
                    className="w-full bg-transparent border-0 outline-none text-white text-sm py-3 px-3 placeholder-slate-500"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <button
                className="app-action w-full py-3 rounded-xl font-sans text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300"
                disabled={busy || !phone.trim()}
                type="submit"
              >
                <KeyRound size={16} />
                {busy ? "Sending..." : "Get OTP"}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-slate-300 uppercase tracking-widest" htmlFor="otp">
                  OTP from terminal
                </label>
                <div className="auth-input-wrap relative flex items-center pl-3">
                  <KeyRound className="text-slate-400" size={18} />
                  <input
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full bg-transparent border-0 outline-none text-white text-sm py-3 px-3 placeholder-slate-500"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="6 digit OTP"
                  />
                </div>
              </div>

              <button
                className="app-action w-full py-3 rounded-xl font-sans text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300"
                disabled={busy || otp.length < 6}
                type="submit"
              >
                <LogIn size={16} />
                {busy ? "Verifying..." : "Enter Dashboard"}
              </button>

              <button
                className="ghost-action w-full py-3 rounded-xl font-sans text-sm font-bold text-slate-400 border border-white/10 hover:border-white/20 transition-all duration-300"
                disabled={busy}
                onClick={() => setStep("phone")}
                type="button"
              >
                Change number
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="font-sans text-xs text-slate-400">
              Need assistance? Contact support at{" "}
              <a className="text-[#5b5ceb] hover:text-[#2dd4bf] font-semibold transition-colors" href="#">
                help@qchart.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
