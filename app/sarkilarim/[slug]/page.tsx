import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  getPublishedSongBySlug,
  getPublishedSongs,
  type PublicMusicPlatform,
} from "@/lib/supabase/public-songs";

type SongDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SongDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await getPublishedSongBySlug(slug);

  if (!song) {
    return {
      title: "Şarkı Bulunamadı | Muhammed Tankılıç",
    };
  }

  return {
    title: `${song.title} | Muhammed Tankılıç`,
    description: song.shortDescription || song.description,
  };
}

function PlatformButton({ platform }: { platform: PublicMusicPlatform }) {
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

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = await params;
  const song = await getPublishedSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const songs = await getPublishedSongs();
  const relatedSongs = songs.filter((relatedSong) => relatedSong.slug !== song.slug);
  const hasSpotify = Boolean(song.spotifyEmbedUrl);
  const hasYoutube = Boolean(song.youtubeEmbedUrl);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-4">
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
                  Single
                </span>

                <span className="rounded-full bg-[#BDEBE8]/76 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]">
                  Bestem
                </span>

                <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4B232D]/66">
                  Kürtçe
                </span>
              </div>

              <p className="section-eyebrow">Şarkılarım</p>

              <h1 className="text-[clamp(46px,6vw,82px)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#4B232D]">
                {song.title}
              </h1>

              <p className="mt-3 text-base font-medium text-[#4B232D]/66">
                {song.artist}
              </p>

              {song.description ? (
                <p className="mt-6 max-w-2xl text-sm leading-8 text-[#4B232D]/72">
                  {song.description}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-2">
                {song.platforms.map((platform) => (
                  <PlatformButton key={platform.name} platform={platform} />
                ))}

                <Link
                  href="/giris"
                  className="rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
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
                {song.description || "Bu şarkının notu daha sonra eklenecek."}
              </p>
            </article>

            <article className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
              <p className="section-eyebrow">İndir</p>

              <h2 className="text-[clamp(30px,3.5vw,44px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                Dosyalar
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#4B232D]/70">
                İndirme dosyaları üyelik gerektirebilir.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/giris"
                  className="rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5"
                >
                  MP3 İndir
                </Link>
              </div>
            </article>
          </aside>
        </div>
      </section>

      {song.lyrics ? (
        <section className="site-container section-space">
          <article className="rounded-[34px] border border-[#4B232D]/10 bg-[#4B232D]/88 p-7 text-white shadow-[0_18px_50px_rgba(75,35,45,0.14)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow light">Sözler</p>

            <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-white">
              Şarkımın sözleri
            </h2>

            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-white/72">
              {song.lyrics}
            </p>
          </article>
        </section>
      ) : null}

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

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {relatedSongs.map((relatedSong) => (
                <Link
                  key={relatedSong.slug}
                  href={`/sarkilarim/${relatedSong.slug}`}
                  className="rounded-[22px] border border-white/42 bg-white/64 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] transition hover:-translate-y-0.5 hover:bg-white/78"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/45">
                    Şarkılarım
                  </p>

                  <h3 className="mt-2 text-[24px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                    {relatedSong.title}
                  </h3>

                  <p className="mt-2 text-[12px] leading-6 text-[#4B232D]/66">
                    {relatedSong.artist}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>resultankilic.ai tarafından tasarlanmıştır</span>
      </footer>
    </main>
  );
}
