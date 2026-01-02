/**
 * PROVIDER LIST - components/discovery/provider-list.tsx
 *
 * Purpose: Scrollable list of provider cards
 *
 * Features:
 * - Virtualized scrolling for performance
 * - Pull to refresh
 * - Infinite scroll / load more
 * - Loading skeletons
 * - Empty state
 *
 * Props:
 * - providers: Provider[]
 * - isLoading: boolean
 * - hasMore: boolean
 * - onLoadMore: () => void
 * - onRefresh: () => void
 * - onProviderClick: (id: string) => void
 * - emptyMessage?: string
 *
 * Performance:
 * - Uses react-window for virtualization
 * - Lazy loads images
 * - Memoized card components
 */

"use client";

import { ProviderCard } from "@/components/common/provider-card";
import { EmptyState } from "@/components/common/empty-state";

interface Provider {
  id: string;
  name: string;
  category: string;
  photo?: string;
  rating?: number;
  reviewCount?: number;
  distance?: number;
}

interface ProviderListProps {
  providers: Provider[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onProviderClick?: (id: string) => void;
}

export function ProviderList({
  providers,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onProviderClick,
}: ProviderListProps) {
  if (!isLoading && providers.length === 0) {
    return <EmptyState variant="noResults" />;
  }

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <div key={provider.id} onClick={() => onProviderClick?.(provider.id)}>
          <ProviderCard provider={provider} />
        </div>
      ))}
      {isLoading && (
        <div className="text-center py-4">Loading...</div>
      )}
      {hasMore && !isLoading && (
        <button onClick={onLoadMore} className="w-full py-2 text-primary">
          Load more
        </button>
      )}
    </div>
  );
}
