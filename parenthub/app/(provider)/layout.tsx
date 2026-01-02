/**
 * PROVIDER LAYOUT - app/(provider)/layout.tsx
 *
 * Purpose: Shared layout for provider portal pages
 *
 * Features:
 * - Authentication check (provider role required)
 * - Redirect to provider signup if not a provider
 * - Provider sidebar navigation (desktop)
 * - Provider header with business name
 * - Bottom navigation (mobile)
 * - Status banner (pending approval, suspended)
 *
 * Components used:
 * - ProviderSidebar
 * - ProviderHeader
 * - StatusBanner
 * - BottomNav (provider variant)
 *
 * Contexts:
 * - Uses AuthContext to check provider role
 */

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add auth check for provider role
  return (
    <div className="min-h-screen flex">
      {/* TODO: Add ProviderSidebar (desktop) */}
      <div className="flex-1 flex flex-col">
        {/* TODO: Add ProviderHeader */}
        {/* TODO: Add StatusBanner if pending/suspended */}
        <main className="flex-1 p-4">{children}</main>
        {/* TODO: Add BottomNav (mobile) */}
      </div>
    </div>
  );
}
