"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthButtons() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const hasUser = Boolean(user);
      setIsLoggedIn(hasUser);

      if (hasUser) {
        try {
          const res = await fetch("/api/admin/hotspot", { cache: "no-store" });
          const json = await res.json();
          if (json.status === "ok") {
            setIsAdmin(true);
          }
        } catch {
          // ignore
        }
      } else {
        setIsAdmin(false);
      }

      setIsLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasUser = Boolean(session?.user);
      setIsLoggedIn(hasUser);
      if (!hasUser) {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-28 animate-pulse rounded-full bg-white/35"
      />
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-extrabold">
        {isAdmin && (
          <Link
            href="/admin"
            className="pill-button !bg-[#4B232D] !text-[#FFF4BC] !px-3 !py-2 text-[10px] tracking-wider uppercase shadow-sm transition hover:opacity-90"
            title="Admin Paneli"
          >
            Admin
          </Link>
        )}

        <Link href="/hesabim" className="pill-button secondary !px-3 !py-2">
          Hesabım
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="pill-button dark !px-3 !py-2"
        >
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-extrabold">
      <Link href="/giris" className="pill-button secondary !px-3 !py-2">
        Giriş Yap
      </Link>

      <Link href="/kayit" className="pill-button !px-3 !py-2">
        Kayıt Ol
      </Link>
    </div>
  );
}