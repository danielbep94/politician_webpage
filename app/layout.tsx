import type { Metadata } from "next";
import { Bitter, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { Analytics } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { BackToTop } from "@/components/ui/BackToTop";
import { siteConfig } from "@/lib/constants/site";
// Validate env vars at startup — throws in production if required vars are missing
import "@/lib/env";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url)
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${bitter.variable}`}>
      <body className="min-h-screen">
        {/* Skip-to-content: first focusable element — keyboard and screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-2xl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          Ir al contenido principal
        </a>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        {/* Sticky volunteer CTA — mobile only, slides up after hero scroll */}
        <StickyMobileCta />
        {/* Back-to-top button — desktop only, after 400px scroll */}
        <BackToTop />
        {/* Non-blocking GA4 analytics — renders only when NEXT_PUBLIC_GA_ID is set */}
        <Analytics />
      </body>
    </html>
  );
}
