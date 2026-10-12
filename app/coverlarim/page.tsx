import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MediaDownloadButton from "@/components/MediaDownloadButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Coverlarım | Muhammed Tankılıç",
  description:
    "YouTube ve Instagram üzerinden paylaştığım cover yorumlarım ve kısa performanslarım.",
};

type CoverRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  release_status: "draft" | "published" | "hidden";
  youtube_url: string | null;
  youtube_embed_url: string | null;
  instagram_url: string | null;
  download_file_path: string | null;
  video_download_file_path: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

type PublicCover = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  description: string;
  youtubeUrl: string | null;
  youtubeEmbedUrl: string | null;
  instagramUrl: string | null;
  hasAudioDownload: boolean;
  hasVideoDownload: boolean;
};

const youtubeChannelUrl = "https://www.youtube.com/@muhammedtanklc";

const mobileButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-full border border-white/50 px-3 text-center text-[11px] font-semibold leading-none transition hover:-translate-y-0.5";

const desktopButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-white/60 px-4 text-center text-[12px] font-semibold transition hover:-translate-y-0.5";

const orangeButtonClass =
  "border-[#F5AE50]/60 bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_20px_rgba(245,174,80,0.18)] hover:bg-[#f7ba65]";

const whiteButtonClass = "bg-white/80 text-[#4B232D] shadow-[0_6px_14px_rgba(75,35,45,0.04)] hover:bg-white";

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
      return parsedUrl.pathname.replace("/", "").split("?")[0] || null;
    }

    if (parsedUrl.pathname.includes("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0] || null;
    }

    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return videoId;
    }

    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0] || null;
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

function mapCoverToPublicCover(cover: CoverRow): PublicCover {
  return {
    id: cover.id,
    slug: cover.slug,
    title: cover.title,
    artist: "Muhammed Tankılıç",
    description:
      cover.description ??
      "YouTube kanalımda paylaştığım cover yorumlarımdan biri.",
    youtubeUrl: cover.youtube_url,
    youtubeEmbedUrl: getYoutubeEmbedUrl(
      cover.youtube_url,
      cover.youtube_embed_url,
    ),
    instagramUrl: cover.instagram_url,
    hasAudioDownload: Boolean(String(cover.download_file_path ?? "").trim()),
    hasVideoDownload: Boolean(String(cover.video_download_file_path ?? "").trim()),
  };
}

function MobileCoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <article className="grid gap-3 overflow-hidden rounded-[24px] border border-white/40 bg-white/58 p-3.5 shadow-[0_12px_32px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:hidden">
      {cover.youtubeEmbedUrl ? (
        <div className="overflow-hidden rounded-[18px] border border-white/25 bg-[#4B232D]/90 shadow-[0_10px_24px_rgba(75,35,45,0.10)]">
          <iframe
            src={cover.youtubeEmbedUrl}
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
          {cover.description}
        </p>

        <div className="mt-3.5 grid grid-cols-[1fr_88px] gap-2">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className={`${mobileButtonClass} ${orangeButtonClass}`}
          >
            ← Kanalım
          </a>

          <MediaDownloadButton
            contentType="cover"
            slug={cover.slug}
            title={cover.title}
            hasAudioFile={cover.hasAudioDownload}
            hasVideoFile={cover.hasVideoDownload}
            className={`${mobileButtonClass} ${whiteButtonClass} w-full`}
            label="İndir"
          />
        </div>
      </div>
    </article>
  );
}

function DesktopCoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <article className="hidden overflow-hidden rounded-[32px] border border-white/40 bg-white/56 p-6 shadow-[0_16px_45px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:block lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex h-full min-h-[300px] flex-col justify-between py-1">
          <div>
            <p className="section-eyebrow">Coverlarım</p>

            <h2 className="mt-3 max-w-[14ch] break-words text-[clamp(34px,3.5vw,52px)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#4B232D]">
              {cover.title}
            </h2>

            <p className="mt-3 text-sm font-medium text-[#4B232D]/60">
              {cover.artist}
            </p>

            <p className="mt-5 max-w-[38ch] text-[14px] leading-relaxed text-[#4B232D]/70">
              {cover.description}
            </p>
          </div>

          <div className="mt-6 flex max-w-[360px] items-center gap-3">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className={`${desktopButtonClass} ${orangeButtonClass}`}
            >
              Kanalım
            </a>

            <MediaDownloadButton
              contentType="cover"
              slug={cover.slug}
              title={cover.title}
              hasAudioFile={cover.hasAudioDownload}
              hasVideoFile={cover.hasVideoDownload}
              className={`${desktopButtonClass} ${whiteButtonClass}`}
              label="Siteden İndir"
            />
          </div>
        </div>

        {cover.youtubeEmbedUrl ? (
          <div className="overflow-hidden rounded-[24px] border border-white/25 bg-[#4B232D]/90 shadow-[0_16px_40px_rgba(75,35,45,0.10)]">
            <iframe
              src={cover.youtubeEmbedUrl}
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
  );
}

function CoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <div id={cover.slug} className="scroll-mt-32">
      <MobileCoverPanel cover={cover} />
      <DesktopCoverPanel cover={cover} />
    </div>
  );
}

export default async function CoverlarimPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
        download_file_path,
        video_download_file_path,
        sort_order,
        published_at,
        created_at
      `,
    )
    .eq("release_status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const covers = ((data ?? []) as CoverRow[]).map(mapCoverToPublicCover);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-4 md:pt-6">
        <div className="mb-3 hidden items-end justify-between gap-4 md:mb-5 md:flex">
          <div>
            <p className="section-eyebrow">Coverlarım</p>
            <h1 className="text-[clamp(34px,4.6vw,58px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
              Cover yorumlarım
            </h1>
          </div>

          <Link href="/sarkilarim" className="pill-button secondary">
            Şarkılarım
          </Link>
        </div>

        {error ? (
          <div className="rounded-[28px] border border-red-200/70 bg-red-50/80 p-5 text-[12px] leading-6 text-red-800 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
            <p className="font-bold">Coverlar şu anda yüklenemedi.</p>
            <p className="mt-1">{error.message}</p>
          </div>
        ) : null}

        {!error && covers.length === 0 ? (
          <div className="rounded-[28px] border border-white/35 bg-white/60 p-6 text-center shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
            <p className="text-2xl font-semibold tracking-[-0.06em] text-[#4B232D]">
              Henüz yayında cover yok.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#4B232D]/70">
              Yeni cover yorumlarımı YouTube ve Instagram’da paylaştıkça bu
              sayfada listeleyeceğim.
            </p>
          </div>
        ) : null}

        {!error && covers.length > 0 ? (
          <div className="grid gap-3 md:gap-5">
            {covers.map((cover) => (
              <CoverPanel key={cover.id} cover={cover} />
            ))}
          </div>
        ) : null}
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}
