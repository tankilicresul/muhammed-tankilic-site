"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { useSiteTexts } from "@/lib/supabase/site-texts-client";

type Message = {
  type: "error" | "success";
  text: string;
};

const inputClass =
  "min-h-11 w-full rounded-[18px] border border-[#4B232D]/12 bg-white/82 px-4 text-[13px] font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_8px_24px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,174,80,0.16)] md:min-h-14 md:rounded-[22px] md:px-5 md:text-base";

const labelClass =
  "text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64 md:text-[10px] md:tracking-[0.2em]";

const actionButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full px-2 text-center text-[10.5px] font-bold leading-none tracking-[-0.015em] shadow-[0_10px_24px_rgba(75,35,45,0.13)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:min-h-12 md:px-5 md:text-sm";

export default function ForgotPasswordPage() {
  const { text } = useSiteTexts();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage({
        type: "error",
        text: text("forgot.error_empty"),
      });
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/yeni-sifre`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage({
        type: "error",
        text: text("forgot.error_send"),
      });
      return;
    }

    setMessage({
      type: "success",
      text: text("forgot.success"),
    });
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
            <p className="section-eyebrow">{text("forgot.eyebrow")}</p>

            <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(25px,3.1vw,42px)] font-semibold leading-[1.18] tracking-[-0.055em] text-[#4B232D]">
              <span className="block">{text("forgot.title_line_1")}</span>
              <span className="block">{text("forgot.title_line_2")}</span>
              <span className="block">
                <span className="text-[#6F3440]">
                  {text("forgot.title_line_3")}
                </span>
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3 md:mt-7 md:gap-4">
            <div className="rounded-[22px] border border-white/42 bg-white/58 p-3.5 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:rounded-[32px] md:p-5">
              <label className="grid gap-1.5 md:gap-2">
                <span className={labelClass}>{text("forgot.email_label")}</span>

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={text("forgot.email_placeholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={inputClass}
                />
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
                {message.text}
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Link
                href="/giris"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("forgot.button.login")}
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${actionButtonClass} bg-[#4B232D] text-white hover:bg-[#5a2b36]`}
              >
                {isSubmitting ? "..." : text("forgot.button.submit")}
              </button>

              <Link
                href="/"
                className={`${actionButtonClass} bg-[#F5AE50] text-[#4B232D] hover:bg-[#f7bb67]`}
              >
                {text("forgot.button.menu")}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
