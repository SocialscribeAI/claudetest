/**
 * DISTANCE BADGE - components/common/distance-badge.tsx
 *
 * Purpose: Display distance from user to provider
 *
 * Display format:
 * - Under 1km: "800 m"
 * - 1-10km: "2.5 km"
 * - Over 10km: "15 km"
 *
 * Optional ETA:
 * - Walking: "5 min walk"
 * - Driving: "8 min drive"
 *
 * Props:
 * - distance: number (in km)
 * - showEta: boolean
 * - etaMode: "walk" | "drive"
 * - size: "sm" | "md"
 *
 * Calculation:
 * - Walking: ~5 km/h
 * - Driving: ~30 km/h (urban average)
 */

interface DistanceBadgeProps {
  distance: number; // in km
  showEta?: boolean;
  etaMode?: "walk" | "drive";
  size?: "sm" | "md";
}

export function DistanceBadge({
  distance,
  showEta = false,
  etaMode = "drive",
  size = "sm",
}: DistanceBadgeProps) {
  // Format distance
  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  // Calculate ETA
  const calculateEta = (km: number, mode: "walk" | "drive"): string => {
    const speed = mode === "walk" ? 5 : 30; // km/h
    const minutes = Math.round((km / speed) * 60);
    if (minutes < 1) return "1 min";
    if (minutes > 60) return `${Math.round(minutes / 60)} hr`;
    return `${minutes} min`;
  };

  return (
    <span className={`text-gray-500 ${size === "sm" ? "text-xs" : "text-sm"}`}>
      {formatDistance(distance)}
      {showEta && ` • ${calculateEta(distance, etaMode)} ${etaMode}`}
    </span>
  );
}
