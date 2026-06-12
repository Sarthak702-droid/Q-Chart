"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function GlassCard({ className = "", children, tilt = false }: HTMLAttributes<HTMLDivElement> & { tilt?: boolean }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [4, -4]);
  const rotateY = useTransform(x, [0, 1], [-4, 4]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={tilt ? { y: -4, z: 10 } : { y: -4 }}
      style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      onMouseMove={tilt ? handleMouseMove : undefined}
      onMouseLeave={tilt ? handleMouseLeave : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`glass-card rounded-3xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${
        variant === "primary"
          ? "gradient-button"
          : "rounded-2xl border border-white/10 bg-white/[.04] text-textPrimary hover:bg-white/[.08] hover:border-white/20"
      } px-5 py-3 font-semibold transition-all ${className}`}
      {...props}
    />
  );
}

export function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "indigo" | "green" | "amber" | "red" }) {
  const cls = {
    cyan: "border-cyan/30 bg-cyan/10 text-cyan shadow-[0_0_10px_rgba(45,212,191,0.1)]",
    indigo: "border-indigo/30 bg-indigo/15 text-[#c1c1ff] shadow-[0_0_10px_rgba(91,92,235,0.1)]",
    green: "border-success/30 bg-success/10 text-success",
    amber: "border-warning/30 bg-warning/10 text-warning",
    red: "border-danger/30 bg-danger/10 text-danger"
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-[.12em] ${cls}`}>
      {children}
    </span>
  );
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-lg text-textSecondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  const isPositive = !delta.includes("-");
  return (
    <GlassCard className="min-h-36 p-5 relative overflow-hidden flex flex-col justify-between" tilt>
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-textMuted">{label}</p>
        <strong className="mt-2 block text-4xl font-black bg-gradient-to-r from-white to-[#cbd5e1] bg-clip-text text-transparent">{value}</strong>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm font-bold ${isPositive ? "text-cyan" : "text-danger"}`}>
          {delta}
        </span>
        {/* Visual Sparkline graph */}
        <svg className="w-16 h-6 overflow-visible" viewBox="0 0 50 20">
          <path
            d={isPositive ? "M0 15 Q 12 5, 25 10 T 50 2" : "M0 2 Q 12 15, 25 10 T 50 18"}
            fill="none"
            stroke={isPositive ? "#2DD4BF" : "#EF4444"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </GlassCard>
  );
}

