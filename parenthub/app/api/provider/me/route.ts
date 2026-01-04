/**
 * PROVIDER SELF API - app/api/provider/me/route.ts
 *
 * Purpose: Provider manages their own profile (auth required)
 *
 * GET /api/provider/me
 * - Get current provider's full profile with stats
 *
 * PUT /api/provider/me
 * - Update provider's profile
 *
 * POST /api/provider/me
 * - Create new provider profile (for users registering as providers)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Helper to calculate profile completeness
function calculateCompleteness(provider: {
  name: string;
  description: string;
  bio: string | null;
  photos: string[];
  services: string[];
  phone: string;
  address: string;
  city: string;
}): number {
  let score = 0;
  const weights = {
    name: 15,
    description: 20,
    bio: 10,
    photos: 20,
    services: 15,
    phone: 10,
    address: 10,
  };

  if (provider.name?.length > 2) score += weights.name;
  if (provider.description?.length > 50) score += weights.description;
  if (provider.bio?.length && provider.bio.length > 20) score += weights.bio;
  if (provider.photos?.length > 0) score += weights.photos;
  if (provider.services?.length > 0) score += weights.services;
  if (provider.phone?.length > 8) score += weights.phone;
  if (provider.address?.length > 5) score += weights.address;

  return score;
}

// Validation schema for provider update
const updateProviderSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  bio: z.string().max(500).optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  priceBand: z.enum(["BUDGET", "MIDRANGE", "PREMIUM"]).optional(),
  languages: z.array(z.string()).optional(),
  schedule: z.record(z.any()).optional().nullable(),
  isAvailable: z.boolean().optional(),
  contact: z.object({
    phone: z.string().optional(),
    whatsapp: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    website: z.string().url().optional().nullable(),
  }).optional(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    serviceRadius: z.number().optional().nullable(),
  }).optional(),
});

// Validation for new provider creation
const createProviderSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  phone: z.string().min(9),
  address: z.string().min(5),
  city: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  categoryIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find provider for this user
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
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

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found. Create one first." },
        { status: 404 }
      );
    }

    // Calculate stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [viewsThisWeek, viewsThisMonth, leadsThisWeek, leadsThisMonth] =
      await Promise.all([
        prisma.analyticsEvent.count({
          where: {
            providerId: provider.id,
            event: "provider_view",
            timestamp: { gte: weekAgo },
          },
        }),
        prisma.analyticsEvent.count({
          where: {
            providerId: provider.id,
            event: "provider_view",
            timestamp: { gte: monthAgo },
          },
        }),
        prisma.clickLedger.count({
          where: {
            providerId: provider.id,
            timestamp: { gte: weekAgo },
          },
        }),
        prisma.clickLedger.count({
          where: {
            providerId: provider.id,
            timestamp: { gte: monthAgo },
          },
        }),
      ]);

    // Calculate average rating
    const ratings = provider.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

    // Calculate completeness
    const completeness = calculateCompleteness({
      name: provider.name,
      description: provider.description,
      bio: provider.bio,
      photos: provider.photos,
      services: provider.services,
      phone: provider.phone,
      address: provider.address,
      city: provider.city,
    });

    return NextResponse.json({
      provider: {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        description: provider.description,
        bio: provider.bio,
        photos: provider.photos,
        categories: provider.categories,
        services: provider.services,
        priceBand: provider.priceBand,
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
        status: provider.status,
        isAvailable: provider.isAvailable,
        isVerified: provider.isVerified,
        featuredRank: provider.featuredRank,
        sponsorBadge: provider.sponsorBadge,
        rating: avgRating,
        reviewCount: ratings.length,
        completeness,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      },
      stats: {
        viewsThisWeek,
        viewsThisMonth,
        leadsThisWeek,
        leadsThisMonth,
      },
    });
  } catch (error) {
    console.error("Get provider profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find existing provider
    const existingProvider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateProviderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.services !== undefined) updateData.services = data.services;
    if (data.priceBand !== undefined) updateData.priceBand = data.priceBand;
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

    // Contact fields
    if (data.contact) {
      if (data.contact.phone !== undefined) updateData.phone = data.contact.phone;
      if (data.contact.whatsapp !== undefined) updateData.whatsapp = data.contact.whatsapp;
      if (data.contact.email !== undefined) updateData.email = data.contact.email;
      if (data.contact.website !== undefined) updateData.website = data.contact.website;
    }

    // Location fields
    if (data.location) {
      if (data.location.address !== undefined) updateData.address = data.location.address;
      if (data.location.city !== undefined) updateData.city = data.location.city;
      if (data.location.lat !== undefined) updateData.lat = data.location.lat;
      if (data.location.lng !== undefined) updateData.lng = data.location.lng;
      if (data.location.serviceRadius !== undefined) updateData.serviceRadius = data.location.serviceRadius;
    }

    // Update provider
    const updatedProvider = await prisma.provider.update({
      where: { id: existingProvider.id },
      data: updateData,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            nameHe: true,
            slug: true,
          },
        },
      },
    });

    // Update categories if provided
    if (data.categoryIds !== undefined) {
      await prisma.provider.update({
        where: { id: existingProvider.id },
        data: {
          categories: {
            set: data.categoryIds.map((id) => ({ id })),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Update provider profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user already has a provider profile
    const existing = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Provider profile already exists" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validation = createProviderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate unique slug
    let slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0590-\u05FF]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check for slug uniqueness
    const existingSlug = await prisma.provider.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create provider
    const provider = await prisma.provider.create({
      data: {
        userId: session.user.id,
        name: data.name,
        slug,
        description: data.description,
        phone: data.phone,
        address: data.address,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        status: "PENDING",
        photos: [],
        services: [],
        languages: ["he"],
        categories: data.categoryIds
          ? { connect: data.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            nameHe: true,
            slug: true,
          },
        },
      },
    });

    // Update user role to PROVIDER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "PROVIDER" },
    });

    return NextResponse.json({
      success: true,
      provider,
      message: "Provider profile created. Pending approval.",
    });
  } catch (error) {
    console.error("Create provider profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
