/**
 * ADMIN REVIEW MODERATION API - app/api/admin/reviews/[id]/route.ts
 *
 * Purpose: Admin moderation of reviews
 *
 * GET /api/admin/reviews/[id]
 * - Get full review details
 *
 * Response:
 * {
 *   review: {
 *     id, rating, text, photos,
 *     status: "pending" | "approved" | "rejected",
 *     user: { id, name, email, reviewCount },
 *     provider: { id, name },
 *     createdAt,
 *     moderatedBy, moderatedAt, moderationReason
 *   }
 * }
 *
 * ---
 *
 * PUT /api/admin/reviews/[id]
 * - Moderate review (approve/reject)
 *
 * Request body:
 * {
 *   status: "approved" | "rejected",
 *   reason?: string (required if rejecting)
 * }
 *
 * Response:
 * - 200: { success: true }
 *
 * Side effects:
 * - Update provider rating aggregate
 * - Optionally notify user of rejection
 *
 * ---
 *
 * DELETE /api/admin/reviews/[id]
 * - Delete review permanently
 *
 * Response:
 * - 200: { success: true }
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin get review
  return NextResponse.json({ review: null, id });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin moderate review
  return NextResponse.json({ message: "Not implemented", id }, { status: 501 });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Implement admin delete review
  return NextResponse.json({ message: "Not implemented", id }, { status: 501 });
}
