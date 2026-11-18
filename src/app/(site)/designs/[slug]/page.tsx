import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { DesignCard } from "@/components/shared/cards";
import { FavouriteButton } from "@/components/shared/favourite-button";
import { ItemImage } from "@/components/shared/item-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { ShareButton } from "@/components/shared/share-button";
import { WhatsAppLink } from "@/components/shared/contact-buttons";
import { getBusinessSettings } from "@/lib/business-settings";
import { byOrder, categoriesOf, designCover, getDesign, getDesigns } from "@/lib/content";
import { publicMediaUrl } from "@/lib/storage";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: design } = await getDesign(slug);
  if (!design) return { title: "Design not found" };
  return pageMetadata({
    title: design.title,
    description: design.description?.slice(0, 160) ?? `${design.title}: POP and PVC design by Shree Krishna Enterprises.`,
    path: `/designs/${design.slug}`,
    image: publicMediaUrl(designCover(design)?.path),
  });
}

export default async function DesignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, result] = await Promise.all([getBusinessSettings(), getDesign(slug)]);
  if (!result.data) notFound();
  const d = result.data;
  const path = `/designs/${d.slug}`;

  // All photos: cover first, then the rest without repeating the cover.
  const cover = designCover(d);
  const extra = byOrder(d.design_images ?? []).filter((i) => i.storage_path !== cover?.path);
  const photos = [
    ...(cover ? [{ id: "cover", path: cover.path, alt: cover.alt }] : []),
    ...extra.map((i) => ({ id: i.id, path: i.storage_path, alt: i.alt_text || d.title })),
  ];

  const cats = categoriesOf(d);
  const all = await getDesigns();
  const catSlugs = new Set(cats.map((c) => c.slug));
  const related = all.data
    .filter((o) => o.id !== d.id && categoriesOf(o).some((c) => catSlugs.has(c.slug)))
    .slice(0, 3);

  return (
    <>
      <Section>
        <Link href="/designs" className="text-stone underline hover:text-charcoal">
          All designs
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {photos.length === 0 ? (
              <ItemImage path={null} alt={d.title} className="aspect-[4/3]" />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {photos.map((p, i) => (
                  <li key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
                    <ItemImage
                      path={p.path}
                      alt={p.alt}
                      className="aspect-[4/3]"
                      sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
                      priority={i === 0}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h1 className="text-4xl text-charcoal sm:text-5xl">{d.title}</h1>
            {cats.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/designs?cat=${encodeURIComponent(c.slug)}`}
                      className="inline-flex h-9 items-center rounded-sm border border-line px-3 text-sm hover:bg-beige"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {d.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal">{d.description}</p>
            ) : null}
            <p className="mt-6 text-sm text-stone">
              Final price depends on the site, material and labour. We give a quotation after reviewing your
              requirements.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <Link href={`/custom-design?design=${encodeURIComponent(d.slug)}`}>Request This Design</Link>
              </Button>
              <WhatsAppLink settings={settings} kind="design" itemName={d.title} path={path} size="lg" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {settings.features.favourites ? <FavouriteButton slug={d.slug} title={d.title} variant="full" /> : null}
              <ShareButton title={d.title} url={`${settings.siteUrl}${path}`} />
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="beige">
          <SectionHeading title="Related designs" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <DesignCard key={r.id} design={r} showFavourite={settings.features.favourites} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
