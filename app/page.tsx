import Link from "next/link";
import Navbar from "@/components/Navbar";
import { latestSong } from "@/lib/data/songs";

const homeLinks = [
  {
    title: "Şarkılarım",
    description: "Kendi Bestelerim.",
    href: "/sarkilarim",
  },
  {
    title: "Coverlarım",
    description: "Kendi Yorumumla Başkalarının Şarkıları.",
    href: "/coverlarim",
  },
  {
    title: "Fotoğraflarım",
    description: "Portrelerim ve görsel arşivim.",
    href: "/fotograflar",
  },
  {
    title: "İletişim",
    description: "Müzik, yayın ve iş birliği.",
    href: "/iletisim",
  },
];

const announcement = {
  type: "song" as "song" | "cover",
  eyebrow: "Yeni Şarkım Çıktı",
  title: `${latestSong.title} yayında.`,
  description: "Spotify ve Apple Music’te dinleyebilirsin.",
  href: `/sarkilarim/${latestSong.slug}`,
};

const announcementButtonLabel =
  announcement.type === "cover" ? "Covera Git -->" : "Şarkıya Git -->";

export default function Home() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-1 md:pt-4">
        <article className="relative flex min-h-[335px] flex-col justify-end sm:min-h-[430px] md:min-h-[calc(100vh-132px)]">
          <div className="rounded-[22px] border border-white/28 bg-white/14 p-2 shadow-[0_16px_44px_rgba(75,35,45,0.08)] backdrop-blur-[16px] sm:p-3 md:rounded-[28px] md:p-4">
            <div className="rounded-[20px] border border-[#4B232D]/10 bg-white/90 px-4 py-4 text-center shadow-[0_12px_34px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:flex md:items-center md:justify-between md:gap-5 md:rounded-[24px] md:bg-white/78 md:px-6 md:py-5 md:text-left">
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/58 md:text-[10px] md:tracking-[0.22em]">
                  {announcement.eyebrow}
                </p>

                <h1 className="mt-1.5 text-[24px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(26px,2.8vw,38px)]">
                  {announcement.title}
                </h1>

                <p className="mx-auto mt-2 max-w-[280px] text-[12px] leading-5 text-[#4B232D]/68 md:mx-0 md:max-w-xl md:text-sm md:leading-6">
                  {announcement.description}
                </p>
              </div>

              <Link
                href={announcement.href}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full !bg-[#4B232D] px-5 text-[11px] font-bold !text-white shadow-[0_12px_30px_rgba(75,35,45,0.18)] transition hover:-translate-y-0.5 hover:!bg-[#5a2b36] sm:w-auto md:mt-0 md:min-h-11 md:px-7 md:text-xs"
              >
                {announcementButtonLabel}
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[24px] border border-white/28 bg-white/14 p-3 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[16px] md:rounded-[34px] md:p-4">
          <div className="rounded-[22px] border border-[#4B232D]/10 bg-white/90 px-5 py-6 text-center shadow-[0_12px_34px_rgba(75,35,45,0.08)] backdrop-blur-[18px] md:rounded-[30px] md:bg-white/78 md:px-10 md:py-9">
            <p className="section-eyebrow">Benim Hikayem ve Misyonum</p>

            <h2 className="mx-auto max-w-3xl text-[clamp(25px,7.2vw,34px)] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(34px,3vw,46px)]">
              Tutkum Kürt Müziği için Modern, Sade ve Güçlü Şarkılar Üretmek.
            </h2>

            <div className="mx-auto mt-5 grid max-w-3xl gap-3 text-center text-[12px] leading-7 text-[#4B232D]/72 md:mt-6 md:text-sm md:leading-8">
              <p>
                Benim müzik yolculuğum, Kürtçe şarkıları hem duygusunu koruyan
                hem de bugünün dinleme alışkanlıklarına uyum sağlayan modern bir
                formda üretme isteğiyle şekilleniyor.
              </p>

              <p>
                Amacım; akustik sıcaklığı, anlaşılır sözleri ve kulağa hoş gelen
                melodileri bir araya getirerek Kürt müziğine yeni, sade ve samimi
                şarkılar kazandırmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="rounded-[24px] border border-white/28 bg-white/14 p-3.5 shadow-[0_14px_38px_rgba(75,35,45,0.08)] backdrop-blur-[16px] md:rounded-[34px] md:p-6">
          <div className="mb-3 text-center md:mb-5">
            <p className="section-eyebrow mb-0">Müzik Arşivim</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {homeLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[96px] flex-col justify-between rounded-[18px] border border-[#4B232D]/10 bg-white/90 p-3.5 text-center shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[18px] transition hover:-translate-y-0.5 hover:bg-white md:min-h-[132px] md:rounded-[24px] md:bg-white/78 md:p-5 md:hover:bg-white/88"
              >
                <h2 className="text-[18px] font-semibold leading-none tracking-[-0.06em] text-[#4B232D] md:text-[28px]">
                  {item.title}
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-[#4B232D]/64 md:text-[13px] md:leading-6">
                  {item.description}
                </p>

                <span className="mt-3 inline-flex min-h-8 items-center justify-center rounded-full bg-[#F5AE50] px-3 text-[10.5px] font-bold leading-none text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.20)] md:min-h-9 md:text-[12px]">
                  Aç
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Tüm hakları saklıdır.</p>
        <span>Resul Tankılıç Tarafından Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}