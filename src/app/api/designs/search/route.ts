import { NextResponse } from "next/server";

export type OnlineDesignItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  photographer?: string;
  tags: string[];
};

const VERIFIED_INTERIOR_DESIGNS: OnlineDesignItem[] = [
  // ================= POP FALSE CEILING (8) =================
  {
    id: "pop-ceiling-01",
    title: "Modern Cove-Lit Tray POP False Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    tags: ["pop", "false ceiling", "cove", "tray ceiling", "living room", "hall", "modern"],
  },
  {
    id: "pop-ceiling-02",
    title: "Royal Chandelier & Carved POP Ceiling Design",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
    tags: ["pop", "false ceiling", "chandelier", "royal", "hall", "living room", "luxury"],
  },
  {
    id: "pop-ceiling-03",
    title: "Architectural Coffered Grid POP False Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    tags: ["pop", "false ceiling", "grid", "coffered", "duplex", "living room"],
  },
  {
    id: "pop-ceiling-04",
    title: "Contemporary Multi-Layer Living Room POP Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    tags: ["pop", "false ceiling", "multi layer", "living room", "gypsum", "hall"],
  },
  {
    id: "pop-ceiling-05",
    title: "Minimalist Gypsum Perimeter Drop POP Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
    tags: ["pop", "gypsum", "drop ceiling", "living room", "minimal", "hall"],
  },
  {
    id: "pop-ceiling-06",
    title: "Duplex Villa Double-Height POP Ceiling Layout",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
    tags: ["duplex", "villa", "double height", "pop", "false ceiling", "hall"],
  },
  {
    id: "pop-ceiling-07",
    title: "Recessed Spotlight & Clean White POP Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1000&q=85",
    tags: ["spotlight", "white", "pop", "false ceiling", "drawing room", "hall"],
  },
  {
    id: "pop-ceiling-08",
    title: "Designer Living & Dining Open-Plan POP Ceiling",
    category: "POP False Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1000&q=85",
    tags: ["open plan", "living", "dining", "pop", "false ceiling", "modern"],
  },

  // ================= LED COVE LIGHTING (7) =================
  {
    id: "led-cove-01",
    title: "Warm Recessed LED Cove & Profile Ceiling Lighting",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1000&q=85",
    tags: ["led", "cove", "profile light", "recessed", "warm light", "false ceiling", "living room"],
  },
  {
    id: "led-cove-02",
    title: "Bedroom LED Cove & Ambient Perimeter Ceiling",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85",
    tags: ["bedroom", "led", "cove", "ambient", "perimeter", "false ceiling", "pop"],
  },
  {
    id: "led-cove-03",
    title: "Double-Layer Geometric LED Cove Dining Ceiling",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1000&q=85",
    tags: ["led", "cove", "dining", "geometric", "double layer", "pop", "ceiling"],
  },
  {
    id: "led-cove-04",
    title: "Hidden Strip LED Cove & Gypsum Tray Living Ceiling",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    tags: ["strip light", "hidden led", "cove", "tray", "living room", "pop"],
  },
  {
    id: "led-cove-05",
    title: "Golden Glow Perimeter LED Cove Master Bedroom",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=85",
    tags: ["golden glow", "led", "cove", "master bedroom", "false ceiling"],
  },
  {
    id: "led-cove-06",
    title: "Linear Architectural LED Channel False Ceiling",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    tags: ["linear led", "profile", "channel", "cove", "modern", "ceiling"],
  },
  {
    id: "led-cove-07",
    title: "Soft Warm Cove Lighting with Spotlights Bedroom Design",
    category: "LED Cove Lighting",
    imageUrl: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=85",
    tags: ["warm cove", "spotlights", "bedroom", "led", "ceiling"],
  },

  // ================= BEDROOM CEILING (7) =================
  {
    id: "bedroom-ceiling-01",
    title: "Minimalist Master Bedroom Gypsum & LED Ceiling",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85",
    tags: ["bedroom", "ceiling", "master bedroom", "gypsum", "led", "cove", "pop"],
  },
  {
    id: "bedroom-ceiling-02",
    title: "Floating Island Bedroom POP Ceiling with Cove Light",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=85",
    tags: ["bedroom", "ceiling", "floating", "island", "cove", "led", "pop"],
  },
  {
    id: "bedroom-ceiling-03",
    title: "Cozy Warm-Lit Modern Bedroom False Ceiling",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=85",
    tags: ["bedroom", "ceiling", "modern", "warm light", "pop", "false ceiling"],
  },
  {
    id: "bedroom-ceiling-04",
    title: "Luxury Suite Bedroom Recessed POP & Accent Wall",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85",
    tags: ["luxury", "suite", "bedroom", "recessed", "pop", "ceiling"],
  },
  {
    id: "bedroom-ceiling-05",
    title: "Contemporary Kids & Guest Bedroom Tray POP Ceiling",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85",
    tags: ["guest bedroom", "kids room", "tray", "pop", "bedroom", "ceiling"],
  },
  {
    id: "bedroom-ceiling-06",
    title: "Wooden Accent & White Gypsum Bedroom Ceiling",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1000&q=85",
    tags: ["wooden", "gypsum", "bedroom", "ceiling", "cove", "led"],
  },
  {
    id: "bedroom-ceiling-07",
    title: "Soft Indirect LED Glow Bedroom False Ceiling",
    category: "Bedroom Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1000&q=85",
    tags: ["indirect led", "glow", "bedroom", "false ceiling", "cove"],
  },

  // ================= PVC WALL PANELS (7) =================
  {
    id: "pvc-wall-01",
    title: "Wooden Fluted PVC & WPC Accent Wall Panel",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=85",
    tags: ["pvc", "wpc", "wooden", "fluted", "wall panel", "louvers", "accent wall"],
  },
  {
    id: "pvc-wall-02",
    title: "Luxury TV Unit Wall with Wooden PVC Louvers & Marble Sheet",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=85",
    tags: ["tv unit", "tv wall", "pvc", "wooden", "louvers", "marble sheet", "uv sheet", "wall panel"],
  },
  {
    id: "pvc-wall-03",
    title: "Textured Wood-Grain PVC Panel Living Room Feature Wall",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    tags: ["pvc", "wooden", "wall panel", "feature wall", "living room", "wpc"],
  },
  {
    id: "pvc-wall-04",
    title: "Modern Floating TV Console & Vertical PVC Louver Wall",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
    tags: ["tv unit", "console", "vertical louvers", "pvc", "wall panel", "hall"],
  },
  {
    id: "pvc-wall-05",
    title: "Bedroom Bed-Back Wooden WPC & PVC Fluted Paneling",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85",
    tags: ["bed back", "bedroom", "wooden", "wpc", "pvc", "wall panel"],
  },
  {
    id: "pvc-wall-06",
    title: "Warm Walnut PVC Wall Cladding & Ambient Lighting",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
    tags: ["walnut", "cladding", "pvc", "wall panel", "wooden", "interior"],
  },
  {
    id: "pvc-wall-07",
    title: "UV Marble & Charcoal PVC Louver Entertainment Wall",
    category: "PVC Wall Panels",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    tags: ["uv marble", "charcoal", "pvc", "louvers", "tv unit", "wall panel"],
  },

  // ================= PVC CEILING (5) =================
  {
    id: "pvc-ceiling-01",
    title: "Waterproof Wooden & White PVC False Ceiling with Spotlights",
    category: "PVC Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
    tags: ["pvc ceiling", "pvc", "waterproof", "spotlights", "false ceiling", "kitchen", "balcony"],
  },
  {
    id: "pvc-ceiling-02",
    title: "Modern Slatted Wood-Finish PVC Ceiling & Dining Space",
    category: "PVC Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
    tags: ["pvc ceiling", "pvc", "wooden", "slatted", "false ceiling", "dining"],
  },
  {
    id: "pvc-ceiling-03",
    title: "Moisture-Resistant Kitchen & Utility PVC Panel Ceiling",
    category: "PVC Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85",
    tags: ["kitchen", "moisture resistant", "pvc ceiling", "pvc", "waterproof", "ceiling"],
  },
  {
    id: "pvc-ceiling-04",
    title: "Teak-Tone PVC Plank False Ceiling with Warm Downlights",
    category: "PVC Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    tags: ["teak", "plank", "pvc ceiling", "downlights", "false ceiling"],
  },
  {
    id: "pvc-ceiling-05",
    title: "Clean Gloss White & Wood Border PVC Ceiling Design",
    category: "PVC Ceiling",
    imageUrl: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1000&q=85",
    tags: ["white", "wood border", "pvc ceiling", "pvc", "living room"],
  },

  // ================= COMMERCIAL & OFFICE (5) =================
  {
    id: "commercial-office-01",
    title: "Corporate Office Linear LED & Gypsum Grid Ceiling",
    category: "Commercial & Office",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85",
    tags: ["commercial", "office", "linear led", "gypsum", "grid", "showroom", "shop", "ceiling"],
  },
  {
    id: "commercial-office-02",
    title: "Modern Showroom & Workspace Acoustic False Ceiling",
    category: "Commercial & Office",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
    tags: ["commercial", "office", "showroom", "workspace", "false ceiling", "led"],
  },
  {
    id: "commercial-office-03",
    title: "Executive Cabin & Conference Room POP Cove Ceiling",
    category: "Commercial & Office",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=85",
    tags: ["conference", "cabin", "office", "commercial", "pop", "cove"],
  },
  {
    id: "commercial-office-04",
    title: "Retail Store & Reception Louvered Ceiling & Wall Panel",
    category: "Commercial & Office",
    imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1000&q=85",
    tags: ["retail", "shop", "reception", "commercial", "office", "ceiling"],
  },
  {
    id: "commercial-office-05",
    title: "Co-Working Studio Recessed Lighting & Gypsum Ceiling",
    category: "Commercial & Office",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=85",
    tags: ["studio", "coworking", "office", "commercial", "gypsum", "lighting"],
  },
];

async function fetchVerifiedPexelsInteriors(
  query: string,
  category: string,
): Promise<OnlineDesignItem[]> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return [];

  try {
    const cleanQuery = query || (category !== "All" ? category : "false ceiling interior");
    const interiorQuery = `${cleanQuery} room interior`;
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(interiorQuery)}&per_page=16&orientation=landscape`,
      {
        headers: { Authorization: pexelsKey },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const bannedWords = /outdoor|exterior|street|building|car|sky|bridge|beach|ocean|mountain/i;

    return (json.photos || [])
      .filter((p: { alt?: string }) => p.alt && !bannedWords.test(p.alt))
      .map((p: { id: number; alt: string; photographer?: string; src: { large: string } }) => ({
        id: `pexels-${p.id}`,
        title: p.alt,
        category: category !== "All" ? category : "Interior Design",
        imageUrl: p.src.large,
        photographer: p.photographer,
        tags: [cleanQuery.toLowerCase()],
      }));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "All").trim();

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const inCategory = VERIFIED_INTERIOR_DESIGNS.filter(
    (item) => category === "All" || item.category === category,
  );

  // Score matching items within selected category
  const scored = inCategory
    .map((item) => {
      if (words.length === 0) return { item, score: 1 };

      const titleLower = item.title.toLowerCase();
      const catLower = item.category.toLowerCase();
      const tagsLower = item.tags.join(" ").toLowerCase();

      let score = 0;
      for (const w of words) {
        if (titleLower.includes(w)) score += 4;
        else if (catLower.includes(w)) score += 3;
        else if (tagsLower.includes(w)) score += 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  const extraOnline = query ? await fetchVerifiedPexelsInteriors(query, category) : [];

  const seen = new Set<string>();
  const finalItems: OnlineDesignItem[] = [];
  for (const item of [...scored, ...extraOnline]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      finalItems.push(item);
    }
  }

  // If user searched something and got fewer than 8 options, pad with more verified designs from the same category (or related interior designs) so user always gets rich visual choices (8 to 16 cards)
  if (finalItems.length < 8) {
    const pool = category !== "All" ? inCategory : VERIFIED_INTERIOR_DESIGNS;
    for (const item of pool) {
      if (finalItems.length >= 12) break;
      if (!seen.has(item.id)) {
        seen.add(item.id);
        finalItems.push(item);
      }
    }
  }

  return NextResponse.json({
    items: finalItems.slice(0, 16),
    source: "verified-interior",
  });
}