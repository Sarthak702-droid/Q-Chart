"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
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

import { ScrollAnimator } from "@/components/ScrollAnimator";

type SceneItem =
  | {
      id: string;
      type: "text";
      label: string;
      x: number;
      y: number;
      rot: number;
      baseZ: number;
    }
  | {
      id: string;
      type: "card";
      label: string;
      meta: string;
      x: number;
      y: number;
      rot: number;
      baseZ: number;
    };

type LenisScrollEvent = {
  scroll: number;
  velocity: number;
};

const platforms = ["WhatsApp", "Instagram", "Messenger", "Telegram", "Email", "Live Chat"];
const sceneLabels = ["INBOX", "AI REPLY", "OMNI", "QCHAT", "FAST", "SYNC", "AGENT", "SALES"];
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

function useScrollHud() {
  const [hud, setHud] = useState({ velocity: "0.00", coord: "000.000", fps: 60 });
  const worldRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: true });
    const state = {
      scroll: 0,
      velocity: 0,
      targetSpeed: 0,
      mouseX: 0,
      mouseY: 0
    };
    let lastTime = performance.now();
    let frame = 0;

    const onMouseMove = (event: MouseEvent) => {
      state.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      state.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    lenis.on("scroll", ({ scroll, velocity }: LenisScrollEvent) => {
      state.scroll = scroll;
      state.targetSpeed = velocity;
    });

    window.addEventListener("mousemove", onMouseMove);

    const raf = (time: number) => {
      lenis.raf(time);
      const delta = Math.max(time - lastTime, 1);
      lastTime = time;
      frame += 1;
      state.velocity += (state.targetSpeed - state.velocity) * 0.1;

      const tiltX = state.mouseY * 5 - state.velocity * 0.45;
      const tiltY = state.mouseX * 5;
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
      if (viewportRef.current) {
        const fov = 1000 - Math.min(Math.abs(state.velocity) * 10, 520);
        viewportRef.current.style.perspective = `${fov}px`;
      }

      if (frame % 8 === 0) {
        setHud({
          velocity: Math.abs(state.velocity).toFixed(2),
          coord: state.scroll.toFixed(0).padStart(3, "0"),
          fps: Math.round(1000 / delta)
        });
      }

      requestAnimationFrame(raf);
    };

    const animation = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("mousemove", onMouseMove);
      lenis.destroy();
    };
  }, []);

  return { hud, worldRef, viewportRef };
}

function HyperScene() {
  const { hud, worldRef, viewportRef } = useScrollHud();
  const items = useMemo<SceneItem[]>(() => {
    return Array.from({ length: 18 }, (_, index) => {
      const isHeading = index % 4 === 0;
      const angle = (index / 18) * Math.PI * 6;
      const x = Math.cos(angle) * 380;
      const y = Math.sin(angle) * 230;
      if (isHeading) {
        return {
          id: `text-${index}`,
          type: "text",
          label: sceneLabels[index % sceneLabels.length],
          x: 0,
          y: 0,
          rot: index % 2 === 0 ? -4 : 4,
          baseZ: -index * 720
        };
      }

      return {
        id: `card-${index}`,
        type: "card",
        label: sceneLabels[index % sceneLabels.length],
        meta: platforms[index % platforms.length],
        x,
        y,
        rot: index % 2 === 0 ? 9 : -13,
        baseZ: -index * 720
      };
    });
  }, []);

  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />
      <div className="hud">
        <div className="hud-row">
          <span>QCHAT.SYS.READY</span>
          <div className="hud-line" />
          <span>
            FPS: <strong>{hud.fps}</strong>
          </span>
        </div>
        <div className="hud-vertical">
          SCROLL VELOCITY // <strong>{hud.velocity}</strong>
        </div>
        <div className="hud-row">
          <span>
            COORD: <strong>{hud.coord}</strong>
          </span>
          <div className="hud-line" />
          <span>MVP 0.1 [BETA]</span>
        </div>
      </div>
      <div className="viewport" ref={viewportRef}>
        <div className="world" ref={worldRef}>
          {items.map((item) => (
            <div
              className="scene-item"
              key={item.id}
              style={{
                transform: `translate3d(${item.x}px, ${item.y}px, ${item.baseZ}px) rotateZ(${item.rot}deg)`
              }}
            >
              {item.type === "text" ? (
                <div className="big-text">{item.label}</div>
              ) : (
                <div className="hyper-card">
                  <div className="hyper-card-header">
                    <span>ID-{String(item.baseZ).replace("-", "")}</span>
                    <i />
                  </div>
                  <h2>{item.label}</h2>
                  <div className="hyper-card-footer">
                    <span>{item.meta}</span>
                    <span>AI_READY</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {Array.from({ length: 120 }, (_, index) => (
            <span
              aria-hidden="true"
              className="star"
              key={index}
              style={{
                transform: `translate3d(${(index % 17) * 145 - 1200}px, ${
                  (index % 11) * 110 - 620
                }px, ${-(index * 131) % 11000}px)`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main>
      <ScrollAnimator />
      <HyperScene />
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
