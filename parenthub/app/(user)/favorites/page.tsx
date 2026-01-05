/**
 * FAVORITES PAGE - app/(user)/favorites/page.tsx
 *
 * Purpose: Display user's saved/favorite providers
 *
 * Features:
 * - Grid/list of saved providers
 * - Remove from favorites action
 * - Sort options
 * - Empty state when no favorites
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ProviderCard } from "@/components/common/provider-card";
import { EmptyState } from "@/components/common/empty-state";

// Mock favorites data
const mockFavorites = [
  {
    id: "1",
    slug: "maya-cohen",
    name: "Maya Cohen",
    category: "babysitters",
    categoryHe: "בייביסיטר",
    photo: "/images/providers/maya.jpg",
    rating: 4.9,
    reviewCount: 47,
    priceBand: "MIDRANGE" as const,
    isVerified: true,
    city: "Tel Aviv",
    addedAt: "2024-01-15",
  },
  {
    id: "3",
    slug: "sarah-music",
    name: "Sarah's Music Studio",
    category: "music-lessons",
    categoryHe: "שיעורי מוזיקה",
    photo: "/images/providers/sarah.jpg",
    rating: 5.0,
    reviewCount: 28,
    priceBand: "MIDRANGE" as const,
    isVerified: true,
    city: "Ramat Gan",
    addedAt: "2024-01-10",
  },
  {
    id: "4",
    slug: "yael-swim",
    name: "Yael Swimming",
    category: "swim-lessons",
    categoryHe: "שיעורי שחייה",
    photo: "/images/providers/yael.jpg",
    rating: 4.7,
    reviewCount: 35,
    priceBand: "BUDGET" as const,
    isAvailable: true,
    city: "Tel Aviv",
    addedAt: "2024-01-05",
  },
];

type SortOption = "recent" | "name" | "rating";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const handleRemoveFavorite = useCallback((providerId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== providerId));
  }, []);

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 -m-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">My Favorites</h1>
            </div>
            <span className="text-sm text-gray-500">
              {favorites.length} saved
            </span>
          </div>
        </div>
      </div>

      {/* Sort Bar */}
      {favorites.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { value: "recent", label: "Recently Added" },
                  { value: "name", label: "Name" },
                  { value: "rating", label: "Rating" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as SortOption)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      sortBy === option.value
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <EmptyState
            variant="noFavorites"
            action={{
              label: "Browse providers",
              onClick: () => window.location.href = "/search",
            }}
          />
        ) : (
          <div className="space-y-4">
            {sortedFavorites.map((provider) => (
              <div key={provider.id} className="relative">
                <ProviderCard
                  provider={provider}
                  variant="horizontal"
                  isFavorited={true}
                  onFavoriteToggle={() => handleRemoveFavorite(provider.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {favorites.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/search"
            className="block w-full text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Find more providers
          </Link>
        </div>
      )}
    </main>
  );
}
