import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { checkIsAdmin } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Paneli | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç web sitesi içerik, fotoğraf ve yayın yönetim paneli.",
};

type AdminTableName = "songs" | "covers" | "photos" | "site_texts";

type TableCountResult = {
  count: number;
  error: string | null;
};

type AdminCard = {
  title: string;
  description: string;
  href: string;
  status: "active";
  countLabel: string;
  count: number;
  error: string | null;
};

async function getTableCount(tableName: AdminTableName): Promise<TableCountResult> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", {
      count: "exact",
      head: true,
    });

  return {
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export default async function AdminPage() {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    redirect("/giris");
  }

  if (!admin.isAdmin) {
    redirect("/hesabim");
  }

  const [songsCount, coversCount, photosCount, siteTextsCount] =
    await Promise.all([
      getTableCount("songs"),
      getTableCount("covers"),
      getTableCount("photos"),
      getTableCount("site_texts"),
    ]);

  const adminCards: AdminCard[] = [
    {
      title: "Şarkı Yönetimi",
      description: "Şarkı ekle, düzenle ve platform bağlantılarını yönet.",
      href: "/admin/sarkilar",
      status: "active",
      countLabel: "kayıtlı şarkı",
      count: songsCount.count,
      error: songsCount.error,
    },
    {
      title: "Cover Yönetimi",
      description: "Cover videolarını, açıklamaları ve bağlantıları güncelle.",
      href: "/admin/coverlar",
      status: "active",
      countLabel: "kayıtlı cover",
      count: coversCount.count,
      error: coversCount.error,
    },
    {
      title: "Fotoğraf Yönetimi",
      description: "Galeri görsellerini yükle, düzenle ve yayına al.",
      href: "/admin/fotograflar",
      status: "active",
      countLabel: "kayıtlı fotoğraf",
      count: photosCount.count,
      error: photosCount.error,
    },
    {
      title: "Site Metinleri",
      description: "Ana sayfa duyuru metnini ve hedef bağlantısını yönet.",
      href: "/admin/metinler",
      status: "active",
      countLabel: "kayıtlı metin",
      count: siteTextsCount.count,
      error: siteTextsCount.error,
    },
  ];

  const statCards = [
    {
      label: "Şarkılar",
      count: songsCount.count,
    },
    {
      label: "Coverlar",
      count: coversCount.count,
    },
    {
      label: "Fotoğraflar",
      count: photosCount.count,
    },
    {
      label: "Site Metinleri",
      count: siteTextsCount.count,
    },
  ];

  const hasDatabaseError = adminCards.some((card) => card.error);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-40 md:pt-10">
        <div className="rounded-[24px] border border-white/35 bg-white/66 p-3 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:rounded-[34px] md:p-6">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <p className="section-eyebrow mb-1">Admin Paneli</p>

              <h1 className="max-w-2xl text-[clamp(30px,5vw,48px)] font-semibold leading-none tracking-[-0.075em] text-[#4B232D]">
                İçerik yönetimi
              </h1>
            </div>

            <div className="mx-auto inline-flex rounded-full border border-[#4B232D]/10 bg-white/74 px-4 py-2 text-[10.5px] font-bold text-[#4B232D]/68 shadow-[0_8px_20px_rgba(75,35,45,0.045)] md:mx-0 md:text-xs">
              Admin: {admin.email}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:grid-cols-4 md:gap-3">
            {statCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-white/42 bg-white/64 px-3 py-3 text-center shadow-[0_8px_22px_rgba(75,35,45,0.055)] backdrop-blur-[12px] md:rounded-[22px] md:py-4"
              >
                <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/48 md:text-[10px]">
                  {item.label}
                </p>

                <p className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.06em] text-[#4B232D] md:text-[32px]">
                  {item.count}
                </p>
              </div>
            ))}
          </div>

          {hasDatabaseError ? (
            <div className="mt-4 rounded-[18px] border border-red-200/70 bg-red-50/80 p-3 text-left text-[11px] leading-5 text-red-800 md:rounded-[22px] md:p-4 md:text-xs md:leading-6">
              <p className="font-bold">Veritabanı okuma uyarısı</p>

              <ul className="mt-2 space-y-1">
                {adminCards
                  .filter((card) => card.error)
                  .map((card) => (
                    <li key={card.title}>
                      {card.title}: {card.error}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-emerald-200/70 bg-emerald-50/72 px-4 py-3 text-center text-[11px] font-bold text-emerald-800 md:rounded-[22px] md:text-xs">
              Supabase bağlantısı başarılı.
            </div>
          )}

          <div className="mt-4 grid gap-3 md:mt-6 md:grid-cols-2">
            {adminCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[20px] border border-white/42 bg-white/64 p-4 shadow-[0_10px_28px_rgba(75,35,45,0.06)] backdrop-blur-[12px] md:rounded-[26px] md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[24px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[30px]">
                      {card.title}
                    </h2>

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/45 md:text-[11px]">
                      {card.count} {card.countLabel}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#F5AE50]/90 px-3 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#4B232D]">
                    Yönet
                  </span>
                </div>

                <p className="mt-3 text-[12px] leading-6 text-[#4B232D]/70 md:text-[13px] md:leading-7">
                  {card.description}
                </p>

                <Link
                  href={card.href}
                  className="mt-4 inline-flex min-h-9 min-w-[132px] items-center justify-center rounded-full border border-[#F5AE50]/60 bg-[#F5AE50]/90 px-5 text-[11px] font-bold text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F5AE50] md:min-h-10 md:text-xs"
                >
                  Bölüme Git
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <p>© 2026 Muhammed Tankılıç. Admin paneli.</p>
        <span>İçerik · Fotoğraf · Yayın yönetimi</span>
      </footer>
    </main>
  );
}
