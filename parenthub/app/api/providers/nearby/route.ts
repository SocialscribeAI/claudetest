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
 *   location: { city: string }
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateDistance } from "@/lib/maps/google-maps";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const category = searchParams.get("category");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "lat and lng are required" },
        { status: 400 }
      );
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: "ACTIVE",
      deletedAt: null,
      isAvailable: true,
    };

    if (category) {
      where.categories = {
        some: { slug: category },
      };
    }

    // Fetch providers (fetch more than needed for geo filtering)
    const providers = await prisma.provider.findMany({
      where,
      take: limit * 5,
      orderBy: [{ featuredRank: "desc" }, { createdAt: "desc" }],
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            nameHe: true,
            slug: true,
            icon: true,
          },
        },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });

    // Calculate distances and filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withDistance = providers.map((provider: any) => {
      const distance = calculateDistance(lat, lng, provider.lat, provider.lng);
      const ratings = provider.reviews.map((r: { rating: number }) => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : null;

      return {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        photo: provider.photos[0] || null,
        categories: provider.categories,
        rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        reviewCount: provider.reviews.length,
        priceBand: provider.priceBand === "BUDGET" ? 1 : provider.priceBand === "MIDRANGE" ? 2 : 3,
        city: provider.city,
        distance,
        isAvailable: provider.isAvailable,
        isFeatured: provider.featuredRank > 0,
        phone: provider.phone,
        whatsapp: provider.whatsapp,
      };
    });

    // Filter within 5km and sort by distance
    const nearby = withDistance
      .filter((p) => p.distance <= 5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    // If not enough nearby, expand to 10km
    let results = nearby;
    if (results.length < limit) {
      results = withDistance
        .filter((p) => p.distance <= 10)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
    }

    // Detect city from first provider or use default
    const detectedCity = results[0]?.city || "Unknown";

    return NextResponse.json({
      providers: results,
      location: { city: detectedCity },
    });
  } catch (error) {
    console.error("Error fetching nearby providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby providers" },
      { status: 500 }
    );
  }
}
