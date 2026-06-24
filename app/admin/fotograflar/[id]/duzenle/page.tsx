import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fotoğraf Düzenle | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli fotoğraf düzenleme sayfası.",
};

type EditPhotoPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

type PhotoRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  media_type: "photo" | "video";
  video_url: string | null;
  video_embed_url: string | null;
  thumbnail_url: string | null;
  release_status: "draft" | "published" | "hidden";
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function textOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function requiredText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function numberOrZero(value: FormDataEntryValue | null) {
  const parsedValue = Number(String(value ?? "0"));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
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

function dateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function createSafeFileName(title: string, file: File) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();
  const extensionFromType =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/jpeg"
          ? "jpg"
          : extensionFromName || "jpg";

  const safeTitle =
    title
      .toLocaleLowerCase("tr-TR")
      .replaceAll("ı", "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "fotograf";

  return `${Date.now()}-${safeTitle}.${extensionFromType}`;
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service role bilgileri eksik. NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY kontrol edilmeli.",
    );
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function redirectWithError(id: string, message: string): never {
  redirect(
    `/admin/fotograflar/${id}/duzenle?error=${encodeURIComponent(message)}`,
  );
}

async function updatePhotoAction(formData: FormData) {
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
  const releaseStatus = requiredText(formData.get("release_status"));
  const mediaType = requiredText(formData.get("media_type"));
  const imageFile = formData.get("image_file");

  if (!id) {
    redirect("/admin/fotograflar");
  }

  if (!title) {
    redirectWithError(id, "Başlık zorunludur.");
  }

  if (!["draft", "published", "hidden"].includes(releaseStatus)) {
    redirectWithError(id, "Geçersiz yayın durumu seçildi.");
  }

  if (!["photo", "video"].includes(mediaType)) {
    redirectWithError(id, "Geçersiz medya türü seçildi.");
  }

  const supabaseAdmin = createAdminClient();

  const updateData: {
    title: string;
    description: string | null;
    alt_text: string | null;
    media_type: string;
    video_url: string | null;
    video_embed_url: string | null;
    thumbnail_url: string | null;
    release_status: string;
    sort_order: number;
    published_at: string | null;
    image_url?: string;
    storage_path?: string;
  } = {
    title,
    description: textOrNull(formData.get("description")),
    alt_text: textOrNull(formData.get("alt_text")) ?? title,
    media_type: mediaType,
    video_url: textOrNull(formData.get("video_url")),
    video_embed_url: textOrNull(formData.get("video_embed_url")),
    thumbnail_url: textOrNull(formData.get("thumbnail_url")),
    release_status: releaseStatus,
    sort_order: numberOrZero(formData.get("sort_order")),
    published_at: normalizePublishedAt(
      releaseStatus,
      formData.get("published_at"),
    ),
  };

  if (imageFile instanceof File && imageFile.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(imageFile.type)) {
      redirectWithError(id, "Sadece JPG, PNG veya WEBP fotoğraf yükleyebilirsin.");
    }

    const maxFileSize = 8 * 1024 * 1024;

    if (imageFile.size > maxFileSize) {
      redirectWithError(id, "Fotoğraf en fazla 8 MB olabilir.");
    }

    const fileName = createSafeFileName(title, imageFile);
    const storagePath = `admin-uploads/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("photos")
      .upload(storagePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: imageFile.type,
      });

    if (uploadError) {
      redirectWithError(id, `Yeni fotoğraf yüklenemedi: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("photos").getPublicUrl(storagePath);

    updateData.image_url = publicUrl;
    updateData.storage_path = storagePath;
  }

  const { error } = await supabaseAdmin
    .from("photos")
    .update(updateData)
    .eq("id", id);

  if (error) {
    redirectWithError(id, error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/fotograflar");
  revalidatePath("/fotograflar");
  revalidatePath(`/fotograflar/${id}`);

  redirect(`/admin/fotograflar/${id}/duzenle?success=1`);
}

export default async function AdminEditPhotoPage({
  params,
  searchParams,
}: EditPhotoPageProps) {
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
  const successMessage = query.success
    ? "Fotoğraf bilgileri başarıyla güncellendi."
    : null;

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
        media_type,
        video_url,
        video_embed_url,
        thumbnail_url,
        release_status,
        sort_order,
        published_at,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    redirect("/admin/fotograflar");
  }

  const photo = data as PhotoRow;

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Fotoğraf Düzenle
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Bu sayfada seçili fotoğraf veya video kaydının başlığını,
                açıklamasını, yayın durumunu ve görselini düzenleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/fotograflar"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/70 px-4 text-[11px] font-bold text-[#4B232D]/70 transition hover:-translate-y-0.5 hover:bg-white md:text-xs"
              >
                Fotoğraf Listesi
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
              <p className="font-bold">Fotoğraf güncellenemedi.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-6 rounded-[22px] border border-emerald-200/70 bg-emerald-50/80 p-4 text-[12px] font-bold leading-6 text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 md:grid-cols-[0.38fr_0.62fr]">
            <div className="rounded-[24px] border border-white/42 bg-white/62 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px]">
              <p className="section-eyebrow">Mevcut Görsel</p>

              <div className="mt-3 overflow-hidden rounded-[20px] border border-white/42 bg-white/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.alt_text || photo.title}
                  className="aspect-[9/16] w-full object-cover"
                />
              </div>

              <a
                href={photo.image_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-full border border-[#4B232D]/10 bg-white/75 px-4 text-[11px] font-bold text-[#4B232D]/75 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Görseli Aç
              </a>
            </div>

            <form action={updatePhotoAction} className="grid gap-4">
              <input type="hidden" name="id" value={photo.id} />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Başlık *
                  </span>
                  <input
                    name="title"
                    required
                    defaultValue={photo.title}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Alt Metin
                  </span>
                  <input
                    name="alt_text"
                    defaultValue={photo.alt_text ?? ""}
                    placeholder="Boş kalırsa başlık kullanılır"
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Medya Türü
                  </span>
                  <select
                    name="media_type"
                    defaultValue={photo.media_type}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  >
                    <option value="photo">Fotoğraf</option>
                    <option value="video">Video</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Yayın Durumu
                  </span>
                  <select
                    name="release_status"
                    defaultValue={photo.release_status}
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
                    defaultValue={photo.sort_order}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yeni Görsel Yükle
                </span>
                <input
                  name="image_file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium text-[#4B232D] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#4B232D] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-white focus:border-[#4B232D]/35"
                />
                <span className="text-[11px] leading-5 text-[#4B232D]/52">
                  Boş bırakırsan mevcut görsel korunur. JPG, PNG veya WEBP;
                  maksimum 8 MB.
                </span>
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Yayın Tarihi
                  </span>
                  <input
                    name="published_at"
                    type="date"
                    defaultValue={dateInputValue(photo.published_at)}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Thumbnail URL
                  </span>
                  <input
                    name="thumbnail_url"
                    defaultValue={photo.thumbnail_url ?? ""}
                    placeholder="Video için kapak görseli URL’i"
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Video URL
                  </span>
                  <input
                    name="video_url"
                    defaultValue={photo.video_url ?? ""}
                    placeholder="Video linki veya mp4/webm URL"
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                    Video Embed URL
                  </span>
                  <input
                    name="video_embed_url"
                    defaultValue={photo.video_embed_url ?? ""}
                    placeholder="YouTube/Instagram embed varsa"
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
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
                  defaultValue={photo.description ?? ""}
                  placeholder="Fotoğraf hakkında kısa açıklama..."
                  className="rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <div className="flex flex-col gap-3 rounded-[22px] border border-[#4B232D]/10 bg-white/45 p-4 md:flex-row md:items-center md:justify-between">
                <p className="text-[12px] leading-6 text-[#4B232D]/65">
                  Yayın durumunu “Yayında” seçersen bu kayıt public
                  Fotoğraflarım sayfasında görünür.
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
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Fotoğraf düzenleme</span>
      </footer>
    </main>
  );
}