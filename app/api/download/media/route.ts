import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ContentType = "song" | "cover";
type DownloadFormat = "audio" | "video";

type DownloadRequestBody = {
  contentType?: ContentType;
  slug?: string;
  format?: DownloadFormat;
};

type DownloadRow = {
  id: string;
  slug: string | null;
  title: string | null;
  release_status: string | null;
  download_file_path: string | null;
  video_download_file_path: string | null;
};

type StorageSigningClient = {
  storage: {
    from: (bucket: string) => {
      createSignedUrl: (
        path: string,
        expiresIn: number,
      ) => Promise<{
        data: {
          signedUrl: string;
        } | null;
        error: unknown;
      }>;
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    { status },
  );
}

function sanitizeFilename(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getExtensionFromPath(path: string, fallback: string) {
  try {
    const parsedUrl = new URL(path);
    const urlExtension = parsedUrl.pathname.split(".").pop();

    if (urlExtension && urlExtension.length <= 8) {
      return urlExtension;
    }
  } catch {
    const cleanPath = path.split("?")[0] ?? path;
    const extension = cleanPath.split(".").pop();

    if (extension && extension.length <= 8 && extension !== cleanPath) {
      return extension;
    }
  }

  return fallback;
}

function getFileName(title: string, format: DownloadFormat, path: string) {
  const baseName = sanitizeFilename(title || "muhammed-tankilic");
  const fallbackExtension = format === "video" ? "mp4" : "mp3";
  const extension = getExtensionFromPath(path, fallbackExtension);

  return `${baseName}.${extension}`;
}

function parseSupabaseStoragePublicUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const marker = "/storage/v1/object/public/";

    if (!parsedUrl.pathname.includes(marker)) {
      return null;
    }

    const [, storagePath = ""] = parsedUrl.pathname.split(marker);
    const [bucket, ...objectParts] = storagePath.split("/").filter(Boolean);

    if (!bucket || objectParts.length === 0) {
      return null;
    }

    return {
      bucket,
      objectPath: objectParts.join("/"),
    };
  } catch {
    return null;
  }
}

async function resolveDownloadUrl(
  supabaseAdmin: StorageSigningClient,
  rawPath: string,
) {
  const value = rawPath.trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    const storagePath = parseSupabaseStoragePublicUrl(value);

    if (storagePath) {
      const { data, error } = await supabaseAdmin.storage
        .from(storagePath.bucket)
        .createSignedUrl(storagePath.objectPath, 300);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    }

    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  const cleanedPath = value.replace(/^public\//, "").replace(/^\/+/, "");

  if (!cleanedPath) {
    return "";
  }

  const [bucket, ...objectParts] = cleanedPath.split("/").filter(Boolean);

  if (bucket && objectParts.length > 0) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(objectParts.join("/"), 300);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  return `/${cleanedPath}`;
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return jsonError(
        "Sunucu indirme ayarı eksik. Lütfen yöneticiyle iletişime geç.",
        500,
      );
    }

    const authorizationHeader = request.headers.get("authorization");
    const accessToken = authorizationHeader?.replace("Bearer ", "").trim();

    if (!accessToken) {
      return jsonError("Şarkıların tam halini indirmek için kayıt olun.", 401);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !userData.user) {
      return jsonError("Şarkıların tam halini indirmek için kayıt olun.", 401);
    }

    const body = (await request.json()) as DownloadRequestBody;
    const contentType = body.contentType;
    const slug = String(body.slug ?? "").trim();
    const format = body.format;

    if (contentType !== "song" && contentType !== "cover") {
      return jsonError("Geçersiz indirme türü.", 400);
    }

    if (format !== "audio" && format !== "video") {
      return jsonError("Geçersiz dosya formatı.", 400);
    }

    if (!slug) {
      return jsonError("İndirilecek içerik bulunamadı.", 400);
    }

    const tableName = contentType === "song" ? "songs" : "covers";

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select(
        "id, slug, title, release_status, download_file_path, video_download_file_path",
      )
      .eq("slug", slug)
      .eq("release_status", "published")
      .maybeSingle();

    if (error) {
      return jsonError(
        "İndirme dosyası kontrol edilemedi. Lütfen biraz sonra tekrar dene.",
        500,
      );
    }

    if (!data) {
      return jsonError("İndirilecek içerik bulunamadı.", 404);
    }

    const row = data as DownloadRow;
    const filePath =
      format === "video" ? row.video_download_file_path : row.download_file_path;

    if (!filePath) {
      return jsonError("Bu içerik için indirme dosyası henüz eklenmedi.", 404);
    }

    const filename = getFileName(row.title ?? slug, format, filePath);
    const downloadUrl = await resolveDownloadUrl(supabaseAdmin, filePath);

    if (!downloadUrl) {
      return jsonError("İndirme bağlantısı oluşturulamadı.", 500);
    }

    return NextResponse.json({
      ok: true,
      url: downloadUrl,
      filename,
      format,
    });
  } catch {
    return jsonError(
      "Beklenmeyen bir hata oluştu. Lütfen biraz sonra tekrar dene.",
      500,
    );
  }
}
