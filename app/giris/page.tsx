import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import { getHomepageMedia } from "@/lib/supabase/public";
import { getPublicSiteTexts, t } from "@/lib/supabase/site-texts";

export const metadata: Metadata = {
  title: "Giriş Yap | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç üyelik alanına giriş yaparak özel içeriklere, şarkı sözlerine ve indirme bağlantılarına erişin.",
};

export default async function LoginPage() {
  const [siteTexts, { announcement }] = await Promise.all([
    getPublicSiteTexts(),
    getHomepageMedia(),
  ]);

  const settings = siteTexts.settings;
  const text = (key: string) => t(settings, key);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-40 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-8 -z-0 hidden -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70 md:block">
          MUHAMMED
        </div>

        <section className="relative z-10 mx-auto max-w-3xl rounded-[24px] border border-white/35 bg-white/66 p-4 shadow-[0_16px_44px_rgba(75,35,45,0.12)] backdrop-blur-[18px] md:max-w-5xl md:rounded-[38px] md:p-8">
          <div className="hidden text-center md:block">
            <p className="section-eyebrow">{text("login.eyebrow")}</p>

            <h1 className="mx-auto mt-2 max-w-[310px] text-[22px] font-semibold leading-[1.12] tracking-[-0.055em] text-[#4B232D] md:mt-4 md:max-w-4xl md:text-[clamp(25px,3.1vw,42px)] md:leading-[1.18]">
              <span className="block">{text("login.title_line_1")}</span>
              <span className="block text-[#6F3440]">
                {text("login.title_line_2")}
              </span>
            </h1>
          </div>

          <LoginForm />

          <div className="mt-4 flex justify-center text-[12px] font-bold text-[#4B232D] md:mt-5 md:text-sm">
            <Link
              href="/sifremi-unuttum"
              className="transition hover:text-[#F5AE50]"
            >
              {text("login.forgot_password_link")}
            </Link>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/42 bg-[#FFF4BC]/68 px-4 py-3 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px] md:mt-5 md:rounded-[26px] md:px-5 md:py-4">
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/58 md:text-[10px] md:tracking-[0.22em]">
                  {announcement.eyebrow}
                </p>

                <h2 className="mt-1 text-[22px] font-semibold leading-none tracking-[-0.065em] text-[#4B232D] md:text-[clamp(20px,2.3vw,30px)]">
                  {announcement.title}
                </h2>

                <p className="mt-2 text-[12px] leading-5 text-[#4B232D]/68 md:text-sm md:leading-6">
                  {announcement.description}
                </p>
              </div>

              <Link
                href={announcement.href}
                className="pill-button dark !min-h-9 !justify-center !px-4 !py-2 !text-[11px] md:!min-h-10 md:!px-5 md:!text-xs"
              >
                Şarkı Detayı →
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
