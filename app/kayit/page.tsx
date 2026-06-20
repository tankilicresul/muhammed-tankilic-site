"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function KayitPage() {
  const supabase = createClient();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const ad = String(formData.get("ad") || "").trim();
    const soyad = String(formData.get("soyad") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefon = String(formData.get("telefon") || "").trim();
    const sifre = String(formData.get("sifre") || "");
    const sifreTekrar = String(formData.get("sifreTekrar") || "");
    const bildirimIzni = formData.get("bildirimIzni") === "on";

    if (sifre !== sifreTekrar) {
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    if (sifre.length < 8) {
      setMessage("Şifre en az 8 karakter olmalı.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: sifre,
      options: {
        emailRedirectTo: `${window.location.origin}/giris?dogrulandi=1`,
        data: {
          ad,
          soyad,
          telefon,
          bildirim_izni: bildirimIzni,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Kayıt oluşturuldu. E-posta adresine gönderilen doğrulama bağlantısına tıkla.",
    );

    event.currentTarget.reset();
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container flex min-h-[calc(100vh-160px)] items-center py-8">
        <div className="grid w-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="dark-card p-5 md:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              Hesap Oluştur
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Sözlere, kayıtlara ve özel arşive eriş.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Üyelik; şarkı sözleri, özel içerikler ve indirme bağlantıları için
              kullanılacak kişisel dinleyici alanıdır.
            </p>

            <div className="mt-8 rounded-[25px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm leading-7 text-white/72">
                Güvenli ve sade bir arşiv deneyimi. Doktorluk içeriği yok;
                tamamen müzik odaklıdır.
              </p>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <p className="section-eyebrow mb-2">Hesap Oluştur</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Kayıt ol
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Özel içerikler, şarkı sözleri ve indirme bağlantılarına erişmek
              için ücretsiz bir hesap oluştur.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Ad
                  </label>

                  <input
                    name="ad"
                    placeholder="Adın"
                    required
                    className="form-field"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Soyad
                  </label>

                  <input
                    name="soyad"
                    placeholder="Soyadın"
                    required
                    className="form-field"
                  />
                </div>
              </div>

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
                  Telefon
                </label>

                <input
                  name="telefon"
                  type="tel"
                  placeholder="+90 5xx xxx xx xx"
                  required
                  className="form-field"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Şifre
                  </label>

                  <input
                    name="sifre"
                    type="password"
                    placeholder="En az 8 karakter"
                    required
                    minLength={8}
                    className="form-field"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Şifre Tekrar
                  </label>

                  <input
                    name="sifreTekrar"
                    type="password"
                    placeholder="Şifreni tekrar yaz"
                    required
                    minLength={8}
                    className="form-field"
                  />
                </div>
              </div>

              <div className="rounded-[25px] border border-[rgba(75,35,45,0.1)] bg-white/50 p-4">
                <label className="flex items-start gap-3 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Gizlilik politikasını ve kullanım koşullarını kabul
                    ediyorum.
                  </span>
                </label>

                <label className="mt-3 flex items-start gap-3 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
                  <input name="bildirimIzni" type="checkbox" className="mt-1" />
                  <span>
                    Yeni şarkılar ve özel içerikler yayımlandığında e-posta almak
                    istiyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pill-button dark w-full"
              >
                {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
              </button>

              {message && (
                <p className="rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                  {message}
                </p>
              )}
            </form>

            <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm font-bold text-(--burgundy)">
              <Link href="/giris">Zaten hesabın var mı? Giriş yap</Link>
              <Link href="/muzik">Şarkılara dön</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}