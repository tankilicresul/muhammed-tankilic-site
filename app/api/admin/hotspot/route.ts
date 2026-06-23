import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin/is-admin";

export async function GET() {
  const admin = await checkIsAdmin();

  if (!admin.userId) {
    return NextResponse.json(
      {
        status: "unauthenticated",
        message: "Admin paneli için giriş yapın ardından tekrar deneyin.",
      },
      { status: 401 },
    );
  }

  if (!admin.isAdmin) {
    return NextResponse.json(
      {
        status: "forbidden",
        message: "Bu hesap admin yetkisine sahip değil.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    status: "ok",
    redirectTo: "/admin",
  });
}