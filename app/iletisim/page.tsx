import type { Metadata } from "next";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "İletişim | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç ile müzik, yayın, video ve iş birliği talepleri için iletişime geçin.",
};

const email = "muhammedtnklc@gmail.com";

const gmailComposeUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=muhammedtnklc@gmail.com&su=%C4%B0leti%C5%9Fim%20Talebi";

const aboutPoints = [
  "Kürtçe şarkılarımı, bestelerimi ve yorumlarımı paylaşıyorum.",
  "Resmi yayınlarım Spotify ve Apple Music’te yer alıyor.",
  "Yayın, video, görsel ve iş birliği için bana yazabilirsin.",
];

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

const orangeActionButtonClass = `${baseActionButtonClass} bg-[#F5AE50]/90 shadow-[0_10px_22px_rgba(245,174,80,0.18)] hover:bg-[#F5AE50]`;

const burgundyActionButtonClass = `${baseActionButtonClass} bg-[#4B232D] hover:bg-[#5b2b37]`;

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-12">
        <section className="relative overflow-hidden rounded-[24px] border border-white/35 bg-white/66 px-3.5 py-4 shadow-[0_14px_38px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:rounded-[38px] md:px-10 md:py-10 lg:px-12 lg:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(245,174,80,0.10),transparent_32%)]" />

          <div className="relative mx-auto max-w-7xl">
            <header className="mx-auto text-center">
              <p className="section-eyebrow mb-0">İletişim</p>
            </header>

            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[18px] border border-[#4B232D]/10 bg-white/76 px-3 text-center text-[14px] font-medium tracking-[-0.03em] text-[#4B232D] shadow-[0_8px_24px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:bg-white/85 hover:text-[#F5AE50] md:mt-7 md:min-h-14 md:rounded-[24px] md:px-6 md:text-lg"
            >
              {email}
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2 md:mt-5 md:gap-4">
              <Link href="/" className={orangeActionButtonClass}>
                <span className="!text-white">← Menü</span>
              </Link>

              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className={burgundyActionButtonClass}
              >
                <span className="!text-white">Mail At</span>
              </a>

              <Link href="/sarkilarim" className={orangeActionButtonClass}>
                <span className="!text-white">Şarkılar →</span>
              </Link>
            </div>

            <ul className="mt-4 grid gap-2 text-[12px] leading-5 text-[#4B232D]/78 md:mt-8 md:grid-cols-3 md:gap-4 md:text-sm md:leading-7">
              {aboutPoints.map((item) => (
                <li
                  key={item}
                  className="grid min-h-[64px] grid-cols-[8px_1fr] items-start gap-2 rounded-[17px] border border-white/42 bg-white/62 px-3.5 py-3 shadow-[0_8px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px] md:min-h-[108px] md:grid-cols-[10px_1fr] md:gap-3 md:rounded-[24px] md:px-5 md:py-5"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#F5AE50]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-4 gap-2 md:mt-6 md:gap-4">
              {platformLinks.map(({ title, href, Icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={title}
                  title={title}
                  className="group flex min-h-12 items-center justify-center rounded-[18px] border border-white/42 bg-white/72 text-[#4B232D] shadow-[0_8px_22px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] hover:text-[#4B232D] md:min-h-16 md:rounded-[24px]"
                >
                  <Icon className="text-[22px] transition group-hover:scale-110 md:text-[30px]" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}