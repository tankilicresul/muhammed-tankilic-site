import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { publishedSongs, type MusicPlatform, type Song } from "@/lib/data/songs";

export const metadata: Metadata = {
  title: "Şarkılarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın kendi besteleri, Spotify ve Apple Music yayınları, şarkı detayları ve dinleme bağlantıları.",
};

function getPlatform(song: Song, name: MusicPlatform["name"]) {
  return song.platforms.find((platform) => platform.name === name);
}

function PlatformButton({
  platform,
}: {
  platform: MusicPlatform;
}) {
  const label =
    platform.name === "Spotify"
      ? "Spotify’da Dinle"
      : platform.name === "Apple Music"
        ? "Apple Music’te Dinle"
        : "YouTube’da İzle";

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
    >
      {label}
    </a>
  );
}

function SongPanel({ song }: { song: Song }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");
  const youtube = getPlatform(song, "YouTube");

  const hasYoutube = Boolean(song.youtubeEmbedUrl);
  const hasSpotify = Boolean(song.spotifyEmbedUrl);

  return (
    <article className="overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-[28px] border border-[#4B232D]/10 bg-white/46 p-5">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#FFF4BC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]">
                {song.type}
              </span>

              <span className="rounded-full bg-[#BDEBE8]/76 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]">
                Kendi Beste
              </span>

              <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]/66">
                {song.language}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-[128px_1fr] md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[#4B232D]/10 bg-[#4B232D]/10 shadow-[0_16px_38px_rgba(75,35,45,0.12)]">
                <Image
                  src={song.coverImage}
                  alt={`${song.title} kapak görseli`}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority={song.isLatest}
                />
              </div>

              <div>
                <p className="section-eyebrow">Şarkılarım</p>

                <h2 className="text-[clamp(34px,4.8vw,58px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                  {song.title}
                </h2>

                <p className="mt-2 text-sm font-medium text-[#4B232D]/64">
                  {song.artist}
                </p>

                <p className="mt-4 text-sm leading-7 text-[#4B232D]/70">
                  {song.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={`/sarkilarim/${song.slug}`}
              className="rounded-full border border-[#4B232D]/12 bg-[#4B232D] px-4 py-2 text-[12px] font-bold text-white transition hover:-translate-y-0.5"
            >
              Şarkı Detayı
            </Link>

            <Link
              href="/giris"
              className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
            >
              İndir
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {hasYoutube ? (
            <div className="overflow-hidden rounded-[26px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
              <iframe
                src={song.youtubeEmbedUrl}
                title={`${song.title} YouTube videosu`}
                className="block aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : null}

          {hasSpotify ? (
            <div className="overflow-hidden rounded-[26px] border border-white/24 bg-white/20 shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
              <iframe
                src={song.spotifyEmbedUrl}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block h-[152px] w-full border-0"
                title={`${song.title} Spotify oynatıcı`}
              />
            </div>
          ) : null}

          {!hasYoutube && !hasSpotify ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-[26px] border border-white/24 bg-white/34 p-6 text-center shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
              <div>
                <p className="section-eyebrow">Dinleme</p>
                <h3 className="text-[28px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                  Platform bağlantıları yakında.
                </h3>
              </div>
            </div>
          ) : null}

          <div className="rounded-[26px] border border-white/24 bg-white/50 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/56">
              Dinleme Linkleri
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {spotify ? <PlatformButton platform={spotify} /> : null}
              {appleMusic ? <PlatformButton platform={appleMusic} /> : null}
              {youtube ? <PlatformButton platform={youtube} /> : null}

              <Link
                href="/giris"
                className="rounded-full border border-[#4B232D]/12 bg-[#FFF4BC]/86 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
              >
                Siteden İndir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MusicPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/54 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(245,174,80,0.13),transparent_30%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  Kendi Besteler
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Spotify
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Apple Music
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  YouTube
                </span>
              </div>

              <p className="section-eyebrow">Şarkılarım</p>

              <h1 className="max-w-3xl text-[clamp(44px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                Kendi besteleri ve resmi yayınları.
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                Bu sayfada Muhammed Tankılıç’ın kendi besteleri yer alır. Her
                şarkı, bulunduğu platforma göre tek panelde gösterilir: Spotify
                ve Apple Music yayınları, YouTube videosu varsa video oynatıcı,
                ayrıca siteden indirme bağlantısı.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/30 bg-[#4B232D]/88 p-7 text-white shadow-[0_20px_58px_rgba(75,35,45,0.16)] backdrop-blur-[12px]">
              <p className="section-eyebrow light">İçerik Ayrımı</p>

              <h2 className="text-[clamp(30px,3.5vw,46px)] font-semibold leading-none tracking-[-0.075em] text-white">
                Besteler burada, coverlar ayrı.
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/70">
                Şarkılarım bölümü özgün çalışmaları listeler. Cover videoları
                ve kısa performanslar ayrı olarak Coverlarım sayfasında
                düzenlenecek.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/coverlarim" className="pill-button outline-light">
                  Coverlarım
                </Link>

                <Link href="/iletisim" className="pill-button">
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-5">
          {publishedSongs.map((song) => (
            <SongPanel key={song.slug} song={song} />
          ))}
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-[#FFF4BC]/74 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="section-eyebrow">Sonraki Bölüm</p>

              <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Cover yorumları ayrı arşivde.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#4B232D]/70">
                YouTube ve Instagram’da paylaşılan cover videoları, kısa
                performanslar ve yorumlar Coverlarım sayfasında ayrı bir
                sistemle listelenecek.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/coverlarim" className="pill-button dark">
                Coverlarım
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Şarkılarım · Kendi besteler · Resmi yayınlar</span>
      </footer>
    </main>
  );
}