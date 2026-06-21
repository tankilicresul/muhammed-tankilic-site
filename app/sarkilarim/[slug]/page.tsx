import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  getSongBySlug,
  publishedSongs,
  type MusicPlatform,
  type SongDownload,
} from "@/lib/data/songs";

type SongDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publishedSongs.map((song) => ({
    slug: song.slug,
  }));
}

export async function generateMetadata({
  params,
}: SongDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    return {
      title: "Şarkı Bulunamadı | Muhammed Tankılıç",
    };
  }

  return {
    title: `${song.title} | Muhammed Tankılıç`,
    description: song.shortDescription,
  };
}

function PlatformButton({ platform }: { platform: MusicPlatform }) {
  const label =
    platform.name === "Spotify"
      ? "Spotify’da Dinle"
      : platform.name === "Apple Music"
        ? "Apple Music’te Dinle"
        : "YouTube’da İzle";

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-[#4B232D]/12 bg-white/70 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/90"
    >
      {label}
    </a>
  );
}

function DownloadButton({ download }: { download: SongDownload }) {
  if (!download.isActive || !download.fileUrl) {
    return (
      <span className="rounded-full border border-[#4B232D]/10 bg-white/42 px-4 py-2 text-[12px] font-bold text-[#4B232D]/42">
        {download.label} Yakında
      </span>
    );
  }

  if (download.requiresAuth) {
    return (
      <Link
        href="/giris"
        className="rounded-full border border-[#4B232D]/12 bg-[#FFF4BC]/86 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
      >
        {download.label}
      </Link>
    );
  }

  return (
    <a
      href={download.fileUrl}
      download
      className="rounded-full border border-[#4B232D]/12 bg-[#FFF4BC]/86 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
    >
      {download.label}
    </a>
  );
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const relatedSongs = publishedSongs.filter(
    (relatedSong) => relatedSong.slug !== song.slug,
  );

  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasYoutube = Boolean(song.youtubeEmbedUrl);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/sarkilarim" className="pill-button secondary">
            ← Şarkılarım
          </Link>

          <Link href="/coverlarim" className="pill-button secondary">
            Coverlarım
          </Link>
        </div>

        <article className="overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[30px] border border-[#4B232D]/10 bg-[#4B232D]/10 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
              <div className="relative aspect-square">
                <Image
                  src={song.coverImage}
                  alt={`${song.title} kapak görseli`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 430px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FFF4BC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]">
                  {song.type}
                </span>

                <span className="rounded-full bg-[#BDEBE8]/76 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]">
                  Bestem
                </span>

                <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]/66">
                  {song.language}
                </span>

                <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]/66">
                  {song.genre}
                </span>
              </div>

              <p className="section-eyebrow">Şarkılarım</p>

              <h1 className="text-[clamp(46px,6vw,82px)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#4B232D]">
                {song.title}
              </h1>

              <p className="mt-3 text-base font-medium text-[#4B232D]/66">
                {song.artist}
              </p>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-[#4B232D]/72">
                {song.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {song.platforms.map((platform) => (
                  <PlatformButton key={platform.name} platform={platform} />
                ))}

                <Link
                  href="/giris"
                  className="rounded-full border border-[#4B232D]/12 bg-[#FFF4BC]/86 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
                >
                  Siteden İndir
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">Dinle</p>

            <h2 className="section-title">Platform oynatıcıları</h2>

            <p className="mt-4 text-sm leading-7 text-[#4B232D]/70">
              Şarkı hangi platformlarda yayınlandıysa burada o platformlara ait
              oynatıcı ve bağlantılar gösterilir.
            </p>

            <div className="mt-6 grid gap-4">
              {hasYoutube ? (
                <div className="overflow-hidden rounded-[26px] border border-white/24 bg-[#4B232D]/88 shadow-[0_18px_50px_rgba(75,35,45,0.12)]">
                  <iframe
                    src={song.youtubeEmbedUrl}
                    title={`${song.title} YouTube videosu`}
                    className="block aspect-video w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : null}

              {hasSpotify ? (
                <div className="overflow-hidden rounded-[26px] border border-white/24 bg-white/20 shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
                  <iframe
                    src={song.spotifyEmbedUrl}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="block h-[152px] w-full border-0"
                    title={`${song.title} Spotify oynatıcı`}
                  />
                </div>
              ) : null}

                            {!hasYoutube && !hasSpotify ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-[26px] border border-white/24 bg-white/34 p-6 text-center shadow-[0_18px_50px_rgba(75,35,45,0.10)]">
                  <div>
                    <p className="section-eyebrow">Dinleme</p>
                    <h3 className="text-[28px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                      Platform bağlantıları yakında.
                    </h3>
                  </div>
                </div>
              ) : null}
            </div>
          </article>

          <aside className="grid gap-4">
            <article className="rounded-[34px] border border-[#4B232D]/10 bg-[#FFF4BC]/74 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
              <p className="section-eyebrow">Hikâye</p>

              <h2 className="text-[clamp(30px,3.5vw,44px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Şarkımın notu
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#4B232D]/72">
                {song.story || song.shortDescription}
              </p>
            </article>

            <article className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
              <p className="section-eyebrow">İndir</p>

              <h2 className="text-[clamp(30px,3.5vw,44px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Dosyalar
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#4B232D]/70">
                İndirme dosyaları üyelik gerektirebilir. Aktif olmayan
                dosyalar hazır olduğunda açılır.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {song.downloads.map((download) => (
                  <DownloadButton
                    key={`${download.label}-${download.format}`}
                    download={download}
                  />
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">Credits</p>

            <h2 className="section-title">Emeği geçenler</h2>

            <div className="mt-6 grid gap-3">
              {song.credits?.vocal ? (
                <div className="rounded-2xl border border-[#4B232D]/10 bg-white/48 px-5 py-4 text-sm text-[#4B232D]/72">
                  <strong className="text-[#4B232D]">Vokal:</strong>{" "}
                  {song.credits.vocal}
                </div>
              ) : null}

              {song.credits?.lyrics ? (
                <div className="rounded-2xl border border-[#4B232D]/10 bg-white/48 px-5 py-4 text-sm text-[#4B232D]/72">
                  <strong className="text-[#4B232D]">Söz:</strong>{" "}
                  {song.credits.lyrics}
                </div>
              ) : null}

              {song.credits?.music ? (
                <div className="rounded-2xl border border-[#4B232D]/10 bg-white/48 px-5 py-4 text-sm text-[#4B232D]/72">
                  <strong className="text-[#4B232D]">Müzik:</strong>{" "}
                  {song.credits.music}
                </div>
              ) : null}

              {song.credits?.guitar ? (
                <div className="rounded-2xl border border-[#4B232D]/10 bg-white/48 px-5 py-4 text-sm text-[#4B232D]/72">
                  <strong className="text-[#4B232D]">Gitar:</strong>{" "}
                  {song.credits.guitar}
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-[34px] border border-[#4B232D]/10 bg-[#4B232D]/88 p-7 text-white shadow-[0_18px_50px_rgba(75,35,45,0.14)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow light">Sözler</p>

            <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-white">
              Şarkımın sözleri
            </h2>

            {song.lyrics ? (
              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-white/72">
                {song.lyrics}
              </p>
            ) : (
              <p className="mt-5 text-sm leading-8 text-white/72">
                Şarkımın sözleri daha sonra bu alana eklenecek.
              </p>
            )}
          </article>
        </div>
      </section>

      {relatedSongs.length > 0 ? (
        <section className="site-container section-space">
          <div className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Diğer Şarkılarım</p>
                <h2 className="section-title">Diğer bestelerim</h2>
              </div>

              <Link href="/sarkilarim" className="pill-button secondary">
                Tümünü Gör
              </Link>
            </div>

            <div className="music-grid">
              {relatedSongs.map((relatedSong) => (
                <article key={relatedSong.slug} className="music-card soft-card">
                  <Link
                    href={`/sarkilarim/${relatedSong.slug}`}
                    className="music-cover"
                  >
                    <Image
                      src={relatedSong.coverImage}
                      alt={`${relatedSong.title} kapak görseli`}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="music-card-body">
                    <span>{relatedSong.type}</span>
                    <h3>{relatedSong.title}</h3>
                    <p>{relatedSong.shortDescription}</p>

                    <div className="card-actions">
                      <Link
                        href={`/sarkilarim/${relatedSong.slug}`}
                        className="text-link"
                      >
                        Detay
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>{song.title} · Şarkılarım · Bestem</span>
      </footer>
    </main>
  );
}