export const dynamic = "force-static";

export function GET() {
  const robots = `User-agent: *
Allow: /

Disallow: /auth/
Disallow: /giris
Disallow: /kayit
Disallow: /hesabim
Disallow: /hesabim/duzenle
Disallow: /sifremi-unuttum
Disallow: /yeni-sifre

Sitemap: https://www.muhammedtankilic.com/sitemap.xml
`;

  return new Response(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}