/**
 * USE FAVORITES HOOK - hooks/use-favorites.ts
 *
 * Purpose: Manage user's favorite providers
 *
 * Returns:
 * - favorites: string[] (provider IDs)
 * - isFavorite: (id: string) => boolean
 * - addFavorite: (id: string) => void
 * - removeFavorite: (id: string) => void
 * - toggleFavorite: (id: string) => void
 * - isLoading: boolean
 *
 * Features:
 * - Syncs with server if authenticated
 * - Falls back to localStorage if not authenticated
 * - Optimistic updates
 * - Tracks analytics events
 *
 * Usage:
 * const { isFavorite, toggleFavorite } = useFavorites();
 *
 * <button onClick={() => toggleFavorite(provider.id)}>
 *   {isFavorite(provider.id) ? "❤️" : "🤍"}
 * </button>
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnalytics } from "./use-analytics";

const STORAGE_KEY = "favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { track } = useAnalytics();

  // Load favorites on mount
  useEffect(() => {
    // TODO: If authenticated, fetch from server
    // For now, use localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const addFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
      track("favorite_add", { providerId: id });
    },
    [track]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => prev.filter((fid) => fid !== id));
      track("favorite_remove", { providerId: id });
    },
    [track]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (isFavorite(id)) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isLoading,
  };
}
