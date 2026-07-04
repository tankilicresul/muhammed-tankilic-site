import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import MediaDownloadButton from "@/components/MediaDownloadButton";
import {
  getPublishedSongBySlug,
  getPublishedSongs,
  type PublicMusicPlatform,
  type PublicSong,
} from "@/lib/supabase/public-songs";

type SongDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const actionButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-center text-[12px] font-bold tracking-[-0.015em] shadow-[0_10px_24px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 md:min-h-12 md:px-5 md:text-sm";

const secondaryButtonClass =
  "border-[#4B232D]/10 bg-white/74 text-[#4B232D] hover:bg-white/92";

const primaryButtonClass =
  "border-[#F5AE50]/60 bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]";

const tagClass =
  "rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#4B232D] md:text-[10px]";

export async function generateMetadata({
  params,
}: SongDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await getPublishedSongBySlug(slug);

  if (!song) {
    return {
      title: "Şarkı Bulunamadı | Muhammed Tankılıç",
    };
  }

  return {
    title: `${song.title} | Muhammed Tankılıç`,
    description: song.shortDescription || song.description,
  };
}

function PlatformButton({ platform }: { platform: PublicMusicPlatform }) {
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
      className={`${actionButtonClass} ${secondaryButtonClass}`}
    >
      {label}
    </a>
  );
}

function PlayerSection({ song }: { song: PublicSong }) {
  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasYoutube = Boolean(song.youtubeEmbedUrl);
  const hasAnyPlayer = hasSpotify || hasYoutube;

  return (
    <section className="site-container section-space">
      <article className="rounded-[28px] border border-white/35 bg-white/58 p-4 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-7 lg:p-8">
        <div className="section-header gap-4">
          <div>
            <p className="section-eyebrow">Dinle</p>
            <h2 className="section-title">Platform oynatıcıları</h2>
          </div>

          <Link href="/sarkilarim" className="pill-button secondary">
            Tüm şarkılar
          </Link>
        </div>

        <div
          className={[
            "mt-5 grid gap-4 md:mt-6",
            hasSpotify && hasYoutube ? "lg:grid-cols-[1.08fr_0.92fr]" : "",
          ].join(" ")}
        >
          {hasYoutube ? (
            <div className="overflow-hidden rounded-[24px] border border-white/24 bg-[#4B232D]/90 shadow-[0_18px_48px_rgba(75,35,45,0.13)] md:rounded-[28px]">
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
            <div className="overflow-hidden rounded-[24px] border border-white/24 bg-white/22 shadow-[0_18px_48px_rgba(75,35,45,0.10)] md:rounded-[28px]">
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

          {!hasAnyPlayer ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-white/30 bg-white/36 p-6 text-center shadow-[0_18px_48px_rgba(75,35,45,0.08)] md:min-h-[220px] md:rounded-[28px]">
              <div>
                <p className="section-eyebrow">Dinleme</p>
                <h3 className="text-[28px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[36px]">
                  Platform bağlantıları yakında.
                </h3>
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </section>
  );
}

function LyricsSection({ lyrics }: { lyrics: string }) {
  if (!lyrics) {
    return null;
  }

  return (
    <section className="site-container section-space">
      <article className="rounded-[28px] border border-[#4B232D]/10 bg-[#4B232D]/88 p-5 text-white shadow-[0_18px_50px_rgba(75,35,45,0.14)] backdrop-blur-[14px] md:rounded-[34px] md:p-9">
        <p className="section-eyebrow light">Sözler</p>

        <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-white">
          Şarkımın sözleri
        </h2>

        <p className="mt-5 whitespace-pre-line text-sm leading-8 text-white/72">
          {lyrics}
        </p>
      </article>
    </section>
  );
}

function RelatedSongsSection({ relatedSongs }: { relatedSongs: PublicSong[] }) {
  if (relatedSongs.length === 0) {
    return null;
  }

  return (
    <section className="site-container section-space">
      <div className="rounded-[28px] border border-white/35 bg-white/58 p-4 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-8">
        <div className="section-header gap-4">
          <div>
            <p className="section-eyebrow">Diğer Şarkılarım</p>
            <h2 className="section-title">Diğer bestelerim</h2>
          </div>

          <Link href="/sarkilarim" className="pill-button secondary">
            Tümünü Gör
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedSongs.map((relatedSong) => (
            <Link
              key={relatedSong.slug}
              href={`/sarkilarim/${relatedSong.slug}`}
              className="group grid grid-cols-[76px_1fr] items-center gap-4 rounded-[24px] border border-white/42 bg-white/66 p-3 shadow-[0_10px_28px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5 hover:bg-white/82 md:rounded-[26px]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[18px] border border-[#4B232D]/10 bg-[#4B232D]/8">
                <Image
                  src={relatedSong.coverImage}
                  alt={`${relatedSong.title} kapak görseli`}
                  fill
                  sizes="76px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/45">
                  Şarkılarım
                </p>

                <h3 className="mt-1 truncate text-[22px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                  {relatedSong.title}
                </h3>

                <p className="mt-2 truncate text-[12px] leading-5 text-[#4B232D]/66">
                  {relatedSong.artist}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = await params;
  const song = await getPublishedSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const songs = await getPublishedSongs();
  const relatedSongs = songs.filter(
    (relatedSong) => relatedSong.slug !== song.slug,
  );

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/sarkilarim" className="pill-button secondary">
            ← Şarkılarım
          </Link>

          <Link href="/coverlarim" className="pill-button secondary">
            Coverlarım
          </Link>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-white/35 bg-white/58 p-4 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:rounded-[36px] md:p-7 lg:p-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.78fr)_1fr] lg:items-center lg:gap-8">
            <div className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-[26px] border border-[#4B232D]/10 bg-[#4B232D]/10 shadow-[0_18px_50px_rgba(75,35,45,0.12)] md:rounded-[32px]">
              <div className="relative aspect-square">
                <Image
                  src={song.coverImage}
                  alt={`${song.title} kapak görseli`}
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 460px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className={`${tagClass} bg-[#FFF4BC]`}>Single</span>
                <span className={`${tagClass} bg-[#BDEBE8]/76`}>Bestem</span>
                <span className={`${tagClass} bg-white/72 text-[#4B232D]/66`}>
                  Kürtçe
                </span>
              </div>

              <p className="section-eyebrow">Şarkılarım</p>

              <h1 className="mt-3 text-[clamp(42px,7vw,78px)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#4B232D]">
                {song.title}
              </h1>

              <p className="mt-3 text-base font-medium text-[#4B232D]/66 md:text-lg">
                {song.artist}
              </p>

              {song.description ? (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#4B232D]/72 md:text-[15px] md:leading-8">
                  {song.description}
                </p>
              ) : (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#4B232D]/64 md:text-[15px] md:leading-8">
                  Bu şarkının açıklaması yakında eklenecek.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2.5">
                {song.platforms.map((platform) => (
                  <PlatformButton key={platform.name} platform={platform} />
                ))}

                <MediaDownloadButton
                  contentType="song"
                  slug={song.slug}
                  title={song.title}
                  hasAudioFile={song.hasAudioDownload}
                  hasVideoFile={song.hasVideoDownload}
                  className={`${actionButtonClass} ${primaryButtonClass}`}
                  label="Siteden İndir"
                />
              </div>
            </div>
          </div>
        </article>
      </section>

      <PlayerSection song={song} />

      <LyricsSection lyrics={song.lyrics} />

      <RelatedSongsSection relatedSongs={relatedSongs} />

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}
