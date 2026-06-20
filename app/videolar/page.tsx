import Link from "next/link";
import Navbar from "@/components/Navbar";

const videos = [
  {
    title: "Akustik performanslar",
    type: "Performans",
    description: "Canlı veya sade kayıt formatındaki akustik performanslar.",
  },
  {
    title: "Kısa müzik kesitleri",
    type: "Sosyal medya",
    description: "Instagram, YouTube Shorts ve kısa video içerikleri.",
  },
  {
    title: "Sahne arkası",
    type: "Arşiv",
    description: "Kayıt süreci, prova anları ve üretim görüntüleri.",
  },
];

export default function VideolarPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="soft-card px-5 py-5 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="section-eyebrow mb-2">Videolar</p>

              <h1 className="font-serif text-4xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-5xl">
                Video arşivi
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
                Video kayıtları, kısa müzik kesitleri, performanslar ve sahne
                arkası görüntüleri.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link href="/muzik" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                Şarkılara Git
              </Link>

              <Link href="/iletisim" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-6">
        <article className="soft-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.58fr_0.42fr]">
            <div className="bg-[rgba(75,35,45,0.05)]">
              <div className="flex aspect-video items-center justify-center px-5 text-center">
                <div>
                  <p className="section-eyebrow mb-2">Video Alanı</p>

                  <h2 className="font-serif text-3xl font-bold tracking-tighter text-(--burgundy) md:text-4xl">
                    YouTube videosu yakında eklenecek
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[rgba(75,35,45,0.62)]">
                    Yayındaki video bağlantısı hazır olduğunda bu alanda
                    oynatılabilecek.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <p className="section-eyebrow mb-2">Öne Çıkan</p>

              <h2 className="font-serif text-3xl font-bold tracking-tighter text-(--burgundy) md:text-4xl">
                Son çıkan video
              </h2>

              <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.7)]">
                YouTube bağlantısı eklendiğinde en güncel video burada
                oynatılacak.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/muzik" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                  Şarkılar
                </Link>

                <Link href="/" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                  Ana Sayfa
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container py-6 pb-2">
        <div className="mb-4">
          <p className="section-eyebrow mb-2">Arşiv</p>

          <h2 className="font-serif text-3xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-4xl">
            Video kategorileri
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
            Klipler, canlı kayıtlar, kısa performanslar ve sahne arkası
            görüntüleri.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {videos.map((video) => (
            <article key={video.title} className="soft-card p-5">
              <span className="rounded-full bg-(--orange) px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-(--burgundy)">
                {video.type}
              </span>

              <h3 className="mt-4 font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                {video.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                {video.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}