import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
        <div className="soft-card w-full max-w-3xl p-7 text-center md:p-10">
          <p className="section-eyebrow">Sayfa Bulunamadı</p>

          <h1 className="font-serif text-6xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-8xl">
            404
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[rgba(75,35,45,0.7)] md:text-base md:leading-8">
            Aradığın sayfa taşınmış, silinmiş veya henüz yayına alınmamış
            olabilir. Ana sayfaya dönerek Muhammed Tankılıç’ın müzikleri,
            sözleri ve hikâyelerine ulaşabilirsin.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link href="/" className="pill-button">
              Ana Sayfaya Dön
            </Link>

            <Link href="/#sarkilar" className="pill-button secondary">
              Şarkılara Git
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}