"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Şarkılar", href: "/muzik" },
  { label: "Videolar", href: "/videolar" },
  { label: "Fotoğraflar", href: "/fotograflar" },
  { label: "Hakkında", href: "/hakkinda" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-4">
      <nav className="site-container">
        <div className="rounded-[25px] border border-[rgba(75,35,45,0.1)] bg-[rgba(189,235,232,0.82)] px-4 py-3 shadow-[0_18px_50px_rgba(75,35,45,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <Link
              href="/"
              aria-label="Muhammed Tankılıç ana sayfa"
              className="flex shrink-0 items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--burgundy) text-sm font-black text-white shadow-sm">
                MT
              </span>

              <span className="flex flex-col leading-none">
                <span className="font-serif text-base font-bold tracking-tighter text-(--burgundy) md:text-lg">
                  Muhammed Tankılıç
                </span>

                <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-(--burgundy) opacity-60">
                  Müzik · Sözler · Hikâyeler
                </span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-1.5 lg:flex-nowrap lg:gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "rounded-full bg-white/75 px-3 py-2 text-[11px] font-extrabold text-(--burgundy) shadow-sm"
                        : "rounded-full px-3 py-2 text-[11px] font-extrabold text-(--burgundy) opacity-75 hover:bg-white/55 hover:opacity-100 hover:shadow-sm"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center justify-center gap-2 lg:justify-end">
              <div className="flex items-center gap-1 rounded-full bg-white/45 p-1 text-[10px] font-extrabold text-(--burgundy)">
                <button
                  type="button"
                  className="rounded-full bg-(--orange) px-2.5 py-1"
                >
                  TR
                </button>

                <button
                  type="button"
                  className="rounded-full px-2.5 py-1 opacity-70 hover:bg-white/60"
                >
                  KU
                </button>
              </div>

              <AuthButtons />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}