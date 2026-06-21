import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Coverlarım | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın YouTube ve Instagram üzerinden paylaştığı cover yorumları ve kısa performansları.",
};

export default function CoverlarimPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/54 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(245,174,80,0.13),transparent_30%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  YouTube
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Instagram
                </span>

                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Cover Yorumlar
                </span>
              </div>

              <p className="section-eyebrow">Coverlarım</p>

              <h1 className="max-w-3xl text-[clamp(44px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                Cover yorumlar ve kısa performanslar.
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                Bu bölümde YouTube ve Instagram’da paylaşılan cover videoları,
                kısa performanslar ve sosyal medya içerikleri ayrı bir arşiv
                olarak listelenecek.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/@Muhammedtanklc"
                  target="_blank"
                  rel="noreferrer"
                  className="pill-button"
                >
                  YouTube Kanalı
                </a>

                <Link href="/sarkilarim" className="pill-button secondary">
                  Şarkılarım
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/30 bg-[#4B232D]/88 p-7 text-white shadow-[0_20px_58px_rgba(75,35,45,0.16)] backdrop-blur-[12px]">
              <p className="section-eyebrow light">Yakında</p>

              <h2 className="text-[clamp(30px,3.5vw,46px)] font-semibold leading-none tracking-[-0.075em] text-white">
                Cover arşivi burada kurulacak.
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/70">
                Şarkılarım sistemi tamamlandıktan sonra Coverlarım sayfası
                YouTube ve Instagram içeriklerine göre ayrıca tasarlanacak.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Coverlarım · YouTube · Instagram</span>
      </footer>
    </main>
  );
}