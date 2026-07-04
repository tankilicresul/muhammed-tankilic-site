"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { useSiteTexts } from "@/lib/supabase/site-texts-client";

type UserInfo = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  bildirimIzni: boolean;
};

export default function HesabimPage() {
  const [supabase] = useState(() => createClient());
  const { text } = useSiteTexts();

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

  const fullName = `${userInfo?.ad || ""} ${userInfo?.soyad || ""}`.trim();

  const profileItems = [
    {
      label: text("account.profile_label.full_name"),
      key: "fullName",
    },
    {
      label: text("account.profile_label.email"),
      key: "email",
    },
    {
      label: text("account.profile_label.phone"),
      key: "telefon",
    },
    {
      label: text("account.profile_label.notifications"),
      key: "bildirim",
    },
  ];

  function getProfileValue(key: string) {
    if (key === "fullName") return fullName || "-";
    if (key === "email") return userInfo?.email || "-";
    if (key === "telefon") return userInfo?.telefon || "-";
    if (key === "bildirim") {
      return userInfo?.bildirimIzni
        ? text("account.notifications_on")
        : text("account.notifications_off");
    }

    return "-";
  }

  if (loading) {
    return (
      <main className="page-shell">
        <Navbar />

        <section className="site-container relative pt-6 md:pt-9">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 text-center shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-4xl md:rounded-[34px] md:p-8">
            <p className="section-eyebrow">{text("account.loading_eyebrow")}</p>

            <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:mt-3 md:text-[clamp(38px,4.6vw,62px)]">
              {text("account.loading_title")}
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
            <p className="section-eyebrow">{text("account.eyebrow")}</p>

            <h1 className="mt-2 text-[38px] font-semibold leading-none tracking-[-0.09em] text-[#4B232D] md:mt-3 md:text-[clamp(54px,6vw,88px)] md:tracking-[-0.095em]">
              {text("account.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-[12px] leading-6 text-[#4B232D]/68 md:mt-4 md:max-w-2xl md:text-sm md:leading-8">
              {text("account.description")}
            </p>
          </div>

          {message ? (
            <p className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold leading-6 text-red-700 shadow-[0_10px_28px_rgba(75,35,45,0.05)] md:mt-6 md:rounded-[22px] md:px-5 md:py-4 md:text-sm md:leading-7">
              {message}
            </p>
          ) : null}

          <div className="mt-5 rounded-[24px] border border-white/42 bg-white/58 p-3.5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:mt-7 md:rounded-[32px] md:p-5">
            <div className="grid gap-2.5 sm:grid-cols-2 md:gap-4">
              {profileItems.map((item) => (
                <ProfileBox
                  key={item.key}
                  label={item.label}
                  value={getProfileValue(item.key)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/42 bg-[#FFF4BC]/70 px-4 py-3 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:mt-5 md:rounded-[26px] md:px-5 md:py-4">
            <p className="text-center text-[12px] font-medium leading-6 text-[#4B232D]/72 md:text-sm md:leading-7">
              {text("account.notice")}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1.5 md:mt-6 md:gap-3">
            <Link
              href="/"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#F5AE50] px-1.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.20)] transition hover:-translate-y-0.5 hover:bg-[#f7bb67] md:min-h-12 md:px-5 md:text-sm"
            >
              {text("account.button.menu")}
            </Link>

            <Link
              href="/hesabim/duzenle"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#4B232D]/12 bg-white/82 px-1.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(75,35,45,0.08)] transition hover:-translate-y-0.5 hover:bg-white md:min-h-12 md:px-5 md:text-sm"
            >
              {text("account.button.edit")}
            </Link>

            <button
              type="button"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#F5AE50] px-1.5 text-center text-[11px] font-bold leading-none text-[#4B232D] shadow-[0_10px_22px_rgba(245,174,80,0.20)] transition hover:-translate-y-0.5 hover:bg-[#f7bb67] md:min-h-12 md:px-5 md:text-sm"
              title={text("account.downloads_title")}
            >
              {text("account.button.downloads")}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function ProfileBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/42 bg-white/76 px-4 py-3 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[24px] md:px-5 md:py-4">
      <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/54 md:text-[10px] md:tracking-[0.18em]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-[13px] font-bold leading-6 text-[#4B232D] md:mt-2 md:text-sm md:leading-7">
        {value || "-"}
      </p>
    </div>
  );
}
