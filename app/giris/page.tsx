"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function GirisPage() {
  const [supabase] = useState(() => createClient());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingCode, setCheckingCode] = useState(true);

  useEffect(() => {
    async function confirmEmail() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setCheckingCode(false);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setMessage(
          "E-posta doğrulandı ancak oturum açılamadı. Giriş yapabilirsin.",
        );
      } else {
        setMessage("E-posta adresin doğrulandı. Hesabına giriş yapıldı.");
      }

      window.history.replaceState({}, "", "/giris?dogrulandi=1");
      setCheckingCode(false);
    }

    confirmEmail();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("E-posta veya şifre hatalı.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

    window.location.href = safeNext;
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container flex min-h-[calc(100vh-160px)] items-center py-8">
        <div className="grid w-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="dark-card p-5 md:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              Üyelik Alanı
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Müziğe daha yakın bir alan.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Şarkı sözleri, özel içerikler ve indirme bağlantılarına erişmek
              için hesabına giriş yap.
            </p>

            <div className="mt-8 rounded-[25px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm leading-7 text-white/72">
                Muhammed Tankılıç’ın müzikleri, sözleri ve hikâyeleri için sade
                bir dinleyici arşivi.
              </p>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <Link
              href="/"
              className="text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.6)]"
            >
              Ana sayfaya dön
            </Link>

            <p className="section-eyebrow mt-4 mb-2">Hesabına Dön</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Giriş yap
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Özel içeriklere, şarkı sözlerine ve indirme bağlantılarına erişmek
              için hesabına giriş yap.
            </p>

            {checkingCode && (
              <p className="mt-5 rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                E-posta doğrulaması kontrol ediliyor...
              </p>
            )}

            {message && (
              <p className="mt-5 rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                  E-posta
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  required
                  className="form-field"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                  Şifre
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder="Şifren"
                  required
                  className="form-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pill-button dark w-full"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm font-bold text-(--burgundy)">
              <Link href="/sifremi-unuttum">Şifremi unuttum</Link>
              <Link href="/kayit">Hesabın yok mu? Kayıt ol</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}