/**
 * PUBLIC LAYOUT - app/(public)/layout.tsx
 *
 * Purpose: Shared layout for all public-facing pages
 *
 * Features:
 * - Public navigation header
 * - Bottom navigation bar (mobile)
 * - Footer with links
 * - Location context provider
 * - Analytics page view tracking
 *
 * Components used:
 * - PublicHeader
 * - BottomNav
 * - Footer
 *
 * Contexts provided:
 * - LocationContext (user's current location)
 */

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: Add PublicHeader */}
      <main className="flex-1">{children}</main>
      {/* TODO: Add BottomNav */}
      {/* TODO: Add Footer */}
    </div>
  );
}
