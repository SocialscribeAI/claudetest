/**
 * AUTH LAYOUT - app/(auth)/layout.tsx
 *
 * Purpose: Shared layout for authentication pages
 *
 * Features:
 * - Minimal header with logo
 * - Centered content container
 * - No bottom navigation
 * - Soft, welcoming visual style
 * - Redirect if already logged in
 *
 * Components used:
 * - AuthHeader (minimal)
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* TODO: Add minimal header with logo */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
