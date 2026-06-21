import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { latestSong, publishedSongs } from "@/lib/data/songs";

export const metadata: Metadata = {
  title: "Şarkılar | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın Kürtçe şarkıları, akustik yorumları ve dijital müzik platformları.",
};

function getPlatformLabel(name: string) {
  if (name === "Spotify") return "Spotify";
  if (name === "Apple Music") return "Apple Music";
  if (name === "YouTube") return "YouTube";
  return name;
}

export default function MusicPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/52 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(245,174,80,0.14),transparent_30%)]" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  Müzik Arşivi
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Kürtçe Müzik
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Akustik Folk
                </span>
              </div>

              <p className="section-eyebrow">Şarkılar</p>

              <h1 className="max-w-3xl text-[clamp(42px,5.8vw,72px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                Muhammed Tankılıç’ın müzikleri.
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                Yayınlanan şarkılar, akustik yorumlar ve ileride eklenecek özel
                kayıtlar. Her şarkının detay sayfasında hikâye, credits, sözler
                ve platform bağlantıları yer alır.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/muzik/${latestSong.slug}`}
                  className="pill-button"
                >
                  Son Çıkanı İncele
                </Link>

                <a
                  href={latestSong.platforms[0]?.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-button secondary"
                >
                  Dinle
                </a>
              </div>
            </div>

            <Link
              href={`/muzik/${latestSong.slug}`}
              className="group block rounded-[30px] border border-[#4B232D]/10 bg-[#4B232D]/86 p-4 text-white shadow-[0_20px_58px_rgba(75,35,45,0.22)] backdrop-blur-[12px] transition hover:-translate-y-1"
            >
              <div className="grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
                <div className="relative aspect-square overflow-hidden rounded-[22px] bg-black/20">
                  <Image
                    src={latestSong.coverImage}
                    alt={`${latestSong.title} kapak görseli`}
                    fill
                    priority
                    sizes="180px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Son Çıkan
                  </p>

                  <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[0.96] tracking-[-0.075em] text-white">
                    {latestSong.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-white/88">
                    {latestSong.artist}
                  </p>

                  <p className="mt-3 text-[13px] leading-6 text-white/68">
                    {latestSong.shortDescription}
                  </p>

                  <strong className="mt-5 block text-sm text-white">
                    Detay sayfasına git →
                  </strong>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Müzik Arşivi</p>
              <h2 className="section-title">Yayınlanan şarkılar</h2>
              <p className="section-description">
                Şarkı kartlarından platform bağlantılarına gidebilir veya detay
                sayfasında hikâyeyi, credits bilgisini ve özel alanları
                inceleyebilirsiniz.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {publishedSongs.map((song) => (
              <article
                key={song.slug}
                className="grid overflow-hidden rounded-[28px] border border-[#4B232D]/10 bg-white/62 shadow-[0_14px_42px_rgba(75,35,45,0.07)] backdrop-blur-[12px] md:grid-cols-[260px_1fr]"
              >
                <Link
                  href={`/muzik/${song.slug}`}
                  className="relative block min-h-[240px] bg-[#4B232D]/10 md:min-h-full"
                >
                  <Image
                    src={song.coverImage}
                    alt={`${song.title} kapak görseli`}
                    fill
                    sizes="(max-width: 900px) 100vw, 260px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-col justify-between gap-6 p-6 md:p-7">
                  <div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#FFF4BC]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]">
                        {song.type}
                      </span>

                      <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/62">
                        {song.language}
                      </span>

                      {song.isLatest ? (
                        <span className="rounded-full bg-[#BDEBE8]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]">
                          Son Çıkan
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-[clamp(30px,3.2vw,42px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                      {song.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-[#4B232D]/72">
                      {song.artist}
                    </p>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B232D]/68">
                      {song.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {song.platforms.map((platform) => (
                        <a
                          key={platform.name}
                          href={platform.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#4B232D]/10 bg-white/70 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-[#FFF4BC]"
                        >
                          {getPlatformLabel(platform.name)}
                        </a>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/muzik/${song.slug}`}
                        className="pill-button"
                      >
                        Detay
                      </Link>

                      <Link href="/giris" className="pill-button secondary">
                        İndir
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="section-eyebrow">Üyelik</p>

              <h2 className="section-title">Özel indirmeler ve arşiv</h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#4B232D]/70">
                Şarkı dosyaları, kapak görselleri, özel sözler veya arşiv
                içerikleri aktif edildiğinde üyelikle erişilebilir olacak.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/kayit" className="pill-button">
                Üye Ol
              </Link>

              <Link href="/giris" className="pill-button secondary">
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Şarkılar · Sözler · Hikâyeler</span>
      </footer>
    </main>
  );
}