/**
 * PROVIDER LIST - components/discovery/provider-list.tsx
 *
 * Purpose: Scrollable list of provider cards with infinite scroll
 *
 * Features:
 * - Loading skeleton states
 * - Infinite scroll / load more
 * - Pull to refresh (mobile)
 * - Empty state handling
 * - Optimized rendering
 */

"use client";

import { useRef, useEffect, useCallback } from "react";
import { ProviderCard } from "@/components/common/provider-card";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils/cn";

interface Provider {
  id: string;
  slug: string;
  name: string;
  category?: string;
  categoryHe?: string;
  photo?: string;
  rating?: number | null;
  reviewCount?: number;
  priceBand?: "BUDGET" | "MIDRANGE" | "PREMIUM";
  distance?: number | null;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  city?: string;
}

interface ProviderListProps {
  providers: Provider[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onProviderClick?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
  favorites?: Set<string>;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

// Skeleton loader for provider cards
function ProviderCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" | "horizontal" }) {
  if (variant === "compact") {
    return (
      <div className="bg-white rounded-xl p-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-10" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export function ProviderList({
  providers,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onProviderClick,
  onFavoriteToggle,
  favorites = new Set(),
  emptyMessage,
  emptyAction,
  variant = "horizontal",
  className,
}: ProviderListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !onLoadMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isLoadingMore]);

  // Handle pull to refresh on mobile
  const handlePullRefresh = useCallback(() => {
    // This would trigger a refresh in the parent component
    // For now, this is a placeholder for pull-to-refresh logic
  }, []);

  // Initial loading state - show skeletons
  if (isLoading && providers.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ProviderCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && providers.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          variant="noResults"
          title={emptyMessage}
          action={emptyAction}
        />
      </div>
    );
  }

  // Grid layout for default variant
  const gridClass = variant === "default"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "space-y-4";

  return (
    <div className={cn(gridClass, className)}>
      {providers.map((provider, index) => (
        <div
          key={provider.id}
          onClick={() => onProviderClick?.(provider.id)}
          className="cursor-pointer"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <ProviderCard
            provider={provider}
            variant={variant}
            isFavorited={favorites.has(provider.id)}
            onFavoriteToggle={() => onFavoriteToggle?.(provider.id)}
          />
        </div>
      ))}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <>
          {Array.from({ length: 2 }).map((_, i) => (
            <ProviderCardSkeleton key={`loading-${i}`} variant={variant} />
          ))}
        </>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && !isLoadingMore && (
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors"
          >
            Load more providers
          </button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && providers.length > 0 && (
        <div className="py-6 text-center text-sm text-gray-500 col-span-full">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-gray-300" />
            <span>You've seen all {providers.length} providers</span>
            <div className="w-8 h-px bg-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
}

// Export skeleton for use in other components
export { ProviderCardSkeleton };
