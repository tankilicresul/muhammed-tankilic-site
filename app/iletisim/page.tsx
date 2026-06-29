import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "İletişim | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç ile müzik, yayın, video ve iş birliği talepleri için iletişime geçin.",
};

const aboutPoints = [
  "Kürtçe şarkılarımı, bestelerimi ve yorumlarımı paylaşıyorum.",
  "Resmi yayınlarım Spotify ve Apple Music’te yer alıyor.",
  "Yayın, video, görsel ve iş birliği için bana yazabilirsin.",
];

const platformLinks = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/muhammedtanklc?igsh=MWdna211cTJwY2FpNA==",
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@Muhammedtanklc",
  },
  {
    title: "Spotify",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
  },
  {
    title: "Apple Music",
    href: "https://music.apple.com/us/album/zef-cara-single/1779404301",
  },
];

const actionButtonClass =
  "inline-flex min-h-9 w-full items-center justify-center rounded-full px-2 text-center text-[11px] font-bold leading-none tracking-[-0.015em] transition md:min-h-12 md:px-6 md:text-sm";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-12">
        <section className="relative overflow-hidden rounded-[22px] border border-white/35 bg-white/66 px-3.5 py-4 shadow-[0_14px_38px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:rounded-[38px] md:px-10 md:py-10 lg:px-12 lg:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(245,174,80,0.10),transparent_32%)]" />

          <div className="relative mx-auto max-w-7xl">
            <header className="mx-auto text-center">
              <p className="section-eyebrow mb-0">İletişim</p>
            </header>

            <a
              href="mailto:muhammedtnklc@gmail.com"
              className="mt-4 flex min-h-10 w-full items-center justify-center rounded-[16px] border border-[#4B232D]/10 bg-white/72 px-3 text-center text-[12px] font-medium tracking-[-0.025em] text-[#4B232D] shadow-[0_8px_24px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:bg-white/80 hover:text-[#F5AE50] md:mt-7 md:min-h-14 md:rounded-[24px] md:px-6 md:text-lg"
            >
              muhammedtnklc@gmail.com
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2 md:mt-5 md:gap-4">
              <Link
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_10px_22px_rgba(75,35,45,0.10)] hover:-translate-y-0.5 hover:bg-[#f7bb67]`}
              >
                ← Menü
              </Link>

              <a
                href="mailto:muhammedtnklc@gmail.com"
                className={`${actionButtonClass} bg-[#4B232D] !text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] hover:-translate-y-0.5 hover:bg-[#5a2b36]`}
              >
                Mail At
              </a>

              <Link
                href="/sarkilarim"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_10px_22px_rgba(75,35,45,0.10)] hover:-translate-y-0.5 hover:bg-[#f7bb67]`}
              >
                Şarkılarım
              </Link>
            </div>

            <ul className="mt-4 grid gap-2 text-[11.5px] leading-5 text-[#4B232D]/76 md:mt-8 md:grid-cols-3 md:gap-4 md:text-[13px] md:leading-7">
              {aboutPoints.map((item) => (
                <li
                  key={item}
                  className="grid min-h-[60px] grid-cols-[8px_1fr] items-start gap-2 rounded-[16px] border border-white/42 bg-white/60 px-3.5 py-3 shadow-[0_8px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px] md:min-h-[118px] md:grid-cols-[10px_1fr] md:gap-3 md:rounded-[24px] md:px-5 md:py-5"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#F5AE50]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 grid grid-cols-2 gap-2 md:mt-6 md:gap-4">
              {platformLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-[70px] flex-col items-center justify-between rounded-[16px] border border-white/42 bg-white/68 p-2.5 text-center shadow-[0_8px_24px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:-translate-y-0.5 hover:bg-white/78 md:min-h-[118px] md:rounded-[24px] md:p-5"
                >
                  <h2 className="w-full text-center text-[14px] font-semibold leading-none tracking-[-0.045em] text-[#4B232D] md:text-[28px]">
                    {item.title}
                  </h2>

                  <span className="inline-flex min-h-8 w-full items-center justify-center rounded-full bg-[#F5AE50] px-2 text-center text-[11px] font-bold leading-none tracking-[-0.015em] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.20)] transition group-hover:bg-[#f7bb67] md:min-h-9 md:text-sm">
                    Aç
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}