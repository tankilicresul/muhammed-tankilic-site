import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type CoverRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  release_status: "draft" | "published" | "hidden";
  youtube_url: string | null;
  youtube_embed_url: string | null;
  instagram_url: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
  media_type: "photo" | "video";
  video_url: string | null;
  video_embed_url: string | null;
  thumbnail_url: string | null;
  release_status: "draft" | "published" | "hidden";
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

export type HomepageSong = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  description: string | null;
  release_status: "draft" | "published" | "hidden";
  spotify_url: string | null;
  spotify_embed_url: string | null;
  apple_music_url: string | null;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  cover_image_path: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
};

export type HomepageAnnouncement = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

type SiteTextRow = {
  key: string;
  value: string;
};

const announcementKeys = [
  "homepage_announcement_eyebrow",
  "homepage_announcement_title",
  "homepage_announcement_description",
  "homepage_announcement_target_type",
  "homepage_announcement_target_id",
  "homepage_announcement_target_url",
  "homepage_announcement_is_active",
];

function createPublicClient() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL eksik.");
  }

  if (!supabaseKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY veya NEXT_PUBLIC_SUPABASE_ANON_KEY eksik.",
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function normalizeSpotifyEmbedUrl(
  spotifyUrl: string | null,
  spotifyEmbedUrl: string | null,
) {
  const embed = String(spotifyEmbedUrl ?? "").trim();

  if (embed) {
    return embed;
  }

  const url = String(spotifyUrl ?? "").trim();

  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    const typeIndex = pathParts.findIndex((part) =>
      ["track", "album", "playlist", "artist", "episode", "show"].includes(part),
    );

    if (typeIndex === -1 || !pathParts[typeIndex + 1]) {
      return null;
    }

    return `https://open.spotify.com/embed/${pathParts[typeIndex]}/${pathParts[typeIndex + 1]}?utm_source=generator`;
  } catch {
    return null;
  }
}

function getFallbackAnnouncement(song: HomepageSong | null): HomepageAnnouncement {
  if (song) {
    return {
      eyebrow: "Yeni Şarkım Çıktı",
      title: `${song.title} yayında.`,
      description: "Spotify ve Apple Music’te dinleyebilirsin.",
      href: `/sarkilarim/${song.slug}`,
    };
  }

  return {
    eyebrow: "Duyuru",
    title: "Muhammed Tankılıç’ın müzikleri burada.",
    description:
      "Şarkılarımı, cover yorumlarımı ve fotoğraflarımı buradan takip edebilirsin.",
    href: "/sarkilarim",
  };
}

function mapSettings(rows: SiteTextRow[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value ?? "";
    return acc;
  }, {});
}

function mapAnnouncement(
  rows: SiteTextRow[],
  fallbackSong: HomepageSong | null,
): HomepageAnnouncement {
  const fallback = getFallbackAnnouncement(fallbackSong);
  const settings = mapSettings(rows);
  const isActive = settings.homepage_announcement_is_active !== "false";

  if (!isActive) {
    return fallback;
  }

  const href = String(settings.homepage_announcement_target_url ?? "").trim();

  return {
    eyebrow:
      String(settings.homepage_announcement_eyebrow ?? "").trim() ||
      fallback.eyebrow,
    title:
      String(settings.homepage_announcement_title ?? "").trim() ||
      fallback.title,
    description:
      String(settings.homepage_announcement_description ?? "").trim() ||
      fallback.description,
    href: href || fallback.href,
  };
}

async function fetchHomepageMedia() {
  const supabase = createPublicClient();

  const [songsResult, coversResult, photosResult, announcementResult] =
    await Promise.all([
      supabase
        .from("songs")
        .select(
          `
            id,
            slug,
            title,
            artist,
            description,
            release_status,
            spotify_url,
            spotify_embed_url,
            apple_music_url,
            youtube_url,
            youtube_embed_url,
            cover_image_path,
            sort_order,
            published_at,
            created_at
          `,
        )
        .eq("release_status", "published")
        .order("created_at", { ascending: false })
        .limit(1),

      supabase
        .from("covers")
        .select(
          `
            id,
            slug,
            title,
            description,
            release_status,
            youtube_url,
            youtube_embed_url,
            instagram_url,
            sort_order,
            published_at,
            created_at
          `,
        )
        .eq("release_status", "published")
        .order("created_at", { ascending: false })
        .limit(1),

      supabase
        .from("photos")
        .select(
          `
            id,
            title,
            description,
            image_url,
            alt_text,
            media_type,
            video_url,
            video_embed_url,
            thumbnail_url,
            release_status,
            sort_order,
            published_at,
            created_at
          `,
        )
        .eq("release_status", "published")
        .order("created_at", { ascending: false })
        .limit(3),

      supabase
        .from("site_texts")
        .select("key,value")
        .eq("group_name", "homepage_announcement")
        .in("key", announcementKeys),
    ]);

  const songs = ((songsResult.data ?? []) as HomepageSong[]).map((song) => ({
    ...song,
    spotify_embed_url: normalizeSpotifyEmbedUrl(
      song.spotify_url,
      song.spotify_embed_url,
    ),
  }));

  const latestSong = songs[0] ?? null;
  const announcementRows = announcementResult.error
    ? []
    : ((announcementResult.data ?? []) as SiteTextRow[]);

  return {
    songs,
    covers: (coversResult.data ?? []) as CoverRow[],
    galleryItems: (photosResult.data ?? []) as GalleryItem[],
    announcement: mapAnnouncement(announcementRows, latestSong),
    songsError: songsResult.error?.message ?? null,
    coversError: coversResult.error?.message ?? null,
    photosError: photosResult.error?.message ?? null,
    announcementError: announcementResult.error?.message ?? null,
  };
}

export const getHomepageMedia = unstable_cache(
  fetchHomepageMedia,
  ["homepage-media"],
  {
    revalidate: 300,
    tags: ["homepage-media"],
  },
);
