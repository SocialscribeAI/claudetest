/**
 * USER LAYOUT - app/(user)/layout.tsx
 *
 * Purpose: Shared layout for authenticated user pages
 *
 * Features:
 * - Authentication check (redirect to login if not authed)
 * - User header with avatar
 * - Back navigation
 * - Bottom navigation
 *
 * Components used:
 * - UserHeader
 * - BottomNav
 *
 * Contexts:
 * - Uses AuthContext to check authentication
 */

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add auth check and redirect
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: Add UserHeader */}
      <main className="flex-1 p-4">{children}</main>
      {/* TODO: Add BottomNav */}
    </div>
  );
}
