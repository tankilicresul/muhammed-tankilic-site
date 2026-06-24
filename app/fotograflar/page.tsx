import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fotoğraflarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın fotoğraf, dikey video ve görsel arşiv paylaşımları.",
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

function getPreviewImage(item: GalleryItem) {
  return item.thumbnail_url || item.image_url;
}

export default async function PhotosPage() {
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
    .eq("release_status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const galleryItems = (data ?? []) as GalleryItem[];

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-4">
        <div className="mb-3 hidden items-end justify-between gap-4 md:mb-5 md:flex">
          <div>
            <p className="section-eyebrow">Fotoğraflarım</p>

            <h1 className="text-[clamp(34px,4.6vw,58px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
              Görsel arşivim
            </h1>
          </div>

          <Link href="/iletisim" className="pill-button secondary">
            Görsel Talebi
          </Link>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/35 bg-white/58 p-2.5 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-4">
          <div className="mb-3 text-center md:hidden">
            <p className="section-eyebrow mb-0">Fotoğraflarım</p>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Fotoğraflar şu anda yüklenemedi.</p>
              <p className="mt-1">{error.message}</p>
            </div>
          ) : null}

          {!error && galleryItems.length === 0 ? (
            <div className="rounded-[22px] border border-white/42 bg-white/82 px-5 py-7 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:rounded-[28px] md:px-8 md:py-10">
              <p className="section-eyebrow">Fotoğraf Arşivim</p>

              <h2 className="mx-auto max-w-xl text-[clamp(26px,7vw,42px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Henüz yayında fotoğraf yok.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[12px] leading-7 text-[#4B232D]/68 md:text-sm md:leading-8">
                Yeni fotoğraflarımı ve dikey video paylaşımlarımı burada
                listeleyeceğim.
              </p>
            </div>
          ) : null}

          {!error && galleryItems.length > 0 ? (
            <div className="group relative aspect-[9/16] overflow-hidden rounded-[14px] border border-white/30 bg-[#4B232D]/25 shadow-[0_8px_22px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(75,35,45,0.14)] md:rounded-[22px]">
              {galleryItems.map((item) => {
                const previewImage = getPreviewImage(item);
                const isVideo = item.media_type === "video";

                return (
                  <Link
                    key={item.id}
                    href={`/fotograflar/${item.id}`}
                    className="group relative aspect-[9/16] overflow-hidden rounded-[14px] border border-white/30 bg-[#4B232D]/25 shadow-[0_8px_22px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(75,35,45,0.14)] md:rounded-[22px]"
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

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,35,45,0),rgba(75,35,45,0.34))] opacity-80" />

                    {isVideo ? (
                      <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/86 text-[11px] font-black text-[#4B232D] shadow-[0_8px_20px_rgba(75,35,45,0.18)] backdrop-blur-[10px]">
                        ▶
                      </span>
                    ) : null}

                    {item.description ? (
                      <span className="absolute bottom-2 left-2 right-2 line-clamp-2 rounded-[12px] bg-white/80 px-2 py-1.5 text-[9.5px] font-semibold leading-4 text-[#4B232D] opacity-0 shadow-[0_8px_20px_rgba(75,35,45,0.12)] backdrop-blur-[10px] transition group-hover:opacity-100 md:text-[11px] md:leading-5">
                        {item.description}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="site-container pt-3 md:pt-5">
        <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/88 px-4 py-4 shadow-[0_12px_32px_rgba(75,35,45,0.07)] backdrop-blur-[16px] md:rounded-[28px] md:bg-white/78 md:px-7 md:py-5">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <h2 className="text-[22px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(22px,2.5vw,34px)]">
              Fotoğraf ve video arşivim zamanla genişleyecek.
            </h2>

            <Link
              href="/iletisim"
              className="pill-button dark shrink-0 !min-h-9 !px-5 !text-[11px] md:!min-h-10 md:!text-xs"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}