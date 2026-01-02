/**
 * DATABASE QUERIES - lib/db/queries.ts
 *
 * Purpose: Reusable database query functions
 *
 * Organization:
 * - Provider queries: getProviders, getProviderById, searchProviders
 * - Category queries: getCategories, getCategoryBySlug
 * - User queries: getUserById, getUserByPhone
 * - Review queries: getReviewsByProvider, getReviewStats
 * - Analytics queries: logEvent, getEventStats
 *
 * Features:
 * - Typed return values
 * - Geo queries using PostGIS
 * - Full-text search
 * - Aggregations
 *
 * Usage:
 * import { getProviders, searchProviders } from "@/lib/db/queries";
 */

import { prisma } from "./index";

/**
 * Get providers with filters and pagination
 */
export async function getProviders(params: {
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { category, page = 1, limit = 20 } = params;

  // TODO: Implement geo query with PostGIS
  const providers = await prisma.provider.findMany({
    where: {
      status: "ACTIVE",
      ...(category && { categories: { some: { slug: category } } }),
    },
    include: {
      categories: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.provider.count({
    where: { status: "ACTIVE" },
  });

  return { providers, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get provider by ID with full details
 */
export async function getProviderById(id: string) {
  return prisma.provider.findUnique({
    where: { id },
    include: {
      categories: true,
      reviews: {
        where: { status: "APPROVED" },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: { name: true },
      },
    },
  });
}

/**
 * Search providers with full-text search
 */
export async function searchProviders(query: string, params: {
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}) {
  // TODO: Implement full-text search
  return getProviders({ ...params, category: params.category });
}

/**
 * Get all active categories
 */
export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { providers: true },
      },
    },
  });
}
