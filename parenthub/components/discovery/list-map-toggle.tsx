/**
 * LIST MAP TOGGLE - components/discovery/list-map-toggle.tsx
 *
 * Purpose: Toggle between list and map views
 *
 * Features:
 * - Two-button toggle with icons
 * - Active state indication with animation
 * - LocalStorage persistence
 * - Keyboard accessible
 */

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

type ViewMode = "list" | "map";

interface ListMapToggleProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
  persistKey?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STORAGE_KEY = "parenthub_view_mode";

export function ListMapToggle({
  activeView,
  onChange,
  persistKey,
  size = "md",
  className,
}: ListMapToggleProps) {
  const [mounted, setMounted] = useState(false);

  // Handle hydration and load persisted preference
  useEffect(() => {
    setMounted(true);

    if (persistKey !== undefined) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "list" || stored === "map") {
        onChange(stored);
      }
    }
  }, [persistKey, onChange]);

  // Persist preference
  const handleChange = (view: ViewMode) => {
    onChange(view);
    if (persistKey !== undefined) {
      localStorage.setItem(STORAGE_KEY, view);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: {
      container: "p-0.5",
      button: "px-2 py-1 text-xs gap-1",
      icon: "w-3.5 h-3.5",
    },
    md: {
      container: "p-1",
      button: "px-3 py-1.5 text-sm gap-1.5",
      icon: "w-4 h-4",
    },
    lg: {
      container: "p-1.5",
      button: "px-4 py-2 text-base gap-2",
      icon: "w-5 h-5",
    },
  };

  const sizes = sizeClasses[size];

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("bg-gray-100 rounded-lg", sizes.container, className)}>
        <div className="flex">
          <div className={cn("flex items-center rounded-md bg-white shadow-sm", sizes.button)}>
            <div className={cn("bg-gray-200 rounded", sizes.icon)} />
            <span className="opacity-0">List</span>
          </div>
          <div className={cn("flex items-center rounded-md", sizes.button)}>
            <div className={cn("bg-gray-200 rounded", sizes.icon)} />
            <span className="opacity-0">Map</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("bg-gray-100 rounded-lg", sizes.container, className)}
      role="tablist"
      aria-label="View mode"
    >
      <div className="flex relative">
        {/* Sliding background indicator */}
        <div
          className={cn(
            "absolute inset-y-0 bg-white rounded-md shadow-sm transition-transform duration-200 ease-out",
            activeView === "list" ? "translate-x-0" : "translate-x-full"
          )}
          style={{ width: "50%" }}
        />

        {/* List button */}
        <button
          onClick={() => handleChange("list")}
          role="tab"
          aria-selected={activeView === "list"}
          aria-controls="provider-list-panel"
          className={cn(
            "relative z-10 flex items-center rounded-md transition-colors",
            sizes.button,
            activeView === "list"
              ? "text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span>List</span>
        </button>

        {/* Map button */}
        <button
          onClick={() => handleChange("map")}
          role="tab"
          aria-selected={activeView === "map"}
          aria-controls="provider-map-panel"
          className={cn(
            "relative z-10 flex items-center rounded-md transition-colors",
            sizes.button,
            activeView === "map"
              ? "text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span>Map</span>
        </button>
      </div>
    </div>
  );
}

// Additional sort dropdown component for search results
interface SortOption {
  value: string;
  label: string;
  labelHe?: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
  className?: string;
}

const defaultSortOptions: SortOption[] = [
  { value: "relevance", label: "Most Relevant", labelHe: "הכי רלוונטי" },
  { value: "distance", label: "Nearest", labelHe: "הכי קרוב" },
  { value: "rating", label: "Highest Rated", labelHe: "דירוג גבוה" },
  { value: "reviews", label: "Most Reviews", labelHe: "הכי ביקורות" },
  { value: "price_low", label: "Price: Low to High", labelHe: "מחיר: נמוך לגבוה" },
  { value: "price_high", label: "Price: High to Low", labelHe: "מחיר: גבוה לנמוך" },
];

export function SortDropdown({
  value,
  onChange,
  options = defaultSortOptions,
  className,
}: SortDropdownProps) {
  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pe-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute end-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
