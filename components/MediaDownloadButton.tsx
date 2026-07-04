"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
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

const pendingDownloadStorageKey = "muhammed_pending_download_return_to";

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

function getCurrentSearchParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}

function getCurrentPathname(fallbackPathname: string) {
  if (typeof window === "undefined") {
    return fallbackPathname;
  }

  return window.location.pathname || fallbackPathname;
}

function buildDownloadReturnTo(
  fallbackPathname: string,
  contentType: MediaDownloadButtonProps["contentType"],
  slug: string,
) {
  const pathname = getCurrentPathname(fallbackPathname);
  const params = getCurrentSearchParams();

  params.set("download", "1");
  params.set("downloadType", contentType);
  params.set("downloadSlug", slug);

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function removeDownloadQueryParams(fallbackPathname: string) {
  const pathname = getCurrentPathname(fallbackPathname);
  const params = getCurrentSearchParams();

  params.delete("download");
  params.delete("downloadType");
  params.delete("downloadSlug");

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function savePendingDownload(returnTo: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(pendingDownloadStorageKey, returnTo);
}

function clearPendingDownload() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(pendingDownloadStorageKey);
}

function getAutoDownloadParams() {
  if (typeof window === "undefined") {
    return {
      download: "",
      downloadType: "",
      downloadSlug: "",
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    download: params.get("download") ?? "",
    downloadType: params.get("downloadType") ?? "",
    downloadSlug: params.get("downloadSlug") ?? "",
  };
}

export default function MediaDownloadButton({
  contentType,
  slug,
  title,
  hasAudioFile,
  hasVideoFile,
  className,
  label = "Ä°ndir",
}: MediaDownloadButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const autoStartedRef = useRef(false);

  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [panel, setPanel] = useState<PanelState>("none");
  const [message, setMessage] = useState("");

  const returnTo = buildDownloadReturnTo(pathname, contentType, slug);
  const loginHref = `/giris?returnTo=${encodeURIComponent(returnTo)}`;
  const registerHref = `/kayit?returnTo=${encodeURIComponent(returnTo)}`;

  const buttonLabel =
    status === "checking"
      ? "Kontrol..."
      : status === "downloading"
        ? "Ä°ndiriliyor..."
        : status === "downloaded"
          ? "Ä°ndirildi"
          : label;

  function closePanel() {
    setPanel("none");
  }

  function cleanDownloadQueryFromUrl() {
    const cleanPath = removeDownloadQueryParams(pathname);

    router.replace(cleanPath, {
      scroll: false,
    });
  }

  async function startDownload(format: DownloadFormat) {
    setPanel("none");
    setMessage("");
    setStatus("downloading");

    const accessToken = await getAccessToken();

    if (!accessToken) {
      setStatus("idle");
      savePendingDownload(returnTo);
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
      savePendingDownload(returnTo);
      setPanel("auth");
      return;
    }

    if (!response.ok || !result.ok || !result.url) {
      setStatus("idle");
      clearPendingDownload();
      setMessage(
        result.error ?? "Ä°ndirme baÅŸlatÄ±lamadÄ±. LÃ¼tfen biraz sonra tekrar dene.",
      );
      setPanel("message");
      return;
    }

    clearPendingDownload();
    triggerBrowserDownload(result.url, result.filename ?? `${title}.mp3`);
    setStatus("downloaded");
  }

  async function continueDownloadFlow() {
    const freshReturnTo = buildDownloadReturnTo(pathname, contentType, slug);

    setMessage("");
    setPanel("none");
    setStatus("checking");

    const accessToken = await getAccessToken();

    if (!accessToken) {
      setStatus("idle");
      savePendingDownload(freshReturnTo);
      setPanel("auth");
      return;
    }

    if (!hasAudioFile && !hasVideoFile) {
      setStatus("idle");
      clearPendingDownload();
      setMessage("Bu iÃ§erik iÃ§in indirme dosyasÄ± henÃ¼z eklenmedi.");
      setPanel("message");
      return;
    }

    setStatus("idle");

    if (hasAudioFile && hasVideoFile) {
      clearPendingDownload();
      setPanel("choice");
      return;
    }

    if (hasVideoFile) {
      await startDownload("video");
      return;
    }

    await startDownload("audio");
  }

  async function handleClick() {
    await continueDownloadFlow();
  }

  useEffect(() => {
    if (autoStartedRef.current) {
      return;
    }

    const autoDownloadParams = getAutoDownloadParams();

    const shouldAutoStart =
      autoDownloadParams.download === "1" &&
      autoDownloadParams.downloadType === contentType &&
      autoDownloadParams.downloadSlug === slug;

    if (!shouldAutoStart) {
      return;
    }

    autoStartedRef.current = true;
    cleanDownloadQueryFromUrl();
    void continueDownloadFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, slug]);

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
            aria-label="Ä°ndirme penceresini kapat"
            className={modalBackdropClass}
            onClick={closePanel}
          />

          <div className={modalCardClass}>
            {panel === "auth" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  Ãœyelik Gerekli
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:text-[32px]">
                  KayÄ±t olman gerekiyor.
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-6 text-[#4B232D]/68 md:text-[13px] md:leading-7">
                  ÅarkÄ±larÄ±n tam halini indirmek iÃ§in kayÄ±t olun veya hesabÄ±na
                  giriÅŸ yap.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={loginHref}
                    className={`${choiceButtonClass} bg-white text-[#4B232D] shadow-[0_8px_18px_rgba(75,35,45,0.08)]`}
                  >
                    GiriÅŸ Yap
                  </Link>

                  <Link
                    href={registerHref}
                    className={`${choiceButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]`}
                  >
                    KayÄ±t Ol
                  </Link>
                </div>
              </>
            ) : null}

            {panel === "choice" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  Ä°ndirme SeÃ§imi
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.075em] text-[#4B232D] md:text-[32px]">
                  Ne olarak indirmek istiyorsun?
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-6 text-[#4B232D]/68 md:text-[13px] md:leading-7">
                  Bu iÃ§erik iÃ§in ses ve video dosyasÄ± mevcut.
                </p>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => startDownload("audio")}
                    className={`${choiceButtonClass} bg-[#F5AE50] text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]`}
                  >
                    Ses dosyasÄ± indir
                  </button>

                  <button
                    type="button"
                    onClick={() => startDownload("video")}
                    className={`${choiceButtonClass} bg-[#4B232D] text-white shadow-[0_8px_18px_rgba(75,35,45,0.16)]`}
                  >
                    Video dosyasÄ± indir
                  </button>
                </div>
              </>
            ) : null}

            {panel === "message" ? (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B232D]/62">
                  Ä°ndirme
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
