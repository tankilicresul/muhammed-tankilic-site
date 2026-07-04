"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DownloadFormat = "audio" | "video";
type DownloadStatus = "idle" | "downloading" | "downloaded";

type MediaDownloadButtonProps = {
  contentType: "song" | "cover";
  slug: string;
  title: string;
  hasAudioFile: boolean;
  hasVideoFile: boolean;
  className: string;
  label?: string;
};

type DownloadResponse = {
  ok?: boolean;
  url?: string;
  filename?: string;
  error?: string;
};

const panelClass =
  "absolute left-0 top-[calc(100%+10px)] z-40 w-[min(330px,calc(100vw-32px))] rounded-[22px] border border-white/45 bg-white/92 p-4 text-left shadow-[0_18px_50px_rgba(75,35,45,0.16)] backdrop-blur-[18px]";

const choiceButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-center text-[12px] font-bold tracking-[-0.015em] transition hover:-translate-y-0.5";

function triggerBrowserDownload(url: string, filename: string) {
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noreferrer";
  anchor.target = "_blank";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export default function MediaDownloadButton({
  contentType,
  slug,
  title,
  hasAudioFile,
  hasVideoFile,
  className,
  label = "İndir",
}: MediaDownloadButtonProps) {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [panel, setPanel] = useState<"none" | "auth" | "choice" | "message">(
    "none",
  );
  const [message, setMessage] = useState("");

  const buttonLabel =
    status === "downloading"
      ? "İndiriliyor..."
      : status === "downloaded"
        ? "İndirildi"
        : label;

  async function startDownload(format: DownloadFormat) {
    setPanel("none");
    setMessage("");
    setStatus("downloading");

    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setStatus("idle");
      setPanel("auth");
      return;
    }

    const response = await fetch("/api/download/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        contentType,
        slug,
        format,
      }),
    });

    const result = (await response.json()) as DownloadResponse;

    if (response.status === 401) {
      setStatus("idle");
      setPanel("auth");
      return;
    }

    if (!response.ok || !result.ok || !result.url) {
      setStatus("idle");
      setMessage(
        result.error ?? "İndirme başlatılamadı. Lütfen biraz sonra tekrar dene.",
      );
      setPanel("message");
      return;
    }

    triggerBrowserDownload(result.url, result.filename ?? `${title}.mp3`);
    setStatus("downloaded");
  }

  function handleClick() {
    if (!hasAudioFile && !hasVideoFile) {
      setMessage("Bu içerik için indirme dosyası henüz eklenmedi.");
      setPanel("message");
      return;
    }

    if (hasAudioFile && hasVideoFile) {
      setPanel((current) => (current === "choice" ? "none" : "choice"));
      return;
    }

    if (hasVideoFile) {
      void startDownload("video");
      return;
    }

    void startDownload("audio");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "downloading"}
        className={className}
      >
        {buttonLabel}
      </button>

      {panel === "auth" ? (
        <div className={panelClass}>
          <p className="text-[12px] font-semibold leading-6 text-[#4B232D]">
            Şarkıların tam halini indirmek için kayıt olun.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/giris"
              className={`${choiceButtonClass} bg-white text-[#4B232D] shadow-[0_8px_18px_rgba(75,35,45,0.08)]`}
            >
              Giriş Yap
            </Link>

            <Link
              href="/kayit"
              className={`${choiceButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]`}
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      ) : null}

      {panel === "choice" ? (
        <div className={panelClass}>
          <p className="text-[12px] font-semibold leading-6 text-[#4B232D]">
            Ne olarak indirmek istiyorsun?
          </p>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => startDownload("audio")}
              className={`${choiceButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]`}
            >
              Ses dosyası indir
            </button>

            <button
              type="button"
              onClick={() => startDownload("video")}
              className={`${choiceButtonClass} bg-[#4B232D] text-white shadow-[0_8px_18px_rgba(75,35,45,0.16)]`}
            >
              Video dosyası indir
            </button>
          </div>
        </div>
      ) : null}

      {panel === "message" ? (
        <div className={panelClass}>
          <p className="text-[12px] font-semibold leading-6 text-[#4B232D]">
            {message}
          </p>

          <button
            type="button"
            onClick={() => setPanel("none")}
            className={`${choiceButtonClass} mt-3 bg-white text-[#4B232D] shadow-[0_8px_18px_rgba(75,35,45,0.08)]`}
          >
            Tamam
          </button>
        </div>
      ) : null}
    </div>
  );
}
