import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { ItemImage } from "@/components/shared/item-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { CallLink, WhatsAppLink } from "@/components/shared/contact-buttons";
import { getBusinessSettings } from "@/lib/business-settings";
import { byOrder, getProject, projectCover } from "@/lib/content";
import { publicMediaUrl } from "@/lib/storage";
import { pageMetadata } from "@/lib/seo";
import { toEmbedUrl } from "@/lib/video";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return pageMetadata({
    title: project.title,
    description: project.description?.slice(0, 160) ?? `Completed project: ${project.title}.`,
    path: `/projects/${project.slug}`,
    image: publicMediaUrl(projectCover(project)?.path),
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, result] = await Promise.all([getBusinessSettings(), getProject(slug)]);
  if (!result.data) notFound();
  const p = result.data;

  const images = byOrder(p.project_images ?? []);
  const gallery = images.filter((i) => i.kind === "gallery");
  const befores = images.filter((i) => i.kind === "before");
  const afters = images.filter((i) => i.kind === "after");
  const pairs = settings.features.before_after
    ? befores.slice(0, afters.length).map((b, i) => ({ before: b, after: afters[i] }))
    : [];
  const embed = settings.features.video_gallery ? toEmbedUrl(p.video_url) : null;

  const date = p.completed_on
    ? new Date(p.completed_on).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;
  const meta = [p.services?.title, p.location, date].filter(Boolean).join(" · ");

  return (
    <>
      <Section>
        <Link href="/projects" className="text-stone underline hover:text-charcoal">
          All projects
        </Link>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-gold-deep">Our completed work</p>
        <h1 className="mt-2 text-4xl text-charcoal sm:text-5xl">{p.title}</h1>
        {meta ? <p className="mt-3 text-stone">{meta}</p> : null}
        {p.description ? (
          <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-charcoal">{p.description}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/quote">Get Free Quote</Link>
          </Button>
          <WhatsAppLink settings={settings} kind="project" itemName={p.title} path={`/projects/${p.slug}`} size="lg" />
          <CallLink settings={settings} size="lg" />
        </div>
      </Section>

      {pairs.length > 0 ? (
        <Section tone="beige">
          <SectionHeading title="Before and after" description="Drag the handle or use the arrow keys." />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {pairs.map(({ before, after }) => {
              const b = publicMediaUrl(before.storage_path);
              const a = publicMediaUrl(after.storage_path);
              return b && a ? (
                <BeforeAfterSlider
                  key={before.id}
                  beforeSrc={b}
                  afterSrc={a}
                  beforeAlt={before.alt_text || `${p.title} before`}
                  afterAlt={after.alt_text || `${p.title} after`}
                />
              ) : null;
            })}
          </div>
        </Section>
      ) : null}

      {gallery.length > 0 ? (
        <Section>
          <SectionHeading title="Photos" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img, i) => (
              <li key={img.id} className={i === 0 && gallery.length > 2 ? "sm:col-span-2 lg:col-span-2" : ""}>
                <ItemImage
                  path={img.storage_path}
                  alt={img.alt_text || `${p.title} photo ${i + 1}`}
                  className="aspect-[4/3]"
                  priority={i === 0}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {embed ? (
        <Section tone="beige">
          <SectionHeading title="Video" />
          <div className="mt-8 aspect-video max-w-3xl overflow-hidden bg-charcoal">
            <iframe
              src={embed}
              title={`${p.title} video`}
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
        </Section>
      ) : null}
    </>
  );
}
