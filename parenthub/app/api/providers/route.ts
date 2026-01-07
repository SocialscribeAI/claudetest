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
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateDistance } from "@/lib/maps/google-maps";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
    const radius = parseFloat(searchParams.get("radius") || "10");
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "featured";
    const price = searchParams.get("price");
    const available = searchParams.get("available") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: "ACTIVE",
      deletedAt: null,
    };

    // Category filter (using junction table for SQLite)
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Search query (SQLite doesn't support mode: "insensitive")
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { city: { contains: query } },
      ];
    }

    // Price band filter
    if (price) {
      const priceBands = price.split(",");
      const priceMap: Record<string, string> = {
        "1": "BUDGET",
        "2": "MIDRANGE",
        "3": "PREMIUM",
      };
      where.priceBand = {
        in: priceBands.map((p) => priceMap[p]).filter(Boolean),
      };
    }

    // Availability filter
    if (available) {
      where.isAvailable = true;
    }

    // Build order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any[] = [];

    switch (sort) {
      case "featured":
        orderBy = [{ featuredRank: "desc" }, { createdAt: "desc" }];
        break;
      case "rating":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "distance":
        orderBy = [{ createdAt: "desc" }];
        break;
      default:
        orderBy = [{ featuredRank: "desc" }, { createdAt: "desc" }];
    }

    // Fetch providers
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit * 2, // Fetch extra for geo filtering
        include: {
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  nameHe: true,
                  slug: true,
                  icon: true,
                },
              },
            },
          },
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
      }),
      prisma.provider.count({ where }),
    ]);

    // Transform and add computed fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results = providers.map((provider: any) => {
      // Calculate average rating
      const ratings = provider.reviews.map((r: { rating: number }) => r.rating);
      const avgRating =
        ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : null;

      // Calculate distance if user location provided
      let distance: number | null = null;
      if (lat && lng) {
        distance = calculateDistance(lat, lng, provider.lat, provider.lng);
      }

      // Parse JSON strings (SQLite stores arrays as JSON strings)
      const photos = typeof provider.photos === "string" ? JSON.parse(provider.photos) : provider.photos || [];
      const services = typeof provider.services === "string" ? JSON.parse(provider.services) : provider.services || [];

      // Map categories from junction table
      const categories = provider.categories.map((cp: any) => cp.category);

      return {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        photo: photos[0] || null,
        photos,
        description: provider.description.substring(0, 200),
        categories,
        rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        reviewCount: provider.reviews.length,
        priceBand: provider.priceBand === "BUDGET" ? 1 : provider.priceBand === "MIDRANGE" ? 2 : 3,
        city: provider.city,
        address: provider.address,
        lat: provider.lat,
        lng: provider.lng,
        distance,
        isAvailable: provider.isAvailable,
        isFeatured: provider.featuredRank > 0,
        isVerified: provider.isVerified,
        phone: provider.phone,
        whatsapp: provider.whatsapp,
        services,
      };
    });

    // Filter by radius if location provided
    if (lat && lng && radius) {
      results = results.filter((p) => p.distance !== null && p.distance <= radius);
    }

    // Sort by distance if requested
    if (sort === "distance" && lat && lng) {
      results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // Sort by rating if requested
    if (sort === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Apply pagination after geo filtering
    const paginatedResults = results.slice(0, limit);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      providers: paginatedResults,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}
