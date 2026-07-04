"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { useSiteTexts } from "@/lib/supabase/site-texts-client";

type ProfileForm = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  bildirimIzni: boolean;
};

const inputClass =
  "min-h-11 rounded-[18px] border border-[#4B232D]/12 bg-white/88 px-4 text-[14px] font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)] md:min-h-12 md:rounded-[20px] md:px-5 md:text-base";

const labelClass =
  "text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/64 md:text-[10px] md:tracking-[0.18em]";

const actionButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full px-2 text-center text-[10.5px] font-bold leading-none shadow-[0_10px_24px_rgba(75,35,45,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:min-h-12 md:px-6 md:text-sm md:shadow-[0_16px_36px_rgba(75,35,45,0.16)]";

export default function ProfilDuzenlePage() {
  const [supabase] = useState(() => createClient());
  const { text } = useSiteTexts();

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
        setMessage(text("account_edit.message.load_error"));
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
  }, [supabase, text]);

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
      setMessage(text("account_edit.message.update_error"));
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
          `${text("account_edit.message.email_partial")}${emailError.message}`,
        );
        return;
      }

      setSaving(false);
      setMessage(text("account_edit.message.email_success"));
      return;
    }

    setSaving(false);
    setMessage(text("account_edit.message.success"));
  }

  if (loading) {
    return (
      <main className="page-shell">
        <Navbar />

        <section className="site-container relative pt-6 md:pt-9">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 text-center shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-4xl md:rounded-[34px] md:p-8">
            <p className="section-eyebrow">
              {text("account_edit.loading_eyebrow")}
            </p>

            <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:mt-3 md:text-[clamp(38px,4.6vw,62px)]">
              {text("account_edit.loading_title")}
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-6 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-5 -z-0 hidden -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70 md:block">
          MUHAMMED
        </div>

        <section className="relative z-10 mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-5xl md:rounded-[38px] md:p-8 md:shadow-[0_24px_70px_rgba(75,35,45,0.12)]">
          <div className="text-center">
            <p className="section-eyebrow">{text("account_edit.eyebrow")}</p>

            <h1 className="mx-auto mt-2 max-w-[280px] text-[30px] font-semibold leading-[1.03] tracking-[-0.085em] text-[#4B232D] md:mt-3 md:max-w-4xl md:text-[clamp(48px,5.5vw,82px)] md:leading-none md:tracking-[-0.095em]">
              {text("account_edit.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-[12px] leading-6 text-[#4B232D]/68 md:mt-4 md:max-w-2xl md:text-sm md:leading-8">
              {text("account_edit.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:mt-7 md:gap-4">
            <div className="rounded-[24px] border border-white/42 bg-white/58 p-3.5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[32px] md:p-5">
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("account_edit.label.first_name")}
                  </span>

                  <input
                    value={form.ad}
                    onChange={(event) =>
                      setForm({ ...form, ad: event.target.value })
                    }
                    placeholder={text("account_edit.placeholder.first_name")}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("account_edit.label.last_name")}
                  </span>

                  <input
                    value={form.soyad}
                    onChange={(event) =>
                      setForm({ ...form, soyad: event.target.value })
                    }
                    placeholder={text("account_edit.placeholder.last_name")}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("account_edit.label.phone")}
                  </span>

                  <input
                    value={form.telefon}
                    onChange={(event) =>
                      setForm({ ...form, telefon: event.target.value })
                    }
                    type="tel"
                    placeholder={text("account_edit.placeholder.phone")}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("account_edit.label.email")}
                  </span>

                  <input
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    type="email"
                    placeholder={text("account_edit.placeholder.email")}
                    required
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/42 bg-white/72 px-4 py-3 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[26px] md:px-5 md:py-4">
              <label className="flex gap-3 text-[12px] leading-6 text-[#4B232D]/72 md:text-sm md:leading-7">
                <input
                  type="checkbox"
                  checked={form.bildirimIzni}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      bildirimIzni: event.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 shrink-0 rounded border-[#4B232D]/30 accent-[#4B232D]"
                />

                <span>{text("account_edit.notification_text")}</span>
              </label>
            </div>

            {message ? (
              <p className="rounded-[18px] border border-[#BDEBE8]/80 bg-[#BDEBE8]/45 px-4 py-3 text-[12px] font-semibold leading-6 text-[#4B232D] shadow-[0_10px_28px_rgba(75,35,45,0.05)] md:rounded-[22px] md:px-5 md:py-4 md:text-sm md:leading-7">
                {message}
              </p>
            ) : null}

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Link
                href="/hesabim"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("account_edit.button.back")}
              </Link>

              <button
                type="submit"
                disabled={saving}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {saving
                  ? text("account_edit.button.saving")
                  : text("account_edit.button.submit")}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
