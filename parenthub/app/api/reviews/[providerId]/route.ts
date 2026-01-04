/**
 * REVIEWS API - app/api/reviews/[providerId]/route.ts
 *
 * Purpose: Get and submit reviews for a provider
 *
 * GET /api/reviews/[providerId]
 * - Get paginated reviews for a provider (public)
 *
 * POST /api/reviews/[providerId]
 * - Submit a new review (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/config";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ providerId: string }>;
}

// GET - Fetch reviews for a provider
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { providerId } = await params;
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const sort = searchParams.get("sort") || "recent";

    // Verify provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { id: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Build order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "highest") orderBy = { rating: "desc" };
    if (sort === "lowest") orderBy = { rating: "asc" };

    // Fetch reviews
    const [reviews, totalCount, allRatings] = await Promise.all([
      prisma.review.findMany({
        where: {
          providerId,
          status: "APPROVED",
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { name: true },
          },
        },
      }),
      prisma.review.count({
        where: { providerId, status: "APPROVED" },
      }),
      prisma.review.findMany({
        where: { providerId, status: "APPROVED" },
        select: { rating: true },
      }),
    ]);

    // Calculate summary
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;
    allRatings.forEach((r) => {
      distribution[r.rating]++;
      totalRating += r.rating;
    });

    const summary = {
      average: allRatings.length > 0
        ? Math.round((totalRating / allRatings.length) * 10) / 10
        : null,
      count: allRatings.length,
      distribution,
    };

    // Transform reviews
    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      text: review.text,
      photos: review.photos,
      user: {
        name: review.user.name || "Anonymous",
        initial: (review.user.name || "A").charAt(0).toUpperCase(),
      },
      createdAt: review.createdAt,
      isVerified: review.isVerifiedInteraction,
    }));

    return NextResponse.json({
      reviews: transformedReviews,
      summary,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// Validation schema for review submission
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(10).max(500),
  photos: z.array(z.string().url()).max(3).optional(),
});

// POST - Submit a new review
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { providerId } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verify provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { id: true, status: true },
    });

    if (!provider || provider.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_providerId: {
          userId,
          providerId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this provider" },
        { status: 403 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { rating, text, photos } = parsed.data;

    // Create review (pending moderation)
    const review = await prisma.review.create({
      data: {
        userId,
        providerId,
        rating,
        text,
        photos: photos || [],
        status: "PENDING",
        isVerifiedInteraction: false, // Could be set to true if we track interactions
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        review: {
          id: review.id,
          rating: review.rating,
          text: review.text,
          status: "pending",
          message: "Your review is pending moderation",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
