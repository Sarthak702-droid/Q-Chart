import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Bot, Sparkles } from "lucide-react";

type DivProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GlassPanel({ children, className = "", ...props }: DivProps) {
  return (
    <div className={`glass-panel ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function GradientButton({ children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`app-action ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`ghost-action ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  icon
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {delta ? <em>{delta}</em> : null}
      {icon}
    </article>
  );
}

export function StatusBadge({
  children,
  tone = "success"
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "info";
}) {
  return (
    <span className="status-badge" data-tone={tone}>
      {children}
    </span>
  );
}

export function AISidebar({
  title = "AI Assistant",
  subtitle = "Intelligent Briefing",
  children
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <aside className="ai-sidebar">
      <div className="ai-brand">
        <span className="icon-tile">
          <Sparkles size={22} />
        </span>
        <div>
          <span className="eyebrow">{title}</span>
          <p style={{ margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      <div className="ai-stack">{children}</div>
    </aside>
  );
}

export function WorkspaceWindow({
  title,
  icon,
  badge,
  children,
  className = ""
}: {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`workspace-window ${className}`.trim()}>
      <div className="window-bar">
        <div className="topbar-actions">
          {icon}
          <h2>{title}</h2>
          {badge}
        </div>
        <span className="muted">•••</span>
      </div>
      <div className="window-body">{children}</div>
    </article>
  );
}

export function SegmentedTabs<T extends string>({
  items,
  active,
  onChange
}: {
  items: T[];
  active: T;
  onChange: (item: T) => void;
}) {
  return (
    <div className="tab-row" role="tablist">
      {items.map((item) => (
        <button
          className="tab-button"
          data-active={item === active}
          key={item}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onClick,
  label
}: {
  checked: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      aria-label={label ?? "Toggle setting"}
      aria-pressed={checked}
      className="toggle"
      data-checked={checked}
      onClick={onClick}
      type="button"
    >
      <i />
    </button>
  );
}

export function ModalShell({
  title,
  description,
  children,
  footer
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="premium-bg">
      <section className="glass-panel modal-shell page-enter">
        <header className="modal-header">
          <div className="topbar-actions">
            <Bot size={28} />
            <div>
              <h1 style={{ margin: 0 }}>{title}</h1>
              <p>{description}</p>
            </div>
          </div>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </main>
  );
}
