/**
 * PROVIDER DETAIL API - app/api/providers/[id]/route.ts
 *
 * Purpose: Get single provider full details (public)
 *
 * GET /api/providers/[id]
 *
 * URL params:
 * - id: string (provider ID or slug)
 *
 * Query params:
 * - lat: number (optional, for distance calc)
 * - lng: number (optional, for distance calc)
 *
 * Response:
 * {
 *   provider: { ...full provider details }
 * }
 *
 * Response codes:
 * - 200: Provider found
 * - 404: Provider not found
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateDistance } from "@/lib/geo";

export const revalidate = 300; // Cache for 5 minutes

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;

    // Try to find by ID first, then by slug
    let provider = await prisma.provider.findUnique({
      where: { id },
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
        user: {
          select: { name: true },
        },
      },
    });

    // If not found by ID, try slug
    if (!provider) {
      provider = await prisma.provider.findUnique({
        where: { slug: id },
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
          user: {
            select: { name: true },
          },
        },
      });
    }

    if (!provider || provider.status !== "ACTIVE" || provider.deletedAt) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = provider.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

    // Calculate distance if user location provided
    let distance: number | null = null;
    if (lat && lng) {
      distance = calculateDistance(lat, lng, provider.lat, provider.lng);
    }

    // Transform response
    const result = {
      id: provider.id,
      name: provider.name,
      slug: provider.slug,
      description: provider.description,
      bio: provider.bio,
      photos: provider.photos,
      categories: provider.categories,
      services: provider.services,
      priceBand: provider.priceBand === "BUDGET" ? 1 : provider.priceBand === "MIDRANGE" ? 2 : 3,
      languages: provider.languages,
      schedule: provider.schedule,
      contact: {
        phone: provider.phone,
        whatsapp: provider.whatsapp,
        email: provider.email,
        website: provider.website,
      },
      location: {
        address: provider.address,
        city: provider.city,
        lat: provider.lat,
        lng: provider.lng,
        serviceRadius: provider.serviceRadius,
      },
      rating: {
        average: avgRating ? Math.round(avgRating * 10) / 10 : null,
        count: provider.reviews.length,
      },
      isAvailable: provider.isAvailable,
      isVerified: provider.isVerified,
      isFeatured: provider.featuredRank > 0,
      distance,
      createdAt: provider.createdAt,
    };

    // Log analytics event (fire and forget)
    logProfileView(provider.id).catch(console.error);

    return NextResponse.json({ provider: result });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider" },
      { status: 500 }
    );
  }
}

// Helper to log profile view
async function logProfileView(providerId: string) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event: "profile_view",
        providerId,
        properties: {},
        sessionId: "server",
        timestamp: new Date(),
      },
    });
  } catch (e) {
    // Ignore analytics errors
    console.error("Failed to log analytics:", e);
  }
}
