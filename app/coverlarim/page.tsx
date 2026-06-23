import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
};

const youtubeChannelUrl = "https://www.youtube.com/@muhammedtanklc";

const mobileButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/12 px-3 text-center text-[11px] font-bold leading-none text-[#4B232D] transition hover:-translate-y-0.5";

const desktopButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#4B232D]/12 px-4 text-center text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5";

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
  };
}

function MobileCoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <article className="grid gap-2 overflow-hidden rounded-[22px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:hidden">
      {cover.youtubeEmbedUrl ? (
        <div className="overflow-hidden rounded-[18px] border border-white/24 bg-[#4B232D]/88 shadow-[0_12px_30px_rgba(75,35,45,0.12)]">
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
        <div className="flex aspect-video items-center justify-center rounded-[18px] border border-white/24 bg-[#4B232D]/88 p-5 text-center text-xs font-bold text-white/80 shadow-[0_12px_30px_rgba(75,35,45,0.12)]">
          Bu cover için henüz video bağlantısı eklenmedi.
        </div>
      )}

      <div className="rounded-[18px] border border-[#4B232D]/10 bg-white/58 px-4 py-3.5 shadow-[0_10px_24px_rgba(75,35,45,0.045)] backdrop-blur-[12px]">
        <p className="text-[12px] leading-6 text-[#4B232D]/74">
          {cover.description}
        </p>

        <div className="mt-3 grid grid-cols-[1fr_88px] gap-2">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className={`${mobileButtonClass} bg-[#FFF4BC]/88 hover:bg-[#FFF4BC]`}
          >
            ← YouTube Kanalım
          </a>

          <Link
            href="/giris"
            className={`${mobileButtonClass} bg-white/76 hover:bg-white/90`}
          >
            İndir
          </Link>
        </div>
      </div>
    </article>
  );
}

function DesktopCoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <article className="hidden overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:block">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="flex h-full min-h-[312px] flex-col justify-between rounded-[28px] border border-[#4B232D]/10 bg-white/48 p-7 shadow-[0_12px_34px_rgba(75,35,45,0.045)]">
          <div>
            <p className="section-eyebrow">Coverlarım</p>

            <h2 className="mt-4 max-w-[12ch] break-words text-[clamp(38px,4vw,58px)] font-semibold leading-[0.92] tracking-[-0.08em] text-[#4B232D]">
              {cover.title}
            </h2>

            <p className="mt-4 text-sm font-medium text-[#4B232D]/64">
              {cover.artist}
            </p>

            <p className="mt-6 max-w-[36ch] text-sm leading-7 text-[#4B232D]/70">
              {cover.description}
            </p>
          </div>

          <div className="mt-7 grid max-w-[390px] grid-cols-2 gap-3">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className={`${desktopButtonClass} bg-[#FFF4BC]/86 hover:bg-[#FFF4BC]`}
            >
              YouTube Kanalım
            </a>

            <Link
              href="/giris"
              className={`${desktopButtonClass} bg-white/72 hover:bg-white/90`}
            >
              Siteden İndir
            </Link>
          </div>
        </div>

        {cover.youtubeEmbedUrl ? (
          <div className="overflow-hidden rounded-[28px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
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
          <div className="flex aspect-video items-center justify-center rounded-[28px] border border-white/24 bg-[#4B232D]/88 p-6 text-center text-sm font-bold text-white/80 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
            Bu cover için henüz video bağlantısı eklenmedi.
          </div>
        )}
      </div>
    </article>
  );
}

function CoverPanel({ cover }: { cover: PublicCover }) {
  return (
    <>
      <MobileCoverPanel cover={cover} />
      <DesktopCoverPanel cover={cover} />
    </>
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

      <section className="site-container pt-40 md:pt-4">
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
        <span>Coverlarım · YouTube · Instagram</span>
      </footer>
    </main>
  );
}