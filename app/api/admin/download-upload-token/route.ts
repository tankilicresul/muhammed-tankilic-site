import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkIsAdmin } from "@/lib/admin/is-admin";

type UploadTokenRequestBody = {
  contentType?: "songs" | "covers";
  fileKind?: "audio" | "video";
  baseSlug?: string;
  fileName?: string;
  fileSize?: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const audioExtensions = new Set(["mp3", "wav", "m4a", "aac", "flac", "ogg"]);
const videoExtensions = new Set(["mp4", "mov", "m4v", "webm"]);

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeSlug(value: string) {
  return value
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
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function getExtension(fileName: string) {
  const cleanName = fileName.split("?")[0] ?? fileName;
  const extension = cleanName.split(".").pop()?.toLocaleLowerCase("tr-TR") ?? "";

  return extension.replace(/[^a-z0-9]/g, "");
}

function validateFile(
  fileKind: "audio" | "video",
  fileName: string,
  fileSize: number,
) {
  const extension = getExtension(fileName);

  if (!extension) {
    return "Dosya uzantısı okunamadı.";
  }

  if (fileKind === "audio" && !audioExtensions.has(extension)) {
    return "Ses dosyası için MP3, WAV, M4A, AAC, FLAC veya OGG yükleyebilirsin.";
  }

  if (fileKind === "video" && !videoExtensions.has(extension)) {
    return "Video dosyası için MP4, MOV, M4V veya WEBM yükleyebilirsin.";
  }

  const maxAudioSize = 80 * 1024 * 1024;
  const maxVideoSize = 500 * 1024 * 1024;

  if (fileKind === "audio" && fileSize > maxAudioSize) {
    return "Ses dosyası en fazla 80 MB olabilir.";
  }

  if (fileKind === "video" && fileSize > maxVideoSize) {
    return "Video dosyası en fazla 500 MB olabilir.";
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const admin = await checkIsAdmin();

    if (!admin.userId) {
      return jsonError("Dosya yüklemek için giriş yapmalısın.", 401);
    }

    if (!admin.isAdmin) {
      return jsonError("Bu işlem için admin yetkisi gerekiyor.", 403);
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonError(
        "Sunucu dosya yükleme ayarı eksik. SUPABASE_SERVICE_ROLE_KEY kontrol edilmeli.",
        500,
      );
    }

    const body = (await request.json()) as UploadTokenRequestBody;
    const contentType = body.contentType;
    const fileKind = body.fileKind;
    const baseSlug = normalizeSlug(body.baseSlug ?? "");
    const fileName = String(body.fileName ?? "").trim();
    const fileSize = Number(body.fileSize ?? 0);

    if (contentType !== "songs" && contentType !== "covers") {
      return jsonError("Geçersiz içerik türü.", 400);
    }

    if (fileKind !== "audio" && fileKind !== "video") {
      return jsonError("Geçersiz dosya türü.", 400);
    }

    if (!baseSlug) {
      return jsonError("Dosya yüklemek için önce başlık veya slug gir.", 400);
    }

    const validationError = validateFile(fileKind, fileName, fileSize);

    if (validationError) {
      return jsonError(validationError, 400);
    }

    const extension = getExtension(fileName);
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const objectPath = `${contentType}/${baseSlug}/${fileKind}-${Date.now()}.${extension}`;

    const { data, error } = await supabaseAdmin.storage
      .from("downloads")
      .createSignedUploadUrl(objectPath, {
        upsert: true,
      });

    if (error || !data?.token) {
      return jsonError(
        error?.message ?? "Yükleme bağlantısı oluşturulamadı.",
        500,
      );
    }

    return NextResponse.json({
      ok: true,
      bucket: "downloads",
      objectPath,
      storagePath: `downloads/${objectPath}`,
      token: data.token,
    });
  } catch {
    return jsonError(
      "Beklenmeyen bir hata oluştu. Lütfen biraz sonra tekrar dene.",
      500,
    );
  }
}
