/**
 * ADMIN CATEGORIES API - app/api/admin/categories/route.ts
 *
 * Purpose: Admin CRUD for categories
 *
 * GET - List all categories (including inactive)
 * POST - Create new category
 * PUT - Reorder categories
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";

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

// Create category schema
const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  nameHe: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  icon: z.string().optional().nullable(),
  description: z.string().max(200).optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Reorder schema
const reorderSchema = z.object({
  categoryIds: z.array(z.string()),
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

    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: {
          select: { id: true, name: true, nameHe: true },
        },
        children: {
          select: { id: true, name: true, nameHe: true, slug: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { providers: true },
        },
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      nameHe: cat.nameHe,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      parentId: cat.parentId,
      parent: cat.parent,
      children: cat.children,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      providerCount: cat._count.providers,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error("Admin categories list error:", error);
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
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Check parent exists if provided
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        nameHe: data.nameHe,
        slug: data.slug,
        icon: data.icon,
        description: data.description,
        parentId: data.parentId,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
      include: {
        parent: {
          select: { id: true, name: true, nameHe: true },
        },
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Admin create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const validation = reorderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryIds } = validation.data;

    // Update sort order for each category
    await Promise.all(
      categoryIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Categories reordered successfully",
    });
  } catch (error) {
    console.error("Admin reorder categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
