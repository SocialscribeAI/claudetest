/**
 * LOCATION CONTEXT - contexts/location-context.tsx
 *
 * Purpose: Share user's location across the app
 *
 * Provides:
 * - location: { lat, lng } | null
 * - isLoading: boolean
 * - error: Error | null
 * - requestPermission: () => void
 * - setManualLocation: (location) => void
 *
 * Features:
 * - Requests permission on first need
 * - Caches location
 * - Allows manual location override
 * - City detection from coordinates
 *
 * Usage:
 * // In layout
 * <LocationProvider>
 *   {children}
 * </LocationProvider>
 *
 * // In component
 * const { location, isLoading } = useLocationContext();
 */

"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLocation } from "@/hooks/use-location";

interface LocationContextValue {
  location: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const locationState = useLocation();

  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}
