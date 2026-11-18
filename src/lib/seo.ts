import type { Metadata } from "next";

/** Same metadata shape for every page: title, description, canonical, Open Graph. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noindex?: boolean;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      ...(opts.image ? { images: [{ url: opts.image }] } : {}),
    },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
