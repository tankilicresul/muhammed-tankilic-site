import type { Metadata } from "next";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { getPublicSiteTexts, t } from "@/lib/supabase/site-texts";

export const metadata: Metadata = {
  title: "İletişim | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç ile müzik, yayın, video ve iş birliği talepleri için iletişime geçin.",
};

const platformLinks: {
  title: string;
  href: string;
  Icon: IconType;
}[] = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/muhammedtanklc?igsh=MWdna211cTJwY2FpNA==",
    Icon: FaInstagram,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@Muhammedtanklc",
    Icon: FaYoutube,
  },
  {
    title: "Spotify",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
    Icon: FaSpotify,
  },
  {
    title: "Apple Music",
    href: "https://music.apple.com/us/album/zef-cara-single/1779404301",
    Icon: FaApple,
  },
];

const baseActionButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full px-3 text-center text-[13px] font-bold leading-none tracking-[-0.02em] shadow-[0_12px_26px_rgba(75,35,45,0.16)] transition hover:-translate-y-0.5 md:min-h-12 md:px-6 md:text-base";

const orangeActionButtonClass = `${baseActionButtonClass} bg-[#F5AE50]/90 text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] hover:bg-[#F5AE50]`;

const burgundyActionButtonClass = `${baseActionButtonClass} bg-[#4B232D] text-white hover:bg-[#5b2b37]`;

function getGmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent("İletişim Talebi")}`;
}

export default async function ContactPage() {
  const { settings } = await getPublicSiteTexts();
  const text = (key: string) => t(settings, key);

  const email = text("contact.email");
  const gmailComposeUrl = getGmailComposeUrl(email);
  const aboutPoints = [
    text("contact.point_1"),
    text("contact.point_2"),
    text("contact.point_3"),
  ].filter(Boolean);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-4 md:pt-8">
        <article className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/55 p-7 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[20px] md:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(189,235,232,0.20),transparent_40%),radial-gradient(circle_at_88%_12%,rgba(245,174,80,0.10),transparent_35%)]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#4B232D]/75 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5AE50]" />
              İletişim & İş Birlikleri
            </span>

            <h1 className="mt-4 text-[clamp(36px,4.5vw,58px)] font-light leading-tight tracking-[-0.05em] text-[#4B232D]">
              Birlikte bir ezgi, <span className="font-semibold">yeni bir hikâye.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-[14px] font-light leading-relaxed text-[#4B232D]/75 md:text-[16px]">
              Müzik çalışmaları, konser, sahne ve stüdyo kayıtları veya sanatsal projeler için doğrudan iletişime geçebilirsiniz.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/50 bg-white/85 px-7 text-[13px] font-semibold text-[#4B232D] shadow-[0_6px_18px_rgba(75,35,45,0.04)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-[#F5AE50] sm:w-auto md:text-sm"
              >
                <span>✉</span>
                <span>{email}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-7 text-[13px] font-semibold text-[#4B232D] shadow-[0_8px_20px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7ba65] sm:w-auto md:text-sm"
              >
                E-posta Gönder
              </a>
            </div>

            {aboutPoints.length > 0 ? (
              <div className="mt-10 rounded-[22px] border border-white/35 bg-white/40 p-5 text-left md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4B232D]/55">
                  Çalışma Alanları
                </p>
                <ul className="mt-3 space-y-2 text-[13px] font-light leading-relaxed text-[#4B232D]/80 md:text-[14px]">
                  {aboutPoints.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#F5AE50]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-10 border-t border-white/40 pt-7">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#4B232D]/55">
                Müzik & Sosyal Platformlar
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                {platformLinks.map(({ title, href, Icon }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={title}
                    title={title}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/80 text-[#4B232D] shadow-[0_4px_14px_rgba(75,35,45,0.04)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#F5AE50] hover:text-[#4B232D]"
                  >
                    <Icon className="text-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <footer className="site-container site-footer">
        <p>{text("footer.copyright")}</p>
        <span>{text("footer.credit")}</span>
      </footer>
    </main>
  );
}
