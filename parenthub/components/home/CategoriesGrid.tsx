"use client";

/**
 * CATEGORIES GRID - components/home/CategoriesGrid.tsx
 *
 * Purpose: Display category tiles on home page
 * Fetches categories from API
 */

import Link from "next/link";
import { useCategories } from "@/hooks/use-api";
import { CategoryTile } from "@/components/common/category-tile";

export function CategoriesGrid() {
  const { data: categories, isLoading, error } = useCategories();

  if (error) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <Link href="/categories" className="text-pink-600 hover:text-pink-700 font-medium text-sm">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories?.slice(0, 8).map((category) => (
              <CategoryTile
                key={category.id}
                category={{
                  id: category.id,
                  slug: category.slug,
                  name: category.name,
                  nameHe: category.nameHe,
                  icon: category.icon || "📍",
                }}
                showCount={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
