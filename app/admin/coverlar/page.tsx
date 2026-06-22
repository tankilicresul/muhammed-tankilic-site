import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cover Yönetimi | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli cover yönetim sayfası.",
};

type CoverRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  release_status: "draft" | "published" | "hidden";
  youtube_url: string | null;
  youtube_embed_url: string | null;
  instagram_url: string | null;
  cover_image_path: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const statusLabels: Record<CoverRow["release_status"], string> = {
  draft: "Taslak",
  published: "Yayında",
  hidden: "Gizli",
};

const statusClasses: Record<CoverRow["release_status"], string> = {
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

export default async function AdminCoversPage() {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("covers")
    .select(
      `
        id,
        title,
        slug,
        description,
        release_status,
        youtube_url,
        youtube_embed_url,
        instagram_url,
        cover_image_path,
        sort_order,
        published_at,
        created_at,
        updated_at
      `,
    )
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const covers = (data ?? []) as CoverRow[];

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Cover Yönetimi
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Bu sayfada Supabase’deki cover kayıtlarını listeliyoruz.
                YouTube ve Instagram bağlantıları buradan kontrol edilecek.
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
  href="/admin/coverlar/yeni"
  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#4B232D] px-4 text-[11px] font-bold text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36] md:text-xs"
>
  Yeni Cover Ekle
</Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Toplam Cover
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {covers.length}
              </p>
            </div>

            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Yayında
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {
                  covers.filter((cover) => cover.release_status === "published")
                    .length
                }
              </p>
            </div>

            <div className="rounded-[20px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/50">
                Taslak / Gizli
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#4B232D]">
                {
                  covers.filter((cover) => cover.release_status !== "published")
                    .length
                }
              </p>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Coverlar okunamadı.</p>
              <p className="mt-1">{error.message}</p>
            </div>
          ) : null}

          {!error && covers.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-white/42 bg-white/62 p-6 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px]">
              <p className="text-lg font-semibold tracking-[-0.04em] text-[#4B232D]">
                Henüz Supabase’de kayıtlı cover yok.
              </p>

              <p className="mx-auto mt-3 max-w-xl text-[12px] leading-7 text-[#4B232D]/65 md:text-sm">
                Bir sonraki adımda “Yeni Cover Ekle” formunu oluşturup cover
                videolarını admin panelden kaydedeceğiz.
              </p>
            </div>
          ) : null}

          {!error && covers.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-white/42 bg-white/62 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px]">
              <div className="hidden grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.7fr] gap-3 border-b border-[#4B232D]/10 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/45 md:grid">
                <span>Cover</span>
                <span>Durum</span>
                <span>YouTube</span>
                <span>Instagram</span>
                <span>Güncelleme</span>
              </div>

              <div className="divide-y divide-[#4B232D]/10">
                {covers.map((cover) => (
                  <article
                    key={cover.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.7fr] md:items-center md:gap-3"
                  >
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.055em] text-[#4B232D]">
                        {cover.title}
                      </h2>

                      <p className="mt-1 text-[11px] font-bold text-[#4B232D]/45">
                        cover slug: {cover.slug}
                      </p>

                      {cover.description ? (
                        <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[#4B232D]/65">
                          {cover.description}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] ${
                          statusClasses[cover.release_status]
                        }`}
                      >
                        {statusLabels[cover.release_status]}
                      </span>
                    </div>

                    <div className="text-[12px] font-bold text-[#4B232D]/65">
                      {cover.youtube_url ? (
                        <a
                          href={cover.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[#4B232D]/25 underline-offset-4 transition hover:text-[#4B232D]"
                        >
                          Aç
                        </a>
                      ) : (
                        "Yok"
                      )}
                    </div>

                    <div className="text-[12px] font-bold text-[#4B232D]/65">
                      {cover.instagram_url ? (
                        <a
                          href={cover.instagram_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[#4B232D]/25 underline-offset-4 transition hover:text-[#4B232D]"
                        >
                          Aç
                        </a>
                      ) : (
                        "Yok"
                      )}
                    </div>

                    <div className="text-[12px] font-bold text-[#4B232D]/65">
                      {formatDate(cover.updated_at)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Cover yönetimi</span>
      </footer>
    </main>
  );
}
