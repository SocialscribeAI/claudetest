/**
 * ADMIN CATEGORY DETAIL API - app/api/admin/categories/[id]/route.ts
 *
 * Purpose: Admin management of single category
 *
 * GET - Get category details
 * PUT - Update category
 * DELETE - Delete category (with provider reassignment)
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

// Update category schema
const updateCategorySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  nameHe: z.string().min(2).max(50).optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().optional().nullable(),
  description: z.string().max(200).optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true, nameHe: true, slug: true },
        },
        children: {
          select: { id: true, name: true, nameHe: true, slug: true, isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        providers: {
          where: { deletedAt: null },
          select: { id: true, name: true, status: true },
          take: 20,
        },
        _count: {
          select: { providers: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category: {
        ...category,
        providerCount: category._count.providers,
      },
    });
  } catch (error) {
    console.error("Admin get category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // Check category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness if changing
    if (data.slug && data.slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check parent exists if changing
    if (data.parentId !== undefined && data.parentId !== existingCategory.parentId) {
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

        // Prevent circular reference
        if (data.parentId === id) {
          return NextResponse.json(
            { error: "Category cannot be its own parent" },
            { status: 400 }
          );
        }
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.nameHe !== undefined) updateData.nameHe = data.nameHe;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: { id: true, name: true, nameHe: true },
        },
        children: {
          select: { id: true, name: true, nameHe: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Admin update category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reassignTo = searchParams.get("reassignTo");

    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { providers: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check for child categories
    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with child categories. Delete or reassign children first." },
        { status: 400 }
      );
    }

    // Check for providers
    if (category._count.providers > 0) {
      if (!reassignTo) {
        return NextResponse.json(
          {
            error: "Category has providers. Provide reassignTo parameter to move them.",
            providerCount: category._count.providers,
          },
          { status: 400 }
        );
      }

      // Check reassign target exists
      const targetCategory = await prisma.category.findUnique({
        where: { id: reassignTo },
      });

      if (!targetCategory) {
        return NextResponse.json(
          { error: "Reassignment target category not found" },
          { status: 400 }
        );
      }

      // Get all providers in this category
      const providers = await prisma.provider.findMany({
        where: {
          categories: {
            some: { id },
          },
        },
        select: { id: true },
      });

      // Reassign providers to new category
      for (const provider of providers) {
        await prisma.provider.update({
          where: { id: provider.id },
          data: {
            categories: {
              disconnect: { id },
              connect: { id: reassignTo },
            },
          },
        });
      }
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      movedProviders: category._count.providers,
    });
  } catch (error) {
    console.error("Admin delete category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
