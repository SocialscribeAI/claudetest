/**
 * PUBLIC LAYOUT - app/(public)/layout.tsx
 *
 * Purpose: Shared layout for all public-facing pages
 *
 * Features:
 * - Public navigation header
 * - Bottom navigation bar (mobile)
 * - Footer with links
 */

import { PublicHeader } from "@/components/layout/PublicHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav />
      <Footer />
    </div>
  );
}
