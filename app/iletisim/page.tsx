import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "İletişim | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç ile müzik, yayın, video ve iş birliği talepleri için iletişime geçin.",
};

const contactLinks = [
  {
    title: "Instagram",
    description: "Güncel paylaşımlar, kısa videolar ve duyurularım.",
    buttonLabel: "Instagram",
    href: "https://www.instagram.com/muhammedtanklc?igsh=MWdna211cTJwY2FpNA==",
    tone: "default",
  },
  {
    title: "YouTube",
    description: "Cover yorumlarım, performanslarım ve video içeriklerim.",
    buttonLabel: "YouTube",
    href: "https://www.youtube.com/@Muhammedtanklc",
    tone: "default",
  },
  {
    title: "Spotify",
    description: "Resmi yayınlarımı ve şarkılarımı dinlemek için.",
    buttonLabel: "Spotify",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
    tone: "default",
  },
  {
    title: "Apple Music",
    description: "Zef Cara ve resmi müzik yayınlarım için.",
    buttonLabel: "Apple Music",
    href: "https://music.apple.com/us/album/zef-cara-single/1779404301",
    tone: "default",
  },
  {
    title: "E-posta",
    description: "Müzik, yayın, görsel ve iş birliği talepleri için.",
    buttonLabel: "E-posta",
    href: "mailto:muhammedtnklc@gmail.com",
    tone: "mail",
  },
];

const requestTypes = [
  "Müzik ve yayın talepleri",
  "Cover / video iş birlikleri",
  "Görsel, basın ve genel iletişim",
];

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-5 md:pt-7">
        <div className="grid gap-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
          <section className="relative flex h-full overflow-hidden rounded-[34px] border border-white/18 bg-[#4B232D] p-7 text-white shadow-[0_24px_70px_rgba(75,35,45,0.18)] md:p-8">
            <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-[#F5AE50]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-[#BDEBE8]/12 blur-3xl" />

            <div className="relative flex w-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/66">
                  İletişim
                </p>

                <h1 className="mt-4 max-w-xl text-[clamp(38px,4.4vw,62px)] font-semibold leading-[0.94] tracking-[-0.085em]">
                  Benimle iletişime geç.
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-8 text-white/72">
                  Şarkılarım, cover yorumlarım, dijital yayınlarım ve müzik
                  üretimime dair iş birliği talepleri için benimle iletişime
                  geçebilirsin.
                </p>

                <div className="mt-7 rounded-[26px] border border-white/16 bg-white/10 p-5 backdrop-blur-[14px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/54">
                    Ana iletişim
                  </p>

                  <a
                    href="mailto:muhammedtnklc@gmail.com"
                    className="mt-3 block text-lg font-medium tracking-[-0.035em] text-white transition hover:text-[#F5AE50]"
                  >
                    muhammedtnklc@gmail.com
                  </a>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {requestTypes.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-white/14 bg-white/8 px-4 py-4 text-sm font-medium leading-6 text-white/76 backdrop-blur-[12px]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/coverlarim"
                  className="pill-button light !min-h-12 !w-full !justify-center !px-6"
                >
                  Coverlarım
                </Link>

                <Link
  href="/sarkilarim"
  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
>
  Şarkılarım
</Link>
              </div>
            </div>
          </section>

          <section className="flex h-full flex-col rounded-[34px] border border-white/35 bg-white/58 p-6 shadow-[0_22px_64px_rgba(75,35,45,0.10)] backdrop-blur-[16px] md:p-7">
            <div>
              <p className="section-eyebrow">Kanallarım</p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4B232D]/68">
                Sosyal medya, dijital müzik platformları ve doğrudan iletişim
                kanallarım.
              </p>
            </div>

            <div className="mt-5 grid flex-1 gap-3">
              {contactLinks.map((item) => {
                const isMail = item.tone === "mail";

                return (
                  <article
                    key={item.title}
                    className={[
                      "rounded-[24px] border px-5 py-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] transition hover:-translate-y-0.5",
                      isMail
                        ? "border-[#F5AE50]/28 bg-[#FFF4BC]/72 hover:bg-[#FFF4BC]/82"
                        : "border-white/42 bg-white/62 hover:bg-white/74",
                    ].join(" ")}
                  >
                    <div className="flex h-full items-center justify-between gap-4">
                      <div>
                        <h2 className="text-[clamp(22px,2.1vw,30px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                          {item.title}
                        </h2>

                        <p className="mt-2 max-w-md text-xs leading-6 text-[#4B232D]/62">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          item.href.startsWith("mailto:")
                            ? undefined
                            : "noreferrer"
                        }
                        className={[
                          "pill-button shrink-0 !min-h-9 !w-[124px] !justify-center !px-4 !py-2 !text-xs",
                          isMail ? "dark" : "accent",
                        ].join(" ")}
                      >
                        {item.buttonLabel}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>İletişim · Müzik · İş birliği</span>
      </footer>
    </main>
  );
}