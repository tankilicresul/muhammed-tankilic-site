import type { Metadata } from "next";
import type { ReactNode } from "react";
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

function SpotifyIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.5a10.5 10.5 0 1 0 10.5 10.5A10.512 10.512 0 0 0 12 1.5Zm4.818 15.147a.657.657 0 0 1-.904.22 9.39 9.39 0 0 0-4.745-1.199 13.6 13.6 0 0 0-2.904.316.657.657 0 1 1-.274-1.285 14.934 14.934 0 0 1 3.178-.346 10.705 10.705 0 0 1 5.414 1.382.657.657 0 0 1 .235.912Zm1.289-2.868a.822.822 0 0 1-1.131.276 11.788 11.788 0 0 0-5.926-1.508 16.97 16.97 0 0 0-3.674.4.822.822 0 0 1-.349-1.607 18.492 18.492 0 0 1 4.023-.431 13.207 13.207 0 0 1 6.764 1.744.822.822 0 0 1 .293 1.126Zm.111-2.987a14.068 14.068 0 0 0-7.094-1.778 20.578 20.578 0 0 0-4.43.471.986.986 0 0 1-.418-1.927 22.425 22.425 0 0 1 4.848-.515 15.598 15.598 0 0 1 8.066 2.032.986.986 0 1 1-.972 1.717Z" />
    </svg>
  );
}

function AppleMusicIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.75 3.5a2.25 2.25 0 0 0-1.686.508A2.245 2.245 0 0 0 14.25 5.7v8.545A3.25 3.25 0 1 0 15.75 17V8.59l4-1.067v4.722A3.25 3.25 0 1 0 21.25 15V4.5a1 1 0 0 0-1.258-.966l-3.242.865Z" />
      <path d="M8.75 5.5a2.25 2.25 0 0 0-1.686.508A2.245 2.245 0 0 0 6.25 7.7v6.545A3.25 3.25 0 1 0 7.75 17V10.59l4-1.067v2.227a.75.75 0 0 0 1.5 0V6.5a1 1 0 0 0-1.258-.966L8.75 6.4Z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.582 7.186a2.844 2.844 0 0 0-2.002-2.012C17.818 4.7 12 4.7 12 4.7s-5.818 0-7.58.474A2.844 2.844 0 0 0 2.418 7.186 29.86 29.86 0 0 0 1.95 12a29.86 29.86 0 0 0 .468 4.814 2.844 2.844 0 0 0 2.002 2.012C6.182 19.3 12 19.3 12 19.3s5.818 0 7.58-.474a2.844 2.844 0 0 0 2.002-2.012A29.86 29.86 0 0 0 22.05 12a29.86 29.86 0 0 0-.468-4.814ZM10.1 15.36V8.64L15.818 12 10.1 15.36Z" />
    </svg>
  );
}

function getPlatform(song: PublicSong, name: PublicMusicPlatform["name"]) {
  return song.platforms.find((platform) => platform.name === name);
}

const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/88 text-[#4B232D] shadow-[0_8px_18px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5 hover:bg-white md:h-11 md:w-11";

const disabledIconButtonClass =
  "inline-flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-[#4B232D]/8 bg-white/50 text-[#4B232D]/26 shadow-[0_8px_18px_rgba(75,35,45,0.03)] md:h-11 md:w-11";

const detailButtonClass =
  "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/88 px-4 text-center text-[12px] font-bold tracking-[-0.015em] text-[#4B232D] shadow-[0_8px_18px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5 hover:bg-white md:min-h-11 md:px-5 md:text-sm";

const downloadButtonClass =
  "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-4 text-center text-[12px] font-bold tracking-[-0.015em] text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7bb67] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:min-h-11 md:px-5 md:text-sm";

function PlatformIconButton({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span className={disabledIconButtonClass} title={`${label} mevcut değil`}>
        {children}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={iconButtonClass}>
      {children}
    </a>
  );
}

function ActionRow({ song }: { song: PublicSong }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");
  const youtube = getPlatform(song, "YouTube");

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5 md:mt-6 md:gap-3">
      <Link href={`/sarkilarim/${song.slug}`} className={detailButtonClass}>
        Detaylar
      </Link>

      <PlatformIconButton href={spotify?.url} label="Spotify">
        <SpotifyIcon />
      </PlatformIconButton>

      <PlatformIconButton href={appleMusic?.url} label="Apple Music">
        <AppleMusicIcon />
      </PlatformIconButton>

      {youtube?.url ? (
        <PlatformIconButton href={youtube.url} label="YouTube">
          <YouTubeIcon />
        </PlatformIconButton>
      ) : null}

      <MediaDownloadButton
        contentType="song"
        slug={song.slug}
        title={song.title}
        hasAudioFile={song.hasAudioDownload}
        hasVideoFile={song.hasVideoDownload}
        className={downloadButtonClass}
        label="İndir"
      />
    </div>
  );
}

function MobileSongCard({ song }: { song: PublicSong }) {
  return (
    <article className="grid gap-2 rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
      <div className="grid grid-cols-[94px_1fr] gap-3 rounded-[18px] border border-white/36 bg-white/58 p-3 shadow-[0_10px_24px_rgba(75,35,45,0.05)]">
        <div className="relative aspect-square overflow-hidden rounded-[16px] border border-[#4B232D]/10 bg-[#4B232D]/8">
          <Image
            src={song.coverImage}
            alt={`${song.title} kapak görseli`}
            fill
            sizes="94px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 py-1">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#4B232D]/45">
            Şarkılarım
          </p>

          <h2 className="mt-1 truncate text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
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

      <div className="rounded-[18px] border border-[#4B232D]/8 bg-white/58 px-3 py-3 shadow-[0_10px_24px_rgba(75,35,45,0.045)]">
        <ActionRow song={song} />
      </div>
    </article>
  );
}

function DesktopSongCard({ song }: { song: PublicSong }) {
  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasYoutube = Boolean(song.youtubeEmbedUrl);

  return (
    <article className="hidden overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="flex min-h-[276px] flex-col justify-between rounded-[28px] border border-[#4B232D]/10 bg-white/48 p-7 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
          <div>
            <p className="section-eyebrow">Şarkılarım</p>

            <h2 className="mt-4 max-w-[13ch] break-words text-[clamp(38px,4vw,58px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
              {song.title}
            </h2>

            <p className="mt-4 text-sm font-medium text-[#4B232D]/64">
              {song.artist}
            </p>

            {song.description ? (
              <p className="mt-6 max-w-[40ch] text-sm leading-7 text-[#4B232D]/70">
                {song.description}
              </p>
            ) : null}
          </div>

          <ActionRow song={song} />
        </div>

        {hasSpotify ? (
          <div className="flex min-h-[276px] items-center rounded-[28px] border border-white/24 bg-[#385d59]/88 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
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
          <div className="flex min-h-[276px] items-center justify-center rounded-[28px] border border-white/24 bg-[#385d59]/88 p-6 text-center text-sm font-bold text-white/80 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
            Dinleme bağlantıları yakında.
          </div>
        ) : null}
      </div>
    </article>
  );
}

function SongCard({ song }: { song: PublicSong }) {
  return (
    <>
      <MobileSongCard song={song} />
      <DesktopSongCard song={song} />
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
              <SongCard key={song.id} song={song} />
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
