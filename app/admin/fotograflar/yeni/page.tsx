import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";

export const metadata: Metadata = {
  title: "Yeni Fotoğraf Ekle | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli yeni fotoğraf ekleme sayfası.",
};

type NewPhotoPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
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

function redirectWithError(message: string): never {
  redirect(`/admin/fotograflar/yeni?error=${encodeURIComponent(message)}`);
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

async function createPhotoAction(formData: FormData) {
  "use server";

  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const title = requiredText(formData.get("title"));
  const releaseStatus = requiredText(formData.get("release_status"));
  const imageFile = formData.get("image_file");

  if (!title) {
    redirectWithError("Başlık zorunludur.");
  }

  if (!["draft", "published", "hidden"].includes(releaseStatus)) {
    redirectWithError("Geçersiz yayın durumu seçildi.");
  }

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    redirectWithError("Fotoğraf dosyası zorunludur.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(imageFile.type)) {
    redirectWithError("Sadece JPG, PNG veya WEBP fotoğraf yükleyebilirsin.");
  }

  const maxFileSize = 8 * 1024 * 1024;

  if (imageFile.size > maxFileSize) {
    redirectWithError("Fotoğraf en fazla 8 MB olabilir.");
  }

  const supabaseAdmin = createAdminClient();
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
    redirectWithError(`Fotoğraf yüklenemedi: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("photos").getPublicUrl(storagePath);

  const { error: insertError } = await supabaseAdmin.from("photos").insert({
    title,
    description: textOrNull(formData.get("description")),
    image_url: publicUrl,
    storage_path: storagePath,
    alt_text: textOrNull(formData.get("alt_text")) ?? title,
    release_status: releaseStatus,
    sort_order: numberOrZero(formData.get("sort_order")),
    published_at: normalizePublishedAt(
      releaseStatus,
      formData.get("published_at"),
    ),
  });

  if (insertError) {
    await supabaseAdmin.storage.from("photos").remove([storagePath]);
    redirectWithError(`Fotoğraf kaydı oluşturulamadı: ${insertError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/fotograflar");
  revalidatePath("/fotograflar");

  redirect("/admin/fotograflar");
}

export default async function AdminNewPhotoPage({
  searchParams,
}: NewPhotoPageProps) {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const params = await searchParams;
  const errorMessage = params.error ? decodeURIComponent(params.error) : null;

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Yeni Fotoğraf Ekle
              </h1>

              <p className="mt-4 max-w-2xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Bu form fotoğrafı Supabase Storage içindeki photos bucket’ına
                yükler ve photos tablosuna yeni kayıt oluşturur.
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
              <p className="font-bold">Fotoğraf kaydedilemedi.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          <form action={createPhotoAction} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Başlık *
                </span>
                <input
                  name="title"
                  required
                  placeholder="Örn: Sahne Arkası"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Alt Metin
                </span>
                <input
                  name="alt_text"
                  placeholder="Boş kalırsa başlık kullanılır"
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                Fotoğraf Dosyası *
              </span>
              <input
                name="image_file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium text-[#4B232D] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#4B232D] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-white focus:border-[#4B232D]/35"
              />
              <span className="text-[11px] leading-5 text-[#4B232D]/52">
                JPG, PNG veya WEBP yükleyebilirsin. Maksimum 8 MB.
              </span>
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
                  Yayın Durumu
                </span>
                <select
                  name="release_status"
                  defaultValue="draft"
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
                  defaultValue="0"
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
                placeholder="Fotoğraf hakkında kısa açıklama..."
                className="rounded-[18px] border border-[#4B232D]/10 bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
              />
            </label>

            <div className="flex flex-col gap-3 rounded-[22px] border border-[#4B232D]/10 bg-white/45 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] leading-6 text-[#4B232D]/65">
                Yayın durumunu “Yayında” seçersen public Fotoğraflarım sayfası
                Supabase’e bağlandığında bu fotoğraf ziyaretçilere gösterilecek.
              </p>

              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#4B232D] px-5 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36]"
              >
                Fotoğrafı Kaydet
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Yeni fotoğraf ekleme</span>
      </footer>
    </main>
  );
}