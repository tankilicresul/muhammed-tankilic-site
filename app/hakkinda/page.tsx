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

  const archiveCards = [
    {
      eyebrow: text("about.card_1_eyebrow"),
      title: text("about.card_1_title"),
      description: text("about.card_1_description"),
      href: "/sarkilarim",
      button: text("about.card_1_button"),
    },
    {
      eyebrow: text("about.card_2_eyebrow"),
      title: text("about.card_2_title"),
      description: text("about.card_2_description"),
      href: "/coverlarim",
      button: text("about.card_2_button"),
    },
  ];

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/60 p-6 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[16px] md:p-9 lg:p-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(189,235,232,0.25),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(245,174,80,0.12),transparent_32%)]" />

          <div className="relative max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={badge}
                  className={`rounded-full px-4 py-2 text-[11px] font-semibold ${
                    index === 0
                      ? "bg-[#BDEBE8]/78 text-[#4B232D]"
                      : "bg-white/66 text-[#4B232D]/72"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <p className="section-eyebrow">{text("about.eyebrow")}</p>

            <h1 className="max-w-4xl text-[clamp(38px,5.4vw,72px)] font-semibold leading-[0.96] tracking-[-0.08em] text-[#4B232D]">
              {text("about.hero_title")}
            </h1>

            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[#4B232D]/76 md:text-[16px]">
              {text("about.hero_description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sarkilarim" className="pill-button">
                {text("about.primary_button")}
              </Link>

              <Link href="/coverlarim" className="pill-button secondary">
                {text("about.secondary_button")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 lg:grid-cols-2">
          {archiveCards.map((item) => (
            <article
              key={item.eyebrow}
              className="rounded-[32px] border border-white/35 bg-white/58 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8"
            >
              <p className="section-eyebrow">{item.eyebrow}</p>

              <h2 className="text-[clamp(32px,3.6vw,48px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                {item.title}
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[#4B232D]/70">
                {item.description}
              </p>

              <div className="mt-7">
                <Link href={item.href} className="pill-button dark">
                  {item.button}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[30px] border border-white/35 bg-white/54 px-6 py-5 text-center shadow-[0_14px_40px_rgba(75,35,45,0.07)] backdrop-blur-[14px] md:px-8 md:py-6">
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[#4B232D]/72 md:text-[15px]">
            {text("about.bottom_note")}
          </p>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>{text("footer.copyright")}</p>
        <span>{text("footer.about_note")}</span>
      </footer>
    </main>
  );
}
