import type { MetadataRoute } from "next";

const siteUrl = "https://www.muhammedtankilic.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/giris",
          "/kayit",
          "/hesabim",
          "/hesabim/duzenle",
          "/sifremi-unuttum",
          "/yeni-sifre",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}