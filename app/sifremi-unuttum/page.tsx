"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function SifremiUnuttumPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/yeni-sifre`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Şifre yenileme bağlantısı e-posta adresine gönderildi.");
    form.reset();
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
              Hesap Kurtarma
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Hesabına yeniden eriş.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              E-posta adresini yaz. Şifreni güvenli şekilde yenileyebileceğin
              bağlantıyı gönderelim.
            </p>

            <div className="mt-8 rounded-[25px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm leading-7 text-white/72">
                Bağlantı yalnızca şifre yenileme için kullanılır. Yeni şifre
                oluşturduktan sonra tekrar giriş yapabilirsin.
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

            <p className="section-eyebrow mt-4 mb-2">Şifre Yenileme</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Şifremi unuttum
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Hesabına bağlı e-posta adresini gir. Şifreni değiştirebileceğin
              bağlantı e-posta adresine gönderilir.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                  E-posta
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  autoComplete="email"
                  required
                  className="form-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pill-button dark w-full"
              >
                {loading ? "Gönderiliyor..." : "Yenileme Bağlantısı Gönder"}
              </button>

              {message && (
                <p className="rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                  {message}
                </p>
              )}
            </form>

            <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm font-bold text-(--burgundy)">
              <Link href="/giris">Giriş yap</Link>
              <Link href="/kayit">Yeni hesap oluştur</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}