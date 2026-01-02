/**
 * PRICE BAND - components/common/price-band.tsx
 *
 * Purpose: Display price tier indicator
 *
 * Display:
 * - ₪ = Budget friendly
 * - ₪₪ = Mid-range
 * - ₪₪₪ = Premium
 *
 * Modes:
 * - display: Shows current price band
 * - input: Selectable price band picker
 *
 * Props:
 * - band: 1 | 2 | 3
 * - mode: "display" | "input"
 * - onChange: (band: number) => void
 * - showLabel: boolean (shows "Budget", "Mid-range", etc.)
 *
 * Styling:
 * - Active symbols are bold/colored
 * - Inactive symbols are grayed
 */

interface PriceBandProps {
  band: 1 | 2 | 3;
  mode?: "display" | "input";
  onChange?: (band: 1 | 2 | 3) => void;
  showLabel?: boolean;
}

const labels: Record<number, string> = {
  1: "Budget friendly",
  2: "Mid-range",
  3: "Premium",
};

export function PriceBand({
  band,
  mode = "display",
  onChange,
  showLabel = false,
}: PriceBandProps) {
  const symbols = [1, 2, 3];

  return (
    <div className="flex items-center gap-1">
      {symbols.map((level) => (
        <span
          key={level}
          onClick={() => mode === "input" && onChange?.(level as 1 | 2 | 3)}
          className={`${
            level <= band ? "text-green-600 font-bold" : "text-gray-300"
          } ${mode === "input" ? "cursor-pointer" : ""}`}
        >
          ₪
        </span>
      ))}
      {showLabel && <span className="text-sm text-gray-500 ml-2">{labels[band]}</span>}
    </div>
  );
}
