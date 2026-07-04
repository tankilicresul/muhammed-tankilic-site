import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  mergeSiteTextRows,
  siteTextDefinitions,
  siteTextKeys,
  type SiteTextDefinition,
} from "@/lib/supabase/site-text-keys";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type SiteTextRow = {
  key: string;
  value: string | null;
};

function createPublicSiteTextsClient() {
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

async function fetchPublicSiteTexts() {
  const supabase = createPublicSiteTextsClient();

  const { data, error } = await supabase
    .from("site_texts")
    .select("key,value")
    .eq("is_public", true)
    .in("key", siteTextKeys);

  if (error) {
    return {
      settings: mergeSiteTextRows([]),
      error: error.message,
    };
  }

  return {
    settings: mergeSiteTextRows((data ?? []) as SiteTextRow[]),
    error: null,
  };
}

export const getPublicSiteTexts = unstable_cache(
  fetchPublicSiteTexts,
  ["public-site-texts"],
  {
    revalidate: 300,
    tags: ["public-site-texts"],
  },
);

export function t(settings: Record<string, string>, key: string) {
  return settings[key] ?? "";
}

export function getDefinitionsByGroup(groupName: string) {
  return siteTextDefinitions.filter(
    (definition: SiteTextDefinition) => definition.groupName === groupName,
  );
}

export { siteTextDefinitions, siteTextKeys };
