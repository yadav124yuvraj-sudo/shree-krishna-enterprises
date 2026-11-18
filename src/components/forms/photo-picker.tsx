"use client";

import { useRef, useState } from "react";
import { compressImage } from "@/lib/compress-image";

type Item = { id: string; file: File; preview: string };

/**
 * Lets the customer choose photos. Each photo is shrunk in the browser first.
 * The chosen files are passed up through onChange; the form adds them when it is sent.
 */
export function PhotoPicker({
  max,
  onChange,
  onBusyChange,
  error,
}: {
  max: number;
  onChange: (files: File[]) => void;
  onBusyChange?: (busy: boolean) => void;
  error?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function publish(next: Item[]) {
    setItems(next);
    onChange(next.map((i) => i.file));
  }

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selected.length === 0) return;

    const room = max - items.length;
    if (room <= 0) {
      setNote(`You can add up to ${max} photos.`);
      return;
    }

    setBusy(true);
    onBusyChange?.(true);
    setNote("");

    const added: Item[] = [];
    const failed: string[] = [];
    for (const file of selected.slice(0, room)) {
      try {
        const small = await compressImage(file);
        added.push({ id: `${Date.now()}-${Math.random()}`, file: small, preview: URL.createObjectURL(small) });
      } catch {
        failed.push(file.name);
      }
    }
    publish([...items, ...added]);

    const messages: string[] = [];
    if (failed.length > 0) messages.push(`Could not read ${failed.join(", ")}. Use a JPG, PNG or WEBP photo.`);
    if (selected.length > room) messages.push(`Only ${max} photos can be added.`);
    setNote(messages.join(" "));

    setBusy(false);
    onBusyChange?.(false);
  }

  function remove(id: string) {
    const gone = items.find((i) => i.id === id);
    if (gone) URL.revokeObjectURL(gone.preview);
    publish(items.filter((i) => i.id !== id));
    setNote("");
  }

  return (
    <div>
      <span className="block text-sm font-medium text-charcoal">Photos (optional)</span>
      <p className="mt-1 text-sm text-stone">
        Add up to {max} photos of the room. They are made smaller on your phone before sending.
      </p>

      {items.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="relative overflow-hidden rounded-sm border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="Selected photo" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute right-1 top-1 rounded-sm bg-charcoal/85 px-2 py-1 text-xs text-warm-white hover:bg-charcoal"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={busy || items.length >= max}
        onChange={handleSelect}
        aria-label="Choose photos"
        className="mt-3 block w-full text-sm text-stone file:mr-4 file:h-11 file:rounded-sm file:border-0 file:bg-charcoal file:px-4 file:text-warm-white disabled:opacity-50"
      />
      {busy ? (
        <p role="status" className="mt-2 text-sm text-stone">
          Preparing photos…
        </p>
      ) : null}
      {note ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {note}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
