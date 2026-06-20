"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function YeniSifrePage() {
  const [supabase] = useState(() => createClient());

  const [checking, setChecking] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function prepareRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!isActive) return;

        if (!error) {
          window.history.replaceState({}, "", "/yeni-sifre");
          setSessionReady(true);
          setChecking(false);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isActive) return;

        if (user) {
          window.history.replaceState({}, "", "/yeni-sifre");
          setSessionReady(true);
          setChecking(false);
          return;
        }

        setMessage(
          "Bağlantı geçersiz veya süresi dolmuş. Yeni bir şifre yenileme bağlantısı iste.",
        );
        setChecking(false);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!isActive) return;

      if (error || !user) {
        setMessage(
          "Bağlantı geçersiz veya süresi dolmuş. Yeni bir şifre yenileme bağlantısı iste.",
        );
        setChecking(false);
        return;
      }

      setSessionReady(true);
      setChecking(false);
    }

    prepareRecoverySession();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const password = String(formData.get("password") || "");
    const passwordAgain = String(formData.get("passwordAgain") || "");

    if (password.length < 8) {
      setMessage("Şifre en az 8 karakter olmalı.");
      return;
    }

    if (password !== passwordAgain) {
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setLoading(false);
      setMessage("Şifre değiştirilemedi. Yeni bir bağlantı iste.");
      return;
    }

    await supabase.auth.signOut();

    setLoading(false);
    setSessionReady(false);
    setMessage(
      "Şifren başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsun.",
    );

    setTimeout(() => {
      window.location.href = "/giris?sifre-degisti=1";
    }, 1500);
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section
        className="site-container flex items-center py-8"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="dark-card p-5 md:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              Hesap Güvenliği
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Yeni şifreni belirle.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Güvenliğin için en az 8 karakterli, tahmin edilmesi zor bir şifre
              kullan.
            </p>

            <div className="mt-8 rounded-[25px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm leading-7 text-white/72">
                Şifre değiştirildikten sonra oturum kapatılır ve giriş sayfasına
                yönlendirilirsin.
              </p>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <Link
              href="/giris"
              className="text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.6)]"
            >
              Giriş sayfasına dön
            </Link>

            <p className="section-eyebrow mt-4 mb-2">Yeni Şifre</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Şifre belirle
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Bağlantı geçerliyse yeni şifreni buradan oluşturabilirsin.
            </p>

            {checking && (
              <p className="mt-5 rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                Yenileme bağlantısı kontrol ediliyor...
              </p>
            )}

            {!checking && sessionReady && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Yeni şifre
                  </label>

                  <input
                    name="password"
                    type="password"
                    placeholder="En az 8 karakter"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="form-field"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Yeni şifre tekrar
                  </label>

                  <input
                    name="passwordAgain"
                    type="password"
                    placeholder="Şifreni tekrar yaz"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="form-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="pill-button dark w-full"
                >
                  {loading ? "Şifre değiştiriliyor..." : "Şifreyi Değiştir"}
                </button>
              </form>
            )}

            {message && (
              <p className="mt-5 rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                {message}
              </p>
            )}

            {!checking && !sessionReady && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/sifremi-unuttum" className="pill-button">
                  Yeni Bağlantı İste
                </Link>

                <Link href="/giris" className="pill-button secondary">
                  Giriş Yap
                </Link>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}