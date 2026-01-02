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
 * - Invalidate on category update
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Implement categories list
  return NextResponse.json({ categories: [] });
}
