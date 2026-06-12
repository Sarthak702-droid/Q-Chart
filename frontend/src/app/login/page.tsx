"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogIn, Smartphone } from "lucide-react";

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
    <main className="auth-surface">
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />
      <section className="auth-card">
        <img src="/qchat-logo.png" alt="QChat logo" />
        <span>QCHAT SECURE ACCESS</span>
        <h1>Login with local OTP</h1>
        <p>
          Use the MVP dummy number. The backend prints the OTP in the terminal so you can test auth without SMS billing.
        </p>
        {notice ? <div className="app-alert">{notice}</div> : null}
        {step === "phone" ? (
          <form className="auth-form" onSubmit={handleRequestOtp}>
            <label>
              Phone number
              <div className="auth-input-wrap">
                <Smartphone size={17} />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>
            </label>
            <button className="app-action" disabled={busy || !phone.trim()} type="submit">
              <KeyRound size={16} />
              {busy ? "Sending..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <label>
              OTP from terminal
              <div className="auth-input-wrap">
                <KeyRound size={17} />
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="6 digit OTP"
                />
              </div>
            </label>
            <button className="app-action" disabled={busy || otp.length < 6} type="submit">
              <LogIn size={16} />
              {busy ? "Verifying..." : "Enter Dashboard"}
            </button>
            <button className="ghost-action" disabled={busy} onClick={() => setStep("phone")} type="button">
              Change number
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
