/**
 * SEARCH API - app/api/search/route.ts
 *
 * Purpose: Full-text search with filters (public)
 *
 * GET /api/search
 *
 * Query parameters:
 * - q: string              // Search query
 * - lat, lng: number       // User location
 * - bounds: string         // Map bounds "swLat,swLng,neLat,neLng"
 * - category: string       // Category slug filter
 * - radius: number         // Distance in km
 * - price: string          // Price bands (comma separated)
 * - available: boolean     // Only available now
 * - sort: string           // Sort order
 * - page, limit: number    // Pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateDistance } from "@/lib/maps/google-maps";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get("q") || "";
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
    const bounds = searchParams.get("bounds");
    const category = searchParams.get("category");
    const radius = parseFloat(searchParams.get("radius") || "25");
    const price = searchParams.get("price");
    const available = searchParams.get("available") === "true";
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: "ACTIVE",
      deletedAt: null,
    };

    // Search query - search in name, description, services
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { services: { hasSome: query.split(" ") } },
        { city: { contains: query, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (category) {
      where.categories = {
        some: { slug: category },
      };
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

    // Map bounds filter
    if (bounds) {
      const [swLat, swLng, neLat, neLng] = bounds.split(",").map(parseFloat);
      where.lat = { gte: swLat, lte: neLat };
      where.lng = { gte: swLng, lte: neLng };
    }

    // Fetch providers
    const providers = await prisma.provider.findMany({
      where,
      take: limit * 3, // Fetch extra for geo filtering
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

    // Get total count for pagination
    const total = await prisma.provider.count({ where });

    // Transform results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results = providers.map((provider: any) => {
      const ratings = provider.reviews.map((r: { rating: number }) => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : null;

      let distance: number | null = null;
      if (lat && lng) {
        distance = calculateDistance(lat, lng, provider.lat, provider.lng);
      }

      return {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        photo: provider.photos[0] || null,
        description: provider.description.substring(0, 150),
        categories: provider.categories,
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
        phone: provider.phone,
        whatsapp: provider.whatsapp,
      };
    });

    // Filter by radius if location provided (and not using bounds)
    if (lat && lng && !bounds) {
      results = results.filter((p) => p.distance !== null && p.distance <= radius);
    }

    // Sort results
    switch (sort) {
      case "distance":
        results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "featured":
        // Already sorted by featured
        break;
      default:
        // Relevance - keep original order (featured + recency)
        break;
    }

    // Paginate
    const paginatedResults = results.slice((page - 1) * limit, page * limit);

    // Build facets (category counts, city counts, price counts)
    const allProviders = await prisma.provider.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      select: {
        city: true,
        priceBand: true,
        categories: { select: { slug: true, name: true } },
      },
    });

    // Category facets
    const categoryMap = new Map<string, { slug: string; name: string; count: number }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allProviders.forEach((p: any) => {
      p.categories.forEach((c: { slug: string; name: string }) => {
        const existing = categoryMap.get(c.slug);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(c.slug, { slug: c.slug, name: c.name, count: 1 });
        }
      });
    });

    // City facets
    const cityMap = new Map<string, number>();
    allProviders.forEach((p) => {
      cityMap.set(p.city, (cityMap.get(p.city) || 0) + 1);
    });

    // Price facets
    const priceCount = { 1: 0, 2: 0, 3: 0 };
    allProviders.forEach((p) => {
      if (p.priceBand === "BUDGET") priceCount[1]++;
      else if (p.priceBand === "MIDRANGE") priceCount[2]++;
      else priceCount[3]++;
    });

    const facets = {
      categories: Array.from(categoryMap.values()).sort((a, b) => b.count - a.count).slice(0, 10),
      cities: Array.from(cityMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      priceBands: [
        { band: 1, count: priceCount[1] },
        { band: 2, count: priceCount[2] },
        { band: 3, count: priceCount[3] },
      ],
    };

    // Log search analytics (fire and forget)
    logSearchEvent(query, results.length).catch(console.error);

    return NextResponse.json({
      results: paginatedResults,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
      query,
      facets,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

async function logSearchEvent(query: string, resultCount: number) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event: resultCount > 0 ? "search_submit" : "search_zero_results",
        properties: { query, resultCount },
        sessionId: "server",
        timestamp: new Date(),
      },
    });
  } catch (e) {
    console.error("Failed to log search event:", e);
  }
}
