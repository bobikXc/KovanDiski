import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import { BackToTopButton } from "@/components/back-to-top-button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pride-forged.local"),
  title: "PRIDE Forged — премиальные кованые диски",
  description: "Производство и продажа премиальных кованых дисков PRIDE Forged.",
  openGraph: {
    title: "PRIDE Forged — премиальные кованые диски",
    description: "Каталог кованых дисков и подбор по автомобилю через Fitment.",
    type: "website",
    locale: "ru_RU",
    siteName: "PRIDE Forged"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.className} premium-gradient antialiased`}>
        <Suspense>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BackToTopButton />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
