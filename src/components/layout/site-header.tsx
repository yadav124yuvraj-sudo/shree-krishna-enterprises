"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Container } from "./container";
import { primaryNav, secondaryNav } from "./nav-links";
import { cn } from "@/lib/utils";

export function SiteHeader({
  name,
  whatsappHref,
}: {
  name: string;
  whatsappHref?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gold/40 bg-[#141413] text-warm-white">
        <Container className="flex min-h-[72px] items-center justify-between gap-4 py-2">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt={name}
              className="h-10 w-12 rounded-sm border border-gold/60 bg-white object-cover"
            />
            <span className="font-sans text-base font-extrabold uppercase tracking-wider text-gold sm:text-lg">
              {name}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest text-warm-white/85 transition-colors hover:text-gold",
                  isActive(item.href) && "text-gold underline decoration-gold decoration-2 underline-offset-8",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref || "/contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noopener noreferrer" : undefined}
              className="hidden items-center gap-2 rounded-full bg-[#22c55e] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#16a34a] sm:inline-flex"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp Us
            </a>
            <button
              type="button"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm border border-gold/50 text-warm-white transition hover:bg-white/10 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="pointer-events-none size-6 text-gold" /> : <Menu className="pointer-events-none size-6" />}
            </button>
          </div>
        </Container>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[73px] bottom-0 z-50 overflow-y-auto bg-[#141413] text-warm-white lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-lg px-6 pb-12 pt-4">
            <ul className="divide-y divide-white/10">
              {[{ href: "/", label: "Home" }, ...primaryNav, ...secondaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "block py-4 font-sans text-base font-bold uppercase tracking-widest text-warm-white transition-colors hover:text-gold",
                      pathname === item.href && "text-gold",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={whatsappHref || "/contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#22c55e] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#16a34a]"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              WhatsApp Us
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}