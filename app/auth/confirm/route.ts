import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedOtpTypes: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function getSafeNextPath(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;

  return value;
}

function isEmailOtpType(value: string | null): value is EmailOtpType {
  if (!value) return false;
  return allowedOtpTypes.includes(value as EmailOtpType);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const safeNext = getSafeNextPath(searchParams.get("next"));

  if (!tokenHash || !isEmailOtpType(type)) {
    return NextResponse.redirect(
      new URL("/giris?hata=eksik-dogrulama-bilgisi", origin),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/giris?hata=gecersiz-veya-suresi-dolmus-baglanti", origin),
    );
  }

  if (safeNext) {
    return NextResponse.redirect(new URL(safeNext, origin));
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/yeni-sifre", origin));
  }

  return NextResponse.redirect(new URL("/giris?dogrulandi=1", origin));
}
