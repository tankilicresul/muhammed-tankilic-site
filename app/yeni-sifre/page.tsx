"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Message = {
  type: "error" | "success";
  text: string;
};

const inputClass =
  "min-h-14 rounded-[22px] border border-[#4B232D]/12 bg-white/82 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_12px_34px_rgba(75,35,45,0.06)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]";

const labelClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/64";

const actionButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-bold shadow-[0_16px_36px_rgba(75,35,45,0.16)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

export default function NewPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Yeni şifren en az 6 karakter olmalı.",
      });
      return;
    }

    if (password !== passwordAgain) {
      setMessage({
        type: "error",
        text: "Şifreler eşleşmiyor. Lütfen tekrar kontrol et.",
      });
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir. Yeniden şifre sıfırlama bağlantısı iste.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "Şifren güncellendi. Giriş sayfasına yönlendiriliyorsun.",
    });

    setTimeout(() => {
      router.refresh();
      router.push("/giris");
    }, 900);
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-7 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-5 -z-0 -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70">
          MUHAMMED
        </div>

        <section className="relative z-10 mx-auto max-w-5xl rounded-[38px] border border-white/35 bg-white/62 p-7 shadow-[0_24px_70px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:p-8">
          <div className="text-center">
            <p className="section-eyebrow">Üyelik alanı</p>

            <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(25px,3.1vw,42px)] font-semibold leading-[1.18] tracking-[-0.055em] text-[#4B232D]">
              <span className="block">Hesabına yeniden giriş yapmak için</span>
              <span className="block">güvenli ve yeni bir</span>
              <span className="block">
                <span className="text-[#6F3440]">Şifre Oluştur</span>.
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            <div className="rounded-[32px] border border-white/42 bg-white/58 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClass}>Yeni şifren</span>

                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>Yeni şifre tekrar</span>

                  <input
                    type="password"
                    name="passwordAgain"
                    autoComplete="new-password"
                    placeholder="Şifreni tekrar yaz"
                    value={passwordAgain}
                    onChange={(event) => setPasswordAgain(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            {message ? (
              <div
                className={[
                  "rounded-[22px] border px-5 py-4 text-sm font-semibold leading-7 shadow-[0_10px_28px_rgba(75,35,45,0.05)]",
                  message.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-[#BDEBE8]/80 bg-[#BDEBE8]/45 text-[#4B232D]",
                ].join(" ")}
              >
                {message.type === "error" &&
                message.text.includes("sıfırlama bağlantısı") ? (
                  <span>
                    Şifre güncellenemedi.{" "}
                    <Link
                      href="/sifremi-unuttum"
                      className="font-extrabold underline decoration-red-300 underline-offset-4 transition hover:text-[#4B232D]"
                    >
                      Yeniden bağlantı iste
                    </Link>
                    .
                  </span>
                ) : (
                  message.text
                )}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/giris"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                ← Giriş Yap
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>

              <Link
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                Ana Sayfa →
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}