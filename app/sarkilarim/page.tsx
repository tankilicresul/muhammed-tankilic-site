import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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

const mobileActionClass =
  "inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/22 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.055)] transition hover:-translate-y-0.5";

const desktopActionClass =
  "inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/18 px-3.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5";

const orangeActionClass =
  "border-[#F5AE50]/60 bg-[#F5AE50]/90 text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] hover:bg-[#F5AE50]";

const whiteActionClass = "bg-white/84 hover:bg-white/95";

function PlatformAction({
  href,
  label,
  isMobile = false,
}: {
  href?: string;
  label: string;
  isMobile?: boolean;
}) {
  const className = `${isMobile ? mobileActionClass : desktopActionClass} ${whiteActionClass}`;

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

function DownloadAction({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <Link
      href="/giris"
      className={`${isMobile ? mobileActionClass : desktopActionClass} ${orangeActionClass}`}
    >
      İndir
    </Link>
  );
}

function MobileSongPanel({ song }: { song: PublicSong }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");

  const hasYoutube = Boolean(song.youtubeEmbedUrl);
  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasDescription = Boolean(song.description?.trim());

  return (
    <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
      {hasSpotify ? (
        <div className="overflow-hidden rounded-[18px] border border-white/24 bg-[#535353] shadow-[0_12px_30px_rgba(75,35,45,0.10)]">
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

      {!hasSpotify && hasYoutube ? (
        <div className="overflow-hidden rounded-[18px] border border-white/24 bg-[#4B232D]/88 shadow-[0_12px_30px_rgba(75,35,45,0.12)]">
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
        <div className="flex min-h-[120px] items-center justify-center rounded-[18px] border border-white/24 bg-white/58 p-4 text-center shadow-[0_12px_30px_rgba(75,35,45,0.08)]">
          <p className="text-[12px] font-bold leading-6 text-[#4B232D]/70">
            Dinleme bağlantıları yakında.
          </p>
        </div>
      ) : null}

      <div className="rounded-[18px] border border-[#4B232D]/10 bg-white/58 px-4 py-3.5 shadow-[0_10px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px]">
        {hasDescription ? (
          <p className="text-[12px] leading-6 text-[#4B232D]/74">
            {song.description}
          </p>
        ) : null}

        <div className={`${hasDescription ? "mt-3" : ""} grid grid-cols-4 gap-1.5`}>
          <Link
            href={`/sarkilarim/${song.slug}`}
            className={`${mobileActionClass} ${whiteActionClass}`}
          >
            Detaylar
          </Link>

          <PlatformAction href={spotify?.url} label="Spotify" isMobile />

          <PlatformAction href={appleMusic?.url} label="Apple" isMobile />

          <DownloadAction isMobile />
        </div>
      </div>
    </article>
  );
}

function DesktopSongPanel({ song }: { song: PublicSong }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");

  const hasYoutube = Boolean(song.youtubeEmbedUrl);
  const hasSpotify = Boolean(song.spotifyEmbedUrl);

  return (
    <article className="hidden overflow-hidden rounded-[32px] border border-white/35 bg-white/56 p-4 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
      <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
        <div className="flex h-full min-h-[152px] flex-col justify-between rounded-[26px] border border-[#4B232D]/10 bg-white/48 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
          <div>
            <p className="section-eyebrow">Şarkılarım</p>

            <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
              <h2 className="text-[clamp(34px,3vw,44px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
                {song.title}
              </h2>

              <p className="pb-1.5 text-sm font-medium text-[#4B232D]/64">
                {song.artist}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-nowrap items-center gap-2">
            <Link
              href={`/sarkilarim/${song.slug}`}
              className={`${desktopActionClass} ${whiteActionClass}`}
            >
              Detaylar
            </Link>

            <PlatformAction href={spotify?.url} label="Spotify" />

            <PlatformAction href={appleMusic?.url} label="Apple Music" />

            <DownloadAction />
          </div>
        </div>

        {hasSpotify ? (
          <div className="overflow-hidden rounded-[26px] border border-white/24 bg-[#535353] shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
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

        {!hasSpotify && hasYoutube ? (
          <div className="overflow-hidden rounded-[26px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
            <iframe
              src={song.youtubeEmbedUrl}
              title={`${song.title} YouTube videosu`}
              className="block h-[152px] w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : null}

        {!hasSpotify && !hasYoutube ? (
          <div className="flex min-h-[152px] items-center justify-center rounded-[26px] border border-white/24 bg-white/34 p-6 text-center shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
            <div>
              <p className="section-eyebrow">Dinleme</p>
              <h3 className="text-[24px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                Platform bağlantıları yakında.
              </h3>
            </div>
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
        <div className="mb-3 hidden items-end justify-between gap-4 md:mb-5 md:flex">
          <div>
            <p className="section-eyebrow">Şarkılarım</p>
            <h1 className="text-[clamp(34px,4.6vw,58px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
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
