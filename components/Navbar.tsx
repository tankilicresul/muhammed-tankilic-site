"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoHotspot from "@/components/AdminLogoHotspot";
import AuthButtons from "@/components/AuthButtons";

const navItems = [
  { label: "Menü", href: "/" },
  { label: "Şarkılarım", href: "/sarkilarim" },
  { label: "Coverlarım", href: "/coverlarim" },
  { label: "Fotoğraflarım", href: "/fotograflar" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar-wrap">
      <div className="site-container">
        <nav className="navbar-shell" aria-label="Ana menü">
          <div className="hidden w-full items-center justify-between gap-3 sm:flex sm:w-auto">
            <div className="brand-link" aria-label="Muhammed Tankılıç">
              <span className="brand-mark relative">
                <Image
                  src="/icon-512.png"
                  alt="Muhammed Tankılıç"
                  fill
                  sizes="48px"
                  className="brand-mark-image scale-[1.24]"
                  priority
                />

                <AdminLogoHotspot />
              </span>

              <Link href="/" className="brand-copy" aria-label="Ana sayfa">
                <strong>Muhammed Tankılıç</strong>
                <small>Müzik · Sözler · Hikâyeler</small>
              </Link>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <span className="relative h-9 w-9 flex-none overflow-hidden rounded-[13px] bg-[#BDEBE8]">
                <Image
                  src="/icon-512.png"
                  alt="Muhammed Tankılıç"
                  fill
                  sizes="36px"
                  className="object-cover scale-[1.24]"
                  priority
                />

                <AdminLogoHotspot />
              </span>

              <Link
                href="/"
                className="flex min-w-0 flex-col leading-none"
                aria-label="Ana sayfa"
              >
                <strong className="truncate text-[12px] font-bold tracking-[-0.035em] text-[#4B232D]">
                  Muhammed Tankılıç
                </strong>
                <small className="mt-1 truncate text-[9px] font-normal text-[#4B232D]/58">
                  Müzik · Sözler · Hikâyeler
                </small>
              </Link>
            </div>

            <div className="flex flex-none items-center gap-1.5">
              <AuthButtons />
            </div>
          </div>

          <div className="nav-links">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "nav-link active" : "nav-link"}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="nav-side">
            <AuthButtons />
            <span className="language-chip active">TR</span>
            <span className="language-chip">KU</span>
          </div>
        </nav>
      </div>
    </header>
  );
}