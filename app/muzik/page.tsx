import Image from "next/image";
import Link from "next/link";

const platforms = [
  {
    name: "Spotify",
    href: "https://open.spotify.com/intl-tr/track/7B5SGhv7YD7opodmyJQQqm?si=958d9492fbd4447b",
    className:
      "border-[#7ebc95]/50 bg-[#dff0e5] text-[#1f5a36] hover:bg-[#d3eadb]",
  },
  {
    name: "Apple Music",
    href: "https://music.apple.com/us/album/zef-cara-single/1779404301",
    className:
      "border-[#9cb7cc]/50 bg-[#e4eef5] text-[#34596d] hover:bg-[#d9e8f1]",
  },
];

const filters = ["Tümü", "Single", "EP", "Albüm", "Canlı Kayıt"];

export default function MuzikPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#17302a]">
      {/* ÜST MENÜ */}
      <header className="sticky top-0 z-40 border-b border-[#17302a]/8 bg-[#f6f3ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-[#17302a]"
          >
            Muhammed Tankılıç
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#17302a]/12 bg-white/70 px-5 py-2.5 text-sm text-[#34596d] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      {/* BAŞLIK */}
      <section className="px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-7xl rounded-4xl border border-white/80 bg-white/72 p-7 shadow-xl backdrop-blur md:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39785d]">
            Müzik Arşivi
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h1 className="max-w-4xl font-serif text-5xl leading-tight text-[#17302a] md:text-7xl">
              Kürtçe, akustik ve halk müziğinden çalışmalar
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-[#5e706a]">
              Özgün eserler, cover çalışmalar, canlı performanslar ve müzik
              yolculuğuna ait özel içerikler.
            </p>
          </div>

          {/* FİLTRELER */}
          <div className="mt-10 flex flex-wrap gap-3">
            {filters.map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  index === 0
                    ? "rounded-full bg-[#f0ca63] px-5 py-2.5 text-sm font-semibold text-[#2d2410] shadow-sm"
                    : "rounded-full border border-[#17302a]/10 bg-[#f8faf8] px-5 py-2.5 text-sm text-[#586963] transition hover:-translate-y-0.5 hover:bg-white"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ZEF CARA */}
      <section className="px-5 pb-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <article className="overflow-hidden rounded-4xl border border-white/85 bg-[#edf3ef]/90 shadow-2xl backdrop-blur">
            <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
              {/* KAPAK */}
              <div className="relative min-h-105 bg-[#dce7e1] lg:min-h-170">
                <Image
                  src="/muzik/zef-cara-cover.jpg"
                  alt="Zef Cara şarkı kapağı"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/22 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 rounded-full border border-white/55 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#17302a] shadow-sm backdrop-blur">
                  Single
                </div>
              </div>

              {/* DETAY */}
              <div className="flex flex-col justify-between bg-[#eef5f1]/95 p-7 md:p-10 lg:p-14">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#39785d]">
                    Öne Çıkan Eser
                  </p>

                  <h2 className="mt-5 font-serif text-5xl text-[#17302a] md:text-7xl">
                    Zef Cara
                  </h2>

                  <p className="mt-3 text-lg text-[#6b7a75]">
                    Muhammed Tankılıç
                  </p>

                  <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5d6d68]">
                    Muhammed Tankılıç’ın yayımlanmış özgün çalışmalarından biri.
                    Eserin hikâyesi, sözleri, künyesi ve prodüksiyon bilgileri
                    daha sonra bu alana eklenecek.
                  </p>

                  {/* PLATFORM BUTONLARI */}
                  <div className="mt-10 flex flex-wrap gap-3">
                    {platforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full border px-6 py-3.5 font-semibold shadow-sm transition hover:-translate-y-1 ${platform.className}`}
                      >
                        {platform.name}
                      </a>
                    ))}

                    <button
                      type="button"
                      disabled
                      title="Zef Cara henüz YouTube’a yüklenmedi."
                      className="cursor-not-allowed rounded-full border border-[#d99588]/35 bg-[#f5dfda]/55 px-6 py-3.5 font-semibold text-[#8d3f35]/55"
                    >
                      YouTube · Yakında
                    </button>
                  </div>
                </div>

                {/* BİLGİLER */}
                <div className="mt-14 grid gap-4 border-t border-[#17302a]/10 pt-8 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/70 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7b8b85]">
                      Tür
                    </p>

                    <p className="mt-2 font-medium text-[#17302a]">
                      Kürtçe · Akustik
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#e6eef3] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#758b9a]">
                      Yayın Türü
                    </p>

                    <p className="mt-2 font-medium text-[#274c5d]">
                      Single
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#f7e8bb] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8f762d]">
                      Durum
                    </p>

                    <p className="mt-2 font-medium text-[#5e4d16]">
                      Yayında
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* GELECEK İÇERİK */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-4xl border border-white/80 bg-[#f8fbf9]/92 p-7 shadow-lg">
              <p className="text-sm text-[#39785d]">Şarkı Sözleri</p>

              <h3 className="mt-3 font-serif text-3xl text-[#17302a]">
                Yakında eklenecek
              </h3>

              <p className="mt-4 leading-7 text-[#62716c]">
                Kürtçe sözler ve Türkçe çeviri ayrı alanlarda gösterilecek.
              </p>
            </article>

            <article className="rounded-4xl border border-white/80 bg-[#edf3f7]/92 p-7 shadow-lg">
              <p className="text-sm text-[#4f6f83]">Eser Künyesi</p>

              <h3 className="mt-3 font-serif text-3xl text-[#24495a]">
                Yapım bilgileri
              </h3>

              <p className="mt-4 leading-7 text-[#62737d]">
                Söz, beste, düzenleme, kayıt ve mix-mastering bilgileri
                eklenecek.
              </p>
            </article>

            <article className="rounded-4xl border border-white/80 bg-[#fbf1cf]/92 p-7 shadow-lg">
              <p className="text-sm text-[#8e7427]">İndirme</p>

              <h3 className="mt-3 font-serif text-3xl text-[#5d4b17]">
                Hesapla erişim
              </h3>

              <p className="mt-4 leading-7 text-[#74653b]">
                MP3, WAV veya video indirme seçenekleri eser sahibinin
                onayından sonra açılacak.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
