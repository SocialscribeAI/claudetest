/**
 * ROOT LAYOUT - app/layout.tsx
 *
 * Purpose: Root layout for the entire application
 *
 * Features:
 * - System font setup
 * - RTL support
 * - Metadata for SEO
 * - Global providers (Query, Auth, Location)
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

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
      <body className="antialiased min-h-screen bg-gray-50 font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
