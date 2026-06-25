import type { Metadata } from "next";
import { Raleway, Russo_One } from "next/font/google";
import { Suspense } from "react";

import { BackToTopButton } from "@/components/back-to-top-button";
import { CookieConsent } from "@/components/cookie-consent";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway-next",
  display: "swap"
});
const russoOne = Russo_One({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-russo-one-next",
  display: "swap"
});

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
      <body className={`${raleway.variable} ${russoOne.variable} premium-gradient antialiased`}>
        <Suspense>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BackToTopButton />
            <CookieConsent />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
