import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CoverRow = {
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

type GalleryItem = {
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

async function fetchHomepageMedia() {
  const supabase = createPublicClient();

  const [coversResult, photosResult] = await Promise.all([
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
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),

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
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
  ]);

  return {
    covers: ((coversResult.data ?? []) as CoverRow[]).slice(0, 6),
    galleryItems: ((photosResult.data ?? []) as GalleryItem[]).slice(0, 12),
    coversError: coversResult.error?.message ?? null,
    photosError: photosResult.error?.message ?? null,
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