"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({ className = "", children }: HTMLAttributes<HTMLDivElement>) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, rotateX: .5, rotateY: -.5 }} transition={{ duration: .22 }} className={`glass-card rounded-3xl ${className}`}>{children}</motion.div>;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return <button className={`${variant === "primary" ? "gradient-button" : "rounded-2xl border border-white/10 bg-white/[.04] text-textPrimary hover:bg-white/[.08]"} px-5 py-3 font-semibold ${className}`} {...props} />;
}

export function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "indigo" | "green" | "amber" | "red" }) {
  const cls = { cyan: "border-cyan/30 bg-cyan/10 text-cyan", indigo: "border-indigo/30 bg-indigo/15 text-[#c1c1ff]", green: "border-success/30 bg-success/10 text-success", amber: "border-warning/30 bg-warning/10 text-warning", red: "border-danger/30 bg-danger/10 text-danger" }[tone];
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-[.12em] ${cls}`}>{children}</span>;
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-lg text-textSecondary">{description}</p> : null}</div>{action}</div>;
}

export function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return <GlassCard className="min-h-36 p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-textMuted">{label}</p><strong className="mt-4 block text-4xl">{value}</strong><span className="text-cyan">{delta}</span></GlassCard>;
}
