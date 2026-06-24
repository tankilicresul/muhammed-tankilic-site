import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fotoğraf Yönetimi | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli fotoğraf yönetim sayfası.",
};

type PhotoRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  release_status: "draft" | "published" | "hidden";
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const statusLabels: Record<PhotoRow["release_status"], string> = {
  draft: "Taslak",
  published: "Yayında",
  hidden: "Gizli",
};

const statusClasses: Record<PhotoRow["release_status"], string> = {
  draft: "bg-[#FFF4BC]/90 text-[#4B232D]",
  published: "bg-emerald-50 text-emerald-800",
  hidden: "bg-zinc-100 text-zinc-700",
};

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminPhotosPage() {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select(
      `
        id,
        title,
        description,
        image_url,
        storage_path,
        alt_text,
        release_status,
        sort_order,
        published_at,
        created_at,
        updated_at
      `,
    )
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as PhotoRow[];

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Fotoğraf Yönetimi
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Bu sayfada Supabase’deki fotoğraf kayıtlarını listeliyoruz.
                Yayında olan fotoğraflar public Fotoğraflarım sayfasında
                gösterilecek.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/70 px-4 text-[11px] font-bold text-[#4B232D]/70 transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Admin Ana Sayfa
              </Link>

              <Link 
  href="/admin/fotograflar/yeni"
  className="inline-flex min-h-10 items-center justify-center rounded-full !bg-[#4B232D] px-4 text-[11px] font-bold !text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:!bg-[#5a2b36] md:text-xs"
>
  Yeni Fotoğraf Ekle
</Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Toplam Fotoğraf
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {photos.length}
              </p>
            </div>

            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Yayında
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {
                  photos.filter(
                    (photo) => photo.release_status === "published",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Taslak / Gizli
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {
                  photos.filter(
                    (photo) => photo.release_status !== "published",
                  ).length
                }
              </p>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Fotoğraflar okunamadı.</p>
              <p className="mt-1">{error.message}</p>
            </div>
          ) : null}

          {!error && photos.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-white/42 bg-white/62 p-6 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px]">
              <p className="text-lg font-semibold tracking-[-0.04em] text-[#4B232D]">
                Henüz Supabase’de kayıtlı fotoğraf yok.
              </p>

              <p className="mx-auto mt-3 max-w-xl text-[12px] leading-7 text-[#4B232D]/65 md:text-sm">
                “Yeni Fotoğraf Ekle” formuyla fotoğraf yükleyip yayın durumunu
                seçebilirsin.
              </p>
            </div>
          ) : null}

          {!error && photos.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-white/42 bg-white/62 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px]">
              <div className="hidden grid-cols-[0.8fr_1.15fr_0.65fr_0.65fr_0.75fr_0.55fr] gap-3 border-b border-[#4B232D]/10 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/45 md:grid">
                <span>Görsel</span>
                <span>Fotoğraf</span>
                <span>Durum</span>
                <span>Sıralama</span>    
                <span>Güncelleme</span>
                <span>Link</span>
              </div>

              <div className="divide-y divide-[#4B232D]/10">
                {photos.map((photo) => (
                  <article
                    key={photo.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1.15fr_0.65fr_0.65fr_0.75fr_0.55fr] md:items-center md:gap-3"
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full max-w-[150px] overflow-hidden rounded-[18px] border border-white/42 bg-white/70 shadow-[0_10px_24px_rgba(75,35,45,0.08)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.image_url}
                          alt={photo.alt_text || photo.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.055em] text-[#4B232D]">
                        {photo.title}
                      </h2>

                      {photo.description ? (
                        <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[#4B232D]/65">
                          {photo.description}
                        </p>
                      ) : null}

                      {photo.storage_path ? (
                        <p className="mt-1 text-[10px] font-bold text-[#4B232D]/38">
                          {photo.storage_path}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] ${
                          statusClasses[photo.release_status]
                        }`}
                      >
                        {statusLabels[photo.release_status]}
                      </span>
                    </div>

                    <div className="text-[12px] font-bold text-[#4B232D]/65">
                      {photo.sort_order}
                    </div>

                    <div className="text-[12px] font-bold text-[#4B232D]/65">
                      {formatDate(photo.updated_at)}
                    </div>

                   <div className="flex flex-wrap gap-2">
  <Link
    href={`/admin/fotograflar/${photo.id}/duzenle`}
    className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/75 px-4 text-[11px] font-bold text-[#4B232D]/75 transition hover:-translate-y-0.5 hover:bg-white"
  >
    Düzenle
  </Link>

  <a
    href={photo.image_url}
    target="_blank"
    rel="noreferrer"
    className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/55 px-4 text-[11px] font-bold text-[#4B232D]/60 transition hover:-translate-y-0.5 hover:bg-white"
  >
    Aç
  </a>
</div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}