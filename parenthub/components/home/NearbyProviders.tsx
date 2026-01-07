"use client";

/**
 * NEARBY PROVIDERS SECTION - components/home/NearbyProviders.tsx
 *
 * Purpose: Display providers near user's location
 * Uses geolocation + API
 */

import Link from "next/link";
import { useProviders } from "@/hooks/use-api";
import { ProviderCard } from "@/components/common/provider-card";
import { useLocation } from "@/hooks/use-location";

export function NearbyProviders() {
  const { location } = useLocation();
  const { data, isLoading, error } = useProviders({
    lat: location?.lat,
    lng: location?.lng,
    sort: "distance",
    limit: 5,
  });

  const cityName = location ? "Based on your location" : "Tel Aviv";

  if (error) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Near You</h2>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {cityName}
            </p>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            View map
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
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
                  distance: provider.distance || undefined,
                  isAvailable: provider.isAvailable,
                  city: provider.city,
                }}
                variant="horizontal"
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium transition-colors"
          >
            See all providers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
