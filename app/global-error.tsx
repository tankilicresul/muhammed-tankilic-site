"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <main className="page-shell">
          <section className="site-container flex min-h-screen items-center justify-center py-12">
            <div className="soft-card w-full max-w-3xl p-7 text-center md:p-10">
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-(--burgundy) text-lg font-black text-white">
                MT
              </div>

              <p className="section-eyebrow">Beklenmeyen Hata</p>

              <h1 className="font-serif text-5xl font-bold leading-none tracking-tighter text-(--burgundy) md:text-7xl">
                Bir şey ters gitti.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[rgba(75,35,45,0.7)] md:text-base md:leading-8">
                Sayfa yüklenirken beklenmeyen bir hata oluştu. Tekrar deneyebilir
                veya ana sayfaya dönebilirsin.
              </p>

              {error.digest && (
                <p className="mx-auto mt-5 w-fit rounded-[25px] border border-[rgba(75,35,45,0.08)] bg-(--mint-soft) px-4 py-2 text-xs font-bold text-(--burgundy)">
                  Hata kodu: {error.digest}
                </p>
              )}

              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <button type="button" onClick={reset} className="pill-button">
                  Tekrar Dene
                </button>

                <Link href="/" className="pill-button secondary">
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}