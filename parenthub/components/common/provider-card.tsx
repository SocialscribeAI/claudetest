/**
 * PROVIDER CARD - components/common/provider-card.tsx
 *
 * Purpose: Card displaying provider summary in lists
 *
 * Variants: default, compact, horizontal
 * Used in: Search results, Category pages, Map info, Favorites, Home page
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { PriceBand } from "./price-band";
import { DistanceBadge } from "./distance-badge";
import { cn } from "@/lib/utils/cn";

interface ProviderCardProps {
  provider: {
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
  };
  variant?: "default" | "compact" | "horizontal";
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export function ProviderCard({
  provider,
  variant = "default",
  showFavorite = true,
  isFavorited = false,
  onFavoriteToggle,
}: ProviderCardProps) {
  const placeholder = "/images/placeholder-provider.jpg";

  if (variant === "compact") {
    return (
      <Link href={`/provider/${provider.slug}`}>
        <Card hoverable className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={provider.photo || placeholder}
                alt={provider.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{provider.name}</h3>
              {provider.rating !== null && provider.rating !== undefined && (
                <StarRating rating={provider.rating} size="sm" showCount={false} />
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/provider/${provider.slug}`}>
        <Card hoverable className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={provider.photo || placeholder}
                alt={provider.name}
                fill
                className="object-cover"
              />
              {provider.isFeatured && (
                <div className="absolute top-2 start-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Featured
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                    {provider.name}
                    {provider.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{provider.categoryHe || provider.category}</p>
                </div>
                {showFavorite && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onFavoriteToggle?.();
                    }}
                    className="p-1.5 -m-1.5"
                  >
                    <svg
                      className={cn("w-5 h-5", isFavorited ? "text-red-500 fill-current" : "text-gray-400")}
                      fill={isFavorited ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {provider.rating !== null && provider.rating !== undefined && (
                  <StarRating rating={provider.rating} count={provider.reviewCount} size="sm" />
                )}
                {provider.priceBand && <PriceBand band={provider.priceBand} />}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                {provider.city && <span>{provider.city}</span>}
                {provider.distance !== null && provider.distance !== undefined && (
                  <>
                    <span>•</span>
                    <DistanceBadge distance={provider.distance} />
                  </>
                )}
                {provider.isAvailable && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Available
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant - vertical card
  return (
    <Link href={`/provider/${provider.slug}`}>
      <Card hoverable className="overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3]">
          <Image
            src={provider.photo || placeholder}
            alt={provider.name}
            fill
            className="object-cover"
          />
          {/* Badges */}
          <div className="absolute top-3 start-3 flex gap-2">
            {provider.isFeatured && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                Featured
              </span>
            )}
          </div>
          {/* Favorite button */}
          {showFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.();
              }}
              className="absolute top-3 end-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <svg
                className={cn("w-5 h-5", isFavorited ? "text-red-500 fill-current" : "text-gray-600")}
                fill={isFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          {/* Availability */}
          {provider.isAvailable && (
            <div className="absolute bottom-3 start-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-medium text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Available now
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                {provider.name}
                {provider.isVerified && (
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </h3>
              <p className="text-sm text-gray-500 truncate">{provider.categoryHe || provider.category}</p>
            </div>
            {provider.priceBand && <PriceBand band={provider.priceBand} />}
          </div>

          <div className="flex items-center gap-3 mt-3">
            {provider.rating !== null && provider.rating !== undefined && (
              <StarRating rating={provider.rating} count={provider.reviewCount} size="sm" />
            )}
          </div>

          {(provider.city || provider.distance !== null) && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              {provider.city && <span>{provider.city}</span>}
              {provider.distance !== null && provider.distance !== undefined && (
                <>
                  <span>•</span>
                  <DistanceBadge distance={provider.distance} />
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
