import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const featuredSong = {
  title: "Zef Cara",
  artist: "Muhammed Tankılıç",
  type: "Single",
  status: "Yayında",
  language: "Kürtçe",
  coverImage: "/muzik/zef-cara-cover.jpg",
  description:
    "Kürtçe sözler, akustik gitar ve sade bir yorumla şekillenen özgün çalışma.",
  spotifyUrl:
    "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
  appleUrl: "https://music.apple.com/us/album/zef-cara-single/1779404301",
  spotifyEmbed:
    "https://open.spotify.com/embed/track/7B5SGhv7YD7opodmyJQQqm?utm_source=generator",
};

const songs = [
  {
    title: "Zef Cara",
    type: "Single",
    status: "Yayında",
    image: "/muzik/zef-cara-cover.jpg",
    description: "Kürtçe sözler, akustik gitar ve yalın yorum.",
  },
  {
    title: "Akustik Kayıtlar",
    type: "Arşiv",
    status: "Yakında",
    image: "/muhammed-hero2.png",
    description: "Ev kayıtları, prova notları ve sade yorumlar.",
  },
  {
    title: "Cover Yorumlar",
    type: "Cover",
    status: "Yakında",
    image: "/muhammed-hero2.png",
    description: "Tanıdık ezgilerin Muhammed Tankılıç yorumları.",
  },
];

const filters = ["Tümü", "Single", "Akustik", "Cover", "Yakında"];

export default function MuzikPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="soft-card px-5 py-5 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-end">
            <div>
              <p className="section-eyebrow mb-2">Şarkılar</p>

              <h1 className="font-serif text-4xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-5xl">
                Müzik arşivi
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                Yayımlanan şarkılar, akustik kayıtlar, cover yorumlar ve özel
                içerikler.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {filters.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={
                    index === 0
                      ? "pill-button !min-h-8 !px-4 !py-1.5 !text-xs"
                      : "pill-button secondary !min-h-8 !px-4 !py-1.5 !text-xs"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-6">
        <article className="soft-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.36fr_0.64fr]">
            <div className="relative h-72 bg-(--mint-soft) lg:h-auto">
              <Image
                src={featuredSong.coverImage}
                alt={`${featuredSong.title} kapak görseli`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 36vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

              <span className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-(--burgundy)">
                {featuredSong.type}
              </span>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className="section-eyebrow mb-2">Öne Çıkan Eser</p>

                  <h2 className="font-serif text-4xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-5xl">
                    {featuredSong.title}
                  </h2>

                  <p className="mt-2 text-xs font-extrabold text-[rgba(75,35,45,0.55)]">
                    {featuredSong.artist}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
                    {featuredSong.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={featuredSong.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-button !min-h-9 !px-4 !py-2 !text-xs"
                    >
                      Spotify
                    </a>

                    <a
                      href={featuredSong.appleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs"
                    >
                      Apple Music
                    </a>

                    <Link
                      href="/giris?next=/muzik"
                      className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs"
                    >
                      İndir
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[25px] border border-[rgba(75,35,45,0.1)] bg-white/55 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.48)]">
                      Siteden Dinle
                    </p>

                    <h3 className="mt-1 font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                      {featuredSong.title}
                    </h3>

                    <div className="mt-3 rounded-[25px] bg-white/65 p-3">
                      <audio controls preload="none" className="w-full">
                        Tarayıcınız ses oynatmayı desteklemiyor.
                      </audio>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[25px] border border-[rgba(75,35,45,0.1)] bg-white/60">
                    <iframe
                      title="Zef Cara Spotify oynatıcı"
                      src={featuredSong.spotifyEmbed}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="block w-full border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-[rgba(75,35,45,0.1)] pt-5 sm:grid-cols-3">
                <InfoBox label="Dil" value={featuredSong.language} />
                <InfoBox label="Yayın Türü" value={featuredSong.type} />
                <InfoBox label="Durum" value={featuredSong.status} />
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container py-6">
        <div className="mb-4">
          <p className="section-eyebrow mb-2">Tüm Şarkılar</p>

          <h2 className="font-serif text-3xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-4xl">
            Kayıtlar
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
            Yayındaki şarkılar ve yakında eklenecek yeni kayıtlar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {songs.map((song) => (
            <article key={song.title} className="soft-card overflow-hidden">
              <div className="relative h-36 bg-(--mint-soft)">
                <Image
                  src={song.image}
                  alt={`${song.title} görseli`}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-(--orange) px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-(--burgundy)">
                    {song.type}
                  </span>

                  <span className="rounded-full bg-white/65 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    {song.status}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                  {song.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                  {song.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <Link href="/muzik" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                    Detay
                  </Link>

                  <Link
                    href="/giris?next=/muzik"
                    className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs"
                  >
                    İndir
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container py-6 pb-2">
        <div className="cream-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="section-eyebrow mb-2">Üyelere Özel</p>

            <h2 className="font-serif text-2xl font-bold tracking-tighter text-(--burgundy) md:text-3xl">
              Sözler, indirmeler ve özel içerikler.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
              Şarkı sözleri, Türkçe çeviriler ve özel kayıtlar üyelik ile
              açılacak.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/giris?next=/muzik" className="pill-button dark !min-h-9 !px-4 !py-2 !text-xs">
              Giriş Yap
            </Link>

            <Link href="/kayit" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[25px] border border-[rgba(75,35,45,0.08)] bg-white/55 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.48)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-(--burgundy)">{value}</p>
    </div>
  );
}