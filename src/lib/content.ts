import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Category,
  Design,
  Faq,
  Inspiration,
  Project,
  Review,
  Service,
  ServiceArea,
} from "@/lib/types";

/**
 * Read-only queries for the public website.
 * They use the anonymous key, so the database (RLS) only returns published/approved rows.
 * `failed` is true when the database could not be reached, so pages can show an error
 * instead of pretending there is no content.
 */
export type Result<T> = { data: T; failed: boolean };

async function run<T>(
  empty: T,
  query: (sb: SupabaseClient) => PromiseLike<{ data: unknown; error: unknown }>,
): Promise<Result<T>> {
  const sb = createPublicClient();
  if (!sb) return { data: empty, failed: false }; // Supabase not connected yet: behave as empty
  try {
    const { data, error } = await query(sb);
    if (error) return { data: empty, failed: true };
    return { data: (data ?? empty) as T, failed: false };
  } catch {
    return { data: empty, failed: true };
  }
}

export const byOrder = <T extends { sort_order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.sort_order - b.sort_order);

// ---------- Services ----------
const SERVICE_COLS = "id, slug, title, short_description, description, cover_image_path";

export const getServices = () =>
  run<Service[]>([], (sb) =>
    sb.from("services").select(SERVICE_COLS).eq("is_published", true).order("sort_order"),
  );

export const getService = cache((slug: string) =>
  run<Service | null>(null, (sb) =>
    sb.from("services").select(SERVICE_COLS).eq("slug", slug).eq("is_published", true).maybeSingle(),
  ),
);

// ---------- Projects ----------
const PROJECT_COLS =
  "id, slug, title, location, description, completed_on, video_url, is_featured, service_id, " +
  "services(title, slug), project_images(id, storage_path, kind, alt_text, sort_order)";

export const getProjects = () =>
  run<Project[]>([], (sb) =>
    sb
      .from("projects")
      .select(PROJECT_COLS)
      .eq("is_published", true)
      .order("completed_on", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(200),
  );

export const getProject = cache((slug: string) =>
  run<Project | null>(null, (sb) =>
    sb.from("projects").select(PROJECT_COLS).eq("slug", slug).eq("is_published", true).maybeSingle(),
  ),
);

/** Best photo for a project card: first gallery image, else an "after" image. */
export function projectCover(p: Project): { path: string; alt: string } | null {
  const imgs = byOrder(p.project_images ?? []);
  const pick =
    imgs.find((i) => i.kind === "gallery") ?? imgs.find((i) => i.kind === "after") ?? imgs[0];
  return pick ? { path: pick.storage_path, alt: pick.alt_text || p.title } : null;
}

// ---------- Designs ----------
const DESIGN_COLS =
  "id, slug, title, description, cover_image_path, service_id, is_featured, " +
  "design_images(id, storage_path, alt_text, sort_order), " +
  "design_category_links(design_categories(id, slug, name, kind))";

export const getDesigns = () =>
  run<Design[]>([], (sb) =>
    sb
      .from("designs")
      .select(DESIGN_COLS)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(500),
  );

export const getDesign = cache((slug: string) =>
  run<Design | null>(null, (sb) =>
    sb.from("designs").select(DESIGN_COLS).eq("slug", slug).eq("is_published", true).maybeSingle(),
  ),
);

export const getCategories = () =>
  run<Category[]>([], (sb) =>
    sb.from("design_categories").select("id, slug, name, kind").order("sort_order"),
  );

export const categoriesOf = (d: Design): Category[] =>
  (d.design_category_links ?? [])
    .map((l) => l.design_categories)
    .filter((c): c is Category => Boolean(c));

export function designCover(d: Design): { path: string; alt: string } | null {
  if (d.cover_image_path) return { path: d.cover_image_path, alt: d.title };
  const first = byOrder(d.design_images ?? [])[0];
  return first ? { path: first.storage_path, alt: first.alt_text || d.title } : null;
}

// ---------- Reviews, areas, FAQ, inspiration ----------
export const getApprovedReviews = (limit = 50) =>
  run<Review[]>([], (sb) =>
    sb
      .from("reviews")
      .select(
        "id, reviewer_name, reviewer_location, rating, body, created_at, projects(title, slug), review_images(storage_path)",
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit),
  );

export const getServiceAreas = () =>
  run<ServiceArea[]>([], (sb) =>
    sb.from("service_areas").select("id, name").eq("is_active", true).order("sort_order"),
  );

export const getFaqs = () =>
  run<Faq[]>([], (sb) =>
    sb.from("faqs").select("id, question, answer").eq("is_published", true).order("sort_order"),
  );

export const getInspiration = () =>
  run<Inspiration[]>([], (sb) =>
    sb
      .from("inspiration_sources")
      .select("id, title, image_path, embed_url, license_type, source_name, source_url, attribution")
      .eq("is_published", true)
      .eq("usage_permission_confirmed", true)
      .order("created_at", { ascending: false })
      .limit(100),
  );

// ---------- Sitemap ----------
type SlugRow = { slug: string; updated_at: string };
export const getSlugs = async () => {
  const [services, projects, designs] = await Promise.all([
    run<SlugRow[]>([], (sb) => sb.from("services").select("slug, updated_at").eq("is_published", true)),
    run<SlugRow[]>([], (sb) => sb.from("projects").select("slug, updated_at").eq("is_published", true)),
    run<SlugRow[]>([], (sb) => sb.from("designs").select("slug, updated_at").eq("is_published", true)),
  ]);
  return { services: services.data, projects: projects.data, designs: designs.data };
};
