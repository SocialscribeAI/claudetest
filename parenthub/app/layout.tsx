/**
 * ROOT LAYOUT - app/layout.tsx
 *
 * Purpose: Root layout for the entire application
 *
 * Features:
 * - Global font setup (Hebrew + English)
 * - RTL support
 * - Metadata for SEO
 * - Global providers (Query, Auth, Location)
 * - Analytics initialization
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ParentHub - Find Baby & Child Services Near You",
    template: "%s | ParentHub",
  },
  description:
    "Discover trusted local services for parents - sleep consultants, lactation experts, babysitters, baby classes, and more. Find what you need for your family.",
  keywords: [
    "baby services",
    "parenting",
    "sleep consultant",
    "lactation consultant",
    "babysitter",
    "baby classes",
    "Israel",
  ],
  authors: [{ name: "ParentHub" }],
  creator: "ParentHub",
  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: "en_US",
    siteName: "ParentHub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF6B6B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        {/* TODO: Add providers (QueryClientProvider, SessionProvider, LocationProvider) */}
        {children}
      </body>
    </html>
  );
}
