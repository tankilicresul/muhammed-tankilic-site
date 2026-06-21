import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { featuredSongs, latestSong } from "@/lib/data/songs";

const quickLinks = [
  {
    title: "Şarkılar",
    description: "Yayınlanan parçalar, akustik kayıtlar ve özel müzik arşivi.",
    href: "/muzik",
    label: "Müzik Arşivi",
  },
  {
    title: "Videolar",
    description: "Klipler, kısa performanslar ve video kayıtları.",
    href: "/videolar",
    label: "Video Arşivi",
  },
  {
    title: "Fotoğraflar",
    description: "Kapak görselleri, portreler ve sahne arkası kareler.",
    href: "/fotograflar",
    label: "Görsel Arşiv",
  },
];

const previewSongs = [
  ...featuredSongs,
  {
    slug: "akustik-kayitlar",
    title: "Akustik Kayıtlar",
    type: "Arşiv",
    shortDescription: "Ev kayıtları, prova notları ve sade yorumlar.",
    coverImage: "/muhammed-hero2.png",
  },
  {
    slug: "cover-yorumlar",
    title: "Cover Yorumlar",
    type: "Yakında",
    shortDescription: "Tanıdık ezgilerin kişisel, sakin ve akustik yorumları.",
    coverImage: "/muhammed-hero2.png",
  },
].slice(0, 3);

const spotifyEmbedUrl =
  "https://open.spotify.com/embed/track/7B5SGhv7YD7opodmyJQQqm?utm_source=generator";

export default function Home() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative flex min-h-[calc(100vh-132px)] overflow-hidden rounded-[34px] border border-white/30 bg-white/8 shadow-[0_22px_70px_rgba(75,35,45,0.08)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_48%,rgba(255,255,255,0.10)_100%)]" />

          <div className="relative flex w-full flex-col justify-end p-4 md:p-6">
            <div className="rounded-[28px] border border-white/28 bg-white/14 p-3 shadow-[0_20px_60px_rgba(75,35,45,0.08)] backdrop-blur-[18px] md:p-4">
              <div className="grid gap-3 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="flex min-h-[152px] flex-col justify-between rounded-[22px] border border-white/22 bg-white/10 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4B232D]/56">
                      Yeni Şarkı Çıktı Hemen Dinle ---&gt;
                    </p>

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h1 className="text-[clamp(24px,2.7vw,38px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                        {latestSong.title}
                      </h1>

                      <span className="text-sm font-medium text-[#4B232D]/68">
                        {latestSong.artist}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/muzik/${latestSong.slug}`}
                      className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
                    >
                      Şarkı Detayı
                    </Link>

                    <Link
                      href="/muzik"
                      className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
                    >
                      Tüm Şarkılar
                    </Link>

                    <Link
                      href="/hakkinda"
                      className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
                    >
                      Hakkında
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-white/22 bg-white/10">
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
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[30px] border border-[#4B232D]/10 bg-white/56 p-6 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] transition hover:-translate-y-1 hover:bg-white/68 hover:shadow-[0_28px_80px_rgba(75,35,45,0.16)]"
            >
              <span className="mb-8 inline-flex rounded-full bg-[#FFF4BC]/82 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]">
                {item.label}
              </span>

              <h2 className="text-[30px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                {item.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#4B232D]/68">
                {item.description}
              </p>

              <strong className="mt-7 block text-sm text-[#4B232D]">
                Sayfaya Git →
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Şarkılar</p>
              <h2 className="section-title">Kayıtlar ve yorumlar</h2>
              <p className="section-description">
                Özgün parçalar, akustik yorumlar ve yakında eklenecek özel
                kayıtlar.
              </p>
            </div>

            <Link href="/muzik" className="pill-button secondary">
              Tümünü Gör
            </Link>
          </div>

          <div className="music-grid">
            {previewSongs.map((song) => (
              <article key={song.slug} className="music-card soft-card">
                <Link
                  href={
                    song.slug === latestSong.slug
                      ? `/muzik/${song.slug}`
                      : "/muzik"
                  }
                  className="music-cover"
                >
                  <Image
                    src={song.coverImage}
                    alt={`${song.title} görseli`}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="object-cover"
                  />
                </Link>

                <div className="music-card-body">
                  <span>{song.type}</span>
                  <h3>{song.title}</h3>
                  <p>{song.shortDescription}</p>

                  <div className="card-actions">
                    <Link
                      href={
                        song.slug === latestSong.slug
                          ? `/muzik/${song.slug}`
                          : "/muzik"
                      }
                      className="text-link"
                    >
                      Detay
                    </Link>

                    <Link href="/giris" className="text-link muted">
                      İndir
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="rounded-[32px] border border-[#4B232D]/10 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">Hakkında</p>

            <h2 className="section-title">Söz, ses ve hikâye.</h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#4B232D]/70">
              Muhammed Tankılıç, Kürtçe şarkı söyleyen bağımsız bir sanatçı
              olarak müziğini sade melodiler, akustik düzenlemeler ve kişisel
              hikâyeler üzerine kurar.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/hakkinda" className="pill-button dark">
                Daha Fazla
              </Link>

              <Link href="/iletisim" className="pill-button secondary">
                İletişim
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#4B232D]/10 bg-[#FFF4BC]/70 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">İletişim</p>

            <h2 className="text-[clamp(28px,3vw,38px)] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
              Müzik ve iş birlikleri
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#4B232D]/70">
              Konser, kayıt, video, dijital yayın ve iş birliği talepleri için
              iletişim kanallarını kullanabilirsiniz.
            </p>

            <div className="mt-7">
              <Link href="/iletisim" className="pill-button">
                İletişim Sayfası
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Kürtçe müzik · Akustik yorumlar · Kişisel arşiv</span>
      </footer>
    </main>
  );
}