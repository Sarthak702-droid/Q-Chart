"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  "[data-scroll-reveal]",
  ".app-header",
  ".app-panel",
  ".metric-card",
  ".conversation-card",
  ".thread-row",
  ".data-row",
  ".filter-row",
  ".gmail-thread",
  ".channel-row",
  ".roadmap-row",
  ".feature-panel",
  ".price-panel",
  ".inbox-console",
  ".message-preview"
].join(",");

export function ScrollAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    elements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 60}ms`);
      element.style.setProperty("--float-delay", `${(index % 6) * 180}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
