"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Loader2,
  MessageCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { OnlineDesignItem } from "@/app/api/designs/search/route";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const CATEGORIES = [
  "All",
  "POP False Ceiling",
  "PVC Wall Panels",
  "LED Cove Lighting",
  "Bedroom Ceiling",
  "PVC Ceiling",
  "Commercial & Office",
];

const QUICK_SEARCHES = [
  "Living Room POP",
  "Wooden PVC Panel",
  "Bedroom LED Cove",
  "TV Unit Wall",
  "Chandelier Molding",
];

export function OnlineDesignExplorer({
  adminDesigns = [],
  whatsappNumber,
}: {
  adminDesigns?: OnlineDesignItem[];
  whatsappNumber: string;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [onlineItems, setOnlineItems] = useState<OnlineDesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<OnlineDesignItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category) params.set("category", category);

    fetch(`/api/designs/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setOnlineItems(data.items || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, category]);

  const filteredAdmin = adminDesigns.filter((item) => {
    const qLower = debouncedQuery.toLowerCase();
    const matchesCat = category === "All" || item.category === category;
    const matchesQ =
      !qLower ||
      item.title.toLowerCase().includes(qLower) ||
      item.category.toLowerCase().includes(qLower);
    return matchesCat && matchesQ;
  });

  const combined = [...filteredAdmin, ...onlineItems];

  return (
    <div>
      {/* Search Bar & Quick Suggestions */}
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-5 size-5 text-[#9A742E]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search POP ceiling, PVC wall panel, bedroom LED cove, TV unit..."
            className="w-full rounded-full border-2 border-[#D4B97B] bg-white py-4 pl-13 pr-12 text-sm font-medium text-charcoal shadow-md outline-none transition placeholder:text-stone/65 focus:border-[#9A742E] focus:ring-4 focus:ring-[#d4af37]/20 sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 rounded-full p-1.5 text-stone hover:bg-amber-50 hover:text-charcoal"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Quick Search Tags */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-semibold text-stone">Popular:</span>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setCategory("All");
                setQuery(term);
              }}
              className="rounded-full border border-[#E6DFD3] bg-white px-3 py-1 font-medium text-charcoal/80 transition hover:border-[#d4af37] hover:text-[#9A742E]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                active
                  ? "border-charcoal bg-charcoal text-[#d4af37] shadow-sm"
                  : "border-[#DFD5C5] bg-white text-charcoal hover:border-charcoal"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Designs Grid */}
      {loading ? (
        <div className="mt-16 flex flex-col items-center justify-center py-12 text-stone">
          <Loader2 className="size-8 animate-spin text-[#9A742E]" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium">Loading interior designs...</p>
        </div>
      ) : combined.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-[#EAE4D9] bg-white p-12 text-center">
          <Sparkles className="mx-auto size-10 text-[#9A742E]/60" aria-hidden="true" />
          <h3 className="mt-4 font-sans text-xl font-extrabold text-charcoal">
            No matching designs found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone">
            Try searching for &ldquo;POP&rdquo;, &ldquo;PVC&rdquo;, &ldquo;Bedroom&rdquo;, or &ldquo;LED&rdquo;, or send us your own reference idea!
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 rounded-full bg-charcoal px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d4af37]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {combined.map((item) => {
            const whatsappHref = buildWhatsAppLink({
              whatsappNumber,
              message: buildEnquiryMessage({
                kind: "design",
                itemName: item.title,
                url: item.imageUrl,
              }),
            });

            return (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d4af37] hover:shadow-xl"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-[#1c1b19] text-left"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#d4af37] backdrop-blur-xs">
                      {item.category}
                    </span>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-charcoal opacity-0 transition group-hover:opacity-100">
                      <ExternalLink className="size-3" />
                      Preview
                    </span>
                  </button>

                  <div className="p-4">
                    <h3 className="line-clamp-2 font-sans text-base font-extrabold leading-snug text-charcoal group-hover:text-[#9A742E]">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[#F2ECE1] px-4 py-3">
                  <Link
                    href={`/quote?design=${encodeURIComponent(item.title)}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-[#9A742E] hover:underline"
                  >
                    Get Quote →
                  </Link>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#1fb874]/10 px-3 py-1 text-xs font-bold text-[#158a55] transition hover:bg-[#1fb874] hover:text-white"
                  >
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal Preview */}
      {previewItem ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-[#161514] text-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              aria-label="Close preview"
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-white hover:text-charcoal"
            >
              <X className="size-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37]">
                  {previewItem.category}
                </span>
                <h3 className="mt-1 font-sans text-xl font-extrabold text-white">
                  {previewItem.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/quote?design=${encodeURIComponent(previewItem.title)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-charcoal transition hover:bg-[#c5a028]"
                >
                  Request This Design
                </Link>
                <a
                  href={buildWhatsAppLink({
                    whatsappNumber,
                    message: buildEnquiryMessage({
                      kind: "design",
                      itemName: previewItem.title,
                      url: previewItem.imageUrl,
                    }),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1fb874] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#199e63]"
                >
                  <MessageCircle className="size-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
