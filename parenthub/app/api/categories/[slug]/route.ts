/**
 * CATEGORY DETAIL API - app/api/categories/[slug]/route.ts
 *
 * Purpose: Get single category details (public)
 *
 * GET /api/categories/[slug]
 *
 * URL params:
 * - slug: string (category slug)
 *
 * Response:
 * {
 *   category: {
 *     id, slug, name, nameHe,
 *     icon, description,
 *     parentId,
 *     parent?: Category,
 *     children?: Category[],
 *     providerCount
 *   }
 * }
 *
 * Response codes:
 * - 200: Category found
 * - 404: Category not found
 *
 * Caching:
 * - Cache for 1 hour
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Cache for 1 hour

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            name: true,
            nameHe: true,
            icon: true,
          },
        },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            slug: true,
            name: true,
            nameHe: true,
            icon: true,
            description: true,
            _count: {
              select: { providers: true },
            },
          },
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

    // Transform response
    const result = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      nameHe: category.nameHe,
      icon: category.icon,
      description: category.description,
      parentId: category.parentId,
      parent: category.parent,
      children: category.children.map((child) => ({
        id: child.id,
        slug: child.slug,
        name: child.name,
        nameHe: child.nameHe,
        icon: child.icon,
        description: child.description,
        providerCount: child._count.providers,
      })),
      providerCount: category._count.providers,
    };

    return NextResponse.json({ category: result });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
