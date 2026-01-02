/**
 * STAR RATING - components/common/star-rating.tsx
 *
 * Purpose: Display and input for star ratings
 *
 * Modes:
 * - display: Read-only rating display
 * - input: Interactive rating input
 *
 * Display mode:
 * - Shows filled/empty stars
 * - Shows rating number (e.g., "4.5")
 * - Shows review count (e.g., "(123 reviews)")
 * - Supports half stars
 *
 * Input mode:
 * - Hover to preview rating
 * - Click to select
 * - Animated feedback
 *
 * Sizes:
 * - sm: Small stars for cards
 * - md: Medium for profile
 * - lg: Large for review input
 *
 * Props:
 * - rating: number (0-5)
 * - count?: number (review count)
 * - mode: "display" | "input"
 * - size: "sm" | "md" | "lg"
 * - onChange: (rating: number) => void
 * - showNumber: boolean
 * - showCount: boolean
 */

interface StarRatingProps {
  rating: number;
  count?: number;
  mode?: "display" | "input";
  size?: "sm" | "md" | "lg";
  onChange?: (rating: number) => void;
  showNumber?: boolean;
  showCount?: boolean;
}

export function StarRating({
  rating,
  count,
  mode = "display",
  size = "md",
  onChange,
  showNumber = true,
  showCount = true,
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => mode === "input" && onChange?.(star)}
        >
          ★
        </span>
      ))}
      {showNumber && <span className="text-sm ml-1">{rating.toFixed(1)}</span>}
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}
