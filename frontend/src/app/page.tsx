"use client";

import {
  Bot,
  type LucideIcon,
  Check,
  CircleDot,
  Inbox,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";

const platforms = ["WhatsApp", "Instagram", "Messenger", "Telegram", "Email", "Live Chat"];
const roadmap = [
  ["01", "Unified Inbox", "All customer conversations in one operational queue."],
  ["02", "Live Chat Widget", "Paste one script and capture website buyers in real time."],
  ["03", "Telegram + Email", "Ship the easiest integrations first and prove daily usage."],
  ["04", "Meta + WhatsApp", "Add high-value channels once the inbox workflow is stable."],
  ["05", "AI Reply Assist", "Draft accurate replies that agents can edit or send."]
];

const features: Array<[LucideIcon, string, string]> = [
  [MessageCircle, "Unified conversations", "One queue across social, email, chat, and messaging channels."],
  [Bot, "AI reply assist", "Draft replies that a human agent can send or edit."],
  [ShieldCheck, "Service boundaries", "Auth, integrations, inbox, AI, and webhooks are separated from day one."]
];

export default function Home() {
  return (
    <main className="premium-bg overflow-x-hidden min-h-screen relative">
      {/* Ambient background glow elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#5b5ceb]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2dd4bf]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <section className="hero-section">
        <nav className="top-nav" aria-label="Main navigation">
          <Link className="brand" href="/">
            <img src="/qchat-logo.png" alt="QChat logo" />
          </Link>
          <div className="nav-links">
            <a href="#inbox">Inbox</a>
            <Link href="/integrations">Integrations</Link>
            <Link href="/ai-assistant">AI</Link>
            <a href="#roadmap">Roadmap</a>
            <a href="#pricing">Pricing</a>
          </div>
          <Link className="nav-cta" href="/login">
            Open App
          </Link>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>One inbox for every customer conversation.</h1>
            <p>
              QChat brings WhatsApp, Instagram DMs, Messenger, Telegram, email, and live chat into
              one AI-assisted workspace for small businesses.
            </p>
            <div className="hero-actions">
              <Link className="primary-action" href="/login">
                <Inbox size={18} />
                Login to Dashboard
              </Link>
              <Link className="secondary-action" href="/inbox">
                <Zap size={18} />
                Use Inbox
              </Link>
            </div>
          </div>

          <div className="inbox-console" id="inbox">
            <div className="console-top">
              <span>ALL CONVERSATIONS</span>
              <strong>45</strong>
            </div>
            <div className="channel-list">
              {platforms.map((platform, index) => (
                <div className="channel-row" key={platform}>
                  <span>
                    <CircleDot size={13} />
                    {platform}
                  </span>
                  <strong>{[20, 10, 5, 3, 4, 3][index]}</strong>
                </div>
              ))}
            </div>
            <div className="message-preview">
              <div>
                <span className="message-platform">Telegram</span>
                <h3>Is this product available?</h3>
                <p>Yes, it is currently available. Would you like help placing an order?</p>
              </div>
              <button aria-label="Send suggested reply">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <h2>Built for the first paying customers.</h2>
          <p>
            Start with the inbox, prove that 5 to 10 local businesses will pay, then expand into
            deeper automation and analytics.
          </p>
        </div>
        <div className="feature-grid">
          {features.map(([Icon, title, body]) => (
            <article className="feature-panel" key={title}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{body}</p>
              <Link className="text-link" href={title.includes("AI") ? "/ai-assistant" : title.includes("Unified") ? "/inbox" : "/integrations"}>
                Open module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="section-heading">
          <h2>Execution roadmap</h2>
          <p>Ship in the order that reduces integration risk while creating visible value quickly.</p>
        </div>
        <div className="roadmap-list">
          {roadmap.map(([step, title, body]) => (
            <article className="roadmap-row" key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="pricing-copy">
          <h2>Simple pricing for a serious MVP.</h2>
          <p>
            Keep the offer focused: small businesses should understand the value in under a minute.
          </p>
        </div>
        <div className="pricing-grid">
          <article className="price-panel">
            <Mail size={24} />
            <h3>Starter</h3>
            <strong>₹999/month</strong>
            <p>2 team members, 1,000 conversations, core integrations, and live chat.</p>
            <ul>
              <li>
                <Check size={16} /> WhatsApp, Telegram, Email
              </li>
              <li>
                <Check size={16} /> Instagram and Messenger queue
              </li>
              <li>
                <Check size={16} /> Website live chat
              </li>
            </ul>
          </article>
          <article className="price-panel price-panel-accent">
            <Sparkles size={24} />
            <h3>Growth</h3>
            <strong>₹2,999/month</strong>
            <p>10 team members, unlimited conversations, AI replies, and priority support.</p>
            <ul>
              <li>
                <Check size={16} /> AI suggested replies
              </li>
              <li>
                <Check size={16} /> Faster sync windows
              </li>
              <li>
                <Check size={16} /> Priority support
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
