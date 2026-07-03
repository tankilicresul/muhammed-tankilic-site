import Link from "next/link";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import {
  latestSong,
  publishedSongs,
  type MusicPlatform,
  type Song,
} from "@/lib/data/songs";

type CoverRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  release_status: "draft" | "published" | "hidden";
  youtube_url: string | null;
  youtube_embed_url: string | null;
  instagram_url: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
  media_type: "photo" | "video";
  video_url: string | null;
  video_embed_url: string | null;
  thumbnail_url: string | null;
  release_status: "draft" | "published" | "hidden";
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

const announcement = {
  type: "song" as "song" | "cover",
  eyebrow: "Yeni Şarkım Çıktı",
  title: `${latestSong.title} yayında.`,
  description: "Spotify ve Apple Music’te dinleyebilirsin.",
  href: `/sarkilarim/${latestSong.slug}`,
};

const announcementButtonLabel =
  announcement.type === "cover" ? "Covera Git →" : "Şarkıya Git →";

const youtubeChannelUrl = "https://www.youtube.com/@muhammedtanklc";
const email = "muhammedtnklc@gmail.com";

const gmailComposeUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=muhammedtnklc@gmail.com&su=%C4%B0leti%C5%9Fim%20Talebi";

const aboutPoints = [
  "Kürtçe şarkılarımı, bestelerimi ve yorumlarımı paylaşıyorum.",
  "Resmi yayınlarım Spotify ve Apple Music’te yer alıyor.",
  "Yayın, video, görsel ve iş birliği için bana yazabilirsin.",
];

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

function getPlatform(song: Song, name: MusicPlatform["name"]) {
  return song.platforms.find((platform) => platform.name === name);
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
              ← YouTube Kanalım
            </a>

            <Link
              href="/giris"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/76 px-3 text-center text-[11px] font-bold leading-none text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              İndir
            </Link>
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
                YouTube Kanalım
              </a>

              <Link
                href="/giris"
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/72 px-4 text-center text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Siteden İndir
              </Link>
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

function SongCard({ song }: { song: Song }) {
  const spotify = getPlatform(song, "Spotify");
  const appleMusic = getPlatform(song, "Apple Music");

  return (
    <>
      <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
        {song.spotifyEmbedUrl ? (
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
        ) : (
          <div className="flex min-h-[152px] items-center justify-center rounded-[18px] border border-white/24 bg-[#535353] p-6 text-center shadow-[0_12px_30px_rgba(75,35,45,0.10)]">
            <p className="text-[12px] font-bold leading-6 text-white/80">
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

          <div className={`${song.description ? "mt-3" : ""} grid grid-cols-4 gap-2`}>
            <Link
              href={`/sarkilarim/${song.slug}`}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 px-2 text-center text-[10.5px] font-bold leading-none text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95"
            >
              Detaylar
            </Link>

            <a
              href={spotify?.url || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Spotify"
              title="Spotify"
              className={`inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                spotify?.url ? "" : "pointer-events-none opacity-45"
              }`}
            >
              <FaSpotify className="text-[18px]" />
            </a>

            <a
              href={appleMusic?.url || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Apple Music"
              title="Apple Music"
              className={`inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                appleMusic?.url ? "" : "pointer-events-none opacity-45"
              }`}
            >
              <FaApple className="text-[18px]" />
            </a>

            <Link
              href="/giris"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-2 text-center text-[10.5px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
            >
              İndir
            </Link>
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
                href={spotify?.url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Spotify"
                title="Spotify"
                className={`inline-flex min-h-9 w-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                  spotify?.url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaSpotify className="text-[17px]" />
              </a>

              <a
                href={appleMusic?.url || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Apple Music"
                title="Apple Music"
                className={`inline-flex min-h-9 w-10 shrink-0 items-center justify-center rounded-full border border-[#4B232D]/18 bg-white/84 text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 ${
                  appleMusic?.url ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <FaApple className="text-[17px]" />
              </a>

              <Link
                href="/giris"
                className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-3.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50]"
              >
                İndir
              </Link>
            </div>
          </div>

          {song.spotifyEmbedUrl ? (
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

export default async function Home() {
  const supabase = await createClient();

  const { data: coverData } = await supabase
    .from("covers")
    .select(
      `
        id,
        slug,
        title,
        description,
        release_status,
        youtube_url,
        youtube_embed_url,
        instagram_url,
        sort_order,
        published_at,
        created_at
      `,
    )
    .eq("release_status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const { data: photoData } = await supabase
    .from("photos")
    .select(
      `
        id,
        title,
        description,
        image_url,
        alt_text,
        media_type,
        video_url,
        video_embed_url,
        thumbnail_url,
        release_status,
        sort_order,
        published_at,
        created_at
      `,
    )
    .eq("release_status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const covers = (coverData ?? []) as CoverRow[];
  const galleryItems = (photoData ?? []) as GalleryItem[];

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

              <Link
                href={announcement.href}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full !bg-[#4B232D] px-5 text-[11px] font-bold !text-white shadow-[0_12px_30px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:!bg-[#5a2b36] sm:w-auto md:mt-0 md:min-h-11 md:px-7 md:text-xs"
              >
                {announcementButtonLabel}
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section id="coverlarim" className="site-container scroll-mt-32 section-space">
        <SectionHeader
          title="Coverlarım"
          href="/coverlarim"
          action="Tüm Coverlar"
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
          title="Şarkılarım"
          href="/sarkilarim"
          action="Tüm Şarkılar"
        />

        <div className="grid gap-3 md:gap-5">
          {publishedSongs.map((song) => (
            <SongCard key={song.slug} song={song} />
          ))}
        </div>
      </section>

      <section id="fotograflar" className="site-container scroll-mt-32 section-space">
        <SectionHeader
          title="Fotoğraflarım"
          href="/fotograflar"
          action="Tüm Fotoğraflar"
        />

        <div className="overflow-hidden rounded-[24px] border border-white/35 bg-white/58 p-2.5 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-4">
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5 md:gap-3">
              {galleryItems.map((item) => {
                const previewImage = getPreviewImage(item);
                const isVideo = item.media_type === "video";

                return (
                  <Link
                    key={item.id}
                    href={`/fotograflar/${item.id}`}
                    className="group relative aspect-[9/16] overflow-hidden rounded-[10px] border border-white/30 bg-[#4B232D]/25 shadow-[0_8px_22px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(75,35,45,0.14)] md:rounded-[18px]"
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
                        <p className="text-[9px] font-bold leading-4 text-[#4B232D]/70 md:text-[10px] md:leading-5">
                          Görsel yakında
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,35,45,0),rgba(75,35,45,0.34))] opacity-70" />

                    {isVideo ? (
                      <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/88 text-[10px] font-black text-[#4B232D] shadow-[0_8px_20px_rgba(75,35,45,0.18)] backdrop-blur-[10px] md:right-2 md:top-2 md:h-7 md:w-7 md:text-[11px]">
                        ▶
                      </span>
                    ) : null}
                  </Link>
                );
              })}
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
              {email}
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2 md:mt-5 md:gap-4">
              <Link
                href="/"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F5AE50]/90 px-3 text-center text-[13px] font-bold !text-white shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-12 md:px-6 md:text-base"
              >
                ← Menü
              </Link>

              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#4B232D] px-3 text-center text-[13px] font-bold !text-white shadow-[0_12px_26px_rgba(75,35,45,0.22)] transition hover:-translate-y-0.5 hover:bg-[#5b2b37] md:min-h-12 md:px-6 md:text-base"
              >
                Mail At
              </a>

              <Link
                href="/sarkilarim"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F5AE50]/90 px-3 text-center text-[13px] font-bold !text-white shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-12 md:px-6 md:text-base"
              >
                Şarkılar →
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
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}