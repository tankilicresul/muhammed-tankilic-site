"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "min-h-14 w-full rounded-[22px] border border-[#4B232D]/12 bg-white/82 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_12px_34px_rgba(75,35,45,0.06)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]";

const passwordInputClass = `${inputClass} pr-14`;

const labelClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/64";

const actionButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-bold shadow-[0_16px_36px_rgba(75,35,45,0.16)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const passwordToggleClass =
  "absolute right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#4B232D]/58 transition hover:bg-[#4B232D]/8 hover:text-[#4B232D] focus:outline-none focus:ring-2 focus:ring-[#F5AE50]/45";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
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
      className="h-5 w-5"
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

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text: "Bu mail ile giriş yapılamadı. Hesabın yoksa kayıt ol.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "Giriş başarılı. Hesabına yönlendiriliyorsun.",
    });

    router.refresh();
    router.push("/hesabim");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
      <div className="rounded-[32px] border border-white/42 bg-white/58 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
        <div className="grid gap-4 md:grid-cols-2">
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

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Şifreni yaz"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className={passwordInputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className={passwordToggleClass}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
          {message.type === "error" ? (
            <span>
              Bu mail ile giriş yapılamadı. Hesabın yoksa{" "}
              <Link
                href="/kayit"
                className="font-extrabold underline decoration-red-300 underline-offset-4 transition hover:text-[#4B232D]"
              >
                Kayıt Ol
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
          href="/sarkilarim"
          className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
        >
          ← Şarkılarım
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <Link
          href="/coverlarim"
          className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
        >
          Coverlarım →
        </Link>
      </div>
    </form>
  );
}