"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";

export function MobileQuickDockClient({
  phoneLink,
  whatsappLink,
}: {
  phoneLink: string;
  whatsappLink: string;
}) {
  const [visible, setVisible] = useState(false);
  const [hiddenOnInput, setHiddenOnInput] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        setHiddenOnInput(true);
      }
    };
    const onFocusOut = () => setHiddenOnInput(false);

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (hiddenOnInput) return null;

  return (
    <>
      {/* Floating Round WhatsApp Button above bottom bar (matches video) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed bottom-16 right-4 z-50 flex size-13 items-center justify-center rounded-full bg-[#1fb874] text-white shadow-[0_8px_24px_rgba(31,184,116,0.45)] transition-all duration-300 active:scale-95 md:hidden ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-95"
        }`}
      >
        <MessageCircle className="size-6 fill-white/15" aria-hidden="true" />
      </a>

      {/* Edge-to-Edge 3-Column Bottom Sticky Bar */}
      <nav
        aria-label="Mobile quick actions"
        className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/15 shadow-[0_-8px_28px_rgba(0,0,0,0.45)] transition-transform duration-300 md:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 1. Left: Dark Charcoal Call Now */}
        <a
          href={phoneLink}
          className="flex h-14 items-center justify-center gap-2 bg-[#1D2220] text-xs font-bold tracking-wide text-white transition active:bg-[#2a312e]"
        >
          <Phone className="size-3.5 text-[#d4af37]" aria-hidden="true" />
          <span>Call Now</span>
        </a>

        {/* 2. Center: Emerald Green WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 bg-[#179E67] text-xs font-extrabold tracking-wide text-white transition active:bg-[#138556]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        {/* 3. Right: Dark Charcoal Quote */}
        <Link
          href="/contact#contact-form"
          className="flex h-14 items-center justify-center gap-2 bg-[#1D2220] text-xs font-bold tracking-wide text-white transition active:bg-[#2a312e]"
        >
          <Send className="size-3.5 text-[#d4af37]" aria-hidden="true" />
          <span>Quote</span>
        </Link>
      </nav>
    </>
  );
}
