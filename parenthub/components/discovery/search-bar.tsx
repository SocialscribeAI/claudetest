/**
 * SEARCH BAR - components/discovery/search-bar.tsx
 *
 * Purpose: Main search input with autocomplete
 *
 * Features:
 * - Text input with search icon
 * - Clear button when has text
 * - Autocomplete dropdown with suggestions
 * - Category suggestions
 * - Provider name suggestions
 * - Recent searches (stored in localStorage)
 * - Voice search button (future)
 *
 * Behavior:
 * - Debounced API calls (300ms)
 * - Show suggestions after 2+ characters
 * - Navigate on Enter or suggestion click
 * - Focus trap in dropdown
 *
 * Props:
 * - defaultValue: string
 * - placeholder: string
 * - onSearch: (query: string) => void
 * - showSuggestions: boolean
 * - autoFocus: boolean
 *
 * Analytics:
 * - search_submit on search
 * - suggestion_click on suggestion select
 */

"use client";

import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search providers...",
  onSearch,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          ✕
        </button>
      )}
    </form>
  );
}
