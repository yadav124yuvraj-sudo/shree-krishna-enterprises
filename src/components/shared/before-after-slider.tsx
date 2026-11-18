"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Drag, touch or use the arrow keys to compare before and after.
 * The range input covers the image, so it works with mouse, touch and keyboard.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden bg-beige">
      <Image src={afterSrc} alt={afterAlt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
      </div>

      <span className="absolute left-3 top-3 rounded-sm bg-charcoal/80 px-2 py-1 text-xs text-warm-white">Before</span>
      <span className="absolute right-3 top-3 rounded-sm bg-charcoal/80 px-2 py-1 text-xs text-warm-white">After</span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-warm-white" />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after photos"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
