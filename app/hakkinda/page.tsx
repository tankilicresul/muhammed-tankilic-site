import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getPublicSiteTexts, t } from "@/lib/supabase/site-texts";

export const metadata: Metadata = {
  title: "Hakkında | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın müzik dili, besteleri, cover yorumları ve kişisel sanatçı hikâyesi.",
};

export default async function AboutPage() {
  const { settings } = await getPublicSiteTexts();
  const text = (key: string) => t(settings, key);

  const badges = [
    text("about.badge_1"),
    text("about.badge_2"),
    text("about.badge_3"),
  ].filter(Boolean);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-4 md:pt-8">
        <article className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/55 p-7 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[20px] md:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(189,235,232,0.20),transparent_40%),radial-gradient(circle_at_88%_10%,rgba(245,174,80,0.12),transparent_35%)]" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={badge}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-medium tracking-wide ${
                    index === 0
                      ? "bg-[#BDEBE8]/80 text-[#4B232D]"
                      : "border border-white/40 bg-white/60 text-[#4B232D]/75"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="text-[clamp(36px,4.6vw,62px)] font-light leading-[0.96] tracking-[-0.05em] text-[#4B232D]">
              {text("about.hero_title")}
            </h1>

            <div className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-[#4B232D]/80 md:text-[17px] md:leading-8">
              <p>
                {text("about.hero_description")}
              </p>

              {text("about.card_1_description") ? (
                <p>
                  {text("about.card_1_description")}
                </p>
              ) : null}

              {text("about.card_2_description") ? (
                <p>
                  {text("about.card_2_description")}
                </p>
              ) : null}
            </div>

            {text("about.bottom_note") ? (
              <blockquote className="my-8 rounded-[20px] border-l-2 border-[#F5AE50] bg-white/40 px-5 py-4 text-[14px] italic text-[#4B232D]/85 md:text-[15px]">
                "{text("about.bottom_note")}"
              </blockquote>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/40 pt-6">
              <Link href="/sarkilarim" className="pill-button">
                {text("about.primary_button") || "Bestelerimi Dinle"}
              </Link>

              <Link href="/coverlarim" className="pill-button secondary">
                {text("about.secondary_button") || "Coverlarımı İzle"}
              </Link>

              <Link
                href="/iletisim"
                className="inline-flex min-h-10 items-center px-4 text-[12px] font-medium text-[#4B232D]/70 transition hover:text-[#4B232D]"
              >
                İletişim Talebi →
              </Link>
            </div>
          </div>
        </article>
      </section>

      <footer className="site-container site-footer">
        <p>{text("footer.copyright")}</p>
        <span>{text("footer.about_note")}</span>
      </footer>
    </main>
  );
}
