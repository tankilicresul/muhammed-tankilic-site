"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type ProfileForm = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  bildirimIzni: boolean;
};

export default function ProfilDuzenlePage() {
  const [supabase] = useState(() => createClient());

  const [form, setForm] = useState<ProfileForm>({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    bildirimIzni: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/giris?next=/hesabim/duzenle";
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

      setForm({
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

    loadProfile();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/giris?next=/hesabim/duzenle";
      return;
    }

    const cleanedProfile = {
      ad: form.ad.trim(),
      soyad: form.soyad.trim(),
      telefon: form.telefon.trim(),
      bildirim_izni: form.bildirimIzni,
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          ...cleanedProfile,
        },
        {
          onConflict: "id",
        },
      );

    if (profileError) {
      setSaving(false);
      setMessage("Profil bilgileri güncellenemedi.");
      return;
    }

    const currentEmail = user.email || "";
    const nextEmail = form.email.trim();

    if (nextEmail && nextEmail !== currentEmail) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: nextEmail,
      });

      if (emailError) {
        setSaving(false);
        setMessage(
          "Profil güncellendi ancak e-posta değiştirilemedi: " +
            emailError.message,
        );
        return;
      }

      setSaving(false);
      setMessage(
        "Profil güncellendi. Yeni e-posta adresine doğrulama bağlantısı gönderildi.",
      );
      return;
    }

    setSaving(false);
    setMessage("Profil bilgileri başarıyla güncellendi.");
  }

  if (loading) {
    return (
      <main className="page-shell">
        <Navbar />

        <section
          className="site-container flex items-center justify-center py-8"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <div className="soft-card p-6 text-center">
            <p className="section-eyebrow mb-2">Profil</p>

            <h1 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy)">
              Profil yükleniyor...
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
              Profil Ayarları
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-none tracking-tighter text-white md:text-5xl">
              Bilgilerini düzenle.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Ad, soyad, telefon ve bildirim tercihlerini buradan
              güncelleyebilirsin.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/hesabim" className="pill-button">
                Hesabıma Dön
              </Link>

              <Link href="/muzik" className="pill-button secondary">
                Müzikler
              </Link>
            </div>
          </aside>

          <section className="soft-card p-5 md:p-6">
            <p className="section-eyebrow mb-2">Düzenle</p>

            <h2 className="font-serif text-4xl font-bold tracking-tighter text-(--burgundy) md:text-5xl">
              Profil bilgileri
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[rgba(75,35,45,0.7)]">
              Değişiklikler Supabase kullanıcı profiline kaydedilir.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-widest text-[rgba(75,35,45,0.55)]">
                    Ad
                  </label>

                  <input
                    value={form.ad}
                    onChange={(event) =>
                      setForm({ ...form, ad: event.target.value })
                    }
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
                    value={form.soyad}
                    onChange={(event) =>
                      setForm({ ...form, soyad: event.target.value })
                    }
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
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
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
                  value={form.telefon}
                  onChange={(event) =>
                    setForm({ ...form, telefon: event.target.value })
                  }
                  type="tel"
                  placeholder="+90 5xx xxx xx xx"
                  required
                  className="form-field"
                />
              </div>

              <div className="rounded-[25px] border border-[rgba(75,35,45,0.1)] bg-white/50 p-4">
                <label className="flex items-start gap-3 text-sm leading-6 text-[rgba(75,35,45,0.72)]">
                  <input
                    type="checkbox"
                    checked={form.bildirimIzni}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        bildirimIzni: event.target.checked,
                      })
                    }
                    className="mt-1"
                  />

                  <span>
                    Yeni şarkılar ve özel içerikler yayımlandığında e-posta almak
                    istiyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="pill-button dark w-full"
              >
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>

              {message && (
                <p className="rounded-[25px] bg-(--mint-soft) px-4 py-3 text-sm text-(--burgundy)">
                  {message}
                </p>
              )}
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}