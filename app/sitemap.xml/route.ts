export const dynamic = "force-static";

const siteUrl = "https://www.muhammedtankilic.com";

const pages = [
  {
    path: "",
    priority: "1.0",
  },
  {
    path: "/sarkilarim",
    priority: "0.9",
  },
  {
    path: "/coverlarim",
    priority: "0.8",
  },
  {
    path: "/fotograflar",
    priority: "0.8",
  },
  {
    path: "/hakkinda",
    priority: "0.8",
  },
  {
    path: "/iletisim",
    priority: "0.7",
  },
];

export function GET() {
  const lastModified = "2026-06-20";

  const urls = pages
    .map((page) => {
      return `
  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}