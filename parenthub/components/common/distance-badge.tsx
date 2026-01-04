/**
 * DISTANCE BADGE - components/common/distance-badge.tsx
 *
 * Purpose: Display distance from user to provider
 *
 * Format: "800 m", "2.5 km", "15 km"
 * Optional ETA: "5 min walk", "8 min drive"
 */

import { cn } from "@/lib/utils/cn";

interface DistanceBadgeProps {
  distance: number; // in km
  showEta?: boolean;
  etaMode?: "walk" | "drive";
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function DistanceBadge({
  distance,
  showEta = false,
  etaMode = "drive",
  size = "sm",
  showIcon = true,
}: DistanceBadgeProps) {
  // Format distance
  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    if (km < 10) {
      return `${km.toFixed(1)}km`;
    }
    return `${Math.round(km)}km`;
  };

  // Calculate ETA
  const calculateEta = (km: number, mode: "walk" | "drive"): string => {
    const speed = mode === "walk" ? 5 : 30; // km/h
    const minutes = Math.round((km / speed) * 60);
    if (minutes < 1) return "1 min";
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes} min`;
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-gray-500",
        sizeClasses[size]
      )}
    >
      {showIcon && (
        <svg
          className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
      <span>{formatDistance(distance)}</span>
      {showEta && (
        <span className="text-gray-400">
          • {calculateEta(distance, etaMode)} {etaMode === "walk" ? "walk" : "drive"}
        </span>
      )}
    </span>
  );
}

// Compact version without icon
export function DistanceText({ distance }: { distance: number }) {
  const formatDistance = (km: number): string => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    if (km < 10) return `${km.toFixed(1)}km`;
    return `${Math.round(km)}km`;
  };

  return <span className="text-xs text-gray-500">{formatDistance(distance)}</span>;
}
