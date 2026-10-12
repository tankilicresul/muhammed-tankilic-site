import Link from "next/link";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import MediaDownloadButton from "@/components/MediaDownloadButton";
import {
  getHomepageMedia,
  type CoverRow,
  type GalleryItem,
  type HomepageAnnouncement,
  type HomepageSong,
} from "@/lib/supabase/public";
import { getPublicSiteTexts, t } from "@/lib/supabase/site-texts";

const youtubeChannelUrl = "https://www.youtube.com/@muhammedtanklc";

const platformLinks = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/muhammedtanklc?igsh=MWdna211cTJwY2FpNA==",
    Icon: FaInstagram,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@Muhammedtanklc",
    Icon: FaYoutube,
  },
  {
    title: "Spotify",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
    Icon: FaSpotify,
  },
  {
    title: "Apple Music",
    href: "https://music.apple.com/us/album/zef-cara-single/1779404301",
    Icon: FaApple,
  },
];


function getDownloadAvailability(media: unknown) {
  if (!media || typeof media !== "object") {
    return {
      hasAudioFile: false,
      hasVideoFile: false,
    };
  }

  const record = media as Record<string, unknown>;

  const hasAudioFile =
    Boolean(record.hasAudioDownload) ||
    Boolean(String(record.downloadFilePath ?? "").trim()) ||
    Boolean(String(record.download_file_path ?? "").trim());

  const hasVideoFile =
    Boolean(record.hasVideoDownload) ||
    Boolean(String(record.videoDownloadFilePath ?? "").trim()) ||
    Boolean(String(record.video_download_file_path ?? "").trim());

  return {
    hasAudioFile,
    hasVideoFile,
  };
}

function getGmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent("İletişim Talebi")}`;
}

function getYoutubeVideoId(url: string | null) {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "") || null;
    }

    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return videoId;
    }

    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

function getYoutubeEmbedUrl(
  youtubeUrl: string | null,
  youtubeEmbedUrl: string | null,
) {
  if (youtubeEmbedUrl) {
    return youtubeEmbedUrl;
  }

  const videoId = getYoutubeVideoId(youtubeUrl);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

function getPreviewImage(item: GalleryItem) {
  return item.thumbnail_url || item.image_url;
}

function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function SectionHeader({
  title,
  href,
  action,
}: {
  title: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
      <h2 className="text-[clamp(28px,3.8vw,48px)] font-light tracking-[-0.05em] text-[#4B232D]">
        <span className="font-semibold">{title}</span>
      </h2>

      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4B232D]/70 transition hover:text-[#4B232D] md:text-[13px]"
      >
        <span>{action}</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
}

function AnnouncementButton({ announcement }: { announcement: HomepageAnnouncement }) {
  const className =
    "inline-flex min-h-10 items-center justify-center rounded-full bg-[#4B232D] px-6 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(75,35,45,0.16)] transition hover:-translate-y-0.5 hover:bg-[#5f2c38] md:min-h-11 md:px-7 md:text-xs";

  if (isExternalUrl(announcement.href)) {
    return (
      <a
        href={announcement.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        Detaya Git →
      </a>
    );
  }

  return (
    <Link href={announcement.href} className={className}>
      Detaya Git →
    </Link>
  );
}

function CoverCard({ cover }: { cover: CoverRow }) {
  const embedUrl = getYoutubeEmbedUrl(
    cover.youtube_url,
    cover.youtube_embed_url,
  );

  return (
    <>
      <article className="grid gap-3 overflow-hidden rounded-[24px] border border-white/40 bg-white/58 p-3.5 shadow-[0_12px_32px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:hidden">
        {embedUrl ? (
          <div className="overflow-hidden rounded-[18px] border border-white/25 bg-[#4B232D]/90 shadow-[0_10px_24px_rgba(75,35,45,0.10)]">
            <iframe
              src={embedUrl}
              title={`${cover.title} YouTube cover videosu`}
              className="block aspect-video w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-[18px] border border-white/25 bg-[#4B232D]/90 p-5 text-center text-xs font-semibold text-white/80">
            Bu cover için henüz video bağlantısı eklenmedi.
          </div>
        )}

        <div className="px-1 pt-1 pb-1">
          <p className="text-[13px] leading-relaxed text-[#4B232D]/75">
            {cover.description ??
              "YouTube kanalımda paylaştığım cover yorumlarımdan biri."}
          </p>

          <div className="mt-3.5 grid grid-cols-[1fr_88px] gap-2">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-3 text-center text-[11px] font-semibold text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
            >
              ← Kanalım
            </a>

            <MediaDownloadButton
              contentType="cover"
              slug={cover.slug}
              title={cover.title}
              hasAudioFile={getDownloadAvailability(cover).hasAudioFile}
              hasVideoFile={getDownloadAvailability(cover).hasVideoFile}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/50 bg-white/80 px-3 text-center text-[11px] font-semibold text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white"
              label="İndir"
            />
          </div>
        </div>
      </article>

      <article className="hidden overflow-hidden rounded-[32px] border border-white/40 bg-white/56 p-6 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:block lg:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex h-full min-h-[300px] flex-col justify-between py-1">
            <div>
              <p className="section-eyebrow">Coverlarım</p>

              <h3 className="mt-3 max-w-[14ch] break-words text-[clamp(34px,3.5vw,52px)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#4B232D]">
                {cover.title}
              </h3>

              <p className="mt-3 text-sm font-medium text-[#4B232D]/60">
                Muhammed Tankılıç
              </p>

              <p className="mt-5 max-w-[38ch] text-[14px] leading-relaxed text-[#4B232D]/70">
                {cover.description ??
                  "YouTube kanalımda paylaştığım cover yorumlarımdan biri."}
              </p>
            </div>

            <div className="mt-6 flex max-w-[360px] items-center gap-3">
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-4 text-center text-[12px] font-semibold text-[#4B232D] shadow-[0_8px_20px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7ba65]"
              >
                Kanalım
              </a>

              <MediaDownloadButton
                contentType="cover"
                slug={cover.slug}
                title={cover.title}
                hasAudioFile={getDownloadAvailability(cover).hasAudioFile}
                hasVideoFile={getDownloadAvailability(cover).hasVideoFile}
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-white/60 bg-white/80 px-4 text-center text-[12px] font-semibold text-[#4B232D] shadow-[0_6px_16px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white"
                label="Siteden İndir"
              />
            </div>
          </div>

          {embedUrl ? (
            <div className="overflow-hidden rounded-[24px] border border-white/25 bg-[#4B232D]/90 shadow-[0_16px_40px_rgba(75,35,45,0.10)]">
              <iframe
                src={embedUrl}
                title={`${cover.title} YouTube cover videosu`}
                className="block aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-[24px] border border-white/25 bg-[#4B232D]/90 p-6 text-center text-sm font-semibold text-white/80 shadow-[0_16px_40px_rgba(75,35,45,0.10)]">
              Bu cover için henüz video bağlantısı eklenmedi.
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function SongCard({ song }: { song: HomepageSong }) {
  return (
    <>
      <article className="grid gap-3 overflow-hidden rounded-[24px] border border-white/40 bg-white/58 p-3.5 shadow-[0_12px_32px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:hidden">
        {song.spotify_embed_url ? (
          <div className="overflow-hidden rounded-[18px] border border-white/25 bg-[#282828] shadow-[0_10px_24px_rgba(75,35,45,0.08)]">
            <iframe
              src={song.spotify_embed_url}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block h-[152px] w-full border-0"
              title={`${song.title} Spotify oynatıcı`}
            />
          </div>
        ) : (
          <div className="flex min-h-[152px] items-center justify-center rounded-[18px] border border-white/25 bg-[#282828] p-6 text-center shadow-[0_10px_24px_rgba(75,35,45,0.08)]">
            <p className="text-[13px] font-semibold leading-6 text-white/80">
              Spotify bağlantısı yakında.
            </p>
          </div>
        )}

        <div className="px-1 pt-1 pb-1">
          {song.description ? (
            <p className="text-[13px] leading-relaxed text-[#4B232D]/75">
              {song.description}
            </p>
          ) : null}

          <div className={`${song.description ? "mt-3.5" : ""} grid grid-cols-4 gap-1.5`}>
            <Link
              href={`/sarkilarim/${song.slug}`}
              className="inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/60 bg-white/84 px-1.5 text-center text-[10px] font-semibold leading-none text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Detaylar
            </Link>

            <a
              href={song.spotify_url || "#"}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/60 bg-white/84 px-1.5 text-center text-[10px] font-semibold leading-none text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white ${
                song.spotify_url ? "" : "pointer-events-none opacity-45"
              }`}
            >
              Spotify
            </a>

            <a
              href={song.apple_music_url || "#"}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/60 bg-white/84 px-1.5 text-center text-[10px] font-semibold leading-none text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white ${
                song.apple_music_url ? "" : "pointer-events-none opacity-45"
              }`}
            >
              Apple
            </a>

            <MediaDownloadButton
              contentType="song"
              slug={song.slug}
              title={song.title}
              hasAudioFile={getDownloadAvailability(song).hasAudioFile}
              hasVideoFile={getDownloadAvailability(song).hasVideoFile}
              className="inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-1.5 text-center text-[10px] font-semibold leading-none text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
              label="İndir"
            />
          </div>
        </div>
      </article>

      <article className="hidden overflow-hidden rounded-[32px] border border-white/40 bg-white/56 p-6 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:block lg:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="flex h-full min-h-[152px] flex-col justify-between py-1">
            <div>
              <p className="section-eyebrow">Şarkılarım</p>

              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[clamp(30px,2.8vw,42px)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#4B232D]">
                  {song.title}
                </h3>

                <p className="text-sm font-medium text-[#4B232D]/60">
                  {song.artist}
                </p>
              </div>

              {song.description ? (
                <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-[#4B232D]/70">
                  {song.description}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-nowrap items-center gap-2.5">
              <Link
                href={`/sarkilarim/${song.slug}`}
                className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/60 bg-white/84 px-4 text-center text-[11px] font-semibold leading-none text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Detaylar
              </Link>

              <a
                href={song.spotify_url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Spotify"
                title="Spotify"
                className={`inline-flex min-h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/84 text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white ${
                  song.spotify_url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaSpotify className="text-[16px]" />
              </a>

              <a
                href={song.apple_music_url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Apple Music"
                title="Apple Music"
                className={`inline-flex min-h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/84 text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] transition hover:-translate-y-0.5 hover:bg-white ${
                  song.apple_music_url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaApple className="text-[16px]" />
              </a>

              <MediaDownloadButton
                contentType="song"
                slug={song.slug}
                title={song.title}
                hasAudioFile={getDownloadAvailability(song).hasAudioFile}
                hasVideoFile={getDownloadAvailability(song).hasVideoFile}
                className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-4 text-center text-[11px] font-semibold leading-none text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7ba65]"
                label="İndir"
              />
            </div>
          </div>

          {song.spotify_embed_url ? (
            <div className="overflow-hidden rounded-[24px] border border-white/25 bg-[#282828] shadow-[0_16px_40px_rgba(75,35,45,0.08)]">
              <iframe
                src={song.spotify_embed_url}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block h-[152px] w-full border-0"
                title={`${song.title} Spotify oynatıcı`}
              />
            </div>
          ) : (
            <div className="flex min-h-[152px] items-center justify-center rounded-[24px] border border-white/25 bg-[#282828] p-6 text-center shadow-[0_16px_40px_rgba(75,35,45,0.08)]">
              <p className="text-[13px] font-semibold leading-6 text-white/80">
                Spotify bağlantısı yakında.
              </p>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function GalleryPreview({ item }: { item: GalleryItem }) {
  const previewImage = getPreviewImage(item);
  const isVideo = item.media_type === "video";

  return (
    <Link
      href={`/fotograflar/${item.id}`}
      className="group relative block aspect-[9/16] overflow-hidden rounded-[18px] border border-white/30 bg-[#4B232D]/25 shadow-[0_8px_22px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(75,35,45,0.14)]"
      aria-label={`${item.title} detayına git`}
    >
      {previewImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewImage}
          alt={item.alt_text || item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/60 p-3 text-center">
          <p className="text-[10px] font-bold leading-5 text-[#4B232D]/70">
            Görsel yakında
          </p>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,35,45,0),rgba(75,35,45,0.34))] opacity-70" />

      {isVideo ? (
        <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/88 text-[11px] font-black text-[#4B232D] shadow-[0_8px_20px_rgba(75,35,45,0.18)] backdrop-blur-[10px]">
          ▶
        </span>
      ) : null}
    </Link>
  );
}

export default async function Home() {
  const [{ songs, covers, galleryItems, announcement }, siteTexts] =
    await Promise.all([getHomepageMedia(), getPublicSiteTexts()]);

  const settings = siteTexts.settings;
  const text = (key: string) => t(settings, key);
  const contactEmail = text("contact.email");
  const gmailComposeUrl = getGmailComposeUrl(contactEmail);
  const aboutPoints = [
    text("contact.point_1"),
    text("contact.point_2"),
    text("contact.point_3"),
  ].filter(Boolean);

  return (
    <main className="page-shell">
      <Navbar />

      <section id="home" className="site-container scroll-mt-32 pt-4 md:pt-10">
        <article className="relative flex min-h-[360px] flex-col justify-end pb-4 sm:min-h-[440px] md:min-h-[calc(100vh-160px)] md:pb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#4B232D]/75 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5AE50] animate-pulse" />
              Müzik · Sözler · Hikâyeler
            </span>

            <h1 className="mt-4 text-[clamp(42px,5.8vw,80px)] font-light leading-[0.94] tracking-[-0.055em] text-[#4B232D]">
              Muhammed <span className="font-semibold">Tankılıç</span>
            </h1>

            <p className="mt-3.5 max-w-lg text-[14px] font-light leading-relaxed text-[#4B232D]/75 md:text-[16px]">
              Akustik tellerin, geleneksel ezgilerin ve modern indie tınıların kesiştiği yerde.
            </p>
          </div>

          <div className="mt-7 max-w-3xl rounded-[26px] border border-white/40 bg-white/60 p-4 shadow-[0_14px_40px_rgba(75,35,45,0.06)] backdrop-blur-[20px] md:flex md:items-center md:justify-between md:gap-6 md:p-6">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/55">
                {announcement.eyebrow || "Öne Çıkan"}
              </p>

              <h2 className="mt-1 text-[20px] font-semibold leading-tight tracking-[-0.04em] text-[#4B232D] md:text-[24px]">
                {announcement.title}
              </h2>

              <p className="mt-1.5 max-w-xl text-[12px] font-light leading-relaxed text-[#4B232D]/70 md:text-[13.5px]">
                {announcement.description}
              </p>
            </div>

            <div className="mt-3.5 flex-none sm:mt-0">
              <AnnouncementButton announcement={announcement} />
            </div>
          </div>
        </article>
      </section>

      <section id="coverlarim" className="site-container scroll-mt-32 section-space">
        <SectionHeader
          title={text("homepage.cover_section_title")}
          href="/coverlarim"
          action={text("homepage.cover_all_button")}
        />

        <div className="grid gap-3 md:gap-5">
          {covers.length > 0 ? (
            covers.map((cover) => <CoverCard key={cover.id} cover={cover} />)
          ) : (
            <div className="rounded-[28px] border border-white/35 bg-white/60 p-6 text-center shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
              <p className="text-2xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                Henüz yayında cover yok.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="sarkilarim" className="site-container scroll-mt-32 section-space">
        <SectionHeader
          title={text("homepage.song_section_title")}
          href="/sarkilarim"
          action={text("homepage.song_all_button")}
        />

        <div className="grid gap-3 md:gap-5">
          {songs.length > 0 ? (
            songs.map((song) => <SongCard key={song.id} song={song} />)
          ) : (
            <div className="rounded-[28px] border border-white/35 bg-white/60 p-6 text-center shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
              <p className="text-2xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                Henüz yayında şarkı yok.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="fotograflar" className="site-container scroll-mt-32 section-space">
        <SectionHeader
          title={text("homepage.photo_section_title")}
          href="/fotograflar"
          action={text("homepage.photo_all_button")}
        />

        <div className="overflow-hidden rounded-[24px] border border-white/35 bg-white/58 p-2.5 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-4">
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5 md:gap-3">
              {galleryItems.map((item) => (
                <GalleryPreview key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-white/42 bg-white/82 px-5 py-7 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:rounded-[28px] md:px-8 md:py-10">
              <h2 className="mx-auto max-w-xl text-[clamp(26px,7vw,42px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Henüz yayında fotoğraf yok.
              </h2>
            </div>
          )}
        </div>
      </section>

      <section id="iletisim" className="site-container scroll-mt-32 section-space">
        <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/55 p-7 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[20px] md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(189,235,232,0.18),transparent_40%),radial-gradient(circle_at_88%_12%,rgba(245,174,80,0.10),transparent_35%)]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(28px,3.6vw,48px)] font-light leading-tight tracking-[-0.05em] text-[#4B232D]">
              Birlikte bir ezgi, <span className="font-semibold">yeni bir hikâye.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[14px] font-light leading-relaxed text-[#4B232D]/75 md:text-[16px]">
              Müzik çalışmaları, konser ve sahne talepleri ya da sanatsal iş birlikleri için doğrudan iletişime geçebilirsiniz.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/50 bg-white/80 px-6 text-[13px] font-semibold text-[#4B232D] shadow-[0_6px_18px_rgba(75,35,45,0.04)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-[#F5AE50]"
              >
                <span>✉</span>
                <span>{contactEmail}</span>
              </a>

              <Link
                href="/iletisim"
                className="inline-flex min-h-11 items-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50] px-6 text-[13px] font-semibold text-[#4B232D] shadow-[0_8px_20px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7ba65]"
              >
                İletişim Sayfası →
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {platformLinks.map(({ title, href, Icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={title}
                  title={title}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/80 text-[#4B232D] shadow-[0_4px_14px_rgba(75,35,45,0.04)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#F5AE50] hover:text-[#4B232D]"
                >
                  <Icon className="text-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>{text("footer.copyright")}</p>
        <span>{text("footer.credit")}</span>
      </footer>
    </main>
  );
}
