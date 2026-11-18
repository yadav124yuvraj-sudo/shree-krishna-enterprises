import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { OnlineDesignExplorer } from "@/components/designs/online-design-explorer";
import { getBusinessSettings } from "@/lib/business-settings";
import { categoriesOf, designCover, getDesigns } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getPublicMediaUrl } from "@/lib/supabase/public";
import type { OnlineDesignItem } from "@/app/api/designs/search/route";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "POP & PVC Design Catalog | Search Interior Designs",
  description: "Browse and search hundreds of POP false ceiling, LED cove lighting, and PVC wall panel designs.",
  path: "/designs",
});

export default async function DesignsPage() {
  const [settings, designs] = await Promise.all([getBusinessSettings(), getDesigns()]);

  const adminDesigns: OnlineDesignItem[] = designs.data
    .map((d) => {
      const cover = designCover(d);
      const imageUrl = getPublicMediaUrl(cover?.path ?? null);
      if (!imageUrl) return null;
      const cats = categoriesOf(d);
      return {
        id: d.id,
        title: d.title,
        category: cats[0]?.name || "POP False Ceiling",
        imageUrl,
        tags: [d.title.toLowerCase(), ...cats.map((c) => c.name.toLowerCase())],
      };
    })
    .filter((item): item is OnlineDesignItem => item !== null);

  return (
    <>
      {/* 1. LUXURY DARK HEADER BANNER */}
      <section className="relative overflow-hidden bg-[#161514] py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_60%)]"
        />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Design Gallery &amp; Search
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Explore POP &amp; PVC <span className="text-[#d4af37]">Designs</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Search modern false ceilings, bedroom LED cove layouts, wooden PVC wall panels, and commercial designs—or request a custom design made for your room.
          </p>
        </Container>
      </section>

      {/* 2. INTERACTIVE ONLINE DESIGN SEARCH & GRID */}
      <section className="bg-[#FAF8F5] py-16 text-charcoal sm:py-24">
        <Container>
          <OnlineDesignExplorer
            adminDesigns={adminDesigns}
            whatsappNumber={settings.whatsappNumber}
          />
        </Container>
      </section>

      {/* 3. CUSTOM DESIGN CTA */}
      <section className="bg-[#161514] py-16 text-white">
        <Container className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
              Have a Pinterest or Instagram design in mind?
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Upload any photo from your phone and we will build the exact ceiling or wall panel for you.
            </p>
          </div>
          <Link
            href="/custom-design"
            className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-charcoal shadow-lg transition hover:bg-[#c5a028]"
          >
            Submit Custom Design
          </Link>
        </Container>
      </section>
    </>
  );
}
