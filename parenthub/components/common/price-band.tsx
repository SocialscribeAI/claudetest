/**
 * PRICE BAND - components/common/price-band.tsx
 *
 * Purpose: Display price tier indicator
 *
 * Bands: BUDGET (₪), MIDRANGE (₪₪), PREMIUM (₪₪₪)
 */

import { cn } from "@/lib/utils/cn";

type PriceBandType = "BUDGET" | "MIDRANGE" | "PREMIUM" | 1 | 2 | 3;

interface PriceBandProps {
  band: PriceBandType;
  mode?: "display" | "input";
  onChange?: (band: PriceBandType) => void;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const labels: Record<number, string> = {
  1: "Budget",
  2: "Mid-range",
  3: "Premium",
};

const labelColors: Record<number, string> = {
  1: "text-green-600",
  2: "text-blue-600",
  3: "text-purple-600",
};

function bandToNumber(band: PriceBandType): number {
  if (typeof band === "number") return band;
  switch (band) {
    case "BUDGET":
      return 1;
    case "MIDRANGE":
      return 2;
    case "PREMIUM":
      return 3;
    default:
      return 2;
  }
}

export function PriceBand({
  band,
  mode = "display",
  onChange,
  showLabel = false,
  size = "sm",
}: PriceBandProps) {
  const numericBand = bandToNumber(band);
  const symbols = [1, 2, 3];

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <div className={cn("inline-flex items-center gap-0.5", sizeClasses[size])}>
      <span className="flex">
        {symbols.map((level) => (
          <span
            key={level}
            onClick={() => {
              if (mode === "input" && onChange) {
                const bands: PriceBandType[] = ["BUDGET", "MIDRANGE", "PREMIUM"];
                onChange(bands[level - 1]);
              }
            }}
            className={cn(
              "transition-colors",
              level <= numericBand
                ? labelColors[numericBand]
                : "text-gray-300",
              level <= numericBand && "font-semibold",
              mode === "input" && "cursor-pointer hover:opacity-80"
            )}
          >
            ₪
          </span>
        ))}
      </span>
      {showLabel && (
        <span className={cn("ms-1.5 text-gray-500", sizeClasses[size])}>
          {labels[numericBand]}
        </span>
      )}
    </div>
  );
}

// Compact inline version
export function PriceBandInline({ band }: { band: PriceBandType }) {
  const numericBand = bandToNumber(band);

  return (
    <span className={cn("text-xs font-medium", labelColors[numericBand])}>
      {"₪".repeat(numericBand)}
    </span>
  );
}
