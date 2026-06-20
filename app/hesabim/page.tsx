"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type UserInfo = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  bildirimIzni: boolean;
};

export default function HesabimPage() {
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/giris?next=/hesabim";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ad, soyad, telefon, bildirim_izni")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setMessage("Profil bilgileri Supabase üzerinden yüklenemedi.");
      }

      const metadata = user.user_metadata || {};

      setUserInfo({
        ad: profile?.ad || metadata.ad || "",
        soyad: profile?.soyad || metadata.soyad || "",
        email: user.email || "",
        telefon: profile?.telefon || metadata.telefon || "",
        bildirimIzni: Boolean(
          profile?.bildirim_izni ?? metadata.bildirim_izni ?? false,
        ),
      });

      setLoading(false);
    }

    loadUser();
  }, [supabase]);

  if (loading) {
    return (
      <main className="page-shell">
        <Navbar />

        <section
          className="site-container flex items-center justify-center py-8"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <div className="soft-card p-6 text-center">
            <p className="section-eyebrow mb-2">Hesap</p>

            <h1 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy)">
              Bilgiler yükleniyor...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container pt-6 md:pt-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="dark-card p-5 md:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              Kullanıcı Paneli
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Hesabım
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Üyelik bilgilerini, bildirim tercihlerini ve özel içerik erişimini
              buradan takip edebilirsin.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/hesabim/duzenle" className="pill-button">
                Bilgilerimi Düzenle
              </Link>

              <Link href="/muzik" className="pill-button secondary">
                Şarkılara Git
              </Link>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="section-eyebrow mb-2">Profil</p>

                <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
                  Profil bilgileri
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
                  Hesabına bağlı temel kullanıcı bilgileri.
                </p>
              </div>

              <Link href="/" className="pill-button secondary w-fit">
                Ana Sayfa
              </Link>
            </div>

            {message && (
              <p className="mt-5 rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                {message}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ProfileBox
                label="Ad Soyad"
                value={`${userInfo?.ad || "-"} ${userInfo?.soyad || ""}`.trim()}
              />

              <ProfileBox label="E-posta" value={userInfo?.email || "-"} />

              <ProfileBox label="Telefon" value={userInfo?.telefon || "-"} />

              <ProfileBox
                label="E-posta Bildirimleri"
                value={userInfo?.bildirimIzni ? "Açık" : "Kapalı"}
              />
            </div>
          </section>
        </div>
      </section>

      <section className="site-container py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="soft-card p-5">
            <p className="section-eyebrow mb-2">Erişim</p>

            <h3 className="font-serif text-3xl font-bold tracking-tighter text-(--burgundy)">
              Özel içerikler
            </h3>

            <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
              Şarkı sözleri, özel kayıtlar ve indirme bağlantıları burada
              açılacak.
            </p>

            <Link href="/muzik" className="mt-5 inline-flex text-sm font-extrabold text-(--burgundy)">
              Müzik arşivine git →
            </Link>
          </article>

          <article className="soft-card p-5">
            <p className="section-eyebrow mb-2">İndirmeler</p>

            <h3 className="font-serif text-3xl font-bold tracking-tighter text-(--burgundy)">
              Şarkılar
            </h3>

            <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
              İndirme geçmişi ve izin verilen dosyalar daha sonra burada
              gösterilecek.
            </p>
          </article>

          <article className="soft-card p-5">
            <p className="section-eyebrow mb-2">Arşiv</p>

            <h3 className="font-serif text-3xl font-bold tracking-tighter text-(--burgundy)">
              Yazılar / notlar
            </h3>

            <p className="mt-3 text-sm leading-6 text-[rgba(75,35,45,0.68)]">
              Şarkı hikâyeleri, söz açıklamaları ve özel notlar üyelik alanına
              eklenebilir.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function ProfileBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[25px] border border-[rgba(75,35,45,0.08)] bg-white/55 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.48)]">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-bold text-(--burgundy)">
        {value || "-"}
      </p>
    </div>
  );
}