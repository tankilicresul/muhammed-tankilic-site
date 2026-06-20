import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const mainFont = Poppins({
  variable: "--font-main",
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.muhammedtankilic.com"),
  title: {
    default: "Muhammed Tankılıç | Kürtçe Müzik, Sözler ve Hikâyeler",
    template: "%s | Muhammed Tankılıç",
  },
  description:
    "Muhammed Tankılıç’ın müzikleri, sözleri ve hikâyeleri. Kürtçe şarkılar, akustik yorumlar, videolar ve özel içerikler.",
  keywords: [
    "Muhammed Tankılıç",
    "Kürtçe müzik",
    "Kürtçe şarkılar",
    "akustik müzik",
    "bağımsız sanatçı",
    "folk müzik",
    "Zef Cara",
  ],
  authors: [{ name: "Muhammed Tankılıç" }],
  creator: "Muhammed Tankılıç",
  publisher: "Muhammed Tankılıç",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.muhammedtankilic.com",
    siteName: "Muhammed Tankılıç",
    title: "Muhammed Tankılıç | Kürtçe Müzik, Sözler ve Hikâyeler",
    description: "Muhammed Tankılıç’ın müzikleri, sözleri ve hikâyeleri.",
    images: [
      {
        url: "/muhammed-hero2.png",
        width: 1200,
        height: 1600,
        alt: "Muhammed Tankılıç müzik arşivi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammed Tankılıç | Kürtçe Müzik, Sözler ve Hikâyeler",
    description: "Muhammed Tankılıç’ın müzikleri, sözleri ve hikâyeleri.",
    images: ["/muhammed-hero2.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#BDEBE8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${mainFont.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}