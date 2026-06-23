import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fotoğraflarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın portreleri, sahne arkası görselleri ve müzik arşivine ait fotoğrafları.",
};

type PhotoRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
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
        release_status,
        sort_order,
        published_at,
        created_at
      `,
    )
    .eq("release_status", "published")
    .not("image_url", "is", null)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as PhotoRow[];

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

        <div className="rounded-[24px] border border-white/35 bg-white/58 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:rounded-[34px] md:p-6">
          <div className="mb-3 text-center md:hidden">
            <p className="section-eyebrow mb-0">Fotoğraflarım</p>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Fotoğraflar şu anda yüklenemedi.</p>
              <p className="mt-1">{error.message}</p>
            </div>
          ) : null}

          {!error && photos.length === 0 ? (
            <div className="rounded-[22px] border border-white/42 bg-white/82 px-5 py-7 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[16px] md:rounded-[28px] md:px-8 md:py-10">
              <p className="section-eyebrow">Fotoğraf Arşivim</p>

              <h2 className="mx-auto max-w-xl text-[clamp(26px,7vw,42px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Henüz yayında fotoğraf yok.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[12px] leading-7 text-[#4B232D]/68 md:text-sm md:leading-8">
                Yeni fotoğraflarımı ve müzik arşivime ait görselleri burada
                paylaşacağım.
              </p>
            </div>
          ) : null}

          {!error && photos.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {photos.map((photo) => {
                const dateLabel = formatDate(photo.published_at);

                return (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-[20px] border border-white/35 bg-white/72 shadow-[0_10px_28px_rgba(75,35,45,0.07)] backdrop-blur-[16px] md:rounded-[28px] md:shadow-[0_16px_42px_rgba(75,35,45,0.08)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#4B232D]/70">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.image_url ?? ""}
                        alt={photo.alt_text || photo.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,35,45,0.02),rgba(75,35,45,0.58))]" />

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(189,235,232,0.16),transparent_38%),radial-gradient(circle_at_86%_20%,rgba(245,174,80,0.14),transparent_34%)]" />

                      <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/72 md:text-[9px] md:tracking-[0.2em]">
                          Fotoğraf Arşivim
                        </p>

                        <h2 className="mt-1.5 text-[25px] font-semibold leading-none tracking-[-0.075em] text-white md:mt-2 md:text-[clamp(28px,3.2vw,42px)]">
                          {photo.title}
                        </h2>
                      </div>
                    </div>

                    {(photo.description || dateLabel) && (
                      <div className="border-t border-white/30 bg-white/82 px-4 py-3 md:px-5 md:py-4">
                        {photo.description ? (
                          <p className="text-[12px] leading-6 text-[#4B232D]/70 md:text-sm md:leading-7">
                            {photo.description}
                          </p>
                        ) : null}

                        {dateLabel ? (
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/42">
                            {dateLabel}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </article>
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
              Galerim yeni fotoğraflarımla genişleyecek.
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
        <span>Fotoğraflarım · Portrelerim · Görsel arşivim</span>
      </footer>
    </main>
  );
}