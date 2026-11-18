import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shreekrishnaenterprises.in";
  const routes = [
    "",
    "/services",
    "/projects",
    "/designs",
    "/about",
    "/reviews",
    "/contact",
    "/quote",
    "/custom-design",
    "/inspiration",
    "/faq",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/designs" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/services" || route === "/designs" ? 0.9 : 0.7,
  }));
}
