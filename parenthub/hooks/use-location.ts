/**
 * USE LOCATION HOOK - hooks/use-location.ts
 *
 * Purpose: Get and watch user's current location
 *
 * Returns:
 * - location: { lat, lng } | null
 * - isLoading: boolean
 * - error: Error | null
 * - refresh: () => void
 *
 * Features:
 * - Requests location permission
 * - Caches location for 5 minutes
 * - Falls back to IP-based location (future)
 * - Watches for location changes (optional)
 *
 * Usage:
 * const { location, isLoading, error } = useLocation();
 *
 * if (location) {
 *   // Use location.lat, location.lng
 * }
 */

"use client";

import { useState, useEffect, useCallback } from "react";

interface LocationState {
  lat: number;
  lng: number;
}

interface UseLocationResult {
  location: LocationState | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const CACHE_KEY = "user_location";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getLocation = useCallback(() => {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { location, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setLocation(location);
        setIsLoading(false);
        return;
      }
    }

    // Request fresh location
    if (!navigator.geolocation) {
      setError(new Error("Geolocation not supported"));
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(loc);
        setError(null);
        setIsLoading(false);

        // Cache the location
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ location: loc, timestamp: Date.now() })
        );
      },
      (err) => {
        setError(new Error(err.message));
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    location,
    isLoading,
    error,
    refresh: getLocation,
  };
}
