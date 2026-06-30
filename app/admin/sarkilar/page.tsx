import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şarkı Yönetimi | Admin Paneli",
  description: "Muhammed Tankılıç web sitesi admin paneli şarkı yönetimi sayfası.",
};

type SongRow = Record<string, unknown>;

function getString(row: SongRow, key: string) {
  const value = row[key];

  if (typeof value === "string") {
    return value.trim();
  }

  return "";
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

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "published" || normalized === "yayinda" || normalized === "yayında") {
    return "Yayında";
  }

  if (normalized === "draft" || normalized === "taslak" || normalized === "") {
    return "Taslak";
  }

  if (normalized === "hidden" || normalized === "gizli") {
    return "Gizli";
  }

  if (normalized === "archived" || normalized === "arsiv" || normalized === "arşiv") {
    return "Arşiv";
  }

  return status;
}

function isPublishedStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "published" || normalized === "yayinda" || normalized === "yayında";
}

function isDraftStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "draft" || normalized === "taslak" || normalized === "";
}

function truncateText(value: string, maxLength = 95) {
  if (!value) {
    return "Açıklama girilmemiş.";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

export default async function AdminSongsPage() {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    redirect("/giris");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  const songs = (data ?? []) as SongRow[];

  const publishedCount = songs.filter((song) => {
    const status = getString(song, "status");
    return isPublishedStatus(status);
  }).length;

  const draftCount = songs.filter((song) => {
    const status = getString(song, "status");
    return isDraftStatus(status);
  }).length;

  const spotifyCount = songs.filter((song) => {
    return Boolean(getString(song, "spotify_url") || getString(song, "spotify_link"));
  }).length;

  const youtubeCount = songs.filter((song) => {
    return Boolean(getString(song, "youtube_url") || getString(song, "youtube_link"));
  }).length;

  return (
    <main className="min-h-screen pb-16 text-[#4B232D]">
      <Navbar />

      <section className="mx-auto mt-10 w-[min(1120px,calc(100%-32px))] rounded-[38px] border border-white/70 bg-white/70 px-8 py-10 shadow-[0_24px_80px_rgba(75,35,45,0.14)] backdrop-blur-xl md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#8a6070]">
              Admin Paneli
            </p>

            <h1 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Şarkı Yönetimi
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f4b58]">
              Bu sayfada Supabase&apos;deki şarkı kayıtlarını listeliyoruz.
              Yeni şarkı ekleme ekranına buradan geçilecek. Düzenleme sayfasını
              sonraki adımda ayrıca bağlayacağız.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-[#4B232D]/10 bg-white/80 px-5 py-3 text-sm font-bold text-[#4B232D] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              Admin Ana Sayfa
            </Link>

            <Link
              href="/admin/sarkilar/yeni"
              className="rounded-full bg-[#4B232D] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(75,35,45,0.24)] transition hover:-translate-y-0.5"
            >
              Yeni Şarkı Ekle
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-[26px] bg-white/85 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a7480]">
              Toplam Şarkı
            </p>
            <p className="mt-3 text-4xl font-black">{songs.length}</p>
          </div>

          <div className="rounded-[26px] bg-white/85 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a7480]">
              Yayında
            </p>
            <p className="mt-3 text-4xl font-black">{publishedCount}</p>
          </div>

          <div className="rounded-[26px] bg-white/85 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a7480]">
              Taslak
            </p>
            <p className="mt-3 text-4xl font-black">{draftCount}</p>
          </div>

          <div className="rounded-[26px] bg-white/85 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a7480]">
              Bağlantılar
            </p>
            <p className="mt-3 text-lg font-black">
              Spotify {spotifyCount} / YouTube {youtubeCount}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-[26px] border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-700">
            Şarkılar okunurken hata oluştu: {error.message}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-[30px] bg-white/88 shadow-sm">
          <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-[#4B232D]/10 px-6 py-5 text-xs font-black uppercase tracking-[0.22em] text-[#9a7480]">
            <span>Şarkı</span>
            <span>Durum</span>
            <span>Sıra</span>
            <span>Güncelleme</span>
            <span>İşlem</span>
          </div>

          {songs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-xl font-black">Henüz şarkı kaydı yok.</p>
              <p className="mt-2 text-sm text-[#6f4b58]">
                İlk şarkıyı eklemek için Yeni Şarkı Ekle butonunu kullan.
              </p>

              <Link
                href="/admin/sarkilar/yeni"
                className="mt-6 inline-flex rounded-full bg-[#4B232D] px-6 py-3 text-sm font-bold text-white"
              >
                Yeni Şarkı Ekle
              </Link>
            </div>
          ) : (
            songs.map((song) => {
              const id = getString(song, "id");
              const title = getString(song, "title") || "Başlıksız Şarkı";
              const slug = getString(song, "slug");
              const artist = getString(song, "artist") || "Muhammed Tankılıç";
              const description =
                getString(song, "description") ||
                getString(song, "short_description") ||
                getString(song, "summary");
              const status = getString(song, "status") || "draft";
              const sortOrder = getNumber(song, "sort_order");
              const updatedAt =
                getString(song, "updated_at") ||
                getString(song, "created_at") ||
                getString(song, "release_date");

              const spotifyUrl =
                getString(song, "spotify_url") || getString(song, "spotify_link");
              const appleMusicUrl =
                getString(song, "apple_music_url") ||
                getString(song, "apple_music_link");
              const youtubeUrl =
                getString(song, "youtube_url") || getString(song, "youtube_link");

              const published = isPublishedStatus(status);

              return (
                <div
                  key={id || slug || title}
                  className="grid grid-cols-1 gap-4 border-b border-[#4B232D]/10 px-6 py-6 last:border-b-0 md:grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_0.8fr] md:items-center"
                >
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.03em]">
                      {title}
                    </h2>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7480]">
                      {artist}
                      {slug ? ` · ${slug}` : ""}
                    </p>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f4b58]">
                      {truncateText(description)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {spotifyUrl ? (
                        <a
                          href={spotifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#BDEBE8]/70 px-3 py-1 text-xs font-bold text-[#4B232D]"
                        >
                          Spotify
                        </a>
                      ) : null}

                      {appleMusicUrl ? (
                        <a
                          href={appleMusicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#FFF4BC]/90 px-3 py-1 text-xs font-bold text-[#4B232D]"
                        >
                          Apple Music
                        </a>
                      ) : null}

                      {youtubeUrl ? (
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#F5AE50]/25 px-3 py-1 text-xs font-bold text-[#4B232D]"
                        >
                          YouTube
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <span
                      className={
                        published
                          ? "inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700"
                          : "inline-flex rounded-full bg-[#FFF4BC] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4B232D]"
                      }
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  <div className="text-sm font-black">
                    {sortOrder === null ? "—" : sortOrder}
                  </div>

                  <div className="text-sm font-bold text-[#6f4b58]">
                    {formatDate(updatedAt)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {slug ? (
                      <Link
                        href={`/sarkilarim/${slug}`}
                        className="rounded-full border border-[#4B232D]/10 bg-white px-4 py-2 text-sm font-bold text-[#4B232D] transition hover:bg-[#FFF4BC]"
                      >
                        Gör
                      </Link>
                    ) : null}

                    <span className="rounded-full border border-[#4B232D]/10 bg-white/60 px-4 py-2 text-sm font-bold text-[#9a7480]">
                      Düzenle sonra
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>Şarkı yönetimi</span>
      </footer>
    </main>
  );
}