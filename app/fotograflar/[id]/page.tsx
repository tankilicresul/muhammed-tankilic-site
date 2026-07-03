import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fotoğraf Detayı | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç fotoğraf ve video arşivinden seçili paylaşım detayı.",
};

type PhotoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
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

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function isDirectVideoUrl(url: string | null) {
  if (!url) {
    return false;
  }

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default async function PhotoDetailPage({
  params,
}: PhotoDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .eq("id", id)
    .eq("release_status", "published")
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const item = data as GalleryItem;
  const isVideo = item.media_type === "video";
  const dateLabel = formatDate(item.published_at || item.created_at);
  const posterImage = item.thumbnail_url || item.image_url;

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-6">
        <div className="mx-auto max-w-5xl rounded-[24px] border border-white/35 bg-white/58 p-3 shadow-[0_16px_44px_rgba(75,35,45,0.10)] backdrop-blur-[16px] md:rounded-[38px] md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 md:mb-5">
            <Link
              href="/fotograflar"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/10 bg-[#4B232D] px-4 text-[11px] font-bold !text-white shadow-[0_10px_24px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5b2b37] md:min-h-10 md:text-xs"
            >
              ← Fotoğraflarım
            </Link>

            <span className="rounded-full bg-white/72 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/54">
              {isVideo ? "Video" : "Fotoğraf"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-[0.85fr_1.15fr] md:gap-5">
            <div className="overflow-hidden rounded-[22px] border border-white/35 bg-[#4B232D]/20 shadow-[0_14px_38px_rgba(75,35,45,0.10)] md:rounded-[30px]">
              {isVideo && item.video_embed_url ? (
                <iframe
                  src={item.video_embed_url}
                  title={`${item.title} videosu`}
                  className="block aspect-[9/16] w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : null}

              {isVideo &&
              !item.video_embed_url &&
              isDirectVideoUrl(item.video_url) ? (
                <video
                  src={item.video_url ?? undefined}
                  poster={posterImage ?? undefined}
                  controls
                  playsInline
                  className="block aspect-[9/16] w-full bg-black object-cover"
                />
              ) : null}

              {isVideo &&
              !item.video_embed_url &&
              item.video_url &&
              !isDirectVideoUrl(item.video_url) ? (
                <div className="relative aspect-[9/16] overflow-hidden">
                  {posterImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={posterImage}
                      alt={item.alt_text || item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/68 p-6 text-center">
                      <p className="text-sm font-bold text-[#4B232D]/70">
                        Video bağlantısı hazır.
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-[#4B232D]/28">
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-[#4B232D] shadow-[0_14px_34px_rgba(75,35,45,0.22)] transition hover:-translate-y-0.5"
                    >
                      Videoyu Aç →
                    </a>
                  </div>
                </div>
              ) : null}

              {!isVideo ? (
                item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.title}
                    className="block aspect-[9/16] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[9/16] items-center justify-center bg-white/68 p-6 text-center">
                    <p className="text-sm font-bold text-[#4B232D]/70">
                      Görsel bulunamadı.
                    </p>
                  </div>
                )
              ) : null}
            </div>

            <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/88 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.08)] backdrop-blur-[16px] md:rounded-[30px] md:p-7">
              <p className="section-eyebrow">
                {isVideo ? "Video Arşivim" : "Fotoğraf Arşivim"}
              </p>

              <h1 className="mt-3 text-[clamp(34px,8vw,58px)] font-semibold leading-none tracking-[-0.08em] text-[#4B232D]">
                {item.title}
              </h1>

              {dateLabel ? (
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/45">
                  {dateLabel}
                </p>
              ) : null}

              {item.description ? (
                <p className="mt-5 text-[13px] leading-7 text-[#4B232D]/72 md:text-sm md:leading-8">
                  {item.description}
                </p>
              ) : (
                <p className="mt-5 text-[13px] leading-7 text-[#4B232D]/58 md:text-sm md:leading-8">
                  Bu paylaşım için henüz açıklama eklenmedi.
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href="/fotograflar"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#4B232D] px-5 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36]"
                >
                  Galeriye Dön
                </Link>

                <Link
                  href="/iletisim"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/82 px-5 text-[12px] font-bold text-[#4B232D] shadow-[0_8px_20px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  İletişim
                </Link>
              </div>
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