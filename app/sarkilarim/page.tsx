import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MediaDownloadButton from "@/components/MediaDownloadButton";
import {
  getPublishedSongs,
  type PublicMusicPlatform,
  type PublicSong,
} from "@/lib/supabase/public-songs";

export const metadata: Metadata = {
  title: "Şarkılarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın besteleri, Spotify ve Apple Music yayınları, şarkı detayları ve dinleme bağlantıları.",
};

function getPlatform(song: PublicSong, name: PublicMusicPlatform["name"]) {
  return song.platforms.find((platform) => platform.name === name);
}

const mobileButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-full border px-3 text-center text-[12px] font-bold leading-none tracking-[-0.015em] shadow-[0_8px_18px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5";

const desktopButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-center text-[13px] font-bold leading-none tracking-[-0.015em] shadow-[0_10px_24px_rgba(75,35,45,0.07)] transition hover:-translate-y-0.5";

const orangeButtonClass =
  "border-[#F5AE50]/60 bg-[#F5AE50] text-[#4B232D] shadow-[0_12px_26px_rgba(245,174,80,0.18)] hover:bg-[#f7bb67]";

const whiteButtonClass =
  "border-[#4B232D]/10 bg-white/82 text-[#4B232D] hover:bg-white/95";

function PlatformAction({
  href,
  label,
  isMobile = false,
}: {
  href?: string;
  label: string;
  isMobile?: boolean;
}) {
  const className = `${isMobile ? mobileButtonClass : desktopButtonClass} ${whiteButtonClass}`;

  if (!href) {
    return (
      <span
        className={`${className} cursor-not-allowed opacity-45 hover:translate-y-0`}
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {label}
    </a>
  );
}

function DownloadAction({
  song,
  isMobile = false,
}: {
  song: PublicSong;
  isMobile?: boolean;
}) {
  return (
    <MediaDownloadButton
      contentType="song"
      slug={song.slug}
      title={song.title}
      hasAudioFile={song.hasAudioDownload}
      hasVideoFile={song.hasVideoDownload}
      className={`${isMobile ? mobileButtonClass : desktopButtonClass} ${orangeButtonClass}`}
      label="İndir"
    />
  );
}

function MobileSongPanel({ song }: { song: PublicSong }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");

  return (
    <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
      <div className="grid grid-cols-[92px_1fr] gap-3 rounded-[18px] border border-white/36 bg-white/54 p-3 shadow-[0_10px_24px_rgba(75,35,45,0.05)]">
        <div className="relative aspect-square overflow-hidden rounded-[16px] border border-[#4B232D]/10 bg-[#4B232D]/8">
          <Image
            src={song.coverImage}
            alt={`${song.title} kapak görseli`}
            fill
            sizes="92px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 py-1">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#4B232D]/45">
            Şarkılarım
          </p>

          <h2 className="mt-1 truncate text-[26px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
            {song.title}
          </h2>

          <p className="mt-2 truncate text-[12px] font-medium text-[#4B232D]/62">
            {song.artist}
          </p>

          {song.description ? (
            <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#4B232D]/62">
              {song.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 rounded-[18px] border border-[#4B232D]/10 bg-white/58 px-3 py-3 shadow-[0_10px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px]">
        <Link
          href={`/sarkilarim/${song.slug}`}
          className={`${mobileButtonClass} ${whiteButtonClass}`}
        >
          Detay
        </Link>

        <PlatformAction href={spotify?.url} label="Spotify" isMobile />

        <PlatformAction href={appleMusic?.url} label="Apple" isMobile />

        <DownloadAction song={song} isMobile />
      </div>
    </article>
  );
}

function DesktopSongPanel({ song }: { song: PublicSong }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");
  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasYoutube = Boolean(song.youtubeEmbedUrl);

  return (
    <article className="hidden overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="flex h-full min-h-[282px] flex-col justify-between rounded-[28px] border border-[#4B232D]/10 bg-white/48 p-7 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
          <div>
            <p className="section-eyebrow">Şarkılarım</p>

            <h2 className="mt-4 max-w-[13ch] break-words text-[clamp(38px,4vw,58px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
              {song.title}
            </h2>

            <p className="mt-4 text-sm font-medium text-[#4B232D]/64">
              {song.artist}
            </p>

            {song.description ? (
              <p className="mt-6 max-w-[38ch] text-sm leading-7 text-[#4B232D]/70">
                {song.description}
              </p>
            ) : null}
          </div>

          <div className="mt-7 flex max-w-[520px] flex-wrap gap-3">
            <Link
              href={`/sarkilarim/${song.slug}`}
              className={`${desktopButtonClass} ${whiteButtonClass}`}
            >
              Detaylar
            </Link>

            <PlatformAction href={spotify?.url} label="Spotify" />

            <PlatformAction href={appleMusic?.url} label="Apple Music" />

            <DownloadAction song={song} />
          </div>
        </div>

        {hasSpotify ? (
          <div className="flex min-h-[282px] items-center overflow-hidden rounded-[28px] border border-white/24 bg-[#385d59]/88 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
            <iframe
              src={song.spotifyEmbedUrl}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block h-[152px] w-full rounded-[16px] border-0"
              title={`${song.title} Spotify oynatıcı`}
            />
          </div>
        ) : null}

        {!hasSpotify && hasYoutube ? (
          <div className="overflow-hidden rounded-[28px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
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

        {!hasSpotify && !hasYoutube ? (
          <div className="flex min-h-[282px] items-center justify-center rounded-[28px] border border-white/24 bg-[#4B232D]/88 p-6 text-center text-sm font-bold text-white/80 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
            Dinleme bağlantıları yakında.
          </div>
        ) : null}
      </div>
    </article>
  );
}

function SongPanel({ song }: { song: PublicSong }) {
  return (
    <>
      <MobileSongPanel song={song} />
      <DesktopSongPanel song={song} />
    </>
  );
}

export default async function SarkilarimPage() {
  const songs = await getPublishedSongs();

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-4">
        <div className="mb-4 hidden items-end justify-between gap-4 md:mb-6 md:flex">
          <div>
            <p className="section-eyebrow">Şarkılarım</p>
            <h1 className="text-[clamp(38px,4.8vw,64px)] font-semibold leading-none tracking-[-0.08em] text-[#4B232D]">
              Bestelerim
            </h1>
          </div>

          <Link href="/coverlarim" className="pill-button secondary">
            Coverlarım
          </Link>
        </div>

        {songs.length > 0 ? (
          <div className="grid gap-3 md:gap-5">
            {songs.map((song) => (
              <SongPanel key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/35 bg-white/62 p-6 text-center shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-10">
            <p className="section-eyebrow">Şarkılarım</p>
            <h2 className="text-[clamp(28px,6vw,46px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
              Henüz yayında şarkı yok.
            </h2>
          </div>
        )}
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}
