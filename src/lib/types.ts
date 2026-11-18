export type ImageKind = "gallery" | "before" | "after";

export type ProjectImage = {
  id: string;
  storage_path: string;
  kind: ImageKind;
  alt_text: string | null;
  sort_order: number;
};

export type DesignImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  cover_image_path: string | null;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  description: string | null;
  completed_on: string | null;
  video_url: string | null;
  is_featured: boolean;
  service_id: string | null;
  services: { title: string; slug: string } | null;
  project_images: ProjectImage[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  kind: "service" | "room" | "type" | "style" | "other";
};

export type Design = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_path: string | null;
  service_id: string | null;
  is_featured: boolean;
  design_images: DesignImage[];
  design_category_links: { design_categories: Category | null }[];
};

export type Review = {
  id: string;
  reviewer_name: string;
  reviewer_location: string | null;
  rating: number;
  body: string;
  created_at: string;
  projects: { title: string; slug: string } | null;
  review_images: { storage_path: string }[];
};

export type Inspiration = {
  id: string;
  title: string;
  image_path: string | null;
  embed_url: string | null;
  license_type: "own_image" | "licensed" | "permitted_embed" | "permission_granted";
  source_name: string | null;
  source_url: string | null;
  attribution: string | null;
};

export type Faq = { id: string; question: string; answer: string };
export type ServiceArea = { id: string; name: string };
