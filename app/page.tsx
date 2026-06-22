import Link from "next/link";
import Navbar from "@/components/Navbar";
import { latestSong } from "@/lib/data/songs";

const homeLinks = [
  {
    title: "Şarkılarım",
    description: "Resmi yayınlarım ve bestelerim.",
    href: "/sarkilarim",
  },
  {
    title: "Coverlarım",
    description: "YouTube ve Instagram yorumlarım.",
    href: "/coverlarim",
  },
  {
    title: "Fotoğraflarım",
    description: "Portrelerim ve görsel arşivim.",
    href: "/fotograflar",
  },
  {
    title: "İletişim",
    description: "Müzik, yayın ve iş birliği.",
    href: "/iletisim",
  },
];

const spotifyEmbedUrl =
  "https://open.spotify.com/embed/track/7B5SGhv7YD7opodmyJQQqm?utm_source=generator";

export default function Home() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-1 md:pt-4">
        <article className="relative flex min-h-[490px] flex-col justify-end sm:min-h-[600px] md:min-h-[calc(100vh-132px)]">
          <div className="rounded-[22px] border border-white/28 bg-white/14 p-2 shadow-[0_16px_44px_rgba(75,35,45,0.08)] backdrop-blur-[16px] sm:p-3 md:rounded-[28px] md:p-4">
            <div className="grid gap-2 md:gap-3 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex min-h-[112px] flex-col justify-between rounded-[18px] border border-white/22 bg-white/10 px-4 py-3.5 sm:min-h-[148px] sm:rounded-[22px] sm:px-5 sm:py-4">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#4B232D]/58 sm:text-[10px] sm:tracking-[0.22em]">
                    Yeni Şarkım Çıktı
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:mt-3 sm:gap-x-3">
                    <h1 className="text-[clamp(24px,7.4vw,32px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D] md:text-[clamp(24px,2.7vw,38px)]">
                      {latestSong.title}
                    </h1>

                    <span className="text-[11px] font-medium text-[#4B232D]/68 sm:text-sm">
                      {latestSong.artist}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                  <Link
                    href={`/sarkilarim/${latestSong.slug}`}
                    className="rounded-full border border-[#4B232D]/12 bg-white/76 px-4 py-2 text-[11px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90 sm:text-[12px]"
                  >
                    Şarkı Detayı
                  </Link>

                  <Link
                    href="/sarkilarim"
                    className="rounded-full border border-[#4B232D]/12 bg-white/76 px-4 py-2 text-[11px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90 sm:text-[12px]"
                  >
                    Tüm Şarkılarım
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[18px] border border-white/22 bg-white/10 sm:rounded-[22px]">
                <iframe
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block h-[152px] w-full border-0"
                  title={`${latestSong.title} Spotify oynatıcı`}
                />
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[24px] border border-white/35 bg-white/60 px-5 py-6 text-center shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:px-10 md:py-9">
          <p className="section-eyebrow">Benim Hikayem ve Misyonum</p>

          <h2 className="mx-auto max-w-3xl text-[clamp(25px,7.2vw,34px)] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(34px,3vw,46px)]">
            Tutkum Kürt Müziği için Modern, Sade ve Güçlü Şarkılar Üretmek.
          </h2>

          <div className="mx-auto mt-5 grid max-w-3xl gap-3 text-center text-[12px] leading-7 text-[#4B232D]/72 md:mt-6 md:text-sm md:leading-8">
            <p>
              Benim müzik yolculuğum, Kürtçe şarkıları hem duygusunu koruyan
              hem de bugünün dinleme alışkanlıklarına uyum sağlayan modern bir
              formda üretme isteğiyle şekilleniyor.
            </p>

            <p>
              Amacım; akustik sıcaklığı, anlaşılır sözleri ve kulağa hoş gelen
              melodileri bir araya getirerek Kürt müziğine yeni, sade ve samimi
              şarkılar kazandırmak.
            </p>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[24px] border border-white/35 bg-white/60 p-3.5 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-6">
          <div className="mb-3 text-center md:mb-5">
            <p className="section-eyebrow mb-0">Müzik Arşivim</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {homeLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[96px] flex-col justify-between rounded-[18px] border border-white/42 bg-white/66 p-3.5 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] transition hover:-translate-y-0.5 hover:bg-white/78 md:min-h-[132px] md:rounded-[24px] md:p-5"
              >
                <h2 className="text-[18px] font-semibold leading-none tracking-[-0.06em] text-[#4B232D] md:text-[28px]">
                  {item.title}
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-[#4B232D]/64 md:text-[13px] md:leading-6">
                  {item.description}
                </p>

                <span className="mt-3 inline-flex min-h-8 items-center justify-center rounded-full bg-[#F5AE50] px-3 text-[10.5px] font-bold leading-none text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.20)] md:min-h-9 md:text-[12px]">
                  Aç
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}