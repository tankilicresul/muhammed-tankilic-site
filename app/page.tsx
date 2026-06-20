"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthButtons from "@/components/AuthButtons";

const heroTallImage = "/muhammed-hero2.png";

const latestRelease = {
  title: "Zef Cara",
  artist: "Muhammed Tankılıç",
  coverImage: "/muzik/zef-cara-cover.jpg",
  description:
    "Kürtçe sözler, akustik gitar ve sade bir yorumla şekillenen özgün çalışma.",
  spotifyUrl:
    "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
  appleUrl: "https://music.apple.com/us/album/zef-cara-single/1779404301",
  youtubeEmbedUrl: "",
};

const songs = [
  {
    title: "Zef Cara",
    type: "Single",
    description: "Kürtçe sözler, akustik gitar ve yalın yorum.",
    coverImage: "/muzik/zef-cara-cover.jpg",
    href: "/muzik",
  },
  {
    title: "Akustik Kayıtlar",
    type: "Arşiv",
    description: "Ev kayıtları, prova notları ve sade yorumlar.",
    coverImage: "/muhammed-hero2.png",
    href: "/muzik",
  },
  {
    title: "Cover Yorumlar",
    type: "Yakında",
    description: "Tanıdık ezgilerin kişisel yorumları.",
    coverImage: "/muhammed-hero2.png",
    href: "/muzik",
  },
];

const quickSections = [
  {
    title: "Videolar",
    description: "Klipler, kısa performanslar ve sahne arkası görüntüler.",
    href: "/videolar",
  },
  {
    title: "Fotoğraflar",
    description: "Kapak tasarımları, portreler ve görsel arşiv.",
    href: "/fotograflar",
  },
  {
    title: "Hakkında",
    description: "Sanatçının müzik dili, sözleri ve kişisel hikâyesi.",
    href: "/hakkinda",
  },
];

export default function Home() {
  const [heroReveal, setHeroReveal] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const value = Math.min(window.scrollY * 0.65, 620);
      setHeroReveal(value);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <Navbar />

      <section
        id="anasayfa"
        className="mx-auto w-full max-w-[1180px] px-4 pt-7 md:px-6 md:pt-10"
      >
        <div className="grid gap-5 lg:grid-cols-[390px_1fr] lg:items-stretch">
          <div className="rounded-[32px] border border-[rgba(75,35,45,0.10)] bg-[rgba(255,255,255,0.88)] p-6 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-xl md:p-8 lg:min-h-[700px]">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
                  Bağımsız Kürtçe Müzik
                </p>

                <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--burgundy)] md:text-6xl">
                  Muhammed
                  <br />
                  Tankılıç
                </h1>

                <p className="mt-7 max-w-sm text-[15px] font-light leading-8 text-[rgba(75,35,45,0.72)]">
                  Kürtçe şarkılar, akustik yorumlar ve kişisel hikâyeler.
                  Muhammed Tankılıç’ın müziklerini, sözlerini ve kayıtlarını
                  sade bir dijital arşivde keşfet.
                </p>

                <div className="mt-8 grid gap-3">
                  <InfoBox label="Tarz" value="Kürtçe Akustik" />
                  <InfoBox label="Arşiv" value="Şarkılar" />
                  <InfoBox label="Erişim" value="Üyelikli" />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2.5">
                <a
                  href="#son-cikan"
                  className="inline-flex justify-center rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-medium text-[var(--burgundy)] shadow-sm transition hover:-translate-y-0.5"
                >
                  Son Çıkanı Dinle
                </a>

                <Link
                  href="/muzik"
                  className="inline-flex justify-center rounded-full border border-[rgba(75,35,45,0.10)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                >
                  Müzik Arşivi
                </Link>

                <Link
                  href="/kayit"
                  className="inline-flex justify-center rounded-full bg-[var(--burgundy)] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  Üye Ol
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[700px] overflow-hidden rounded-[32px] border border-[rgba(75,35,45,0.12)] bg-[rgba(255,255,255,0.18)] shadow-[0_24px_70px_rgba(75,35,45,0.12)]">
            <div
              className="absolute inset-x-0 top-0 h-[190%] will-change-transform"
              style={{
                transform: `translate3d(0, -${heroReveal}px, 0)`,
              }}
            >
              <Image
                src={heroTallImage}
                alt="Muhammed Tankılıç gitarla"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover object-top"
              />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-[rgba(255,255,255,0.1)] via-transparent to-[rgba(255,255,255,0.04)]" />

            <div className="absolute right-5 top-5 rounded-full border border-white/35 bg-white/76 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--burgundy)] backdrop-blur-md">
              Müzik · Söz · Hikâye
            </div>

            <div className="absolute bottom-5 right-5 rounded-full border border-white/35 bg-white/72 px-5 py-3 text-[11px] font-medium text-[var(--burgundy)] shadow-[0_12px_34px_rgba(75,35,45,0.12)] backdrop-blur-md">
              Kürtçe müzik · Akustik yorumlar
            </div>
          </div>
        </div>
      </section>

      <section
        id="uyelik"
        className="mx-auto w-full max-w-[1180px] px-4 py-6 md:px-6"
      >
        <div className="flex flex-col gap-4 rounded-[32px] border border-[rgba(75,35,45,0.10)] bg-[rgba(189,235,232,0.72)] px-5 py-5 shadow-[0_18px_45px_rgba(75,35,45,0.06)] backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
              Üyelik
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.05em] text-[var(--burgundy)] md:text-4xl">
              Özel içerikler ve indirmeler için giriş yap.
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-light leading-7 text-[rgba(75,35,45,0.68)]">
              Üyeler şarkı sözlerine, özel içeriklere ve indirme bağlantılarına
              erişebilir.
            </p>
          </div>

          <div className="shrink-0">
            <AuthButtons />
          </div>
        </div>
      </section>

      <section
        id="son-cikan"
        className="mx-auto w-full max-w-[1180px] px-4 py-7 md:px-6"
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
              Son Çıkan
            </p>

            <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.05em] text-[var(--burgundy)] md:text-5xl">
              Yeni kayıt
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-[rgba(75,35,45,0.68)]">
              En son yayımlanan parça, dinleme bağlantıları ve video alanı.
            </p>
          </div>

          <Link
            href="/muzik"
            className="inline-flex w-fit rounded-full border border-[rgba(75,35,45,0.10)] bg-white/78 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
          >
            Tüm Müzikler
          </Link>
        </div>

        <article className="overflow-hidden rounded-[32px] border border-[rgba(75,35,45,0.10)] bg-[rgba(255,255,255,0.84)] shadow-[0_18px_55px_rgba(75,35,45,0.08)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-[0.34fr_0.66fr]">
            <div className="relative h-72 lg:h-full">
              <Image
                src={latestRelease.coverImage}
                alt={`${latestRelease.title} kapak görseli`}
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/28 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/82 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--burgundy)]">
                Latest Release
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.58)]">
                    Öne Çıkan Eser
                  </p>

                  <h3 className="mt-2 text-4xl font-semibold leading-none tracking-[-0.06em] text-[var(--burgundy)] md:text-6xl">
                    {latestRelease.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium text-[rgba(75,35,45,0.56)]">
                    {latestRelease.artist}
                  </p>

                  <p className="mt-5 text-[15px] font-light leading-7 text-[rgba(75,35,45,0.72)]">
                    {latestRelease.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <a
                      href={latestRelease.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                    >
                      Spotify
                    </a>

                    <a
                      href={latestRelease.appleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-[rgba(75,35,45,0.10)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                    >
                      Apple Music
                    </a>

                    <Link
                      href="/giris?next=/muzik"
                      className="inline-flex rounded-full border border-[rgba(75,35,45,0.10)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                    >
                      İndir
                    </Link>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[rgba(75,35,45,0.10)] bg-white/55 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.48)]">
                    Video Alanı
                  </p>

                  <div className="mt-3 flex aspect-video items-center justify-center rounded-[22px] bg-[rgba(75,35,45,0.05)] px-5 text-center">
                    {latestRelease.youtubeEmbedUrl ? (
                      <iframe
                        src={latestRelease.youtubeEmbedUrl}
                        title={`${latestRelease.title} videosu`}
                        className="h-full w-full rounded-[22px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <p className="text-sm font-light leading-6 text-[rgba(75,35,45,0.62)]">
                        YouTube videosu eklendiğinde burada oynatılacak.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 rounded-[22px] bg-white/70 p-3">
                    <audio controls preload="none" className="w-full">
                      Tarayıcınız ses oynatmayı desteklemiyor.
                    </audio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section
        id="sarkilar"
        className="mx-auto w-full max-w-[1180px] px-4 py-7 md:px-6"
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
              Şarkılar
            </p>

            <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.05em] text-[var(--burgundy)] md:text-5xl">
              Kayıtlar ve yorumlar
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-[rgba(75,35,45,0.68)]">
              Özgün parçalar, akustik yorumlar ve yakında eklenecek özel
              kayıtlar.
            </p>
          </div>

          <Link
            href="/muzik"
            className="inline-flex w-fit rounded-full border border-[rgba(75,35,45,0.10)] bg-white/78 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {songs.map((song) => (
            <article
              key={song.title}
              className="overflow-hidden rounded-[30px] border border-[rgba(75,35,45,0.10)] bg-[rgba(255,255,255,0.84)] shadow-[0_16px_45px_rgba(75,35,45,0.07)] backdrop-blur-xl"
            >
              <div className="relative h-40 bg-[rgba(189,235,232,0.35)]">
                <Image
                  src={song.coverImage}
                  alt={`${song.title} görseli`}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover object-[center_58%]"
                />
              </div>

              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.50)]">
                  {song.type}
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--burgundy)]">
                  {song.title}
                </h3>

                <p className="mt-3 text-sm font-light leading-6 text-[rgba(75,35,45,0.68)]">
                  {song.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={song.href}
                    className="inline-flex rounded-full bg-[var(--orange)] px-4 py-2.5 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                  >
                    Detay
                  </Link>

                  <Link
                    href="/giris?next=/muzik"
                    className="inline-flex rounded-full border border-[rgba(75,35,45,0.10)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                  >
                    İndir
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-4 py-7 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {quickSections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[30px] border border-[rgba(75,35,45,0.10)] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_16px_45px_rgba(75,35,45,0.07)] backdrop-blur-xl transition hover:-translate-y-1"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
                {item.title}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--burgundy)]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm font-light leading-6 text-[rgba(75,35,45,0.68)]">
                {item.description}
              </p>

              <span className="mt-5 inline-flex text-sm font-medium text-[var(--burgundy)]">
                Sayfaya Git →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="hakkinda"
        className="mx-auto w-full max-w-[1180px] px-4 py-7 md:px-6"
      >
        <div className="rounded-[32px] bg-[var(--burgundy)] p-5 shadow-[0_18px_50px_rgba(75,35,45,0.16)] md:p-6">
          <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Hakkında
              </p>

              <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.05em] text-white md:text-5xl">
                Söz, ses ve hikâye.
              </h2>
            </div>

            <div>
              <p className="text-sm font-light leading-7 text-white/78">
                Muhammed Tankılıç, Kürtçe şarkı söyleyen bağımsız bir sanatçı
                olarak müziğini sade melodiler, akustik düzenlemeler ve kişisel
                hikâyeler üzerine kurar.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/hakkinda"
                  className="inline-flex rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
                >
                  Daha Fazla
                </Link>

                <Link
                  href="/iletisim"
                  className="inline-flex rounded-full border border-white/18 bg-white/12 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="iletisim"
        className="mx-auto w-full max-w-[1180px] px-4 py-7 pb-10 md:px-6"
      >
        <div className="rounded-[32px] border border-[rgba(75,35,45,0.10)] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_16px_45px_rgba(75,35,45,0.07)] backdrop-blur-xl md:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(75,35,45,0.84)]">
                İletişim
              </p>

              <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.05em] text-[var(--burgundy)] md:text-5xl">
                Müzik ve iş birlikleri
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-[rgba(75,35,45,0.68)]">
                Konser, kayıt, video, dijital yayın ve iş birliği talepleri
                için iletişim kanalları.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <a
                href="mailto:iletisim@muhammedtankilic.com"
                className="inline-flex rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
              >
                E-posta
              </a>

              <Link
                href="/iletisim"
                className="inline-flex rounded-full border border-[rgba(75,35,45,0.10)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--burgundy)] transition hover:-translate-y-0.5"
              >
                İletişim Sayfası
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[rgba(75,35,45,0.10)] pt-4 text-xs font-light text-[rgba(75,35,45,0.58)] md:flex-row">
            <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
            <p>Kürtçe müzik · Akustik yorumlar · Kişisel arşiv</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(75,35,45,0.08)] bg-white/55 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgba(75,35,45,0.50)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-[var(--burgundy)]">
        {value}
      </p>
    </div>
  );
}