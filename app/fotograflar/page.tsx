import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const galleryItems = [
  {
    title: "Portreler",
    description: "Sanatçı kimliği için sade portre arşivi.",
    image: "/muhammed-hero2-site.jpg",
  },
  {
    title: "Kapak görselleri",
    description: "Şarkı kapakları ve yayın görselleri.",
    image: "/muzik/zef-cara-cover.jpg",
  },
  {
    title: "Sahne arkası",
    description: "Kayıt, prova ve üretim sürecinden kareler.",
    image: "/muhammed-hero2-site.jpg",
  },
  {
    title: "Müzik arşivi",
    description: "Şarkılar ve özel içeriklerle bağlantılı görseller.",
    image: "/muzik/zef-cara-cover.jpg",
  },
];

export default function FotograflarPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="soft-card px-5 py-5 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="section-eyebrow mb-2">Fotoğraflar</p>

              <h1 className="font-serif text-4xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-5xl">
                Görsel arşiv
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
                Kapak tasarımları, portreler, sahne arkası görüntüler ve müzik
                arşivine ait görseller.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link href="/sarkilarim" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                Şarkılara Git
              </Link>

              <Link href="/iletisim" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                Görsel Talebi
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-6">
        <div className="grid gap-4 md:grid-cols-2">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              className={
                index === 0
                  ? "soft-card overflow-hidden md:col-span-2"
                  : "soft-card overflow-hidden"
              }
            >
              <div
                className={
                  index === 0
                    ? "relative h-56 bg-(--mint-soft) md:h-72"
                    : "relative h-44 bg-(--mint-soft)"
                }
              >
                <Image
                  src={item.image}
                  alt={`${item.title} görseli`}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 900px) 100vw, 1120px"
                      : "(max-width: 900px) 100vw, 50vw"
                  }
                  className="object-cover object-top"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                    Fotoğraf Arşivi
                  </p>

                  <h2 className="mt-1 font-serif text-3xl font-bold tracking-tighter text-white md:text-4xl">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container py-6 pb-2">
        <div className="cream-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="section-eyebrow mb-2">Not</p>

            <h2 className="font-serif text-2xl font-bold tracking-tighter text-(--burgundy) md:text-3xl">
              Yeni fotoğraflarla galeri genişletilecek.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
              Yeni portre, kapak ve sahne arkası fotoğrafları geldikçe bu alan
              güçlendirilir.
            </p>
          </div>

          <Link href="/iletisim" className="pill-button dark !min-h-9 !px-4 !py-2 !text-xs w-fit">
            İletişime Geç
          </Link>
        </div>
      </section>
    </main>
  );
}