/**
 * ANALYTICS TRACKER - lib/analytics/tracker.ts
 *
 * Purpose: Client-side analytics event tracking
 *
 * Events tracked:
 * - app_open
 * - search_submit (query, category, results count)
 * - results_shown (count, hasResults)
 * - map_move
 * - search_this_area
 * - result_click (providerId, position)
 * - profile_view (providerId)
 * - call_click (providerId)
 * - whatsapp_click (providerId)
 * - navigate_click (providerId)
 * - review_submit (providerId, rating)
 * - favorite_add/remove (providerId)
 *
 * Implementation:
 * - Sends to /api/analytics/event
 * - Batches events (flush every 5s or 10 events)
 * - Includes session ID
 * - Includes distance bucket calculation
 *
 * Usage:
 * import { track } from "@/lib/analytics/tracker";
 * track("profile_view", { providerId: "123" });
 */

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

let eventQueue: { event: EventName; properties: EventProperties; timestamp: number }[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Calculate distance bucket
 */
function getDistanceBucket(distance?: number): string | undefined {
  if (!distance) return undefined;
  if (distance < 1) return "0-1km";
  if (distance < 3) return "1-3km";
  if (distance < 10) return "3-10km";
  return "10+km";
}

/**
 * Flush events to server
 */
async function flushEvents() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events,
        sessionId: getSessionId(),
      }),
    });
  } catch (error) {
    // Re-queue events on failure
    eventQueue = [...events, ...eventQueue];
  }
}

/**
 * Track an analytics event
 */
export function track(event: EventName, properties: EventProperties = {}) {
  // Add distance bucket if distance provided
  if (properties.distance) {
    properties.distanceBucket = getDistanceBucket(properties.distance);
  }

  eventQueue.push({
    event,
    properties,
    timestamp: Date.now(),
  });

  // Flush if queue is full
  if (eventQueue.length >= 10) {
    flushEvents();
    return;
  }

  // Schedule flush
  if (!flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      flushEvents();
    }, 5000);
  }
}

// Flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushEvents);
}
