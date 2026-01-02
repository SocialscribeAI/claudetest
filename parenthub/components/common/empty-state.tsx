/**
 * EMPTY STATE - components/common/empty-state.tsx
 *
 * Purpose: Friendly display when no content is available
 *
 * Use cases:
 * - No search results
 * - Empty favorites list
 * - No reviews yet
 * - Offline state
 * - Permission denied
 *
 * Display:
 * - Illustration (optional)
 * - Title
 * - Description
 * - Action button (optional)
 *
 * Variants:
 * - noResults: No search results
 * - noFavorites: Empty favorites
 * - noReviews: No reviews yet
 * - offline: No internet connection
 * - noLocation: Location permission needed
 * - error: Something went wrong
 *
 * Props:
 * - variant: EmptyStateVariant
 * - title?: string (override default)
 * - description?: string (override default)
 * - action?: { label: string, onClick: () => void }
 * - illustration?: ReactNode
 */

interface EmptyStateProps {
  variant?: "noResults" | "noFavorites" | "noReviews" | "offline" | "noLocation" | "error";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const defaults = {
  noResults: {
    title: "No results found",
    description: "Try adjusting your filters or search terms",
  },
  noFavorites: {
    title: "No favorites yet",
    description: "Save providers you like to find them easily later",
  },
  noReviews: {
    title: "No reviews yet",
    description: "Be the first to share your experience",
  },
  offline: {
    title: "You're offline",
    description: "Check your internet connection and try again",
  },
  noLocation: {
    title: "Location needed",
    description: "Enable location to find providers near you",
  },
  error: {
    title: "Something went wrong",
    description: "Please try again later",
  },
};

export function EmptyState({
  variant = "noResults",
  title,
  description,
  action,
}: EmptyStateProps) {
  const content = defaults[variant];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold mb-2">{title || content.title}</h3>
      <p className="text-gray-500 mb-4">{description || content.description}</p>
      {action && (
        <button onClick={action.onClick} className="text-primary font-medium">
          {action.label}
        </button>
      )}
    </div>
  );
}
