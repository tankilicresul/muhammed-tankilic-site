"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DownloadFormat = "audio" | "video";
type DownloadStatus = "idle" | "checking" | "downloading" | "downloaded";
type PanelState = "none" | "auth" | "choice" | "message";

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

const modalBackdropClass =
  "fixed inset-0 z-[9998] bg-[#4B232D]/14 backdrop-blur-[2px]";

const modalCardClass =
  "fixed left-1/2 top-1/2 z-[9999] w-[min(340px,calc(100vw-44px))] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-white/55 bg-white/95 p-4 text-left shadow-[0_22px_70px_rgba(75,35,45,0.22)] backdrop-blur-[18px] md:w-[min(390px,calc(100vw-44px))] md:rounded-[28px] md:p-5";

const choiceButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-center text-[12px] font-bold tracking-[-0.015em] transition hover:-translate-y-0.5 md:min-h-11 md:text-sm";

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

async function getAccessToken() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? "";
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
  const [panel, setPanel] = useState<PanelState>("none");
  const [message, setMessage] = useState("");

  const buttonLabel =
    status === "checking"
      ? "Kontrol..."
      : status === "downloading"
        ? "İndiriliyor..."
        : status === "downloaded"
          ? "İndirildi"
          : label;

  function closePanel() {
    setPanel("none");
  }

  async function startDownload(format: DownloadFormat) {
    setPanel("none");
    setMessage("");
    setStatus("downloading");

    const accessToken = await getAccessToken();

    if (!accessToken) {
      setStatus("idle");
      setPanel("auth");
      return;
    }

    const response = await fetch("/api/download/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

  async function handleClick() {
    setMessage("");
    setPanel("none");
    setStatus("checking");

    const accessToken = await getAccessToken();

    if (!accessToken) {
      setStatus("idle");
      setPanel("auth");
      return;
    }

    if (!hasAudioFile && !hasVideoFile) {
      setStatus("idle");
      setMessage("Bu içerik için indirme dosyası henüz eklenmedi.");
      setPanel("message");
      return;
    }

    setStatus("idle");

    if (hasAudioFile && hasVideoFile) {
      setPanel("choice");
      return;
    }

    if (hasVideoFile) {
      await startDownload("video");
      return;
    }

    await startDownload("audio");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "checking" || status === "downloading"}
        className={className}
      >
        {buttonLabel}
      </button>

      {panel !== "none" ? (
        <>
          <button
            type="button"
            aria-label="İndirme penceresini kapat"
            className={modalBackdropClass}
            onClick={closePanel}
          />

          <div className={modalCardClass}>
            {panel === "auth" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  Üyelik Gerekli
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:text-[32px]">
                  Kayıt olman gerekiyor.
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-6 text-[#4B232D]/68 md:text-[13px] md:leading-7">
                  Şarkıların tam halini indirmek için kayıt olun veya hesabına
                  giriş yap.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
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
              </>
            ) : null}

            {panel === "choice" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  İndirme Seçimi
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:text-[32px]">
                  Ne olarak indirmek istiyorsun?
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-6 text-[#4B232D]/68 md:text-[13px] md:leading-7">
                  Bu içerik için ses ve video dosyası mevcut.
                </p>

                <div className="mt-4 grid gap-2">
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
              </>
            ) : null}

            {panel === "message" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  İndirme
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:text-[32px]">
                  Bilgi
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-6 text-[#4B232D]/68 md:text-[13px] md:leading-7">
                  {message}
                </p>

                <button
                  type="button"
                  onClick={closePanel}
                  className={`${choiceButtonClass} mt-4 bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]`}
                >
                  Tamam
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}
