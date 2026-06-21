import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Giriş Yap | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç üyelik alanına giriş yaparak özel içeriklere, şarkı sözlerine ve indirme bağlantılarına erişin.",
};

const accessItems = ["Şarkı sözleri", "Özel arşiv", "İndirme bağlantıları"];

export default function LoginPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-9 md:pt-12">
        <div className="pointer-events-none absolute left-1/2 top-7 -z-0 -translate-x-1/2 select-none text-[clamp(84px,13vw,190px)] font-black leading-none tracking-[-0.12em] text-white/78">
          MUHAMMED
        </div>

        <div className="relative z-10 grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
          <section className="relative flex h-full overflow-hidden rounded-[34px] border border-white/18 bg-[#4B232D] p-7 text-white shadow-[0_24px_70px_rgba(75,35,45,0.18)] md:p-8">
            <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-[#F5AE50]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-[#BDEBE8]/12 blur-3xl" />

            <div className="relative flex w-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/66">
                  Üyelik alanı
                </p>

                <h1 className="mt-4 max-w-xl text-[clamp(38px,4.3vw,62px)] font-semibold leading-[0.94] tracking-[-0.085em]">
                  Müziğe daha yakın bir alan.
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-8 text-white/72">
                  Şarkı sözleri, özel içerikler ve indirme bağlantılarına
                  erişmek için hesabına giriş yap.
                </p>

                <div className="mt-7 rounded-[26px] border border-white/16 bg-white/10 p-5 backdrop-blur-[14px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/54">
                    Bu alanda ne var?
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/74">
                    Şarkılarım, sözlerim ve özel arşiv içeriklerim için sade bir
                    dinleyici alanı.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {accessItems.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-[88px] items-center rounded-[22px] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-[12px]"
                    >
                      <h2 className="text-sm font-semibold leading-6 text-white">
                        {item}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/sarkilarim"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Şarkılarım
                </Link>

                <Link
                  href="/coverlarim"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Coverlarım
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-white/35 bg-white/62 p-6 shadow-[0_22px_64px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:p-7">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <Link
                  href="/"
                  className="inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-[#4B232D]/68 transition hover:text-[#4B232D]"
                >
                  Ana sayfaya dön
                </Link>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#4B232D]/62">
                  Hesabına dön
                </p>

                <h2 className="mt-2 text-[clamp(42px,4.7vw,68px)] font-semibold leading-none tracking-[-0.085em] text-[#4B232D]">
                  Giriş yap
                </h2>
              </div>

              <div className="rounded-full border border-[#4B232D]/8 bg-[#BDEBE8]/68 px-4 py-2 text-xs font-semibold text-[#4B232D] shadow-[0_10px_28px_rgba(75,35,45,0.06)]">
                Üye alanı
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-8 text-[#4B232D]/68">
              E-posta adresin ve şifrenle hesabına giriş yap.
            </p>

<LoginForm />

            <div className="mt-5 flex flex-col gap-3 text-sm font-bold text-[#4B232D] sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/sifre-sifirla"
                className="transition hover:text-[#F5AE50]"
              >
                Şifremi unuttum
              </Link>

              <Link href="/kayit" className="transition hover:text-[#F5AE50]">
                Hesabın yoksa kayıt ol
              </Link>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/42 bg-[#FFF4BC]/72 px-5 py-4 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
              <p className="text-sm font-medium leading-7 text-[#4B232D]/72">
                İlk kez geliyorsan kayıt ol. Hesabın varsa doğrudan giriş yap.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}