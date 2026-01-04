/**
 * STAR RATING - components/common/star-rating.tsx
 *
 * Purpose: Display and input for star ratings
 *
 * Modes: display (read-only), input (interactive)
 * Sizes: sm, md, lg
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

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
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating;

  const sizes = {
    sm: "text-sm gap-0.5",
    md: "text-lg gap-1",
    lg: "text-2xl gap-1.5",
  };

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const renderStar = (index: number) => {
    const filled = index <= displayRating;
    const halfFilled = !filled && index - 0.5 <= displayRating;

    return (
      <span
        key={index}
        className={cn(
          "relative transition-transform",
          mode === "input" && "cursor-pointer hover:scale-110"
        )}
        onClick={() => mode === "input" && onChange?.(index)}
        onMouseEnter={() => mode === "input" && setHoverRating(index)}
        onMouseLeave={() => mode === "input" && setHoverRating(null)}
      >
        {/* Background star (empty) */}
        <svg
          className={cn(starSizes[size], "text-gray-300")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {/* Foreground star (filled) */}
        {(filled || halfFilled) && (
          <svg
            className={cn(
              starSizes[size],
              "absolute inset-0 text-yellow-400",
              halfFilled && "clip-path-half"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            style={halfFilled ? { clipPath: "inset(0 50% 0 0)" } : undefined}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    );
  };

  return (
    <div className={cn("inline-flex items-center", sizes[size])}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      {showNumber && rating > 0 && (
        <span className={cn("font-medium text-gray-900 ms-1.5", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && count !== undefined && count > 0 && (
        <span className={cn("text-gray-500 ms-1", textSizes[size])}>
          ({count})
        </span>
      )}
    </div>
  );
}

// Simple inline star display
export function StarRatingInline({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  };

  return (
    <div className="inline-flex items-center gap-1">
      <svg
        className={cn(starSizes[size], "text-yellow-400")}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
    </div>
  );
}
