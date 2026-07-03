import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şarkı Yönetimi | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli şarkı yönetimi sayfası.",
};

type SongRow = Record<string, unknown>;

function getString(row: SongRow, key: string) {
  const value = row[key];
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(row: SongRow, key: string) {
  const value = row[key];

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function getSongStatus(row: SongRow) {
  return getString(row, "release_status") || getString(row, "status") || "draft";
}

function getStatusLabel(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized === "published" ||
    normalized === "yayinda" ||
    normalized === "yayında"
  ) {
    return "Yayında";
  }

  if (normalized === "draft" || normalized === "taslak" || normalized === "") {
    return "Taslak";
  }

  if (normalized === "hidden" || normalized === "gizli") {
    return "Gizli";
  }

  return status;
}

function isPublishedStatus(status: string) {
  const normalized = status.toLowerCase();

  return (
    normalized === "published" ||
    normalized === "yayinda" ||
    normalized === "yayında"
  );
}

function isDraftStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "draft" || normalized === "taslak" || normalized === "";
}

async function deleteSongAction(formData: FormData) {
  "use server";

  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/sarkilar");
  }

  const supabase = await createClient();

  await supabase.from("songs").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/sarkilar");
  revalidatePath("/sarkilarim");

  redirect("/admin/sarkilar");
}

export default async function AdminSongsPage() {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  const songs = (data ?? []) as SongRow[];

  const publishedCount = songs.filter((song) =>
    isPublishedStatus(getSongStatus(song)),
  ).length;

  const draftCount = songs.filter((song) =>
    isDraftStatus(getSongStatus(song)),
  ).length;

  const statCards = [
    { label: "Toplam", value: songs.length },
    { label: "Yayında", value: publishedCount },
    { label: "Taslak", value: draftCount },
  ];

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-3 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[34px] md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-eyebrow mb-1">Admin Paneli</p>

              <h1 className="text-[clamp(30px,5vw,48px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Şarkı Yönetimi
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/78 px-4 text-[11px] font-bold text-[#4B232D] shadow-[0_8px_20px_rgba(75,35,45,0.055)] transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Admin Ana Sayfa
              </Link>

              <Link
                href="/admin/sarkilar/yeni"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-4 text-[11px] font-bold text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:text-xs"
              >
                Yeni Şarkı Ekle
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-3">
            {statCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-white/42 bg-white/64 px-3 py-3 text-center shadow-[0_8px_22px_rgba(75,35,45,0.055)] backdrop-blur-[12px] md:rounded-[22px] md:py-4"
              >
                <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/48 md:text-[10px]">
                  {item.label}
                </p>

                <p className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.06em] text-[#4B232D] md:text-[32px]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-[18px] border border-red-200/70 bg-red-50/80 p-3 text-[11px] font-semibold leading-5 text-red-800 md:rounded-[22px] md:p-4 md:text-xs">
              Şarkılar okunurken hata oluştu: {error.message}
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-[22px] border border-white/42 bg-white/68 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:mt-6 md:rounded-[28px]">
            <div className="grid grid-cols-[1.25fr_58px_34px_116px] items-center gap-2 border-b border-[#4B232D]/10 px-3 py-3 text-[8.5px] font-bold uppercase tracking-[0.12em] text-[#4B232D]/48 md:grid-cols-[1.6fr_0.55fr_0.35fr_0.95fr] md:px-5 md:py-4 md:text-[10px] md:tracking-[0.18em]">
              <span>Şarkı</span>
              <span>Durum</span>
              <span>Sıra</span>
              <span>İşlem</span>
            </div>

            {songs.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-[22px] font-semibold tracking-[-0.065em] text-[#4B232D]">
                  Henüz şarkı kaydı yok.
                </p>

                <Link
                  href="/admin/sarkilar/yeni"
                  className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-5 text-[11px] font-bold text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:text-xs"
                >
                  Yeni Şarkı Ekle
                </Link>
              </div>
            ) : (
              songs.map((song) => {
                const id = getString(song, "id");
                const title = getString(song, "title") || "Başlıksız Şarkı";
                const status = getSongStatus(song);
                const sortOrder = getNumber(song, "sort_order");
                const published = isPublishedStatus(status);

                return (
                  <div
                    key={id || title}
                    className="grid grid-cols-[1.25fr_58px_34px_116px] items-center gap-2 border-b border-[#4B232D]/10 px-3 py-3 text-[#4B232D] last:border-b-0 md:grid-cols-[1.6fr_0.55fr_0.35fr_0.95fr] md:px-5 md:py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold tracking-[-0.035em] md:text-base">
                        {title}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex min-h-7 items-center justify-center rounded-full px-2 text-[8px] font-bold uppercase tracking-[0.08em] md:px-3 md:text-[10px] ${
                          published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#FFF4BC] text-[#4B232D]"
                        }`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold md:text-sm">
                      {sortOrder === null ? "—" : sortOrder}
                    </div>

                    <div className="flex items-center justify-end gap-1.5 md:justify-start md:gap-2">
                      <Link
                        href={`/admin/sarkilar/${id}/duzenle`}
                        className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-2.5 text-[9px] font-bold text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.16)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-9 md:px-4 md:text-[11px]"
                      >
                        Düzenle
                      </Link>

                      <form action={deleteSongAction}>
                        <input type="hidden" name="id" value={id} />

                        <button
                          type="submit"
                          className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/84 px-2.5 text-[9px] font-bold text-[#4B232D] shadow-[0_7px_16px_rgba(75,35,45,0.05)] transition hover:-translate-y-0.5 hover:bg-white/95 md:min-h-9 md:px-4 md:text-[11px]"
                        >
                          Sil
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Şarkı yönetimi</span>
      </footer>
    </main>
  );
}
