"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mergeSiteTextRows, siteTextKeys } from "@/lib/supabase/site-text-keys";

type SiteTextRow = {
  key: string;
  value: string | null;
};

export function useSiteTexts() {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<Record<string, string>>(() =>
    mergeSiteTextRows([]),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data } = await supabase
        .from("site_texts")
        .select("key,value")
        .eq("is_public", true)
        .in("key", siteTextKeys);

      if (!mounted) return;

      setSettings(mergeSiteTextRows((data ?? []) as SiteTextRow[]));
      setLoading(false);
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return {
    settings,
    loading,
    text: (key: string) => settings[key] ?? "",
  };
}
