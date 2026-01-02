/**
 * CATEGORY TILE - components/common/category-tile.tsx
 *
 * Purpose: Clickable tile for category navigation
 *
 * Used in:
 * - Home page category grid
 * - Search page category chips
 *
 * Display:
 * - Category icon
 * - Category name (localized)
 * - Provider count (optional)
 *
 * Variants:
 * - tile: Square tile with icon for grids
 * - chip: Horizontal chip for inline lists
 * - pill: Rounded pill for filters
 *
 * Props:
 * - category: Category
 * - variant: TileVariant
 * - isActive: boolean (for filter chips)
 * - onClick: () => void
 * - showCount: boolean
 *
 * Accessibility:
 * - Keyboard navigable
 * - ARIA labels
 */

interface CategoryTileProps {
  category: {
    id: string;
    name: string;
    nameHe?: string;
    icon?: string;
    providerCount?: number;
  };
  variant?: "tile" | "chip" | "pill";
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryTile({
  category,
  variant = "tile",
  isActive = false,
  onClick,
}: CategoryTileProps) {
  if (variant === "chip" || variant === "pill") {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-sm ${
          isActive ? "bg-primary text-white" : "bg-gray-100"
        }`}
      >
        {category.name}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100"
    >
      <span className="text-2xl mb-2">{category.icon || "📍"}</span>
      <span className="text-sm font-medium">{category.name}</span>
    </button>
  );
}
