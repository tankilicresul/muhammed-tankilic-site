import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type PublicMusicPlatform = {
  name: "Spotify" | "Apple Music" | "YouTube";
  url: string;
};

export type PublicSong = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  description: string;
  shortDescription: string;
  releaseStatus: string;
  sortOrder: number;
  publishedAt: string | null;
  coverImage: string;
  lyrics: string;
  downloadFilePath: string;
  spotifyUrl: string;
  spotifyEmbedUrl: string;
  appleMusicUrl: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  platforms: PublicMusicPlatform[];
};

type SongRow = {
  id: string;
  slug: string | null;
  title: string | null;
  artist: string | null;
  description: string | null;
  release_status: string | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string | null;
  spotify_url: string | null;
  spotify_embed_url: string | null;
  apple_music_url: string | null;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  cover_image_path: string | null;
  lyrics: string | null;
  download_file_path: string | null;
};

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

function normalizeImagePath(path: string | null) {
  const value = String(path ?? "").trim();

  if (!value) {
    return "/muzik/zef-cara-cover.jpg";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/${value}`;
}

function normalizeSpotifyEmbedUrl(spotifyUrl: string, spotifyEmbedUrl: string) {
  if (spotifyEmbedUrl) {
    return spotifyEmbedUrl;
  }

  if (!spotifyUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(spotifyUrl);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    const typeIndex = pathParts.findIndex((part) =>
      ["track", "album", "playlist", "artist", "episode", "show"].includes(part),
    );

    if (typeIndex === -1 || !pathParts[typeIndex + 1]) {
      return "";
    }

    const type = pathParts[typeIndex];
    const id = pathParts[typeIndex + 1];

    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  } catch {
    return "";
  }
}

function getYoutubeVideoId(url: string) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "");
    }

    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return videoId;
    }

    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] ?? "";
    }

    return "";
  } catch {
    return "";
  }
}

function normalizeYoutubeEmbedUrl(youtubeUrl: string, youtubeEmbedUrl: string) {
  if (youtubeEmbedUrl) {
    return youtubeEmbedUrl;
  }

  const videoId = getYoutubeVideoId(youtubeUrl);

  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

function mapSong(row: SongRow): PublicSong {
  const spotifyUrl = row.spotify_url ?? "";
  const spotifyEmbedUrl = normalizeSpotifyEmbedUrl(
    spotifyUrl,
    row.spotify_embed_url ?? "",
  );
  const appleMusicUrl = row.apple_music_url ?? "";
  const youtubeUrl = row.youtube_url ?? "";
  const youtubeEmbedUrl = normalizeYoutubeEmbedUrl(
    youtubeUrl,
    row.youtube_embed_url ?? "",
  );

  const platforms: PublicMusicPlatform[] = [];

  if (spotifyUrl) {
    platforms.push({ name: "Spotify", url: spotifyUrl });
  }

  if (appleMusicUrl) {
    platforms.push({ name: "Apple Music", url: appleMusicUrl });
  }

  if (youtubeUrl) {
    platforms.push({ name: "YouTube", url: youtubeUrl });
  }

  return {
    id: row.id,
    slug: row.slug ?? "",
    title: row.title ?? "Başlıksız Şarkı",
    artist: row.artist ?? "Muhammed Tankılıç",
    description: row.description ?? "",
    shortDescription: row.description ?? "",
    releaseStatus: row.release_status ?? "draft",
    sortOrder: row.sort_order ?? 0,
    publishedAt: row.published_at ?? row.created_at,
    coverImage: normalizeImagePath(row.cover_image_path),
    lyrics: row.lyrics ?? "",
    downloadFilePath: row.download_file_path ?? "",
    spotifyUrl,
    spotifyEmbedUrl,
    appleMusicUrl,
    youtubeUrl,
    youtubeEmbedUrl,
    platforms,
  };
}

async function fetchPublishedSongs() {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("songs")
    .select(
      `
        id,
        slug,
        title,
        artist,
        description,
        release_status,
        sort_order,
        published_at,
        created_at,
        spotify_url,
        spotify_embed_url,
        apple_music_url,
        youtube_url,
        youtube_embed_url,
        cover_image_path,
        lyrics,
        download_file_path
      `,
    )
    .eq("release_status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as SongRow[]).map(mapSong).filter((song) => song.slug);
}

export const getPublishedSongs = unstable_cache(
  fetchPublishedSongs,
  ["published-songs"],
  {
    revalidate: 300,
    tags: ["published-songs"],
  },
);

export async function getPublishedSongBySlug(slug: string) {
  const songs = await getPublishedSongs();
  return songs.find((song) => song.slug === slug) ?? null;
}
