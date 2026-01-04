/**
 * CATEGORIES LIST API - app/api/categories/route.ts
 *
 * Purpose: Get all categories (public)
 *
 * GET /api/categories
 *
 * Query parameters:
 * - includeChildren: boolean (default: true)
 * - activeOnly: boolean (default: true)
 *
 * Response:
 * {
 *   categories: [
 *     {
 *       id, slug, name, nameHe,
 *       icon, description,
 *       parentId, sortOrder,
 *       providerCount,
 *       children?: Category[]
 *     }
 *   ]
 * }
 *
 * Caching:
 * - Cache for 1 hour (categories rarely change)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get("includeChildren") !== "false";
    const activeOnly = searchParams.get("activeOnly") !== "false";

    // Fetch categories with provider count
    const categories = await prisma.category.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { providers: true },
        },
        ...(includeChildren && {
          children: {
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: { sortOrder: "asc" },
            include: {
              _count: {
                select: { providers: true },
              },
            },
          },
        }),
      },
    });

    // Filter to only parent categories (parentId is null) when including children
    const result = includeChildren
      ? categories.filter((cat) => cat.parentId === null)
      : categories;

    // Transform to include providerCount at top level
    const transformed = result.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      nameHe: cat.nameHe,
      icon: cat.icon,
      description: cat.description,
      parentId: cat.parentId,
      sortOrder: cat.sortOrder,
      providerCount: cat._count.providers,
      ...(includeChildren && "children" in cat && {
        children: (cat.children as typeof categories).map((child) => ({
          id: child.id,
          slug: child.slug,
          name: child.name,
          nameHe: child.nameHe,
          icon: child.icon,
          description: child.description,
          parentId: child.parentId,
          sortOrder: child.sortOrder,
          providerCount: child._count.providers,
        })),
      }),
    }));

    return NextResponse.json({ categories: transformed });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
