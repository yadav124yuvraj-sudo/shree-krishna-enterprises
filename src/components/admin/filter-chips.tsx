import Link from "next/link";

export type Chip = { label: string; href: string; active: boolean; count?: number | null };

export function FilterChips({ label, items }: { label: string; items: Chip[] }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {items.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          aria-current={c.active ? "page" : undefined}
          className={
            c.active
              ? "rounded-sm bg-charcoal px-3 py-1.5 text-sm text-warm-white"
              : "rounded-sm border border-line px-3 py-1.5 text-sm text-charcoal hover:bg-beige"
          }
        >
          {c.label}
          {typeof c.count === "number" ? <span className="ml-1.5 opacity-70">{c.count}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
