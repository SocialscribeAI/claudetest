/**
 * PROVIDER CARD - components/common/provider-card.tsx
 *
 * Purpose: Card displaying provider summary in lists
 *
 * Used in:
 * - Search results
 * - Category pages
 * - Map info windows
 * - Favorites list
 * - Home page "near you" section
 *
 * Display:
 * - Provider photo (or placeholder)
 * - Name
 * - Category badge
 * - Star rating (average + count)
 * - Price band indicator (₪, ₪₪, ₪₪₪)
 * - Distance from user
 * - Availability indicator (green dot if available)
 * - Featured badge (if sponsored)
 * - Favorite button (heart icon)
 *
 * Variants:
 * - default: Full card for list view
 * - compact: Smaller for map info windows
 * - horizontal: Side-by-side layout
 *
 * Props:
 * - provider: ProviderSummary
 * - variant: CardVariant
 * - showFavorite: boolean
 * - onFavoriteToggle: () => void
 * - onClick: () => void
 *
 * Analytics:
 * - Logs result_click on click
 */

import { Card } from "@/components/ui/card";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    category: string;
    photo?: string;
    rating?: number;
    reviewCount?: number;
    priceBand?: number;
    distance?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
  };
  variant?: "default" | "compact" | "horizontal";
}

export function ProviderCard({ provider, variant = "default" }: ProviderCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      {/* TODO: Implement provider card */}
      <div className="p-4">
        <h3 className="font-semibold">{provider.name}</h3>
        <p className="text-sm text-gray-500">{provider.category}</p>
      </div>
    </Card>
  );
}
