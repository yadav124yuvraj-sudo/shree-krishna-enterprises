"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function BrandPreloader() {
  const [stage, setStage] = useState<"visible" | "exiting" | "hidden">("visible");

  useEffect(() => {
    // Only show full preloader once per browser session so repeat navigation stays instant
    const alreadyShown = sessionStorage.getItem("ske_preloader_shown");
    if (alreadyShown) {
      setStage("hidden");
      return;
    }

    sessionStorage.setItem("ske_preloader_shown", "1");

    const exitTimer = setTimeout(() => {
      setStage("exiting");
    }, 950);

    const hideTimer = setTimeout(() => {
      setStage("hidden");
    }, 1450);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0D0C] text-white transition-all duration-500 ease-out ${
        stage === "exiting" ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Architectural Golden Frame & Monogram */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex size-20 items-center justify-center">
          {/* Outer rotating/drawing golden border */}
          <span className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-2xl border border-[#d4af37]/35" />
          <span className="absolute inset-1.5 rounded-xl border border-[#d4af37]/80 bg-[#161514] shadow-[0_0_30px_rgba(212,175,55,0.25)]" />
          <span className="relative font-sans text-2xl font-black tracking-[0.18em] text-[#d4af37]">
            SKE
          </span>
        </div>

        {/* Brand Name Reveal */}
        <p className="mt-5 font-sans text-sm font-extrabold uppercase tracking-[0.28em] text-white sm:text-base">
          Shree Krishna Enterprises
        </p>

        {/* Golden Progress Line */}
        <div className="mt-3 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[skeLine_0.95s_ease-out_forwards] bg-gradient-to-r from-[#9A742E] via-[#f3d473] to-[#d4af37]" />
        </div>

        <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
          POP &bull; PVC &bull; Architectural Interiors
        </span>
      </div>
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="animate-[skePageIn_0.38s_cubic-bezier(0.22,1,0.36,1)_forwards]"
    >
      {children}
    </div>
  );
}
