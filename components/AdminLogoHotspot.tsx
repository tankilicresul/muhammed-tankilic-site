"use client";

import { MouseEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AdminLogoHotspotProps = {
  className?: string;
};

export default function AdminLogoHotspot({
  className = "",
}: AdminLogoHotspotProps) {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);

    window.setTimeout(() => {
      setMessage(null);
    }, 3200);
  }

  async function checkAdminAccess() {
    setIsChecking(true);

    try {
      const response = await fetch("/api/admin/hotspot", {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as {
        status: "ok" | "unauthenticated" | "forbidden";
        message?: string;
        redirectTo?: string;
      };

      if (result.status === "ok" && result.redirectTo) {
        router.push(result.redirectTo);
        return;
      }

      showMessage(
        result.message ??
          "Admin paneli şu anda açılamadı. Lütfen tekrar deneyin.",
      );
    } catch {
      showMessage(
        "Admin paneli şu anda kontrol edilemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsChecking(false);
    }
  }

  function handleClick(event: MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isChecking) {
      return;
    }

    clickCountRef.current += 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 1800);

    if (clickCountRef.current >= 4) {
      clickCountRef.current = 0;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      void checkAdminAccess();
    }
  }

  return (
    <>
      <span
        role="button"
        tabIndex={-1}
        aria-label="Admin paneli gizli erişim alanı"
        onClick={handleClick}
        className={`absolute inset-0 z-20 cursor-default rounded-full bg-transparent ${className}`}
      />

      {message ? (
        <div className="fixed left-1/2 top-24 z-[999] w-[min(92vw,420px)] -translate-x-1/2 rounded-[22px] border border-[#4B232D]/12 bg-white/90 px-5 py-4 text-center text-[12px] font-bold leading-6 text-[#4B232D] shadow-[0_18px_50px_rgba(75,35,45,0.16)] backdrop-blur-[18px]">
          {message}
        </div>
      ) : null}
    </>
  );
}