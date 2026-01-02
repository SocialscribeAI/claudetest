/**
 * ADMIN SIDEBAR - components/admin/sidebar.tsx
 *
 * Purpose: Navigation sidebar for admin panel
 *
 * Navigation items:
 * - Dashboard (home icon)
 * - Providers (building icon) - with pending badge
 * - Categories (grid icon)
 * - Reviews (star icon) - with pending badge
 * - Users (users icon)
 * - Analytics (chart icon)
 * - Import (upload icon)
 *
 * Features:
 * - Active state indication
 * - Collapsible on desktop
 * - Badge for pending items
 * - User info at bottom
 * - Logout button
 *
 * Props:
 * - pendingProviders: number
 * - pendingReviews: number
 * - collapsed: boolean
 * - onCollapse: (collapsed: boolean) => void
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  pendingProviders?: number;
  pendingReviews?: number;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/providers", label: "Providers", icon: "🏢" },
  { href: "/categories", label: "Categories", icon: "📁" },
  { href: "/reviews", label: "Reviews", icon: "⭐" },
  { href: "/users", label: "Users", icon: "👥" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/import", label: "Import", icon: "📤" },
];

export function AdminSidebar({ pendingProviders = 0, pendingReviews = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">ParentHub Admin</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            const badge =
              item.href === "/providers" ? pendingProviders :
              item.href === "/reviews" ? pendingReviews : 0;

            return (
              <li key={item.href}>
                <Link
                  href={`/(admin)${item.href}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
