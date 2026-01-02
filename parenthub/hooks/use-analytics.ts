/**
 * USE ANALYTICS HOOK - hooks/use-analytics.ts
 *
 * Purpose: Hook wrapper for analytics tracking
 *
 * Returns:
 * - track: (event, properties) => void
 *
 * Features:
 * - Automatically includes location if available
 * - Includes user ID if authenticated
 * - Provides typed event names
 *
 * Usage:
 * const { track } = useAnalytics();
 *
 * track("profile_view", { providerId: "123" });
 * track("call_click", { providerId: "123", distance: 2.5 });
 */

"use client";

import { useCallback } from "react";
import { track as trackEvent } from "@/lib/analytics/tracker";
import { useLocation } from "./use-location";

type EventName =
  | "app_open"
  | "search_submit"
  | "results_shown"
  | "map_move"
  | "search_this_area"
  | "result_click"
  | "profile_view"
  | "call_click"
  | "whatsapp_click"
  | "navigate_click"
  | "address_copy"
  | "review_submit"
  | "favorite_add"
  | "favorite_remove";

interface EventProperties {
  providerId?: string;
  categoryId?: string;
  query?: string;
  resultCount?: number;
  position?: number;
  rating?: number;
  distance?: number;
  [key: string]: string | number | boolean | undefined;
}

export function useAnalytics() {
  const { location } = useLocation();

  const track = useCallback(
    (event: EventName, properties: EventProperties = {}) => {
      // Add location if available
      if (location) {
        properties.userLat = location.lat;
        properties.userLng = location.lng;
      }

      trackEvent(event, properties);
    },
    [location]
  );

  return { track };
}
