"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/hero-ceiling.jpg",
    fallback:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
    alt: "Modern cove lit POP false ceiling living room",
  },
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
    fallback:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
    alt: "Luxury chandelier with carved POP ceiling moldings",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
    fallback:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
    alt: "Contemporary warm LED recessed false ceiling interior",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    fallback:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    alt: "Architectural POP grid ceiling and living space",
  },
];

export function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#141413]">
      {/* Animated Ken Burns Interior Slideshow */}
      {SLIDES.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-in-out ${
              isActive ? "scale-110 opacity-100" : "scale-100 opacity-0"
            }`}
            style={{
              backgroundImage: `url('${slide.src}'), url('${slide.fallback}')`,
              transitionProperty: "opacity, transform",
              transitionDuration: isActive ? "1800ms, 7000ms" : "1800ms, 1800ms",
            }}
          />
        );
      })}

      {/* Luxury Dark Readability Vignette & Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-[#141413]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}