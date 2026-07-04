import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cover Düzenle | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli cover düzenleme sayfası.",
};

type EditCoverPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
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
  download_file_path: string | null;
  video_download_file_path: string | null;
  sort_order: number;
  published_at: string | null;
};

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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function numberOrZero(value: FormDataEntryValue | null) {
  const parsedValue = Number(String(value ?? "0"));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function formatDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
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

function normalizeYoutubeEmbedUrl(
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

function redirectWithError(id: string, message: string): never {
  redirect(
    `/admin/coverlar/${id}/duzenle?error=${encodeURIComponent(message)}`,
  );
}

async function updateCoverAction(formData: FormData) {
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
  const releaseStatus = requiredText(formData.get("release_status"));
  const youtubeUrl = textOrNull(formData.get("youtube_url"));
  const youtubeEmbedUrl = normalizeYoutubeEmbedUrl(
    youtubeUrl,
    textOrNull(formData.get("youtube_embed_url")),
  );

  if (!id) {
    redirect("/admin/coverlar");
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

  const { error } = await supabase
    .from("covers")
    .update({
      title,
      slug,
      description: textOrNull(formData.get("description")),
      release_status: releaseStatus,
      youtube_url: youtubeUrl,
      youtube_embed_url: youtubeEmbedUrl,
      instagram_url: textOrNull(formData.get("instagram_url")),
      cover_image_path: textOrNull(formData.get("cover_image_path")),
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

  revalidatePath("/admin");
  revalidatePath("/admin/coverlar");
  revalidatePath(`/admin/coverlar/${id}/duzenle`);

  redirect("/admin/coverlar");
}

export default async function AdminEditCoverPage({
  params,
  searchParams,
}: EditCoverPageProps) {
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
        download_file_path,
        video_download_file_path,
        sort_order,
        published_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const cover = data as CoverRow;

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Cover Düzenle
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Bu sayfada mevcut cover kaydını güncelleyebilirsin. Kaydetme
                sonrası liste sayfasına yönlendirilir.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/coverlar"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/70 px-4 text-[11px] font-bold text-[#4B232D]/70 transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Cover Listesi
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
              <p className="font-bold">Cover güncellenemedi.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          <form action={updateCoverAction} className="mt-6 grid gap-4">
            <input type="hidden" name="id" value={cover.id} />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Başlık *
                </span>
                <input
                  name="title"
                  required
                  defaultValue={cover.title}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Slug
                </span>
                <input
                  name="slug"
                  defaultValue={cover.slug}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yayın Durumu
                </span>
                <select
                  name="release_status"
                  defaultValue={cover.release_status}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
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
                  defaultValue={cover.sort_order}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yayın Tarihi
                </span>
                <input
                  name="published_at"
                  type="date"
                  defaultValue={formatDateInputValue(cover.published_at)}
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
                defaultValue={cover.description ?? ""}
                className="rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  YouTube Link
                </span>
                <input
                  name="youtube_url"
                  defaultValue={cover.youtube_url ?? ""}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  YouTube Embed Link
                </span>
                <input
                  name="youtube_embed_url"
                  defaultValue={cover.youtube_embed_url ?? ""}
                  placeholder="Boş kalırsa YouTube linkinden üretilir"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Instagram Link
                </span>
                <input
                  name="instagram_url"
                  defaultValue={cover.instagram_url ?? ""}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Kapak Görsel Path
                </span>
                <input
                  name="cover_image_path"
                  defaultValue={cover.cover_image_path ?? ""}
                  placeholder="covers/pela-dur/cover.webp"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Ses İndirme Dosyası Path
                </span>
                <input
                  name="download_file_path"
                  defaultValue={cover.download_file_path ?? ""}
                  placeholder="downloads/covers/pela-dur.mp3"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Video İndirme Dosyası Path
                </span>
                <input
                  name="video_download_file_path"
                  defaultValue={cover.video_download_file_path ?? ""}
                  placeholder="downloads/covers/pela-dur.mp4"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 rounded-[22px] border border-[#4B232D]/10 bg-white/45 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] leading-6 text-[#4B232D]/65">
                Güncellediğinde kayıt Supabase’de değişir. Ses ve video dosya path alanları
                indirme butonları tarafından üyelik kontrolüyle kullanılır.
              </p>

              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#4B232D] px-5 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36]"
              >
                Coverı Güncelle
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Cover düzenleme</span>
      </footer>
    </main>
  );
}