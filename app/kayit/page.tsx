import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kayıt Ol | Muhammed Tankılıç",
  description:
    "Muhammed Tankılıç üyelik alanına kayıt olarak özel içeriklere, şarkı sözlerine ve indirme bağlantılarına erişin.",
};

const accessItems = ["Şarkı sözleri", "Özel arşiv", "İndirme bağlantıları"];

export default function RegisterPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="site-container relative pt-7 md:pt-9">
        <div className="pointer-events-none absolute left-1/2 top-5 -z-0 -translate-x-1/2 select-none text-[clamp(78px,12vw,170px)] font-black leading-none tracking-[-0.12em] text-white/70">
          MUHAMMED
        </div>

        <div className="relative z-10 grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <section className="relative flex h-full overflow-hidden rounded-[34px] border border-white/18 bg-[#4B232D] p-7 text-white shadow-[0_24px_70px_rgba(75,35,45,0.18)] md:p-8">
            <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-[#F5AE50]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-[#BDEBE8]/12 blur-3xl" />

            <div className="relative flex w-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/66">
                  Hesap oluştur
                </p>

                <h1 className="mt-4 max-w-xl text-[clamp(38px,4.3vw,62px)] font-semibold leading-[0.94] tracking-[-0.085em]">
                  Üye alanına eriş.
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-8 text-white/72">
                  Şarkılarım, sözlerim ve özel arşiv içeriklerim için ücretsiz
                  bir dinleyici hesabı oluştur.
                </p>

                <div className="mt-7 rounded-[26px] border border-white/16 bg-white/10 p-5 backdrop-blur-[14px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/54">
                    Kayıt sonrası
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/74">
                    Özel içeriklere, şarkı sözlerine ve uygun indirme
                    bağlantılarına daha düzenli erişebilirsin.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {accessItems.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-[82px] items-center rounded-[22px] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-[12px]"
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
                  href="/giris"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Giriş Yap
                </Link>

                <Link
                  href="/sarkilarim"
                  className="pill-button accent !min-h-12 !w-full !justify-center !px-6"
                >
                  Şarkılarım
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-white/35 bg-white/62 p-7 shadow-[0_22px_64px_rgba(75,35,45,0.10)] backdrop-blur-[18px] md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-[clamp(48px,5vw,76px)] font-semibold leading-none tracking-[-0.09em] text-[#4B232D]">
                Kayıt ol
              </h2>
            </div>

            <form className="grid gap-4">
              <div className="rounded-[30px] border border-white/42 bg-white/58 p-5 shadow-[0_12px_34px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      Adın
                    </span>

                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="Adını yaz"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      Soyadın
                    </span>

                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Soyadını yaz"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      Telefonun
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+90 5xx xxx xx xx"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      E-postan
                    </span>

                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="ornek@mail.com"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      Şifren
                    </span>

                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="En az 8 karakter"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B232D]/64">
                      Şifre tekrar
                    </span>

                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Şifreni tekrar yaz"
                      className="min-h-12 rounded-[20px] border border-[#4B232D]/12 bg-white/88 px-5 text-base font-medium tracking-[-0.02em] text-[#4B232D] outline-none shadow-[0_10px_28px_rgba(75,35,45,0.05)] transition placeholder:text-[#4B232D]/34 focus:border-[#F5AE50]/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(245,174,80,0.18)]"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/42 bg-white/72 px-5 py-4 shadow-[0_10px_28px_rgba(75,35,45,0.05)] backdrop-blur-[12px]">
                <label className="flex gap-3 text-sm leading-7 text-[#4B232D]/72">
                  <input
                    type="checkbox"
                    name="terms"
                    className="mt-1 h-4 w-4 rounded border-[#4B232D]/30 accent-[#4B232D]"
                  />
                  <span>
                    Gizlilik politikasını ve kullanım koşullarını kabul
                    ediyorum.
                  </span>
                </label>

                <label className="mt-2 flex gap-3 text-sm leading-7 text-[#4B232D]/72">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="mt-1 h-4 w-4 rounded border-[#4B232D]/30 accent-[#4B232D]"
                  />
                  <span>
                    Yeni şarkılar ve özel içerikler yayınlandığında e-posta
                    almak istiyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="min-h-14 rounded-full bg-[#4B232D] px-6 text-sm font-bold text-white shadow-[0_16px_36px_rgba(75,35,45,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5a2b36]"
              >
                Hesap Oluştur
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-sm font-bold text-[#4B232D] sm:flex-row sm:items-center sm:justify-between">
              <Link href="/giris" className="transition hover:text-[#F5AE50]">
                Hesabın varsa giriş yap
              </Link>

              <Link
                href="/sarkilarim"
                className="transition hover:text-[#F5AE50]"
              >
                Şarkılara dön
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}