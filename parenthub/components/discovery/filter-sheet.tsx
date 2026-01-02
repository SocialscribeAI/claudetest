/**
 * FILTER SHEET - components/discovery/filter-sheet.tsx
 *
 * Purpose: Bottom sheet with search filters
 *
 * Filters:
 * - Distance radius (slider: 1, 3, 5, 10, 25, 50 km)
 * - Price band (multi-select: ₪, ₪₪, ₪₪₪)
 * - Availability (toggle: available now)
 * - Categories (multi-select chips)
 * - Languages (multi-select)
 *
 * Features:
 * - Clear all filters button
 * - Apply button with result count preview
 * - Reset to defaults
 * - Filter count badge on trigger
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - filters: FilterState
 * - onApply: (filters: FilterState) => void
 * - resultCount: number (preview)
 *
 * Analytics:
 * - filter_apply on apply
 * - filter_clear on clear
 */

"use client";

import { Sheet, SheetHeader, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface FilterState {
  radius: number;
  priceBands: number[];
  availableNow: boolean;
  categories: string[];
  languages: string[];
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  resultCount?: number;
}

export function FilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
  resultCount,
}: FilterSheetProps) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} side="bottom">
      <SheetHeader>
        <h2 className="text-lg font-semibold">Filters</h2>
      </SheetHeader>
      <SheetContent>
        {/* TODO: Implement filter controls */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Distance</label>
            <input type="range" min="1" max="50" className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Price Range</label>
            {/* Price band selector */}
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Clear
          </Button>
          <Button onClick={() => onApply(filters)}>
            Show {resultCount} results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
