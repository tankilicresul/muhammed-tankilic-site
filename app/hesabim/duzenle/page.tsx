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

const profileItems = ["Ad soyad", "E-posta", "Bildirim tercihi"];

const inputClass =
  "min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]";

const labelClass =
  "text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64";

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

    const { error: profileError } = await supabase.from("profiles").upsert(
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

        <section className="site-container relative pt-7 md:pt-9">
          <div className="rounded-[34px] border border-white/35 bg-white/62 p-8 text-center shadow-[0_22px_64px_rgba(75,35,45,0.10)] backdrop-blur-[18px]">
            <p className="section-eyebrow">Profil</p>

            <h1 className="mt-3 text-[clamp(38px,4.6vw,62px)] font-semibold leading-none tracking-[-0.085em] text-[#4B232D]">
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

      <section className="site-container relative pt-7 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-5 -z-0 -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70">
          MUHAMMED
        </div>

        <div className="relative z-10 grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <aside className="relative flex h-full overflow-hidden rounded-[34px] border border-white/18 bg-[#4B232D] p-7 text-white shadow-[0_24px_70px_rgba(75,35,45,0.18)] md:p-8">
            <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-[#F5AE50]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-[#BDEBE8]/12 blur-3xl" />

            <div className="relative flex w-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/66">
                  Profil ayarları
                </p>

                <h1 className="mt-4 max-w-xl text-[clamp(38px,4.3vw,62px)] font-semibold leading-[0.94] tracking-[-0.085em]">
                  Bilgilerini düzenle.
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-8 text-white/72">
                  Ad, Soyad, Telefon ve Bildirim tercihlerini buradan
                  güncelleyebilirsin--&gt;
                </p>

                <div className="mt-7 rounded-[26px] border border-white/16 bg-white/10 p-5 backdrop-blur-[14px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/54">
                    Profilinde ne değişir?
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/74">
                    Kaydettiğin bilgiler üyelik alanında ve özel içerik erişim
                    tercihinde kullanılabilir.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {profileItems.map((item) => (
                    <div
  key={item}
  className="flex min-h-[82px] items-center rounded-[22px] border border-white/8 bg-white/[0.045] px-4 py-4 backdrop-blur-[12px]"
>
  <h2 className="text-sm font-semibold leading-6 text-white/64">
    {item}
  </h2>
</div>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/hesabim"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Hesabıma Dön
                </Link>

                <Link
                  href="/sarkilarim"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Şarkılarım
                </Link>
              </div>
            </div>
          </aside>

          <section className="rounded-[34px] border border-white/35 bg-white/62 p-7 shadow-[0_22px_64px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-[clamp(44px,4.8vw,70px)] font-semibold leading-none tracking-[-0.09em] text-[#4B232D]">
                Profil bilgileri
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="rounded-[30px] border border-white/42 bg-white/58 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className={labelClass}>Adın</span>

                    <input
                      value={form.ad}
                      onChange={(event) =>
                        setForm({ ...form, ad: event.target.value })
                      }
                      placeholder="Adını yaz"
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className={labelClass}>Soyadın</span>

                    <input
                      value={form.soyad}
                      onChange={(event) =>
                        setForm({ ...form, soyad: event.target.value })
                      }
                      placeholder="Soyadını yaz"
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className={labelClass}>Telefonun</span>

                    <input
                      value={form.telefon}
                      onChange={(event) =>
                        setForm({ ...form, telefon: event.target.value })
                      }
                      type="tel"
                      placeholder="+90 5xx xxx xx xx"
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className={labelClass}>E-postan</span>

                    <input
                      value={form.email}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                      type="email"
                      placeholder="ornek@mail.com"
                      required
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/42 bg-white/72 px-5 py-4 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
                <label className="flex gap-3 text-sm leading-7 text-[#4B232D]/72">
                  <input
                    type="checkbox"
                    checked={form.bildirimIzni}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        bildirimIzni: event.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-[#4B232D]/30 accent-[#4B232D]"
                  />

                  <span>
                    Yeni şarkılar ve özel içerikler yayınlandığında e-posta
                    almak istiyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="min-h-14 rounded-full bg-[#4B232D] px-6 text-sm font-bold text-white shadow-[0_16px_36px_rgba(75,35,45,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>

              {message ? (
                <p className="rounded-[22px] border border-[#BDEBE8]/80 bg-[#BDEBE8]/45 px-5 py-4 text-sm font-semibold leading-7 text-[#4B232D] shadow-[0_10px_28px_rgba(75,35,45,0.05)]">
                  {message}
                </p>
              ) : null}
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}