import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://talent.innomium.com";
  const routes = [
    "",
    "/for-clients",
    "/for-talent",
    "/talents",
    "/competitions",
    "/trust",
    "/apply",
    "/login",
    "/signup",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
