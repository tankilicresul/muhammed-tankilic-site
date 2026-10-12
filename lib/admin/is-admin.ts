import { createClient, createAdminClient } from "@/lib/supabase/server";

export type AdminCheckResult = {
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
};

const DEFAULT_ADMIN_EMAILS = [
  "resultankilic.business@gmail.com",
  "rtankilic22@ku.edu.tr",
  "resultankilic3465@gmail.com",
  "fx59698@gmail.com",
];

function getWhitelistedAdminEmails(): string[] {
  const envEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const combined = new Set([
    ...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()),
    ...envEmails,
  ]);

  return Array.from(combined);
}

export async function checkIsAdmin(): Promise<AdminCheckResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isAdmin: false,
      userId: null,
      email: null,
    };
  }

  const userEmail = (user.email ?? "").toLowerCase().trim();
  const whitelistedEmails = getWhitelistedAdminEmails();
  const isWhitelisted = Boolean(userEmail && whitelistedEmails.includes(userEmail));

  // 1. Veritabanından kontrol
  const { data: adminRow } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminRow) {
    return {
      isAdmin: true,
      userId: user.id,
      email: user.email ?? null,
    };
  }

  // 2. Eğer whitelist'te ise doğrudan yetki ver ve veritabanına da otomatik kaydet
  if (isWhitelisted) {
    try {
      const adminClient = createAdminClient();
      await adminClient.from("site_admins").upsert(
        { user_id: user.id },
        { onConflict: "user_id" },
      );
    } catch {
      // sessizce devam et
    }

    return {
      isAdmin: true,
      userId: user.id,
      email: user.email ?? null,
    };
  }

  return {
    isAdmin: false,
    userId: user.id,
    email: user.email ?? null,
  };
}