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
    <div className="mb-3 flex items-end justify-between gap-4 md:mb-5">
      <h2 className="text-[clamp(32px,4.4vw,56px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
        {title}
      </h2>

      <Link href={href} className="pill-button secondary hidden md:inline-flex">
        {action}
      </Link>
    </div>
  );
}

function AnnouncementButton({ announcement }: { announcement: HomepageAnnouncement }) {
  const className =
    "mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full !bg-[#4B232D] px-5 text-[11px] font-bold !text-white shadow-[0_12px_30px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:!bg-[#5a2b36] sm:w-auto md:mt-0 md:min-h-11 md:px-7 md:text-xs";

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
      <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
        {embedUrl ? (
          <div className="overflow-hidden rounded-[18px] border border-white/24 bg-[#4B232D]/88 shadow-[0_12px_30px_rgba(75,35,45,0.12)]">
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
          <div className="flex aspect-video items-center justify-center rounded-[18px] border border-white/24 bg-[#4B232D]/88 p-5 text-center text-xs font-bold text-white/80 shadow-[0_12px_30px_rgba(75,35,45,0.12)]">
            Bu cover için henüz video bağlantısı eklenmedi.
          </div>
        )}

        <div className="rounded-[18px] border border-[#4B232D]/10 bg-white/58 px-4 py-3.5 shadow-[0_10px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px]">
          <p className="text-[12px] leading-6 text-[#4B232D]/74">
            {cover.description ??
              "YouTube kanalımda paylaştığım cover yorumlarımdan biri."}
          </p>

          <div className="mt-3 grid grid-cols-[1fr_88px] gap-2">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-3 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
            >
              ← Kanalım
            </a>

            <MediaDownloadButton
              contentType="cover"
              slug={cover.slug}
              title={cover.title}
              hasAudioFile={getDownloadAvailability(cover).hasAudioFile}
              hasVideoFile={getDownloadAvailability(cover).hasVideoFile}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/76 px-3 text-center text-[11px] font-bold leading-none text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90"
              label="İndir"
            />
          </div>
        </div>
      </article>

      <article className="hidden overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="flex h-full min-h-[312px] flex-col justify-between rounded-[28px] border border-[#4B232D]/10 bg-white/48 p-7 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
            <div>
              <p className="section-eyebrow">Coverlarım</p>

              <h3 className="mt-4 max-w-[12ch] break-words text-[clamp(38px,4vw,58px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
                {cover.title}
              </h3>

              <p className="mt-4 text-sm font-medium text-[#4B232D]/64">
                Muhammed Tankılıç
              </p>

              <p className="mt-6 max-w-[36ch] text-sm leading-7 text-[#4B232D]/70">
                {cover.description ??
                  "YouTube kanalımda paylaştığım cover yorumlarımdan biri."}
              </p>
            </div>

            <div className="mt-7 grid max-w-[390px] grid-cols-2 gap-3">
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-4 text-center text-[12px] font-bold text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
              >
                Kanalım
              </a>

              <MediaDownloadButton
                contentType="cover"
                slug={cover.slug}
                title={cover.title}
                hasAudioFile={getDownloadAvailability(cover).hasAudioFile}
                hasVideoFile={getDownloadAvailability(cover).hasVideoFile}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/76 px-4 text-center text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90"
                label="Siteden İndir"
              />
            </div>
          </div>

          {embedUrl ? (
            <div className="overflow-hidden rounded-[28px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
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
            <div className="flex aspect-video items-center justify-center rounded-[28px] border border-white/24 bg-[#4B232D]/88 p-6 text-center text-sm font-bold text-white/80 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
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
      <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
        {song.spotify_embed_url ? (
          <div className="overflow-hidden rounded-[18px] border border-white/24 bg-[#535353] shadow-[0_12px_30px_rgba(75,35,45,0.10)]">
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
          <div className="flex min-h-[152px] items-center justify-center rounded-[18px] border border-white/24 bg-[#535353] p-6 text-center shadow-[0_12px_30px_rgba(75,35,45,0.10)]">
            <p className="text-[13px] font-bold leading-6 text-white/80">
              Spotify bağlantısı yakında.
            </p>
          </div>
        )}

        <div className="rounded-[18px] border border-[#4B232D]/10 bg-white/58 px-4 py-3.5 shadow-[0_10px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px]">
          {song.description ? (
            <p className="text-[12px] leading-6 text-[#4B232D]/74">
              {song.description}
            </p>
          ) : null}

          <div className={`${song.description ? "mt-3" : ""} grid grid-cols-4 gap-1.5`}>
            <Link
              href={`/sarkilarim/${song.slug}`}
              className="inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/22 bg-white/84 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.055)] transition hover:-translate-y-0.5 hover:bg-white/95"
            >
              Detaylar
            </Link>

            <a
              href={song.spotify_url || "#"}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/22 bg-white/84 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.055)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                song.spotify_url ? "" : "pointer-events-none opacity-45"
              }`}
            >
              Spotify
            </a>

            <a
              href={song.apple_music_url || "#"}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/22 bg-white/84 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.055)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
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
              className="inline-flex min-h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-1.5 text-center text-[10px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
              label="İndir"
            />
          </div>
        </div>
      </article>

      <article className="hidden overflow-hidden rounded-[32px] border border-white/35 bg-white/56 p-4 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
        <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <div className="flex h-full min-h-[152px] flex-col justify-between rounded-[26px] border border-[#4B232D]/10 bg-white/48 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
            <div>
              <p className="section-eyebrow">Şarkılarım</p>

              <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h3 className="text-[clamp(34px,3vw,44px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
                  {song.title}
                </h3>

                <p className="pb-1.5 text-sm font-medium text-[#4B232D]/64">
                  {song.artist}
                </p>
              </div>

              {song.description ? (
                <p className="mt-4 max-w-[42ch] text-sm leading-7 text-[#4B232D]/72">
                  {song.description}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-nowrap items-center gap-2">
              <Link
                href={`/sarkilarim/${song.slug}`}
                className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4B232D]/18 bg-white/84 px-3.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95"
              >
                Detaylar
              </Link>

              <a
                href={song.spotify_url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Spotify"
                title="Spotify"
                className={`inline-flex min-h-9 w-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                  song.spotify_url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaSpotify className="text-[17px]" />
              </a>

              <a
                href={song.apple_music_url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Apple Music"
                title="Apple Music"
                className={`inline-flex min-h-9 w-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                  song.apple_music_url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaApple className="text-[17px]" />
              </a>

              <MediaDownloadButton
                contentType="song"
                slug={song.slug}
                title={song.title}
                hasAudioFile={getDownloadAvailability(song).hasAudioFile}
                hasVideoFile={getDownloadAvailability(song).hasVideoFile}
                className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-3.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
                label="İndir"
              />
            </div>
          </div>

          {song.spotify_embed_url ? (
            <div className="overflow-hidden rounded-[26px] border border-white/24 bg-[#535353] shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
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
            <div className="flex min-h-[152px] items-center justify-center rounded-[26px] border border-white/24 bg-[#535353] p-6 text-center shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
              <p className="text-[13px] font-bold leading-6 text-white/80">
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

      <section id="home" className="site-container scroll-mt-32 pt-1 md:pt-4">
        <article className="relative flex min-h-[335px] flex-col justify-end sm:min-h-[430px] md:min-h-[calc(100vh-132px)]">
          <div className="rounded-[22px] border border-white/28 bg-white/14 p-2 shadow-[0_16px_44px_rgba(75,35,45,0.08)] backdrop-blur-[16px] sm:p-3 md:rounded-[28px] md:p-4">
            <div className="rounded-[20px] border border-[#4B232D]/10 bg-white/90 px-4 py-4 text-center shadow-[0_12px_34px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:flex md:items-center md:justify-between md:gap-5 md:rounded-[24px] md:bg-white/78 md:px-6 md:py-5 md:text-left">
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/58 md:text-[10px] md:tracking-[0.22em]">
                  {announcement.eyebrow}
                </p>

                <h1 className="mt-1.5 text-[24px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(26px,2.8vw,38px)]">
                  {announcement.title}
                </h1>

              <p className="mx-auto mt-2 max-w-[280px] text-[12px] leading-5 text-[#4B232D]/68 md:mx-0 md:max-w-xl md:text-sm md:leading-6">
                  {announcement.description}
                </p>
              </div>

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
        <div className="relative overflow-hidden rounded-[24px] border border-white/35 bg-white/66 px-3.5 py-4 shadow-[0_14px_38px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:rounded-[38px] md:px-10 md:py-10 lg:px-12 lg:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(245,174,80,0.10),transparent_32%)]" />

          <div className="relative mx-auto max-w-7xl">
            <header className="mx-auto text-center">
              <p className="section-eyebrow mb-0">İletişim</p>
            </header>

            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[18px] border border-[#4B232D]/10 bg-white/76 px-3 text-center text-[14px] font-medium tracking-[-0.03em] text-[#4B232D] shadow-[0_8px_24px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:bg-white/85 hover:text-[#F5AE50] md:mt-7 md:min-h-14 md:rounded-[24px] md:px-6 md:text-lg"
            >
              {contactEmail}
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2 md:mt-5 md:gap-4">
              <Link
                href="/"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F5AE50]/90 px-3 text-center text-[13px] font-bold !text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-12 md:px-6 md:text-base"
              >
                {text("contact.button.menu")}
              </Link>

              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F5AE50]/90 px-3 text-center text-[13px] font-bold !text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-12 md:px-6 md:text-base"
              >
                {text("contact.button.mail")}
              </a>

              <Link
                href="/sarkilarim"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F5AE50]/90 px-3 text-center text-[13px] font-bold !text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-12 md:px-6 md:text-base"
              >
                {text("contact.button.songs")}
              </Link>
            </div>

            <ul className="mt-4 grid gap-2 text-[12px] leading-5 text-[#4B232D]/78 md:mt-8 md:grid-cols-3 md:gap-4 md:text-sm md:leading-7">
              {aboutPoints.map((item) => (
                <li
                  key={item}
                  className="grid min-h-[64px] grid-cols-[8px_1fr] items-start gap-2 rounded-[17px] border border-white/42 bg-white/62 px-3.5 py-3 shadow-[0_8px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px] md:min-h-[108px] md:grid-cols-[10px_1fr] md:gap-3 md:rounded-[24px] md:px-5 md:py-5"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#F5AE50]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-4 gap-2 md:mt-6 md:gap-4">
              {platformLinks.map(({ title, href, Icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={title}
                  title={title}
                  className="group flex min-h-12 items-center justify-center rounded-[18px] border border-white/42 bg-white/72 text-[#4B232D] shadow-[0_8px_22px_rgba(75,35,45,0.055)] backdrop-blur-[12px] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] hover:text-[#4B232D] md:min-h-16 md:rounded-[24px]"
                >
                  <Icon className="text-[22px] transition group-hover:scale-110 md:text-[30px]" />
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
