/**
 * NEARBY PROVIDERS API - app/api/providers/nearby/route.ts
 *
 * Purpose: Get providers near a location (for home page)
 *
 * GET /api/providers/nearby
 *
 * Query parameters:
 * - lat: number (required)
 * - lng: number (required)
 * - limit: number (default: 10)
 * - category?: string (optional category filter)
 *
 * Response:
 * {
 *   providers: Provider[],
 *   location: { city: string, neighborhood?: string }
 * }
 *
 * Logic:
 * 1. Find providers within 5km
 * 2. Sort by distance, then rating
 * 3. Limit to requested count
 * 4. Include distance and ETA for each
 *
 * Caching:
 * - Cache for 5 minutes with location grid key
 *   (round lat/lng to 2 decimal places)
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement nearby providers
  return NextResponse.json({ providers: [], location: null });
}
