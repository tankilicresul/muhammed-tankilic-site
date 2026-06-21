"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        text: "E-posta veya şifre hatalı. Bilgilerini kontrol edip tekrar dene.",
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
    <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
      <label className="grid gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/64">
          E-postan
        </span>

        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="ornek@mail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="min-h-14 rounded-[22px] border border-[#4B232D]/12 bg-white/82 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_12px_34px_rgba(75,35,45,0.06)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B232D]/64">
          Şifren
        </span>

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Şifreni yaz"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="min-h-14 rounded-[22px] border border-[#4B232D]/12 bg-white/82 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_12px_34px_rgba(75,35,45,0.06)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
        />
      </label>

      {message ? (
        <div
          className={[
            "rounded-[20px] border px-5 py-4 text-sm font-semibold leading-7 shadow-[0_10px_28px_rgba(75,35,45,0.05)]",
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#BDEBE8]/80 bg-[#BDEBE8]/45 text-[#4B232D]",
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 min-h-14 rounded-full bg-[#4B232D] px-6 text-sm font-bold text-white shadow-[0_16px_36px_rgba(75,35,45,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}