/**
 * ADMIN LAYOUT - app/(admin)/layout.tsx
 *
 * Purpose: Shared layout for all admin pages
 *
 * Features:
 * - Authentication check (admin role required)
 * - Redirect to login if not admin
 * - Admin sidebar navigation:
 *   - Dashboard
 *   - Providers
 *   - Categories
 *   - Reviews
 *   - Users
 *   - Analytics
 *   - Import
 * - Admin header with user info
 * - Collapsible sidebar (desktop)
 * - Bottom navigation (mobile)
 * - Notification center
 *
 * Components used:
 * - AdminSidebar
 * - AdminHeader
 * - NotificationCenter
 *
 * Contexts:
 * - Uses AuthContext to check admin role
 */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add auth check for admin role
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* TODO: Add AdminSidebar */}
      <div className="flex-1 flex flex-col">
        {/* TODO: Add AdminHeader */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
