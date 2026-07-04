import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";
import {
  editableSiteTextDefinitions,
  mergeSiteTextRows,
  siteTextDefinitions,
  siteTextGroups,
} from "@/lib/supabase/site-text-keys";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Metinleri | Admin Paneli",
  description:
    "Muhammed Tankılıç web sitesi admin paneli site metinleri yönetim sayfası.",
};

type SiteTextsPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

type SongOption = {
  id: string;
  title: string;
  slug: string;
};

type CoverOption = {
  id: string;
  title: string;
  slug: string;
};

type PhotoOption = {
  id: string;
  title: string;
};

type SiteTextRow = {
  key: string;
  value: string | null;
};

const announcementKeys = [
  "homepage_announcement_eyebrow",
  "homepage_announcement_title",
  "homepage_announcement_description",
  "homepage_announcement_target_type",
  "homepage_announcement_target_id",
  "homepage_announcement_target_url",
  "homepage_announcement_is_active",
];

function text(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function redirectWithError(message: string): never {
  redirect(`/admin/metinler?error=${encodeURIComponent(message)}`);
}

async function resolveAnnouncementTargetUrl(
  targetType: string,
  targetId: string,
  customUrl: string,
) {
  const supabase = await createClient();

  if (targetType === "song") {
    if (!targetId) {
      redirectWithError("Şarkı duyurusu için hedef şarkı seçmelisin.");
    }

    const { data, error } = await supabase
      .from("songs")
      .select("slug")
      .eq("id", targetId)
      .maybeSingle();

    if (error || !data?.slug) {
      redirectWithError("Seçilen şarkı bulunamadı.");
    }

    return `/sarkilarim/${data.slug}`;
  }

  if (targetType === "cover") {
    if (!targetId) {
      redirectWithError("Cover duyurusu için hedef cover seçmelisin.");
    }

    const { data, error } = await supabase
      .from("covers")
      .select("slug")
      .eq("id", targetId)
      .maybeSingle();

    if (error || !data?.slug) {
      redirectWithError("Seçilen cover bulunamadı.");
    }

    return `/coverlarim#${data.slug}`;
  }

  if (targetType === "photo") {
    if (!targetId) {
      redirectWithError("Fotoğraf duyurusu için hedef fotoğraf seçmelisin.");
    }

    return `/fotograflar/${targetId}`;
  }

  if (targetType === "link") {
    if (!customUrl) {
      redirectWithError("Özel link için hedef link yazmalısın.");
    }

    return customUrl;
  }

  redirectWithError("Geçersiz duyuru hedefi seçildi.");
}

async function saveSiteTextsAction(formData: FormData) {
  "use server";

  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const targetType = text(formData.get("homepage_announcement_target_type"));
  const customUrl = text(formData.get("homepage_announcement_custom_url"));
  const isActive = text(formData.get("homepage_announcement_is_active")) === "on";

  const targetId =
    targetType === "song"
      ? text(formData.get("homepage_announcement_song_id"))
      : targetType === "cover"
        ? text(formData.get("homepage_announcement_cover_id"))
        : targetType === "photo"
          ? text(formData.get("homepage_announcement_photo_id"))
          : "";

  const targetUrl = await resolveAnnouncementTargetUrl(
    targetType,
    targetId,
    customUrl,
  );

  const now = new Date().toISOString();

  const genericRows = editableSiteTextDefinitions.map((definition) => ({
    key: definition.key,
    label: definition.label,
    group_name: definition.groupName,
    value: text(formData.get(definition.key)) || definition.defaultValue,
    value_type: "plain_text",
    description: definition.description,
    is_public: definition.isPublic,
    updated_by: admin.userId,
    updated_at: now,
  }));

  const specialRows = [
    {
      key: "homepage_announcement_target_type",
      label: "Ana Sayfa Duyuru Tipi",
      group_name: "Duyuru",
      value: targetType,
      value_type: "plain_text",
      description: "Duyuru hedef tipi: song, cover, photo veya link.",
      is_public: true,
      updated_by: admin.userId,
      updated_at: now,
    },
    {
      key: "homepage_announcement_target_id",
      label: "Ana Sayfa Duyuru Hedef ID",
      group_name: "Duyuru",
      value: targetId,
      value_type: "plain_text",
      description: "Seçilen şarkı, cover veya fotoğraf kaydının id değeri.",
      is_public: true,
      updated_by: admin.userId,
      updated_at: now,
    },
    {
      key: "homepage_announcement_target_url",
      label: "Ana Sayfa Duyuru Hedef Link",
      group_name: "Duyuru",
      value: targetUrl,
      value_type: "plain_text",
      description: "Duyuru kartındaki Detaya Git butonunun hedefi.",
      is_public: true,
      updated_by: admin.userId,
      updated_at: now,
    },
    {
      key: "homepage_announcement_is_active",
      label: "Ana Sayfa Duyuru Aktif",
      group_name: "Duyuru",
      value: isActive ? "true" : "false",
      value_type: "plain_text",
      description: "Duyuru aktifse true, pasifse false.",
      is_public: true,
      updated_by: admin.userId,
      updated_at: now,
    },
  ];

  const rows = [...genericRows, ...specialRows];

  const supabase = await createClient();

  const { error } = await supabase.from("site_texts").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    redirectWithError(error.message);
  }

  revalidateTag("public-site-texts", "max");
  revalidateTag("homepage-media", "max");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/metinler");
  revalidatePath("/iletisim");
  revalidatePath("/hakkinda");
  revalidatePath("/giris");
  revalidatePath("/kayit");
  revalidatePath("/hesabim");
  revalidatePath("/hesabim/duzenle");
  revalidatePath("/sifremi-unuttum");
  revalidatePath("/yeni-sifre");

  redirect("/admin/metinler?saved=1");
}

export default async function AdminSiteTextsPage({
  searchParams,
}: SiteTextsPageProps) {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const params = await searchParams;
  const errorMessage = params.error ? decodeURIComponent(params.error) : null;
  const saved = params.saved === "1";

  const supabase = await createClient();

  const [settingsResult, songsResult, coversResult, photosResult] =
    await Promise.all([
      supabase
        .from("site_texts")
        .select("key,value")
        .in(
          "key",
          siteTextDefinitions.map((definition) => definition.key),
        ),

      supabase
        .from("songs")
        .select("id,title,slug")
        .eq("release_status", "published")
        .order("created_at", { ascending: false }),

      supabase
        .from("covers")
        .select("id,title,slug")
        .eq("release_status", "published")
        .order("created_at", { ascending: false }),

      supabase
        .from("photos")
        .select("id,title")
        .eq("release_status", "published")
        .order("created_at", { ascending: false }),
    ]);

  const settings = mergeSiteTextRows((settingsResult.data ?? []) as SiteTextRow[]);
  const songs = (songsResult.data ?? []) as SongOption[];
  const covers = (coversResult.data ?? []) as CoverOption[];
  const photos = (photosResult.data ?? []) as PhotoOption[];

  const targetType = settings.homepage_announcement_target_type || "song";
  const targetId = settings.homepage_announcement_target_id || "";
  const targetUrl = settings.homepage_announcement_target_url || "";
  const isActive = settings.homepage_announcement_is_active !== "false";

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[38px] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-eyebrow">Admin Paneli</p>

              <h1 className="text-[clamp(28px,7vw,48px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Site Metinleri
              </h1>

              <p className="mt-4 max-w-3xl text-[12px] leading-7 text-[#4B232D]/70 md:text-sm md:leading-8">
                Navbar, şarkı, cover ve fotoğraf kayıtları hariç; sitedeki
                sabit başlıkları, açıklamaları, buton yazılarını ve footer
                metinlerini buradan yönet.
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
                href="/"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-4 text-[11px] font-bold text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:text-xs"
              >
                Ana Sayfayı Gör
              </Link>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">Site metinleri kaydedilemedi.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          {saved ? (
            <div className="mt-6 rounded-[22px] border border-emerald-200/70 bg-emerald-50/80 p-4 text-[12px] font-bold leading-6 text-emerald-800">
              Site metinleri başarıyla kaydedildi.
            </div>
          ) : null}

          {settingsResult.error ? (
            <div className="mt-6 rounded-[22px] border border-red-200/70 bg-red-50/80 p-4 text-[12px] leading-6 text-red-800">
              <p className="font-bold">site_texts tablosu okunamadı.</p>
              <p className="mt-1">{settingsResult.error.message}</p>
            </div>
          ) : null}

          <form action={saveSiteTextsAction} className="mt-6 grid gap-5">
            <section className="rounded-[22px] border border-[#4B232D]/10 bg-white/44 p-4 md:rounded-[28px] md:p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-eyebrow">Duyuru Hedefi</p>
                  <h2 className="text-[26px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[34px]">
                    Detaya Git yönlendirmesi
                  </h2>
                </div>

                <label className="flex items-center gap-3 rounded-full border border-[#4B232D]/10 bg-white/70 px-4 py-3">
                  <input
                    name="homepage_announcement_is_active"
                    type="checkbox"
                    defaultChecked={isActive}
                    className="h-4 w-4 accent-[#4B232D]"
                  />

                  <span className="text-xs font-bold text-[#4B232D]">
                    Duyuru aktif olsun
                  </span>
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                    Duyuru Tipi
                  </span>

                  <select
                    name="homepage_announcement_target_type"
                    defaultValue={targetType}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  >
                    <option value="song">Şarkı</option>
                    <option value="cover">Cover</option>
                    <option value="photo">Fotoğraf</option>
                    <option value="link">Özel Link</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                    Hedef Şarkı
                  </span>

                  <select
                    name="homepage_announcement_song_id"
                    defaultValue={targetType === "song" ? targetId : ""}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  >
                    <option value="">Şarkı seç</option>
                    {songs.map((song) => (
                      <option key={song.id} value={song.id}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                    Hedef Cover
                  </span>

                  <select
                    name="homepage_announcement_cover_id"
                    defaultValue={targetType === "cover" ? targetId : ""}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  >
                    <option value="">Cover seç</option>
                    {covers.map((cover) => (
                      <option key={cover.id} value={cover.id}>
                        {cover.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                    Hedef Fotoğraf
                  </span>

                  <select
                    name="homepage_announcement_photo_id"
                    defaultValue={targetType === "photo" ? targetId : ""}
                    className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-bold text-[#4B232D] outline-none transition focus:border-[#4B232D]/35"
                  >
                    <option value="">Fotoğraf seç</option>
                    {photos.map((photo) => (
                      <option key={photo.id} value={photo.id}>
                        {photo.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                  Özel Link
                </span>

                <input
                  name="homepage_announcement_custom_url"
                  placeholder="https://..."
                  defaultValue={targetType === "link" ? targetUrl : ""}
                  className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                />
              </label>

              <p className="mt-3 text-[11px] leading-6 text-[#4B232D]/60">
                Buton yazısı ana sayfada sabit olarak “Detaya Git →” görünür.
                Seçtiğin tipe göre ilgili şarkıya, cover bölümüne, fotoğrafa
                veya özel linke yönlenir.
              </p>
            </section>

            {siteTextGroups.map((groupName) => {
              const groupDefinitions = editableSiteTextDefinitions.filter(
                (definition) => definition.groupName === groupName,
              );

              return (
                <section
                  key={groupName}
                  className="rounded-[22px] border border-white/42 bg-white/54 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.055)] backdrop-blur-[12px] md:rounded-[28px] md:p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="section-eyebrow">Metin Grubu</p>
                      <h2 className="text-[26px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[34px]">
                        {groupName}
                      </h2>
                    </div>

                    <span className="rounded-full bg-[#F5AE50]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#4B232D]">
                      {groupDefinitions.length} alan
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {groupDefinitions.map((definition) => {
                      const value = settings[definition.key] ?? definition.defaultValue;

                      return (
                        <label
                          key={definition.key}
                          className={
                            definition.inputType === "textarea"
                              ? "grid gap-2 md:col-span-2"
                              : "grid gap-2"
                          }
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/55">
                            {definition.label}
                          </span>

                          {definition.inputType === "textarea" ? (
                            <textarea
                              name={definition.key}
                              defaultValue={value}
                              rows={3}
                              className="rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 py-3 text-sm font-medium leading-7 text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                            />
                          ) : (
                            <input
                              name={definition.key}
                              defaultValue={value}
                              className="min-h-12 rounded-[18px] border border-[#4B232D]/10 bg-white/78 px-4 text-sm font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35"
                            />
                          )}

                          <span className="text-[10.5px] leading-5 text-[#4B232D]/48">
                            {definition.description}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <div className="sticky bottom-3 z-20 rounded-[22px] border border-white/45 bg-white/82 p-3 shadow-[0_16px_44px_rgba(75,35,45,0.14)] backdrop-blur-[18px]">
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#4B232D] px-6 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36] md:text-sm"
              >
                Tüm Site Metinlerini Kaydet
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Site metinleri</span>
      </footer>
    </main>
  );
}
