import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const values = [
  {
    title: "Kürtçe sözler",
    description: "Anlamı güçlü, sade ve kişisel Kürtçe sözler.",
  },
  {
    title: "Akustik sadelik",
    description: "Gitar ve yalın düzenlemelerle sözün öne çıktığı müzik dili.",
  },
  {
    title: "Kişisel hikâyeler",
    description: "Duygu, hafıza ve kişisel anlatının müzikle birleşmesi.",
  },
];

export default function HakkindaPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="soft-card px-5 py-5 md:px-6">
            <p className="section-eyebrow mb-2">Hakkında</p>

            <h1 className="font-serif text-4xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-5xl">
              Söz, ses ve hikâye.
            </h1>

            <p className="mt-4 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
              Muhammed Tankılıç, Kürtçe şarkı söyleyen bağımsız bir sanatçı
              olarak müziğini sade melodiler, akustik düzenlemeler ve kişisel
              hikâyeler üzerine kurar.
            </p>

            <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
              Yazdığı sözlerde hem anlamı hem de kulağa doğal gelen modern bir
              müzik dilini önemser.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/muzik" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                Şarkıları Dinle
              </Link>

              <Link href="/videolar" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                Videolar
              </Link>
            </div>
          </div>

          <div className="soft-card overflow-hidden">
            <div className="relative h-64 md:h-80 lg:h-full">
              <Image
                src="/muhammed-hero2.png"
                alt="Muhammed Tankılıç"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover object-top"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[rgba(75,35,45,0.38)] via-transparent to-white/5" />

              <div className="absolute bottom-4 left-4 right-4 rounded-[25px] border border-white/35 bg-white/38 p-4 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-(--burgundy) opacity-70">
                  Sanatçı Kimliği
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                  Bağımsız ve kişisel.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-6">
        <div className="mb-4">
          <p className="section-eyebrow mb-2">Müzik Dili</p>

          <h2 className="font-serif text-3xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-4xl">
            Bağımsız ve kişisel
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(75,35,45,0.68)]">
            Şarkılar, videolar, fotoğraflar ve üyelikli özel içerikler üzerinden
            sade bir müzik arşivi.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="soft-card p-5">
              <h3 className="font-serif text-2xl font-bold tracking-tighter text-(--burgundy)">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container py-6 pb-2">
        <div className="dark-card p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
                Arşiv
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold leading-none tracking-tighter text-white md:text-4xl">
                Müzikler, sözler ve kayıtlar tek yerde.
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 text-white/76">
                Üyelik sistemi; şarkı sözleri, özel kayıtlar ve indirme
                bağlantıları için kullanılacak.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/kayit" className="pill-button !min-h-9 !px-4 !py-2 !text-xs">
                  Üye Ol
                </Link>

                <Link href="/giris" className="pill-button secondary !min-h-9 !px-4 !py-2 !text-xs">
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}