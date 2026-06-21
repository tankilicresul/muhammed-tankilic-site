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

export default function RegisterPage() {
  const router = useRouter();

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [uyelikOnayi, setUyelikOnayi] = useState(false);
  const [bildirimIzni, setBildirimIzni] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);

    const cleanAd = ad.trim();
    const cleanSoyad = soyad.trim();
    const cleanTelefon = telefon.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanAd || !cleanSoyad || !cleanTelefon || !cleanEmail) {
      setMessage({
        type: "error",
        text: "Lütfen ad, soyad, telefon ve e-posta alanlarını doldur.",
      });
      return;
    }

    if (sifre.length < 6) {
      setMessage({
        type: "error",
        text: "Şifren en az 6 karakter olmalı.",
      });
      return;
    }

    if (sifre !== sifreTekrar) {
      setMessage({
        type: "error",
        text: "Şifreler eşleşmiyor. Lütfen tekrar kontrol et.",
      });
      return;
    }

    if (!uyelikOnayi) {
      setMessage({
        type: "error",
        text: "Hesap oluşturmak için üyelik onayını işaretlemelisin.",
      });
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/confirm`
        : undefined;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: sifre,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          ad: cleanAd,
          soyad: cleanSoyad,
          telefon: cleanTelefon,
          bildirim_izni: bildirimIzni,
        },
      },
    });

    if (error) {
      setIsSubmitting(false);

      const alreadyRegistered =
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("registered") ||
        error.message.toLowerCase().includes("exists");

      setMessage({
        type: "error",
        text: alreadyRegistered
          ? "Bu mail ile kayıtlı bir hesap olabilir. Giriş yapmayı deneyebilirsin."
          : "Kayıt oluşturulamadı. Bilgilerini kontrol edip tekrar dene.",
      });

      return;
    }

    if (data.user && data.session) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          ad: cleanAd,
          soyad: cleanSoyad,
          telefon: cleanTelefon,
          bildirim_izni: bildirimIzni,
        },
        { onConflict: "id" }
      );

      setMessage({
        type: "success",
        text: "Hesabın oluşturuldu. Hesabına yönlendiriliyorsun.",
      });

      router.refresh();
      router.push("/hesabim");
      return;
    }

    setIsSubmitting(false);

    setMessage({
      type: "success",
      text: "Hesabın oluşturuldu. E-posta adresine gelen doğrulama bağlantısını açtıktan sonra giriş yapabilirsin.",
    });
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
              <span className="block">
                Şarkı sözleri, özel içerikler ve indirme
              </span>
              <span className="block">bağlantılarına erişmek için</span>
              <span className="block">
                <span className="text-[#6F3440]">Hesap Aç</span>.
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            <div className="rounded-[32px] border border-white/42 bg-white/58 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClass}>Adın</span>

                  <input
                    type="text"
                    name="ad"
                    autoComplete="given-name"
                    placeholder="Adını yaz"
                    value={ad}
                    onChange={(event) => setAd(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>Soyadın</span>

                  <input
                    type="text"
                    name="soyad"
                    autoComplete="family-name"
                    placeholder="Soyadını yaz"
                    value={soyad}
                    onChange={(event) => setSoyad(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>Telefonun</span>

                  <input
                    type="tel"
                    name="telefon"
                    autoComplete="tel"
                    placeholder="05xx xxx xx xx"
                    value={telefon}
                    onChange={(event) => setTelefon(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>E-postan</span>

                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>Şifren</span>

                  <input
                    type="password"
                    name="sifre"
                    autoComplete="new-password"
                    placeholder="En az 6 karakter"
                    value={sifre}
                    onChange={(event) => setSifre(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClass}>Şifre tekrar</span>

                  <input
                    type="password"
                    name="sifreTekrar"
                    autoComplete="new-password"
                    placeholder="Şifreni tekrar yaz"
                    value={sifreTekrar}
                    onChange={(event) => setSifreTekrar(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-3 rounded-[26px] border border-white/42 bg-white/58 p-5 text-sm font-semibold leading-7 text-[#4B232D]/76 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={uyelikOnayi}
                  onChange={(event) => setUyelikOnayi(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#4B232D]"
                  required
                />

                <span>
                  Hesap oluşturmak için verdiğim bilgilerin üyelik amacıyla
                  kullanılmasını kabul ediyorum.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={bildirimIzni}
                  onChange={(event) => setBildirimIzni(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#4B232D]"
                />

                <span>
                  Yeni şarkılar, özel içerikler ve indirme bağlantıları hakkında
                  bilgilendirme almayı kabul ediyorum.
                </span>
              </label>
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
                message.text.includes("Giriş yapmayı") ? (
                  <span>
                    Bu mail ile kayıtlı bir hesap olabilir.{" "}
                    <Link
                      href="/giris"
                      className="font-extrabold underline decoration-red-300 underline-offset-4 transition hover:text-[#4B232D]"
                    >
                      Giriş Yap
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
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                ← Ana Sayfa
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {isSubmitting ? "Hesap oluşturuluyor..." : "Hesabımı Oluştur"}
              </button>

              <Link
                href="/giris"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                Giriş Yap →
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}