import Link from "next/link";
import Navbar from "@/components/Navbar";

const contactLinks = [
  {
    title: "E-posta",
    description: "Müzik, iş birliği ve iletişim talepleri için.",
    href: "mailto:muhammedtnklc@gmail.com",
    label: "E-posta Gönder",
  },
  {
    title: "YouTube",
    description: "Videolar, performanslar ve yeni yayınlar için.",
    href: "https://www.youtube.com/",
    label: "YouTube’a Git",
  },
  {
    title: "Spotify",
    description: "Yayımlanan şarkıları dinlemek için.",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
    label: "Spotify’da Dinle",
  },
];

export default function IletisimPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="dark-card p-5 md:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              İletişim
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Müzik ve iş birlikleri için ulaş.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Konser, kayıt, video, dijital yayın ve iş birliği talepleri için
              iletişim kanalları.
            </p>

            <div className="mt-5 rounded-[25px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-bold text-white">Ana iletişim</p>

              <a
                href="mailto:muhammedtnklc@gmail.com"
                className="mt-2 block wrap-break-word text-sm leading-7 text-white/72 hover:text-white"
              >
                muhammedtnklc@gmail.com
              </a>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <p className="section-eyebrow mb-2">Kanallar</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Bağlantılar
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Sosyal medya, dijital müzik platformları ve doğrudan iletişim
              kanalları.
            </p>

            <div className="mt-5 grid gap-3">
              {contactLinks.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[25px] border border-[rgba(75,35,45,0.08)] bg-white/55 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                        {item.description}
                      </p>
                    </div>

                    <a
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={
                        item.href.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="pill-button !min-h-9 !px-4 !py-2 !text-xs w-fit shrink-0"
                    >
                      {item.label}
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/sarkilarim" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                Şarkılara Git
              </Link>

              <Link href="/" className="pill-button dark !min-h-9 !px-4 !py-2 !text-xs">
                Ana Sayfa
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}