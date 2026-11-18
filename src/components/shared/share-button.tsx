"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

/** Uses the phone share sheet when available, otherwise copies the link. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [message, setMessage] = useState("");

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage("Could not share. Copy the link from the address bar.");
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={share}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-[0.95rem] font-medium text-charcoal hover:bg-beige"
      >
        <Share2 aria-hidden="true" className="size-4" />
        Share
      </button>
      <span role="status" className="text-sm text-stone">
        {message}
      </span>
    </span>
  );
}
