"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import AuthButtons from "@/components/AuthButtons";

const identityCards = [
  {
    number: "01",
    label: "Hekimlik",
    title: "Bilimsel güven, sade anlatım",
    description:
      "Gaziantep Üniversitesi Tıp Fakültesi mezunu ve Mardin’de acil serviste görev yapan pratisyen hekim.",
    href: "#hekimlik",
    className: "bg-[#dfeaf0]/94 text-[#12344a]",
  },
  {
    number: "02",
    label: "Müzik",
    title: "Kürtçe, akustik ve halk müziği",
    description:
      "Klasik gitar, bağlama ve dijital prodüksiyonla şekillenen özgün eserler, cover çalışmalar ve canlı performanslar.",
    href: "/muzik",
    className: "bg-[#104e3b]/94 text-white",
  },
  {
    number: "03",
    label: "İçerik",
    title: "Kültür, seyahat ve insan hikâyeleri",
    description:
      "Tıp, müzik, yolculuk ve kişisel deneyimler üzerine yazılı ve görsel içerikler.",
    href: "#yazilar",
    className: "bg-[#e7c35c]/94 text-[#2d220c]",
  },
];

const archiveItems = [
  {
    number: "01",
    title: "Fotoğraflar",
    description: "Portreler, seyahatler ve sahne arkasından seçilmiş kareler.",
  },
  {
    number: "02",
    title: "Videolar",
    description: "Akustik performanslar, klipler ve özel video içerikleri.",
  },
  {
    number: "03",
    title: "Röportajlar",
    description: "Basın, podcast ve farklı platformlarda yayımlanan söyleşiler.",
  },
  {
    number: "04",
    title: "Etkinlikler",
    description: "Canlı müzik etkinlikleri, sahne kayıtları ve buluşmalar.",
  },
];

export default function Home() {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;

    let targetPosition = 0;
    let currentPosition = 0;
    let velocity = 0;
    let initialized = false;

    const stiffness = 0.042;
    const damping = 0.835;

    function updateTarget() {
      const maximumPageScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );

      const pageProgress = Math.min(
        Math.max(window.scrollY / maximumPageScroll, 0),
        1,
      );

      const background = backgroundRef.current;

      if (background) {
        const maximumImageTravel = Math.max(
          background.offsetHeight - window.innerHeight,
          0,
        );

        targetPosition = pageProgress * maximumImageTravel;

        if (!initialized) {
          currentPosition = targetPosition;
          initialized = true;
        }
      }

      const heroContent = heroContentRef.current;

      if (heroContent) {
        const heroProgress = Math.min(
          Math.max(window.scrollY / (window.innerHeight * 0.85), 0),
          1,
        );

        heroContent.style.opacity = String(1 - heroProgress);
        heroContent.style.transform = `translate3d(
          0,
          ${-heroProgress * 90}px,
          0
        )`;
      }
    }

    function animateBackground() {
      const distance = targetPosition - currentPosition;

      velocity += distance * stiffness;
      velocity *= damping;
      currentPosition += velocity;

      const background = backgroundRef.current;

      if (background) {
        background.style.transform = `translate3d(
          -50%,
          ${-currentPosition}px,
          0
        )`;
      }

      animationFrame = requestAnimationFrame(animateBackground);
    }

    const resizeObserver = new ResizeObserver(updateTarget);

    if (backgroundRef.current) {
      resizeObserver.observe(backgroundRef.current);
    }

    updateTarget();
    animationFrame = requestAnimationFrame(animateBackground);

    window.addEventListener("scroll", updateTarget, {
      passive: true,
    });
    window.addEventListener("resize", updateTarget);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-[#10211d]">
      {/* YAY FİZİĞİYLE GECİKMELİ HAREKET EDEN TEK ARKA PLAN */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b1c18]">
        <div
          ref={backgroundRef}
          className="absolute left-1/2 top-0 w-screen will-change-transform"
          style={{
            transform: "translate3d(-50%, 0, 0)",
          }}
        >
          <Image
            src="/muhammed-hero2.png"
            alt=""
            width={1920}
            height={4320}
            priority
            sizes="100vw"
            aria-hidden="true"
            className="h-auto w-full max-w-none"
          />
        </div>

        <div className="absolute inset-0 bg-[#0b1c18]/34" />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35" />
      </div>

      {/* SAYFA İÇERİĞİ */}
      <div className="relative z-10">
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-white/20 bg-[#f6f3ea]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-10">
            <a
              href="#anasayfa"
              className="shrink-0 font-serif text-lg font-semibold tracking-tight text-[#10211d] md:text-xl"
            >
              Muhammed Tankılıç
            </a>

            <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
              <a href="#portre" className="transition hover:text-[#39785d]">
                Portre
              </a>
              <a href="#hekimlik" className="transition hover:text-[#39785d]">
                Hekimlik
              </a>
              <a href="/muzik" className="transition hover:text-[#39785d]">
                Müzik
              </a>
              <a href="#yazilar" className="transition hover:text-[#39785d]">
                Yazılar
              </a>
              <a href="#arsiv" className="transition hover:text-[#39785d]">
                Arşiv
              </a>
              <a href="#iletisim" className="transition hover:text-[#39785d]">
                İletişim
              </a>
            </nav>

            <AuthButtons />
          </div>
        </header>

        {/* HERO */}
        <section
          id="anasayfa"
          className="relative flex min-h-[calc(100svh-80px)] items-start justify-center px-5 pt-16 text-white md:pt-20"
        >
          <div
            ref={heroContentRef}
            className="relative mx-auto w-full max-w-7xl text-center will-change-transform"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-white/75 sm:text-xs">
              İki Disiplin · Tek İmza
            </p>

            <h1 className="mt-6 font-sans text-[clamp(3.4rem,10vw,9rem)] font-black leading-[0.78] tracking-[-0.08em] drop-shadow-2xl">
              <span className="block">MUHAMMED</span>
              <span className="block text-[#f4c85d]">TANKILIÇ</span>
            </h1>

            <div className="mx-auto mt-44 max-w-2xl md:mt-56">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/85 md:text-sm">
                Doktor · Müzisyen · İçerik Üreticisi
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/90 md:text-lg md:leading-8">
                Bilim, müzik, kültür ve insan hikâyelerinin aynı kişisel
                yolculukta birleştiği bir arşiv.
              </p>

              <a
                href="#kimlik"
                className="mt-6 inline-flex rounded-full border border-white/35 bg-black/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:bg-black/40"
              >
                Hikâyeyi Keşfet ↓
              </a>
            </div>
          </div>
        </section>

        {/* ÜÇ KİMLİK */}
        <section id="kimlik" className="relative px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-4xl border border-white/25 bg-[#f6f3ea]/90 p-7 shadow-2xl backdrop-blur-xl md:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#39785d]">
                  Üç Alan · Tek Kimlik
                </p>

                <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
                  Birbirinden ayrılmayan üç farklı yolculuk
                </h2>
              </div>

              <p className="text-lg leading-8 text-[#40524d]">
                Hekimlik, müzik ve içerik üretimi; aynı kişinin farklı alanlarda
                geliştirdiği tek bir anlatının parçaları.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {identityCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  className={`${card.className} group flex min-h-105 flex-col justify-between rounded-4xl p-8 shadow-lg transition duration-300 hover:-translate-y-2`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-65">
                      {card.label}
                    </p>

                    <p className="font-serif text-3xl opacity-35">
                      {card.number}
                    </p>
                  </div>

                  <div>
                    <h3 className="max-w-sm font-serif text-4xl leading-tight">
                      {card.title}
                    </h3>

                    <p className="mt-5 max-w-sm leading-7 opacity-75">
                      {card.description}
                    </p>

                    <p className="mt-8 text-sm font-semibold">
                      Bölümü incele
                      <span className="ml-2 inline-block transition group-hover:translate-x-2">
                        →
                      </span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* MÜZİK */}
        <section id="muzik" className="relative px-5 pb-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-4xl border border-white/20 bg-[#102d25]/92 p-7 text-white shadow-2xl backdrop-blur-xl md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#90c4a2]">
                Müzik
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
                Kürtçe, akustik ve halk müziğinden çalışmalar
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
                Klasik gitar, bağlama ve dijital prodüksiyonla şekillenen özgün
                eserler, cover çalışmalar ve canlı performanslar.
              </p>
            </div>

            <article className="rounded-4xl border border-white/10 bg-white/10 p-7 backdrop-blur md:p-10">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Son yayın
                  </p>

                  <h3 className="mt-3 font-serif text-4xl">
                    Yeni eser yakında
                  </h3>
                </div>

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl">
                  ▶
                </div>
              </div>

              <div className="my-8 h-px bg-white/10" />

              <p className="max-w-2xl leading-8 text-white/65">
                Şarkı dosyaları, kapak görselleri, eser künyeleri, sözler ve
                hikâyeler bu bölümde yayımlanacak.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
  href="/muzik"
  className="rounded-full bg-[#f4c85d] px-6 py-3.5 font-semibold text-[#10231d]"
>
  Müzik Arşivini Aç
</a>

                <a
                  href="#arsiv"
                  className="rounded-full border border-white/20 px-6 py-3.5 font-semibold"
                >
                  Video Arşivi
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* HEKİMLİK */}
        <section id="hekimlik" className="relative px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-4xl border border-white/25 bg-[#e7eff1]/92 p-7 shadow-2xl backdrop-blur-xl md:p-10 lg:p-12">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#34596d]">
                  Hekimlik
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
                  Bilimsel güveni sade bir dille buluşturmak
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-4xl bg-white/90 p-8 shadow-lg">
                  <p className="text-sm text-[#34596d]">Eğitim</p>

                  <h3 className="mt-4 font-serif text-3xl">
                    Gaziantep Üniversitesi
                  </h3>

                  <p className="mt-4 leading-7 text-[#52615d]">
                    Tıp Fakültesi mezunu. Mezuniyet: Şubat 2025.
                  </p>
                </article>

                <article className="rounded-4xl bg-[#173d56]/95 p-8 text-white shadow-lg">
                  <p className="text-sm text-white/55">Görev</p>

                  <h3 className="mt-4 font-serif text-3xl">
                    Acil Servis Hekimliği
                  </h3>

                  <p className="mt-4 leading-7 text-white/70">
                    Mardin’de acil serviste görev yapan pratisyen hekim.
                  </p>
                </article>

                <article className="rounded-4xl bg-[#d7e6dc]/95 p-8 shadow-lg md:col-span-2">
                  <p className="text-sm text-[#39785d]">
                    Sağlık İletişimi
                  </p>

                  <h3 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">
                    Doğru bilgiyi, insanlara ulaşabilecek anlaşılır bir anlatımla
                    paylaşmak
                  </h3>

                  <p className="mt-5 max-w-2xl leading-8 text-[#52615d]">
                    Tıbbi yazılar, mesleki deneyimler ve sağlık iletişimi
                    içerikleri yakında bu bölümde yer alacak.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* YAZILAR */}
        <section id="yazilar" className="relative px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-4xl border border-white/25 bg-[#f6f3ea]/90 p-7 shadow-2xl backdrop-blur-xl md:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a44e3f]">
              Yazılar
            </p>

            <h2 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">
              Tıp, sanat, kültür ve insan hikâyeleri
            </h2>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <article className="flex min-h-95 flex-col justify-between rounded-4xl bg-white/90 p-8 shadow-lg md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39785d]">
                  Tıp ve Sağlık
                </p>

                <div>
                  <h3 className="font-serif text-4xl leading-tight md:text-5xl">
                    Bilimsel güveni koruyan sade içerikler
                  </h3>

                  <p className="mt-6 leading-8 text-[#52615d]">
                    Sağlık okuryazarlığı ve mesleki deneyimler üzerine yazılar.
                  </p>
                </div>
              </article>

              <article className="flex min-h-95 flex-col justify-between rounded-4xl bg-[#b84d3c]/95 p-8 text-white shadow-lg md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Denemeler ve Düşünceler
                </p>

                <div>
                  <h3 className="font-serif text-4xl leading-tight md:text-5xl">
                    Kültür, yolculuk ve gündelik yaşam
                  </h3>

                  <p className="mt-6 leading-8 text-white/70">
                    İnsan, sanat, coğrafya ve yaşanmışlıklar üzerine kişisel
                    notlar.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* PORTRE */}
        <section id="portre" className="relative px-5 pb-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 rounded-4xl border border-white/20 bg-[#f4c85d]/92 p-7 text-[#2a210f] shadow-2xl backdrop-blur-xl md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                Portre
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
                Van’dan Gaziantep’e, hekimlikten müziğe
              </h2>
            </div>

            <p className="text-lg leading-9 text-black/65">
              Muhammed Tankılıç, Van’ın Muradiye ilçesinde doğdu. Gaziantep
              Üniversitesi Tıp Fakültesi’nden Şubat 2025’te mezun oldu.
              Müzikle 17 yaşından beri ilgileniyor.
            </p>
          </div>
        </section>

        {/* ARŞİV */}
        <section id="arsiv" className="relative px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-4xl border border-white/20 bg-[#091b17]/93 p-7 text-white shadow-2xl backdrop-blur-xl md:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#90c4a2]">
              Arşiv
            </p>

            <h2 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">
              Fotoğraflar, videolar, röportajlar ve etkinlikler
            </h2>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {archiveItems.map((item) => (
                <article
                  key={item.title}
                  className="flex min-h-64 flex-col justify-between rounded-4xl border border-white/10 bg-white/10 p-7 transition hover:-translate-y-2 hover:bg-white/15"
                >
                  <p className="font-serif text-3xl text-white/30">
                    {item.number}
                  </p>

                  <div>
                    <h3 className="font-serif text-3xl">{item.title}</h3>

                    <p className="mt-4 text-sm leading-7 text-white/55">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="iletisim" className="relative px-5 pb-6 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-4xl border border-white/15 bg-[#04110e]/95 p-7 text-white shadow-2xl backdrop-blur-xl md:p-10 lg:p-12">
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <h2 className="font-serif text-4xl">
                  Muhammed Tankılıç
                </h2>

                <p className="mt-5 max-w-sm leading-7 text-white/50">
                  Bilim, sanat, kültür ve insan hikâyelerinin kesişiminde.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  Bölümler
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-white/65">
                  <a href="#portre">Portre</a>
                  <a href="#hekimlik">Hekimlik</a>
                  <a href="/muzik">Müzik</a>
                  <a href="#yazilar">Yazılar</a>
                  <a href="#arsiv">Arşiv</a>
                  <a href="#anasayfa">Yukarı Dön</a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  İletişim
                </p>

                <p className="mt-5 leading-7 text-white/55">
                  İletişim ve iş birliği e-posta adresi yakında eklenecek.
                </p>
              </div>
            </div>

            <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
              <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
              <p>Doktor · Müzisyen · İçerik Üreticisi</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
