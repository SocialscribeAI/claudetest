/**
 * REVIEWS API - app/api/reviews/[providerId]/route.ts
 *
 * Purpose: Get and submit reviews for a provider
 *
 * GET /api/reviews/[providerId]
 * - Get paginated reviews for a provider (public)
 *
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - sort: "recent" | "highest" | "lowest" (default: "recent")
 *
 * Response:
 * {
 *   reviews: [
 *     {
 *       id, rating (1-5), text,
 *       photos?: string[],
 *       user: { name, initial },
 *       createdAt,
 *       isVerified: boolean (verified interaction)
 *     }
 *   ],
 *   summary: {
 *     average: number,
 *     count: number,
 *     distribution: { 1: n, 2: n, 3: n, 4: n, 5: n }
 *   },
 *   page, totalPages
 * }
 *
 * ---
 *
 * POST /api/reviews/[providerId]
 * - Submit a new review (auth required)
 *
 * Request body:
 * {
 *   rating: number (1-5),
 *   text: string (10-500 chars),
 *   photos?: string[] (max 3)
 * }
 *
 * Response:
 * - 201: { success: true, review: Review }
 * - 400: { error: "Validation error" }
 * - 401: { error: "Login required" }
 * - 403: { error: "Already reviewed" }
 *
 * Flow:
 * 1. Verify user is authenticated
 * 2. Check user hasn't already reviewed this provider
 * 3. Validate input
 * 4. Create review with status "pending"
 * 5. Return review
 *
 * Moderation:
 * - Reviews go to pending queue
 * - Admin must approve before public display
 */

import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ providerId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { providerId } = await params;
  // TODO: Implement get reviews
  return NextResponse.json({ reviews: [], summary: null, providerId });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { providerId } = await params;
  // TODO: Implement submit review
  return NextResponse.json({ message: "Not implemented", providerId }, { status: 501 });
}
