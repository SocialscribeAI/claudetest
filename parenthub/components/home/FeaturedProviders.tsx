"use client";

/**
 * FEATURED PROVIDERS SECTION - components/home/FeaturedProviders.tsx
 *
 * Purpose: Display featured providers on home page
 * Fetches data from API using React Query
 */

import Link from "next/link";
import { useProviders } from "@/hooks/use-api";
import { ProviderCard } from "@/components/common/provider-card";

export function FeaturedProviders() {
  const { data, isLoading, error } = useProviders({
    sort: "featured",
    limit: 3,
  });

  if (error) {
    return null; // Silently fail, show nothing
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-pink-50/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Providers</h2>
            <p className="text-gray-600 text-sm mt-1">Top-rated providers in your area</p>
          </div>
          <Link
            href="/search?featured=true"
            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={{
                  id: provider.id,
                  slug: provider.slug,
                  name: provider.name,
                  category: provider.categories[0]?.slug || "other",
                  categoryHe: provider.categories[0]?.nameHe || "אחר",
                  photo: provider.photo || undefined,
                  rating: provider.rating || 0,
                  reviewCount: provider.reviewCount,
                  priceBand: provider.priceBand === 1 ? "BUDGET" : provider.priceBand === 2 ? "MIDRANGE" : "PREMIUM",
                  isVerified: provider.isVerified,
                  isFeatured: provider.isFeatured,
                  city: provider.city,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
