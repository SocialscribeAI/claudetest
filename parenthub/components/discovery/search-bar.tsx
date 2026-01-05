/**
 * SEARCH BAR - components/discovery/search-bar.tsx
 *
 * Purpose: Main search input with autocomplete
 *
 * Features: Debounced search, suggestions, recent searches, clear button
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface Suggestion {
  type: "category" | "provider" | "recent";
  id: string;
  name: string;
  icon?: string;
  slug?: string;
}

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "hero";
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search for babysitters, tutors, activities...",
  onSearch,
  showSuggestions = true,
  autoFocus = false,
  size = "md",
  variant = "default",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get recent searches from localStorage
  const getRecentSearches = useCallback((): Suggestion[] => {
    if (typeof window === "undefined") return [];
    const recent = localStorage.getItem("recentSearches");
    if (!recent) return [];
    try {
      const searches = JSON.parse(recent) as string[];
      return searches.slice(0, 5).map((s) => ({
        type: "recent" as const,
        id: s,
        name: s,
      }));
    } catch {
      return [];
    }
  }, []);

  // Save to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (typeof window === "undefined" || !searchQuery.trim()) return;
    const recent = localStorage.getItem("recentSearches");
    let searches: string[] = [];
    try {
      searches = recent ? JSON.parse(recent) : [];
    } catch {
      searches = [];
    }
    searches = [searchQuery, ...searches.filter((s) => s !== searchQuery)].slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  // Fetch suggestions (debounced)
  useEffect(() => {
    if (!showSuggestions || query.length < 2) {
      setSuggestions(query.length === 0 ? getRecentSearches() : []);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch {
        // Fallback to recent searches
        setSuggestions(getRecentSearches());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showSuggestions, getRecentSearches]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    saveRecentSearch(query);
    setIsOpen(false);

    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "category" && suggestion.slug) {
      router.push(`/category/${suggestion.slug}`);
    } else if (suggestion.type === "provider" && suggestion.slug) {
      router.push(`/provider/${suggestion.slug}`);
    } else {
      setQuery(suggestion.name);
      saveRecentSearch(suggestion.name);
      if (onSearch) {
        onSearch(suggestion.name);
      } else {
        router.push(`/search?q=${encodeURIComponent(suggestion.name)}`);
      }
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const sizeClasses = {
    sm: "py-2 ps-9 pe-9 text-sm",
    md: "py-3 ps-11 pe-11 text-base",
    lg: "py-4 ps-12 pe-12 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconPositions = {
    sm: "start-2.5",
    md: "start-3.5",
    lg: "start-4",
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <div className={cn("absolute inset-y-0 flex items-center pointer-events-none text-gray-400", iconPositions[size])}>
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "w-full rounded-2xl border bg-white text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",
              "transition-all duration-200",
              variant === "hero"
                ? "border-gray-200 shadow-lg"
                : "border-gray-300 hover:border-gray-400",
              sizeClasses[size]
            )}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className={cn(
                "absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
              )}
            >
              <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <ul className="py-2 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.type}-${suggestion.id}`}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-start transition-colors",
                    selectedIndex === index
                      ? "bg-pink-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span className="text-xl flex-shrink-0">
                    {suggestion.type === "recent" && "🕒"}
                    {suggestion.type === "category" && (suggestion.icon || "📁")}
                    {suggestion.type === "provider" && "👤"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate">{suggestion.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {suggestion.type === "recent" ? "Recent search" : suggestion.type}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
