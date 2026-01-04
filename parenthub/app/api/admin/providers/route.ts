/**
 * ADMIN PROVIDERS API - app/api/admin/providers/route.ts
 *
 * Purpose: Admin management of all providers
 *
 * GET /api/admin/providers - List with filters and stats
 * POST /api/admin/providers - Create new provider (admin seeding)
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

// Helper to check admin role
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return { error: "Admin access required", status: 403 };
  }

  return { userId: session.user.id };
}

// Create provider schema
const createProviderSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  bio: z.string().max(500).optional().nullable(),
  phone: z.string().min(9),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().min(5),
  city: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  serviceRadius: z.number().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  priceBand: z.enum(["BUDGET", "MIDRANGE", "PREMIUM"]).default("MIDRANGE"),
  languages: z.array(z.string()).default(["he"]),
  photos: z.array(z.string().url()).optional(),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]).default("ACTIVE"),
  isVerified: z.boolean().default(false),
  adminNotes: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse query params
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "created";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    // Build where clause
    const where: Prisma.ProviderWhereInput = {
      deletedAt: null,
    };

    if (status !== "all") {
      where.status = status.toUpperCase() as "PENDING" | "ACTIVE" | "SUSPENDED";
    }

    if (category) {
      where.categories = {
        some: { slug: category },
      };
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    let orderBy: Prisma.ProviderOrderByWithRelationInput = {};
    switch (sort) {
      case "name":
        orderBy = { name: order as "asc" | "desc" };
        break;
      case "created":
      default:
        orderBy = { createdAt: order as "asc" | "desc" };
        break;
    }

    // Get providers with pagination
    const [providers, total, statusCounts] = await Promise.all([
      prisma.provider.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: {
            select: { id: true, name: true, nameHe: true, slug: true },
          },
          user: {
            select: { id: true, email: true, phone: true, name: true },
          },
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
          _count: {
            select: {
              reviews: true,
              clickLedger: true,
            },
          },
        },
      }),
      prisma.provider.count({ where }),
      prisma.provider.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: { id: true },
      }),
    ]);

    // Format status counts
    const counts = {
      pending: 0,
      active: 0,
      suspended: 0,
    };
    statusCounts.forEach((sc) => {
      counts[sc.status.toLowerCase() as keyof typeof counts] = sc._count.id;
    });

    // Calculate ratings
    const formattedProviders = providers.map((provider) => {
      const ratings = provider.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;

      return {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        description: provider.description,
        phone: provider.phone,
        email: provider.email,
        city: provider.city,
        status: provider.status,
        isVerified: provider.isVerified,
        isAvailable: provider.isAvailable,
        featuredRank: provider.featuredRank,
        sponsorBadge: provider.sponsorBadge,
        categories: provider.categories,
        user: provider.user,
        rating: avgRating,
        reviewCount: ratings.length,
        leadCount: provider._count.clickLedger,
        adminNotes: provider.adminNotes,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      };
    });

    return NextResponse.json({
      providers: formattedProviders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      statusCounts: counts,
    });
  } catch (error) {
    console.error("Admin providers list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
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

    const existingSlug = await prisma.provider.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create a system user for admin-created providers
    let userId: string;

    // Try to find an existing user by phone or email
    let existingUser = null;
    if (data.phone) {
      existingUser = await prisma.user.findUnique({
        where: { phone: data.phone },
      });
    }
    if (!existingUser && data.email) {
      existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
    }

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a new user for this provider
      const newUser = await prisma.user.create({
        data: {
          phone: data.phone,
          email: data.email,
          name: data.name,
          role: "PROVIDER",
        },
      });
      userId = newUser.id;
    }

    // Create provider
    const provider = await prisma.provider.create({
      data: {
        userId,
        name: data.name,
        slug,
        description: data.description,
        bio: data.bio,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        website: data.website,
        address: data.address,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        serviceRadius: data.serviceRadius,
        services: data.services || [],
        priceBand: data.priceBand,
        languages: data.languages,
        photos: data.photos || [],
        status: data.status,
        isVerified: data.isVerified,
        adminNotes: data.adminNotes,
        approvedBy: authResult.userId,
        approvedAt: data.status === "ACTIVE" ? new Date() : null,
        categories: data.categoryIds
          ? { connect: data.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        categories: true,
        user: {
          select: { id: true, email: true, phone: true, name: true },
        },
      },
    });

    return NextResponse.json({ provider }, { status: 201 });
  } catch (error) {
    console.error("Admin create provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
