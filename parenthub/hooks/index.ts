/**
 * HOOKS INDEX - hooks/index.ts
 *
 * Purpose: Central export for custom React hooks
 *
 * Available hooks:
 * - useLocation: Get user's current location
 * - useAnalytics: Track analytics events
 * - useFavorites: Manage favorite providers
 * - useDebounce: Debounce value changes
 * - useLocalStorage: Persist state in localStorage
 * - useMediaQuery: Responsive breakpoint detection
 *
 * Usage:
 * import { useLocation, useAnalytics, useFavorites } from "@/hooks";
 */

export * from "./use-location";
export * from "./use-analytics";
export * from "./use-favorites";
export * from "./use-api";
