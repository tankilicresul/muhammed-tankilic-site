import type { MetadataRoute } from "next";

const siteUrl = "https://www.muhammedtankilic.com";

const publicRoutes = [
  {
    path: "",
    priority: 1,
  },
  {
    path: "/muzik",
    priority: 0.9,
  },
  {
    path: "/videolar",
    priority: 0.8,
  },
  {
    path: "/fotograflar",
    priority: 0.8,
  },
  {
    path: "/hakkinda",
    priority: 0.8,
  },
  {
    path: "/iletisim",
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}