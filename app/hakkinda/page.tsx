import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Hakkında | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç’ın müzik yolculuğu, Kürtçe akustik şarkıları, sözleri ve sanatçı kimliği.",
};

const highlights = [
  {
    label: "Dil",
    value: "Kürtçe",
    description: "Şarkıların ana dili ve duygu zemini.",
  },
  {
    label: "Tarz",
    value: "Akustik Folk",
    description: "Sade gitar, yalın yorum ve modern kayıt hissi.",
  },
  {
    label: "Odak",
    value: "Söz ve Hikâye",
    description: "Anlamlı sözler, kişisel anlatım ve doğal atmosfer.",
  },
];

const values = [
  "Kürtçe müziği sade, modern ve duygu odaklı bir çizgide sunmak.",
  "Şarkı sözlerinde kişisel hikâyeleri ve güçlü duyguları öne çıkarmak.",
  "Akustik gitar merkezli, ferah ve samimi bir müzik dili kurmak.",
];

export default function AboutPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-3 md:pt-4">
        <div className="relative overflow-hidden rounded-[34px] border border-white/35 bg-white/54 p-5 shadow-[0_22px_70px_rgba(75,35,45,0.11)] backdrop-blur-[14px] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(189,235,232,0.22),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(245,174,80,0.13),transparent_30%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#BDEBE8]/76 px-4 py-2 text-[11px] font-semibold text-[#4B232D]">
                  Bağımsız Sanatçı
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Kürtçe Müzik
                </span>
                <span className="rounded-full bg-white/62 px-4 py-2 text-[11px] font-semibold text-[#4B232D]/72">
                  Akustik Folk
                </span>
              </div>

              <p className="section-eyebrow">Hakkında</p>

              <h1 className="max-w-3xl text-[clamp(44px,6vw,74px)] font-semibold leading-[0.94] tracking-[-0.08em] text-[#4B232D]">
                Kürtçe akustik müziğin sade ve kişisel sesi.
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[#4B232D]/76 md:text-[15px]">
                Muhammed Tankılıç, Kürtçe şarkı söyleyen bağımsız bir sanatçı
                olarak müziğini sade melodiler, akustik düzenlemeler ve kişisel
                hikâyeler üzerine kurar. Şarkılarında hem anlamlı sözleri hem de
                kulağa hoş gelen modern bir akustik atmosferi öne çıkarır.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/sarkilarim" className="pill-button">
                  Şarkıları Dinle
                </Link>

                <Link href="/iletisim" className="pill-button secondary">
                  İletişim
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/28 bg-white/32 p-4 shadow-[0_20px_58px_rgba(75,35,45,0.13)] backdrop-blur-[12px]">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[26px] border border-white/24 bg-[#BDEBE8]/34">
                <Image
                  src="/muhammed-hero2-site.jpg"
                  alt="Muhammed Tankılıç gitar ile"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 440px"
                  className="object-contain object-center"
                />
              </div>

              <div className="mt-4 rounded-[24px] border border-white/24 bg-white/54 p-5 shadow-[0_18px_50px_rgba(75,35,45,0.10)] backdrop-blur-[14px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/56">
                  Sanatçı Kimliği
                </p>

                <h2 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                  Muhammed Tankılıç
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#4B232D]/68">
                  Kürtçe akustik müzik · Sözler · Hikâyeler
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.label}
              className="rounded-[30px] border border-[#4B232D]/10 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px]"
            >
              <p className="section-eyebrow">{item.label}</p>

              <h2 className="text-[32px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D]">
                {item.value}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#4B232D]/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[34px] border border-white/35 bg-white/56 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">Müzik Dili</p>

            <h2 className="section-title">Doğal, sade ve kişisel.</h2>

            <p className="mt-5 text-sm leading-8 text-[#4B232D]/70">
              Muhammed Tankılıç’ın müzik yaklaşımı; sade akustik gitar, güçlü
              söz anlatımı ve doğal bir yorum etrafında şekillenir. Şarkılar,
              fazla süslenmiş bir prodüksiyondan çok, hissin ve hikâyenin öne
              çıktığı bir atmosfer kurmayı hedefler.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#4B232D]/70">
              Bu yüzden müziğinde pastoral bir sakinlik, modern bir kayıt dili
              ve Kürtçe sözlerin taşıdığı derin duygu birlikte hissedilir.
            </p>
          </article>

          <article className="rounded-[34px] border border-[#4B232D]/10 bg-[#FFF4BC]/72 p-7 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-[14px] md:p-9">
            <p className="section-eyebrow">Yaklaşım</p>

            <h2 className="section-title">Neyi öne çıkarır?</h2>

            <div className="mt-6 grid gap-3">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-2xl border border-[#4B232D]/10 bg-white/48 px-5 py-4 text-sm leading-7 text-[#4B232D]/74"
                >
                  {value}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[34px] border border-white/35 bg-[#4B232D]/88 p-7 text-white shadow-[0_18px_50px_rgba(75,35,45,0.14)] backdrop-blur-[14px] md:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="section-eyebrow light">Müzik Arşivi</p>

              <h2 className="text-[clamp(32px,4vw,52px)] font-semibold leading-none tracking-[-0.075em] text-white">
                Şarkıları ve hikâyeleri keşfet.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
                Yayınlanan şarkılar, platform bağlantıları, hikâye notları ve
                ileride eklenecek özel içerikler müzik sayfasında yer alır.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/sarkilarim" className="pill-button">
                Müzik Sayfası
              </Link>

              <Link href="/coverlarim" className="pill-button outline-light">
                Videolar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Hakkında · Kürtçe müzik · Akustik hikâyeler</span>
      </footer>
    </main>
  );
}