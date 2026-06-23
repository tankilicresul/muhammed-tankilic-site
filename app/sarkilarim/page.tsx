import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { publishedSongs, type MusicPlatform, type Song } from "@/lib/data/songs";

export const metadata: Metadata = {
  title: "Şarkılarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın besteleri, Spotify ve Apple Music yayınları, şarkı detayları ve dinleme bağlantıları.",
};

function getPlatform(song: Song, name: MusicPlatform["name"]) {
  return song.platforms.find((platform) => platform.name === name);
}

const mobileActionClass =
  "inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/12 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] transition hover:-translate-y-0.5";

const desktopActionClass =
  "inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/12 px-3.5 text-center text-[11px] font-bold leading-none text-[#4B232D] transition hover:-translate-y-0.5";

function PlatformAction({
  href,
  label,
  isHighlighted = false,
  isMobile = false,
}: {
  href?: string;
  label: string;
  isHighlighted?: boolean;
  isMobile?: boolean;
}) {
  const className = `${isMobile ? mobileActionClass : desktopActionClass} ${
    isHighlighted
      ? "bg-[#FFF4BC]/88 hover:bg-[#FFF4BC]"
      : "bg-white/76 hover:bg-white/90"
  }`;

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
      className={`${
        isMobile ? mobileActionClass : desktopActionClass
      } bg-[#FFF4BC]/88 hover:bg-[#FFF4BC]`}
    >
      İndir
    </Link>
  );
}

function MobileSongPanel({ song }: { song: Song }) {
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

        <div className={`${hasDescription ? "mt-3" : ""} grid grid-cols-3 gap-1.5`}>
          <Link
            href={`/sarkilarim/${song.slug}`}
            className={`${mobileActionClass} bg-white/76 hover:bg-white/90`}
          >
            Detaylar
          </Link>

          <PlatformAction href={spotify?.url} label="Spotify" isMobile />

          <PlatformAction href={appleMusic?.url} label="Apple Music" isMobile />
        </div>
      </div>
    </article>
  );
}

function DesktopSongPanel({ song }: { song: Song }) {
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
              className={`${desktopActionClass} bg-white/76 hover:bg-white/90`}
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

function SongPanel({ song }: { song: Song }) {
  return (
    <>
      <MobileSongPanel song={song} />
      <DesktopSongPanel song={song} />
    </>
  );
}

export default function SarkilarimPage() {
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

        <div className="grid gap-3 md:gap-5">
          {publishedSongs.map((song) => (
            <SongPanel key={song.slug} song={song} />
          ))}
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}