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

export default function NewPasswordPage() {
  const router = useRouter();
  const { text } = useSiteTexts();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: text("new_password.error_short"),
      });
      return;
    }

    if (password !== passwordAgain) {
      setMessage({
        type: "error",
        text: text("new_password.error_mismatch"),
      });
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text: text("new_password.error_update"),
      });
      return;
    }

    const response = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        password,
      }),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      message?: string;
      error?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !result.ok) {
      setMessage({
        type: "error",
        text: result.error ?? text("new_password.error_update"),
      });
      return;
    }

    setMessage({
      type: "success",
      text: text("new_password.success"),
    });

    await supabase.auth.signOut();

    setTimeout(() => {
      router.refresh();
      router.push("/giris");
    }, 900);
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-50 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-8 -z-0 hidden -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70 md:block">
          MUHAMMED
        </div>

        <section className="relative z-10 mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-5xl md:rounded-[38px] md:p-8">
          <div className="hidden text-center md:block">
            <p className="section-eyebrow">{text("new_password.eyebrow")}</p>

            <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(25px,3.1vw,42px)] font-semibold leading-[1.18] tracking-[-0.055em] text-[#4B232D]">
              <span className="block">{text("new_password.title_line_1")}</span>
              <span className="block">
                <span className="text-[#6F3440]">
                  {text("new_password.title_line_2")}
                </span>
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3 md:mt-7 md:gap-4">
            <div className="rounded-[22px] border border-white/42 bg-white/58 p-3.5 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[32px] md:p-5">
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("new_password.label.password")}
                  </span>

                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      placeholder={text("new_password.placeholder.password")}
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

                <label className="grid gap-1.5 md:gap-2">
                  <span className={labelClass}>
                    {text("new_password.label.password_repeat")}
                  </span>

                  <div className="relative w-full">
                    <input
                      type={showPasswordAgain ? "text" : "password"}
                      name="passwordAgain"
                      autoComplete="new-password"
                      placeholder={text(
                        "new_password.placeholder.password_repeat",
                      )}
                      value={passwordAgain}
                      onChange={(event) => setPasswordAgain(event.target.value)}
                      required
                      className={passwordInputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordAgain((current) => !current)
                      }
                      className={passwordToggleClass}
                      aria-label={
                        showPasswordAgain ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                      title={
                        showPasswordAgain ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                    >
                      {showPasswordAgain ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
              </div>
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
                {message.text}
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Link
                href="/giris"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("new_password.button.login")}
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {isSubmitting
                  ? text("new_password.button.saving")
                  : text("new_password.button.submit")}
              </button>

              <Link
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("new_password.button.menu")}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
