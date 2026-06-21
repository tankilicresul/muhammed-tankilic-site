"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "@/components/AuthButtons";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Şarkılarım", href: "/sarkilarim" },
  { label: "Coverlarım", href: "/coverlarim" },
  { label: "Fotoğraflarım", href: "/fotograflar" },
  { label: "Hakkında", href: "/hakkinda" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar-wrap">
      <div className="site-container">
        <nav className="navbar-shell" aria-label="Ana menü">
          <Link href="/" className="brand-link" aria-label="Ana sayfa">
            <span className="brand-mark">
              <Image
                src="/icon-512.png"
                alt="Muhammed Tankılıç"
                fill
                sizes="48px"
                className="brand-mark-image"
                priority
              />
            </span>

            <span className="brand-copy">
              <strong>Muhammed Tankılıç</strong>
              <small>Müzik · Sözler · Hikâyeler</small>
            </span>
          </Link>

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