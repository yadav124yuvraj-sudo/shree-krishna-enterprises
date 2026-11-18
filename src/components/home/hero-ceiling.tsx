/**
 * Hero illustration: plan view of a tray ceiling with cove lighting.
 * It is a drawing, not a photo of real work, and is captioned that way.
 * Animation (see globals.css): the gold cove line draws, then the glow rises.
 */
export function HeroCeiling() {
  const ink = "var(--color-charcoal)";
  const faint = "var(--color-line)";
  const gold = "var(--color-gold)";

  return (
    <figure className="mx-auto w-full max-w-md lg:max-w-none">
      <svg
        viewBox="0 0 480 520"
        role="img"
        aria-label="Illustration of a POP tray ceiling seen from below, with a gold line of cove lighting"
        className="h-auto w-full"
      >
        <defs>
          <filter id="cove-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Room and plaster surfaces */}
        <rect x="20" y="20" width="440" height="480" fill="var(--color-beige)" stroke={faint} strokeWidth="1.5" />
        <rect x="56" y="56" width="368" height="408" fill="var(--color-warm-white)" stroke={ink} strokeWidth="1" />
        <rect x="140" y="140" width="200" height="240" fill="var(--color-beige)" stroke={ink} strokeWidth="1" />

        {/* Depth lines from outer corners to the recessed tray */}
        <g stroke={faint} strokeWidth="1">
          <line x1="56" y1="56" x2="104" y2="104" />
          <line x1="424" y1="56" x2="376" y2="104" />
          <line x1="56" y1="464" x2="104" y2="416" />
          <line x1="424" y1="464" x2="376" y2="416" />
          <line x1="104" y1="104" x2="140" y2="140" />
          <line x1="376" y1="104" x2="340" y2="140" />
          <line x1="104" y1="416" x2="140" y2="380" />
          <line x1="376" y1="416" x2="340" y2="380" />
        </g>

        {/* Cove light: soft glow behind, crisp line on top */}
        <rect
          className="cove-glow"
          x="104" y="104" width="272" height="312"
          fill="none" stroke={gold} strokeWidth="14" filter="url(#cove-blur)" opacity="0.55"
        />
        <rect
          className="cove-line"
          pathLength="1"
          x="104" y="104" width="272" height="312"
          fill="none" stroke={gold} strokeWidth="2.5"
        />

        {/* Centre rose */}
        <g fill="none" stroke={ink} strokeWidth="1">
          <circle cx="240" cy="260" r="46" />
          <circle cx="240" cy="260" r="30" />
          <circle cx="240" cy="260" r="6" fill={gold} stroke="none" />
        </g>
      </svg>
      <figcaption className="mt-3 text-sm text-stone">
        Illustration: POP tray ceiling with cove lighting, seen from below.
      </figcaption>
    </figure>
  );
}
