/**
 * SEARCH RESULTS PAGE - app/(public)/search/page.tsx
 *
 * Purpose: Display search results with filters and sorting
 *
 * Features:
 * - Results list/map view toggle
 * - Filter sheet (distance, price band, availability)
 * - Sort options (distance, rating, relevance)
 * - Category chips for quick filtering
 * - Infinite scroll
 */

"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SearchBar } from "@/components/discovery/search-bar";
import { FilterSheet, FilterButton, type FilterState } from "@/components/discovery/filter-sheet";
import { ProviderList } from "@/components/discovery/provider-list";
import { GoogleMap } from "@/components/discovery/google-map";
import { ListMapToggle, SortDropdown } from "@/components/discovery/list-map-toggle";
import { CategoryTile } from "@/components/common/category-tile";

// Mock data - would come from API
const mockProviders = [
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
    isFeatured: true,
    city: "Tel Aviv",
    distance: 0.8,
    lat: 32.0853,
    lng: 34.7818,
  },
  {
    id: "2",
    slug: "david-levi",
    name: "David Levi",
    category: "tutoring",
    categoryHe: "מורה פרטי",
    photo: "/images/providers/david.jpg",
    rating: 4.8,
    reviewCount: 62,
    priceBand: "PREMIUM" as const,
    isVerified: true,
    city: "Herzliya",
    distance: 5.2,
    lat: 32.1663,
    lng: 34.8431,
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
    distance: 3.1,
    isAvailable: true,
    lat: 32.0684,
    lng: 34.8248,
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
    distance: 1.2,
    isAvailable: true,
    city: "Tel Aviv",
    lat: 32.0733,
    lng: 34.7805,
  },
  {
    id: "5",
    slug: "art-together",
    name: "Art Together",
    category: "art-classes",
    categoryHe: "סטודיו לאמנות",
    photo: "/images/providers/art.jpg",
    rating: 4.6,
    reviewCount: 19,
    priceBand: "MIDRANGE" as const,
    distance: 2.5,
    city: "Tel Aviv",
    lat: 32.0789,
    lng: 34.7742,
  },
  {
    id: "6",
    slug: "dance-kids",
    name: "Dance Kids Studio",
    category: "dance-classes",
    categoryHe: "סטודיו ריקוד",
    photo: "/images/providers/dance.jpg",
    rating: 4.9,
    reviewCount: 44,
    priceBand: "MIDRANGE" as const,
    distance: 3.1,
    isAvailable: true,
    city: "Givatayim",
    lat: 32.0714,
    lng: 34.8103,
  },
];

const categories = [
  { id: "all", slug: "all", name: "All", nameHe: "הכל" },
  { id: "1", slug: "babysitters", name: "Babysitters", nameHe: "בייביסיטר" },
  { id: "2", slug: "tutoring", name: "Tutoring", nameHe: "שיעורים פרטיים" },
  { id: "3", slug: "music-lessons", name: "Music", nameHe: "מוזיקה" },
  { id: "4", slug: "sports-activities", name: "Sports", nameHe: "ספורט" },
  { id: "5", slug: "art-classes", name: "Art", nameHe: "אמנות" },
  { id: "6", slug: "swim-lessons", name: "Swimming", nameHe: "שחייה" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial values from URL
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "relevance";

  // State
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState(initialSort);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    radius: 10,
    priceBands: [],
    availableNow: false,
    categories: [],
    languages: [],
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState(mockProviders);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>();

  // Count active filters
  const activeFilterCount =
    (filters.radius !== 10 ? 1 : 0) +
    filters.priceBands.length +
    (filters.availableNow ? 1 : 0) +
    filters.categories.length +
    filters.languages.length;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (initialQuery) params.set("q", initialQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (sortBy !== "relevance") params.set("sort", sortBy);

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [activeCategory, sortBy, initialQuery, router]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  }, [searchParams, router]);

  // Handle filter apply
  const handleFilterApply = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    // In production, this would trigger a new API call
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading more providers
    setTimeout(() => {
      setHasMore(false);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((providerId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) {
        next.delete(providerId);
      } else {
        next.add(providerId);
      }
      return next;
    });
  }, []);

  // Handle marker click on map
  const handleMarkerClick = useCallback((provider: { id: string }) => {
    setSelectedProviderId(provider.id);
  }, []);

  // Filter providers based on active category
  const filteredProviders = activeCategory === "all"
    ? providers
    : providers.filter(p => p.category === activeCategory);

  // Map providers for Google Map
  const mapProviders = filteredProviders.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    rating: p.rating,
  }));

  return (
    <>
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <Link
              href="/"
              className="p-2 -m-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {/* Search bar */}
            <div className="flex-1">
              <SearchBar
                defaultValue={initialQuery}
                onSearch={handleSearch}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                variant="chip"
                isActive={activeCategory === category.slug}
                onClick={() => setActiveCategory(category.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Results count & sort */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""}
              </span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* View toggle & filter */}
            <div className="flex items-center gap-3">
              <ListMapToggle
                activeView={viewMode}
                onChange={setViewMode}
                size="sm"
              />
              <FilterButton
                onClick={() => setIsFilterOpen(true)}
                activeCount={activeFilterCount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {viewMode === "list" ? (
          <ProviderList
            providers={filteredProviders}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
            variant="horizontal"
          />
        ) : (
          <div className="relative h-[calc(100vh-280px)] min-h-[400px]">
            <GoogleMap
              providers={mapProviders}
              selectedProviderId={selectedProviderId}
              onMarkerClick={handleMarkerClick}
              showSearchButton
              className="h-full"
            />

            {/* Selected provider card overlay */}
            {selectedProviderId && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                {(() => {
                  const provider = filteredProviders.find(p => p.id === selectedProviderId);
                  if (!provider) return null;
                  return (
                    <Link
                      href={`/provider/${provider.slug}`}
                      className="block bg-white rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-sm text-gray-500">{provider.categoryHe}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {provider.rating && (
                              <span className="text-sm text-amber-500">★ {provider.rating}</span>
                            )}
                            {provider.distance && (
                              <span className="text-sm text-gray-500">{provider.distance} km</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={handleFilterApply}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </main>
  );
}
