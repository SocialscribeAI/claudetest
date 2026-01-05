/**
 * FILTER SHEET - components/discovery/filter-sheet.tsx
 *
 * Purpose: Bottom sheet with search filters
 *
 * Filters: Distance, Price, Availability, Categories, Languages
 */

"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface FilterState {
  radius: number;
  priceBands: ("BUDGET" | "MIDRANGE" | "PREMIUM")[];
  availableNow: boolean;
  categories: string[];
  languages: string[];
}

interface Category {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  categories?: Category[];
  resultCount?: number;
}

const radiusOptions = [1, 3, 5, 10, 25, 50];

const languageOptions = [
  { value: "he", label: "עברית" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "fr", label: "Français" },
];

const defaultFilters: FilterState = {
  radius: 10,
  priceBands: [],
  availableNow: false,
  categories: [],
  languages: [],
};

export function FilterSheet({
  isOpen,
  onClose,
  filters: initialFilters,
  onApply,
  categories = [],
  resultCount,
}: FilterSheetProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Reset to initial filters when sheet opens
  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.radius !== 10) count++;
    if (filters.priceBands.length > 0) count++;
    if (filters.availableNow) count++;
    if (filters.categories.length > 0) count++;
    if (filters.languages.length > 0) count++;
    return count;
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Filters" side="bottom">
      <div className="space-y-6">
        {/* Distance */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Distance
          </label>
          <div className="flex flex-wrap gap-2">
            {radiusOptions.map((radius) => (
              <button
                key={radius}
                onClick={() => setFilters((f) => ({ ...f, radius }))}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  filters.radius === radius
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {radius} km
              </button>
            ))}
          </div>
        </div>

        {/* Price Band */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Price Range
          </label>
          <div className="flex gap-2">
            {([
              { value: "BUDGET", label: "₪", sublabel: "Budget" },
              { value: "MIDRANGE", label: "₪₪", sublabel: "Mid-range" },
              { value: "PREMIUM", label: "₪₪₪", sublabel: "Premium" },
            ] as const).map(({ value, label, sublabel }) => (
              <button
                key={value}
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    priceBands: f.priceBands.includes(value)
                      ? f.priceBands.filter((p) => p !== value)
                      : [...f.priceBands, value],
                  }))
                }
                className={cn(
                  "flex-1 py-3 rounded-xl text-center transition-all border-2",
                  filters.priceBands.includes(value)
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                )}
              >
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-gray-500">{sublabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Available Now */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              Available Now
            </span>
            <button
              onClick={() =>
                setFilters((f) => ({ ...f, availableNow: !f.availableNow }))
              }
              className={cn(
                "relative w-12 h-7 rounded-full transition-colors",
                filters.availableNow ? "bg-pink-500" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                  filters.availableNow ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </label>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      categories: f.categories.includes(category.slug)
                        ? f.categories.filter((c) => c !== category.slug)
                        : [...f.categories, category.slug],
                    }))
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all",
                    filters.categories.includes(category.slug)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category.nameHe || category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.value}
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    languages: f.languages.includes(lang.value)
                      ? f.languages.filter((l) => l !== lang.value)
                      : [...f.languages, lang.value],
                  }))
                }
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  filters.languages.includes(lang.value)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SheetFooter>
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1"
          disabled={activeFilterCount() === 0}
        >
          Clear all
        </Button>
        <Button onClick={handleApply} className="flex-1">
          {resultCount !== undefined
            ? `Show ${resultCount} results`
            : "Apply filters"}
        </Button>
      </SheetFooter>
    </Sheet>
  );
}

// Filter trigger button
interface FilterButtonProps {
  onClick: () => void;
  activeCount: number;
}

export function FilterButton({ onClick, activeCount }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
        activeCount > 0
          ? "border-pink-500 bg-pink-50 text-pink-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
      )}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span className="font-medium">Filters</span>
      {activeCount > 0 && (
        <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-pink-500 text-white rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}
