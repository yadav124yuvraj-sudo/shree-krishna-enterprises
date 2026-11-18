"use client";

import { useEffect, useState } from "react";

export function BrandPreloader({ businessName }: { businessName: string }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), 1600);
    const hideTimer = window.setTimeout(() => setVisible(false), 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-warm-white px-6 transition-opacity duration-400 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-serif text-2xl tracking-wide text-charcoal sm:text-4xl">
        {businessName}
      </p>

      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-beige sm:w-56">
        <div className="h-full w-full origin-left animate-[pulse_1s_ease-in-out_infinite] bg-gold-deep" />
      </div>
    </div>
  );
}
