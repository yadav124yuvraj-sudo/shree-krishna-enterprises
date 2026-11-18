import { getPublicMediaUrl } from "@/lib/supabase/public";

const SERVICE_IMAGE_MAP: { keywords: string[]; url: string }[] = [
  {
    keywords: ["pvc wall", "wall panel", "wpc", "louver", "fluted", "tv unit", "tv wall"],
    url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["pvc ceiling", "pvc false", "waterproof", "bathroom", "balcony"],
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["gypsum", "grid", "office", "commercial", "shop", "showroom"],
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["pvc", "panel", "louver", "wpc"],
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["led", "cove", "lighting", "profile", "spotlight"],
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["chandelier", "luxury", "royal", "hall", "living"],
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["bedroom", "room", "duplex"],
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["pop", "plaster", "false ceiling", "ceiling"],
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
];

const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";

/**
 * Returns the admin-uploaded Supabase image if present;
 * otherwise picks a matching high-res interior image based on the service name.
 */
export function resolveServiceImage(
  coverImagePath: string | null | undefined,
  serviceTitle: string,
): string {
  const uploaded = getPublicMediaUrl(coverImagePath ?? null);
  if (uploaded) return uploaded;

  const titleLower = (serviceTitle || "").toLowerCase();
  for (const entry of SERVICE_IMAGE_MAP) {
    if (entry.keywords.some((kw) => titleLower.includes(kw))) {
      return entry.url;
    }
  }

  return DEFAULT_SERVICE_IMAGE;
}
