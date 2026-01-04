/**
 * CATEGORY TILE - components/common/category-tile.tsx
 *
 * Purpose: Clickable tile for category navigation
 *
 * Variants: tile (grid), chip (inline), pill (filters)
 */

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface CategoryTileProps {
  category: {
    id: string;
    slug: string;
    name: string;
    nameHe?: string;
    icon?: string;
    providerCount?: number;
  };
  variant?: "tile" | "chip" | "pill";
  isActive?: boolean;
  onClick?: () => void;
  showCount?: boolean;
  href?: string;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  babysitters: "👶",
  daycares: "🏠",
  "music-lessons": "🎵",
  tutoring: "📚",
  "art-classes": "🎨",
  "sports-activities": "⚽",
  "swim-lessons": "🏊",
  "dance-classes": "💃",
  "language-lessons": "🗣️",
  therapists: "🧠",
  pediatricians: "👨‍⚕️",
  photographers: "📷",
  "birthday-parties": "🎂",
  camps: "⛺",
  playgrounds: "🎪",
};

export function CategoryTile({
  category,
  variant = "tile",
  isActive = false,
  onClick,
  showCount = false,
  href,
}: CategoryTileProps) {
  const icon = category.icon || categoryIcons[category.slug] || "📍";
  const displayName = category.nameHe || category.name;
  const linkHref = href || `/category/${category.slug}`;

  if (variant === "pill") {
    const Component = onClick ? "button" : Link;
    const props = onClick ? { onClick } : { href: linkHref };

    return (
      <Component
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>)}
        className={cn(
          "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
          isActive
            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        <span>{icon}</span>
        <span>{displayName}</span>
        {showCount && category.providerCount !== undefined && (
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            isActive ? "bg-white/20" : "bg-gray-200"
          )}>
            {category.providerCount}
          </span>
        )}
      </Component>
    );
  }

  if (variant === "chip") {
    const Component = onClick ? "button" : Link;
    const props = onClick ? { onClick } : { href: linkHref };

    return (
      <Component
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>)}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all",
          isActive
            ? "bg-pink-100 text-pink-700 ring-1 ring-pink-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        <span className="text-base">{icon}</span>
        <span>{displayName}</span>
      </Component>
    );
  }

  // Default: tile variant for grids
  return (
    <Link
      href={linkHref}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl transition-all",
        "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-rose-50",
        "border border-gray-200 hover:border-pink-200 hover:shadow-md",
        "group min-h-[120px]"
      )}
    >
      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-800 text-center">
        {displayName}
      </span>
      {showCount && category.providerCount !== undefined && (
        <span className="text-xs text-gray-500 mt-1">
          {category.providerCount} providers
        </span>
      )}
    </Link>
  );
}
