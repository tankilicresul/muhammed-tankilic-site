"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { useSiteTexts } from "@/lib/supabase/site-texts-client";

type Message = {
  type: "error" | "success";
  text: string;
};

const pendingDownloadStorageKey = "muhammed_pending_download_return_to";

const inputClass =
  "min-h-11 w-full rounded-[18px] border border-[#4B232D]/12 bg-white/82 px-4 text-[13px] font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_8px_24px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,174,80,0.16)] md:min-h-14 md:rounded-[22px] md:px-5 md:text-base";

const passwordInputClass = `${inputClass} pr-11 md:pr-14`;

const labelClass =
  "text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64 md:text-[10px] md:tracking-[0.2em]";

const actionButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full px-2 text-center text-[10.5px] font-bold leading-none tracking-[-0.015em] shadow-[0_10px_24px_rgba(75,35,45,0.13)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:min-h-12 md:px-5 md:text-sm";

const passwordToggleClass =
  "absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#4B232D]/58 transition hover:bg-[#4B232D]/8 hover:text-[#4B232D] focus:outline-none focus:ring-2 focus:ring-[#F5AE50]/45 md:right-4 md:h-9 md:w-9";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 md:h-5 md:w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 md:h-5 md:w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.7 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17.6 17.6 0 0 1-2.1 3.1" />
      <path d="M6.4 6.5C3.8 8.3 2.5 12 2.5 12s3.5 7 9.5 7a9.6 9.6 0 0 0 4.1-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M14.1 9.9A3 3 0 0 0 12 9" />
    </svg>
  );
}

function isValidEmail(value: string) {
  const cleanValue = value.trim();

  if (!cleanValue || cleanValue.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanValue);
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function isValidTurkishMobilePhone(value: string) {
  return /^0\d{10}$/.test(value);
}


function getStoredPendingDownloadReturnTo() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(pendingDownloadStorageKey) ?? "";
}

function getSearchParam(name: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get(name) ?? "";
}

function normalizeReturnTo(value: string | null) {
  const candidate = String(value ?? "").trim();

  if (!candidate) {
    return "";
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "";
  }

  if (candidate.includes("://")) {
    return "";
  }

  return candidate;
}

function getFallbackReturnTo() {
  return normalizeReturnTo(getStoredPendingDownloadReturnTo()) || "/hesabim";
}

export default function RegisterPage() {
  const router = useRouter();
  const { text } = useSiteTexts();

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [uyelikOnayi, setUyelikOnayi] = useState(false);
  const [bildirimIzni, setBildirimIzni] = useState(false);

  const [showSifre, setShowSifre] = useState(false);
  const [showSifreTekrar, setShowSifreTekrar] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  function getPostRegisterReturnTo() {
    return normalizeReturnTo(getSearchParam("returnTo")) || getFallbackReturnTo();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);

    const cleanAd = ad.trim();
    const cleanSoyad = soyad.trim();
    const cleanTelefon = normalizePhone(telefon);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanAd || !cleanSoyad || !cleanTelefon || !cleanEmail) {
      setMessage({
        type: "error",
        text: "Lütfen ad, soyad, telefon ve e-posta alanlarını doldur.",
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setMessage({
        type: "error",
        text: "Lütfen geçerli formatta bir e-posta adresi yaz.",
      });
      return;
    }

    if (!isValidTurkishMobilePhone(cleanTelefon)) {
      setMessage({
        type: "error",
        text: "Telefon numarası 0 ile başlamalı ve toplam 11 haneli olmalı. Örnek: 05XXXXXXXXX",
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

    const returnTo = getPostRegisterReturnTo();

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/confirm?returnTo=${encodeURIComponent(returnTo)}`
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
      router.push(returnTo);
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

      <section className="site-container relative pt-4 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-8 -z-0 hidden -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70 md:block">
          MUHAMMED
        </div>

        <section className="relative z-10 mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-5xl md:rounded-[38px] md:p-8">
          <div className="hidden text-center md:block">
            <p className="section-eyebrow">{text("register.eyebrow")}</p>

            <h1 className="mx-auto mt-2 max-w-[310px] text-[22px] font-semibold leading-[1.12] tracking-[-0.055em] text-[#4B232D] md:mt-4 md:max-w-4xl md:text-[clamp(25px,3.1vw,42px)] md:leading-[1.18]">
              <span className="block">{text("register.title")}</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-3 md:mt-7 md:gap-4">
            <div className="rounded-[22px] border border-white/42 bg-white/58 p-3.5 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[32px] md:p-5">
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <label className="grid gap-1.5 md:gap-2">
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

                <label className="grid gap-1.5 md:gap-2">
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

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>Telefonun</span>

                  <input
                    type="tel"
                    name="telefon"
                    autoComplete="tel"
                    inputMode="numeric"
                    placeholder="05xx xxx xx xx"
                    value={telefon}
                    onChange={(event) => setTelefon(event.target.value)}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1.5 md:gap-2">
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

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>Şifren</span>

                  <div className="relative w-full">
                    <input
                      type={showSifre ? "text" : "password"}
                      name="sifre"
                      autoComplete="new-password"
                      placeholder="En az 6 karakter"
                      value={sifre}
                      onChange={(event) => setSifre(event.target.value)}
                      required
                      className={passwordInputClass}
                    />

                    <button
                      type="button"
                      onClick={() => setShowSifre((current) => !current)}
                      className={passwordToggleClass}
                      aria-label={showSifre ? "Şifreyi gizle" : "Şifreyi göster"}
                      title={showSifre ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showSifre ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>Şifre tekrar</span>

                  <div className="relative w-full">
                    <input
                      type={showSifreTekrar ? "text" : "password"}
                      name="sifreTekrar"
                      autoComplete="new-password"
                      placeholder="Şifreni tekrar yaz"
                      value={sifreTekrar}
                      onChange={(event) => setSifreTekrar(event.target.value)}
                      required
                      className={passwordInputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowSifreTekrar((current) => !current)
                      }
                      className={passwordToggleClass}
                      aria-label={
                        showSifreTekrar ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                      title={
                        showSifreTekrar ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                    >
                      {showSifreTekrar ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid gap-2 rounded-[20px] border border-white/42 bg-white/58 p-3.5 text-[11.5px] font-semibold leading-5 text-[#4B232D]/76 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:gap-3 md:rounded-[26px] md:p-5 md:text-sm md:leading-7">
              <label className="flex items-start gap-2.5 md:gap-3">
                <input
                  type="checkbox"
                  checked={uyelikOnayi}
                  onChange={(event) => setUyelikOnayi(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#4B232D] md:mt-1"
                  required
                />

                <span>
                  {text("register.consent_text")}
                </span>
              </label>

              <label className="flex items-start gap-2.5 md:gap-3">
                <input
                  type="checkbox"
                  checked={bildirimIzni}
                  onChange={(event) => setBildirimIzni(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#4B232D] md:mt-1"
                />

                <span>
                  {text("register.notification_text")}
                </span>
              </label>
            </div>

            {message ? (
              <div
                className={[
                  "rounded-[18px] border px-4 py-3 text-[12px] font-semibold leading-6 shadow-[0_10px_28px_rgba(75,35,45,0.05)] md:rounded-[22px] md:px-5 md:py-4 md:text-sm md:leading-7",
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
                      href={`/giris?returnTo=${encodeURIComponent(getPostRegisterReturnTo())}`}
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

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Link
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("register.button.menu")}
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {isSubmitting ? "..." : text("register.button.submit")}
              </button>

              <Link
                href={`/giris?returnTo=${encodeURIComponent(getPostRegisterReturnTo())}`}
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("register.button.login")}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}