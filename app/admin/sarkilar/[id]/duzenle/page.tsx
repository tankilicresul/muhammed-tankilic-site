import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şarkı Düzenle | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli şarkı düzenleme sayfası.",
};

type EditSongPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
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
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function textOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function requiredText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function createSlugFromTitle(title: string) {
  return title
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSlug(slug: string, title: string) {
  const source = slug.trim().length > 0 ? slug : createSlugFromTitle(title);

  return source
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function numberOrZero(value: FormDataEntryValue | null) {
  const parsedValue = Number(String(value ?? "0"));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function formatDateInput(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function normalizePublishedAt(
  releaseStatus: string,
  value: FormDataEntryValue | null,
) {
  const rawValue = String(value ?? "").trim();

  if (rawValue) {
    return new Date(`${rawValue}T12:00:00.000Z`).toISOString();
  }

  if (releaseStatus === "published") {
    return new Date().toISOString();
  }

  return null;
}

function redirectWithError(id: string, message: string): never {
  redirect(
    `/admin/sarkilar/${id}/duzenle?error=${encodeURIComponent(message)}`,
  );
}

async function updateSongAction(formData: FormData) {
  "use server";

  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const id = requiredText(formData.get("id"));
  const title = requiredText(formData.get("title"));
  const slug = normalizeSlug(requiredText(formData.get("slug")), title);
  const artist = requiredText(formData.get("artist")) || "Muhammed Tankılıç";
  const releaseStatus = requiredText(formData.get("release_status"));

  if (!id) {
    redirect("/admin/sarkilar");
  }

  if (!title) {
    redirectWithError(id, "Başlık zorunludur.");
  }

  if (!slug) {
    redirectWithError(id, "Slug oluşturulamadı. Lütfen başlık veya slug gir.");
  }

  if (!["draft", "published", "hidden"].includes(releaseStatus)) {
    redirectWithError(id, "Geçersiz yayın durumu seçildi.");
  }

  const supabase = await createClient();

  const { data: duplicateSong } = await supabase
    .from("songs")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (duplicateSong) {
    redirectWithError(id, "Bu slug başka bir şarkıda kullanılıyor.");
  }

  const { error } = await supabase
    .from("songs")
    .update({
      title,
      slug,
      artist,
      description: textOrNull(formData.get("description")),
      release_status: releaseStatus,
      spotify_url: textOrNull(formData.get("spotify_url")),
      spotify_embed_url: textOrNull(formData.get("spotify_embed_url")),
      apple_music_url: textOrNull(formData.get("apple_music_url")),
      youtube_url: textOrNull(formData.get("youtube_url")),
      youtube_embed_url: textOrNull(formData.get("youtube_embed_url")),
      cover_image_path: textOrNull(formData.get("cover_image_path")),
      lyrics: textOrNull(formData.get("lyrics")),
      download_file_path: textOrNull(formData.get("download_file_path")),
      video_download_file_path: textOrNull(formData.get("video_download_file_path")),
      sort_order: numberOrZero(formData.get("sort_order")),
      published_at: normalizePublishedAt(
        releaseStatus,
        formData.get("published_at"),
      ),
    })
    .eq("id", id);

  if (error) {
    redirectWithError(id, error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/sarkilar");
  revalidatePath("/sarkilarim");

  redirect("/admin/sarkilar");
}

export default async function AdminEditSongPage({
  params,
  searchParams,
}: EditSongPageProps) {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const { id } = await params;
  const query = await searchParams;
  const errorMessage = query.error ? decodeURIComponent(query.error) : null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const song = data as SongRow;
  const title = getString(song, "title");
  const releaseStatus =
    getString(song, "release_status") || getString(song, "status") || "draft";

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Şarkı Düzenle
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                {title || "Başlıksız Şarkı"} kaydını düzenliyorsun.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/sarkilar"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/70 px-4 text-[11px] font-bold text-[#4B232D]/70 transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Şarkı Listesi
              </Link>

              <Link
                href="/admin"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/70 px-4 text-[11px] font-bold text-[#4B232D]/70 transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Admin Ana Sayfa
              </Link>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Şarkı güncellenemedi.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          <form action={updateSongAction} className="mt-6 grid gap-4">
            <input type="hidden" name="id" value={id} />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Başlık *
                </span>
                <input
                  name="title"
                  required
                  defaultValue={title}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Slug
                </span>
                <input
                  name="slug"
                  defaultValue={getString(song, "slug")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Sanatçı
                </span>
                <input
                  name="artist"
                  defaultValue={getString(song, "artist") || "Muhammed Tankılıç"}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yayın Durumu
                </span>
                <select
                  name="release_status"
                  defaultValue={releaseStatus}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                >
                  <option value="published">Yayında</option>
                  <option value="draft">Taslak</option>
                  <option value="hidden">Gizli</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Sıralama
                </span>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={getNumber(song, "sort_order")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                Açıklama
              </span>
              <textarea
                name="description"
                rows={4}
                defaultValue={getString(song, "description")}
                className="rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Spotify Link
                </span>
                <input
                  name="spotify_url"
                  defaultValue={getString(song, "spotify_url")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Spotify Embed Link
                </span>
                <input
                  name="spotify_embed_url"
                  defaultValue={getString(song, "spotify_embed_url")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Apple Music Link
                </span>
                <input
                  name="apple_music_url"
                  defaultValue={getString(song, "apple_music_url")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  YouTube Link
                </span>
                <input
                  name="youtube_url"
                  defaultValue={getString(song, "youtube_url")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                YouTube Embed Link
              </span>
              <input
                name="youtube_embed_url"
                defaultValue={getString(song, "youtube_embed_url")}
                className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Kapak Görsel Path
                </span>
                <input
                  name="cover_image_path"
                  defaultValue={getString(song, "cover_image_path")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Ses İndirme Dosyası Path
                </span>
                <input
                  name="download_file_path"
                  defaultValue={getString(song, "download_file_path")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Video İndirme Dosyası Path
                </span>
                <input
                  name="video_download_file_path"
                  defaultValue={getString(song, "video_download_file_path")}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yayın Tarihi
                </span>
                <input
                  name="published_at"
                  type="date"
                  defaultValue={formatDateInput(getString(song, "published_at"))}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                Şarkı Sözleri
              </span>
              <textarea
                name="lyrics"
                rows={10}
                defaultValue={getString(song, "lyrics")}
                className="rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
              />
            </label>

            <div className="flex flex-col gap-3 rounded-[22px] border border-[#4B232D]/10 bg-white/45 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] leading-6 text-[#4B232D]/65">
                Kaydettiğinde şarkı Supabase üzerinde güncellenir.
              </p>

              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#4B232D] px-5 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36]"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Şarkı düzenleme</span>
      </footer>
    </main>
  );
}
