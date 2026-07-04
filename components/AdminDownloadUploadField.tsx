"use client";

import { ChangeEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

type AdminDownloadUploadFieldProps = {
  label: string;
  fieldName: "download_file_path" | "video_download_file_path";
  contentType: "songs" | "covers";
  fileKind: "audio" | "video";
  defaultValue?: string | null;
  placeholder: string;
};

type UploadTokenResponse = {
  ok?: boolean;
  bucket?: string;
  objectPath?: string;
  storagePath?: string;
  token?: string;
  error?: string;
};

const acceptedAudioTypes = ".mp3,.wav,.m4a,.aac,.flac,.ogg,audio/*";
const acceptedVideoTypes = ".mp4,.mov,.m4v,.webm,video/*";

function createSlugFromTitle(title: string) {
  return title
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readInputValue(form: HTMLFormElement | null, name: string) {
  const element = form?.elements.namedItem(name);

  if (element instanceof HTMLInputElement) {
    return element.value.trim();
  }

  if (element instanceof HTMLTextAreaElement) {
    return element.value.trim();
  }

  return "";
}

function formatSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminDownloadUploadField({
  label,
  fieldName,
  contentType,
  fileKind,
  defaultValue,
  placeholder,
}: AdminDownloadUploadFieldProps) {
  const pathInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");

  const accept = fileKind === "audio" ? acceptedAudioTypes : acceptedVideoTypes;
  const helperText =
    fileKind === "audio"
      ? "MP3, WAV, M4A, AAC, FLAC veya OGG dosyası seç."
      : "MP4, MOV, M4V veya WEBM dosyası seç.";

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStatus("uploading");
    setMessage(`${file.name} yükleniyor...`);

    try {
      const form = event.currentTarget.form;
      const manualSlug = readInputValue(form, "slug");
      const title = readInputValue(form, "title");
      const baseSlug = createSlugFromTitle(manualSlug || title);

      if (!baseSlug) {
        setStatus("error");
        setMessage("Önce başlık veya slug gir, sonra dosya seç.");
        event.currentTarget.value = "";
        return;
      }

      const tokenResponse = await fetch("/api/admin/download-upload-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          fileKind,
          baseSlug,
          fileName: file.name,
          fileSize: file.size,
        }),
      });

      const tokenResult =
        (await tokenResponse.json()) as UploadTokenResponse;

      if (
        !tokenResponse.ok ||
        !tokenResult.ok ||
        !tokenResult.bucket ||
        !tokenResult.objectPath ||
        !tokenResult.token ||
        !tokenResult.storagePath
      ) {
        setStatus("error");
        setMessage(
          tokenResult.error ??
            "Yükleme bağlantısı alınamadı. Lütfen tekrar dene.",
        );
        event.currentTarget.value = "";
        return;
      }

      const supabase = createClient();

      const { error } = await supabase.storage
        .from(tokenResult.bucket)
        .uploadToSignedUrl(tokenResult.objectPath, tokenResult.token, file);

      if (error) {
        setStatus("error");
        setMessage(error.message);
        event.currentTarget.value = "";
        return;
      }

      if (pathInputRef.current) {
        pathInputRef.current.value = tokenResult.storagePath;
      }

      setStatus("uploaded");
      setMessage(
        `Yüklendi: ${tokenResult.storagePath} (${formatSize(file.size)})`,
      );
    } catch {
      setStatus("error");
      setMessage("Yükleme sırasında beklenmeyen bir hata oluştu.");
      event.currentTarget.value = "";
    }
  }

  return (
    <div className="grid gap-2 rounded-[20px] border border-[#4B232D]/10 bg-white/50 p-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B232D]/55">
        {label}
      </span>

      <input
        ref={pathInputRef}
        name={fieldName}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="min-h-11 rounded-[16px] border border-[#4B232D]/10 bg-white/78 px-4 text-xs font-medium text-[#4B232D] outline-none transition placeholder:text-[#4B232D]/35 focus:border-[#4B232D]/35 md:text-sm"
      />

      <label className="grid cursor-pointer gap-2 rounded-[16px] border border-dashed border-[#4B232D]/18 bg-[#FFF4BC]/36 p-3 transition hover:bg-[#FFF4BC]/52">
        <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#F5AE50] px-4 text-center text-xs font-bold text-[#4B232D] shadow-[0_8px_18px_rgba(245,174,80,0.18)]">
          Dosya Seç ve Yükle
        </span>

        <span className="text-center text-[11px] font-medium leading-5 text-[#4B232D]/58">
          {helperText}
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>

      {message ? (
        <p
          className={[
            "rounded-[14px] px-3 py-2 text-[11px] font-semibold leading-5",
            status === "error"
              ? "bg-red-50 text-red-700"
              : status === "uploaded"
                ? "bg-[#BDEBE8]/55 text-[#4B232D]"
                : "bg-white/70 text-[#4B232D]/65",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
