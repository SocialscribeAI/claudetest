/**
 * PROVIDERS LIST API - app/api/providers/route.ts
 *
 * Purpose: List and filter providers (public)
 *
 * GET /api/providers
 *
 * Query parameters:
 * - lat: number          // User latitude
 * - lng: number          // User longitude
 * - radius: number       // Distance in km (default: 10)
 * - category: string     // Category slug filter
 * - q: string            // Search query
 * - sort: string         // "distance" | "rating" | "featured"
 * - price: string        // Price band filter (1,2,3)
 * - available: boolean   // Only available now
 * - page: number         // Page number (default: 1)
 * - limit: number        // Items per page (default: 20)
 *
 * Response:
 * {
 *   providers: Provider[],
 *   total: number,
 *   page: number,
 *   totalPages: number
 * }
 *
 * Provider object includes:
 * - id, name, slug
 * - category (name, icon)
 * - photos (first image)
 * - rating (average, count)
 * - priceBand
 * - distance (calculated from user location)
 * - isAvailable
 * - isFeatured
 *
 * Sorting:
 * - distance: Nearest first (requires lat/lng)
 * - rating: Highest rated first
 * - featured: Featured first, then by rating
 *
 * Caching:
 * - Cache for 5 minutes with location-based key
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement providers list
  return NextResponse.json({ providers: [], total: 0 });
}
