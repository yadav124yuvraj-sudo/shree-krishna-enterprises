"use client";

import { useMemo, useSyncExternalStore } from "react";

// Saved designs for visitors who are not logged in. Stored only in their own browser.
const KEY = "ske-favourites";
const EVENT = "ske-favourites-change";

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function useFavourites(): string[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => {
    try {
      const value: unknown = JSON.parse(raw);
      return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }, [raw]);
}

export function toggleFavourite(slug: string) {
  try {
    const current: string[] = JSON.parse(readRaw());
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    window.localStorage.setItem(KEY, JSON.stringify(next.slice(0, 200)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage blocked (private mode): saving silently does nothing.
  }
}
