import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  featuredVideo,
  publishedVideos,
  youtubeChannelUrl,
} from "@/lib/data/videos";

export const metadata: Metadata = {
  title: "Videolar | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın YouTube cover videoları, performansları ve video arşivi.",
};

export default function VideosPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/54 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(245,174,80,0.13),transparent_30%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  YouTube
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Cover Yorumlar
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Video Arşivi
                </span>
              </div>

              <p className="section-eyebrow">Videolar</p>

              <h1 className="max-w-3xl text-[clamp(44px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                Cover yorumlar ve video kayıtları.
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                Bu sayfada Muhammed Tankılıç’ın YouTube kanalında paylaştığı
                cover yorumlar, performanslar ve video içerikleri yer alır.
                Zef Cara müzik platformlarında yayınlanan ayrı bir single
                çalışmasıdır; Pela Dur ise YouTube kanalında paylaşılan bağımsız
                bir cover yorumudur.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-button"
                >
                  YouTube Kanalı
                </a>

                <Link href="/muzik" className="pill-button secondary">
                  Şarkılar
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/30 bg-[#4B232D]/18 p-3 shadow-[0_20px_58px_rgba(75,35,45,0.12)] backdrop-blur-[12px]">
              <div className="overflow-hidden rounded-[24px] border border-white/20 bg-[#4B232D]/86">
                <iframe
                  src={featuredVideo.youtubeEmbedUrl}
                  title={`${featuredVideo.title} YouTube videosu`}
                  className="block aspect-video w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="mt-4 rounded-[24px] border border-white/24 bg-white/54 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.10)] backdrop-blur-[14px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/56">
                  Öne Çıkan Cover
                </p>

                <h2 className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                  {featuredVideo.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#4B232D]/68">
                  {featuredVideo.description}
                </p>

                <div className="mt-5">
                  <a
                    href={featuredVideo.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
                  >
                    YouTube’da Aç
                  </a>
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
              <p className="section-eyebrow">Video Arşivi</p>
              <h2 className="section-title">YouTube içerikleri</h2>
              <p className="section-description">
                Cover yorumlar, performans kayıtları ve ileride eklenecek video
                içerikleri.
              </p>
            </div>

            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="pill-button secondary"
            >
              Kanalı Aç
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {publishedVideos.map((video) => (
              <article
                key={video.slug}
                className="overflow-hidden rounded-[30px] border border-[#4B232D]/10 bg-white/58 p-3 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px]"
              >
                <div className="overflow-hidden rounded-[24px] border border-white/24 bg-[#4B232D]/88">
                  <iframe
                    src={video.youtubeEmbedUrl}
                    title={`${video.title} YouTube videosu`}
                    className="block aspect-video w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#FFF4BC] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4B232D]">
                    {video.type}
                  </span>

                  <h3 className="mt-4 text-[30px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                    {video.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#4B232D]/68">
                    {video.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#4B232D]/12 bg-white/68 px-4 py-2 text-[12px] font-bold text-[#4B232D] transition hover:-translate-y-0.5 hover:bg-white/86"
                    >
                      YouTube’da Aç
                    </a>

                    <a
                      href={youtubeChannelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#4B232D]/12 bg-[#4B232D] px-4 py-2 text-[12px] font-bold text-white transition hover:-translate-y-0.5"
                    >
                      Kanal
                    </a>
                  </div>
                </div>
              </article>
            ))}

            <article className="flex min-h-[360px] flex-col justify-between rounded-[30px] border border-[#4B232D]/10 bg-[#FFF4BC]/72 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px]">
              <div>
                <p className="section-eyebrow">Yakında</p>

                <h3 className="text-[34px] font-semibold leading-none tracking-[-0.07em] text-[#4B232D]">
                  Yeni performanslar
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#4B232D]/70">
                  YouTube kanalına yeni cover, akustik performans veya video
                  kayıtları eklendikçe bu arşiv genişletilecek.
                </p>
              </div>

              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="pill-button dark mt-7 w-fit"
              >
                YouTube Kanalı
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-[#4B232D]/88 p-7 text-white shadow-[0_18px_50px_rgba(75,35,45,0.14)] backdrop-blur-[14px] md:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="section-eyebrow light">Müzik Ayrımı</p>

              <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-white">
                Şarkılar ayrı, cover videolar ayrı.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
                Zef Cara gibi yayınlanan single çalışmalar müzik sayfasında;
                Pela Dur gibi YouTube cover yorumları ise video arşivinde
                listelenir.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/muzik" className="pill-button">
                Müzik Sayfası
              </Link>

              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="pill-button outline-light"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Videolar · Cover yorumlar · YouTube arşivi</span>
      </footer>
    </main>
  );
}