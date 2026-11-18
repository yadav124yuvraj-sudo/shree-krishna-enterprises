/** Turns a YouTube or Vimeo link into a safe embed URL. Anything else returns null. */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/embed\/([\w-]{6,20})/)?.[1] ?? null;
    return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = u.pathname.match(/^\/(\d{5,12})/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

/** Official Pinterest pin embed from a pin link like https://www.pinterest.com/pin/1234567890/ */
export function toPinterestEmbed(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const id = raw.match(/pinterest\.[a-z.]+\/pin\/(\d{5,25})/i)?.[1];
  return id ? `https://assets.pinterest.com/ext/embed.html?id=${id}` : null;
}
