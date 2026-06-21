import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSongBySlug, publishedSongs } from "@/lib/data/songs";

type SongDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
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
    description: song.description,
  };
}

function getPlatformLabel(name: string) {
  if (name === "Spotify") return "Spotify’da Dinle";
  if (name === "Apple Music") return "Apple Music";
  if (name === "YouTube") return "YouTube";
  return name;
}

function CreditRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-2xl bg-white/58 px-4 py-3 text-sm">
      <span className="text-[#4B232D]/58">{label}</span>
      <strong className="text-right text-[#4B232D]">{value}</strong>
    </div>
  );
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <Link
          href="/muzik"
          className="mb-4 inline-flex rounded-full bg-white/58 px-4 py-2 text-[12px] font-bold text-[#4B232D] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/74"
        >
          ← Tüm Şarkılar
        </Link>

        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(245,174,80,0.14),transparent_30%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-[30px] border border-white/25 bg-[#4B232D]/15 shadow-[0_22px_65px_rgba(75,35,45,0.16)]">
              <Image
                src={song.coverImage}
                alt={`${song.title} kapak görseli`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 440px"
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  {song.isLatest ? "Son Çıkan" : "Şarkı"}
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  {song.language}
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  {song.type}
                </span>
              </div>

              <p className="section-eyebrow">Şarkı Detayı</p>

              <h1 className="max-w-3xl text-[clamp(44px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                {song.title}
              </h1>

              <p className="mt-3 text-sm font-semibold text-[#4B232D]/78">
                {song.artist}
              </p>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                {song.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {song.platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-button"
                  >
                    {getPlatformLabel(platform.name)}
                  </a>
                ))}

                <Link href="/giris" className="pill-button secondary">
                  Üye Olup İndir
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/58 p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#4B232D]/50">
                    Tür
                  </span>
                  <strong className="mt-2 block text-sm text-[#4B232D]">
                    {song.genre}
                  </strong>
                </div>

                <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/58 p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#4B232D]/50">
                    Dil
                  </span>
                  <strong className="mt-2 block text-sm text-[#4B232D]">
                    {song.language}
                  </strong>
                </div>

                <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/58 p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#4B232D]/50">
                    Yayın
                  </span>
                  <strong className="mt-2 block text-sm text-[#4B232D]">
                    {song.releaseDate ?? "Yakında"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Detaylar</p>
              <h2 className="section-title">Hikâye ve erişim</h2>
              <p className="section-description">
                Şarkının hikâyesi, özel dosyaları ve üyelik gerektiren içerik
                alanları.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="flex min-h-[300px] flex-col rounded-[30px] border border-[#4B232D]/10 bg-white/58 p-7 shadow-[0_14px_42px_rgba(75,35,45,0.07)] backdrop-blur-[12px] md:p-8">
              <p className="section-eyebrow">Hikâye</p>

              <h3 className="text-[clamp(30px,3.8vw,46px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Şarkının arkasındaki duygu
              </h3>

              <p className="mt-5 text-sm leading-8 text-[#4B232D]/72">
                {song.story ??
                  "Bu şarkının hikâyesi ve üretim notları daha sonra eklenecek."}
              </p>
            </article>

            <aside className="flex min-h-[300px] flex-col rounded-[30px] border border-[#4B232D]/10 bg-[#FFF4BC]/72 p-7 shadow-[0_14px_42px_rgba(75,35,45,0.07)] backdrop-blur-[12px] md:p-8">
              <p className="section-eyebrow">İndirme</p>

              <h3 className="text-[clamp(30px,3.8vw,46px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Üyelere özel dosyalar
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#4B232D]/70">
                MP3, WAV, kapak görseli veya özel içerikler aktif edildiğinde
                üyelikle indirilebilir olacak.
              </p>

              <div className="mt-6 grid gap-2">
                {song.downloads.map((download) => {
                  if (!download.isActive) {
                    return (
                      <div
                        key={download.label}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#4B232D]/10 bg-white/48 px-4 py-3 text-sm"
                      >
                        <span className="font-semibold text-[#4B232D]">
                          {download.label}
                        </span>

                        <span className="rounded-full bg-[#4B232D]/10 px-3 py-1 text-[11px] font-bold text-[#4B232D]/60">
                          Yakında
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={download.label}
                      href={download.requiresAuth ? "/giris" : download.fileUrl}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#4B232D]/10 bg-white/54 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:bg-white/74"
                    >
                      <span className="font-semibold text-[#4B232D]">
                        {download.label}
                      </span>

                      <span className="rounded-full bg-[#F5AE50]/80 px-3 py-1 text-[11px] font-bold text-[#4B232D]">
                        {download.requiresAuth
                          ? "Giriş Gerekli"
                          : download.format}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Arşiv Bilgisi</p>
              <h2 className="section-title">Credits ve sözler</h2>
              <p className="section-description">
                Şarkının üretim bilgileri, söz alanı ve özel notları.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="flex min-h-[330px] flex-col rounded-[30px] border border-[#4B232D]/10 bg-white/58 p-7 shadow-[0_14px_42px_rgba(75,35,45,0.07)] backdrop-blur-[12px] md:p-8">
              <p className="section-eyebrow">Credits</p>

              <h3 className="text-[clamp(30px,3.8vw,46px)] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                Emeği geçenler
              </h3>

              <div className="mt-6 grid gap-3">
                {song.credits?.vocal ? (
                  <CreditRow label="Vokal" value={song.credits.vocal} />
                ) : null}

                {song.credits?.lyrics ? (
                  <CreditRow label="Söz" value={song.credits.lyrics} />
                ) : null}

                {song.credits?.music ? (
                  <CreditRow label="Müzik" value={song.credits.music} />
                ) : null}

                {song.credits?.arrangement ? (
                  <CreditRow label="Aranje" value={song.credits.arrangement} />
                ) : null}

                {song.credits?.guitar ? (
                  <CreditRow label="Gitar" value={song.credits.guitar} />
                ) : null}

                {song.credits?.recording ? (
                  <CreditRow label="Kayıt" value={song.credits.recording} />
                ) : null}

                {song.credits?.mixMaster ? (
                  <CreditRow
                    label="Mix / Master"
                    value={song.credits.mixMaster}
                  />
                ) : null}

                {song.credits?.coverDesign ? (
                  <CreditRow label="Kapak" value={song.credits.coverDesign} />
                ) : null}
              </div>
            </article>

            <article className="flex min-h-[330px] flex-col rounded-[30px] border border-[#4B232D]/10 bg-[#4B232D]/88 p-7 text-white shadow-[0_14px_42px_rgba(75,35,45,0.12)] backdrop-blur-[12px] md:p-8">
              <p className="section-eyebrow light">Şarkı Sözleri</p>

              <h3 className="text-[clamp(30px,3.8vw,46px)] font-semibold leading-none tracking-[-0.07em] text-white">
                Sözler ve özel notlar
              </h3>

              {song.lyrics ? (
                <details className="mt-6 rounded-[24px] border border-white/12 bg-white/8 p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white">
                    Şarkı sözlerini göster
                  </summary>

                  <p className="mt-5 whitespace-pre-line text-sm leading-8 text-white/74">
                    {song.lyrics}
                  </p>
                </details>
              ) : (
                <p className="mt-5 text-sm leading-7 text-white/68">
                  Şarkı sözleri ve özel notlar daha sonra eklenecek. Bu alan
                  ileride üyelik gerektiren özel içerik olarak da kullanılabilir.
                </p>
              )}

              <div className="mt-7">
                <Link href="/giris" className="pill-button outline-light">
                  Özel İçerikler İçin Giriş Yap
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {song.youtubeEmbedUrl ? (
        <section className="site-container section-space">
          <div className="rounded-[34px] border border-white/35 bg-white/56 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-8 lg:p-10">
            <p className="section-eyebrow">Video</p>
            <h2 className="section-title">YouTube videosu</h2>

            <div className="mt-6 aspect-video overflow-hidden rounded-[24px] bg-[#4B232D]/20">
              <iframe
                src={song.youtubeEmbedUrl}
                title={`${song.title} YouTube videosu`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : null}

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>{song.title} · Şarkı Detayı</span>
      </footer>
    </main>
  );
}