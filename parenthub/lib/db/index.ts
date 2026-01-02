/**
 * DATABASE CLIENT - lib/db/index.ts
 *
 * Purpose: Prisma client singleton and database utilities
 *
 * Exports:
 * - prisma: Prisma client instance
 * - db: Alias for prisma (convenience)
 *
 * Features:
 * - Singleton pattern for connection pooling
 * - Development logging
 * - Soft delete middleware (future)
 * - Query timing middleware (future)
 *
 * Usage:
 * import { prisma } from "@/lib/db";
 * const users = await prisma.user.findMany();
 *
 * Best practices:
 * - Never import PrismaClient directly
 * - Always use this singleton
 * - Connection limit handled by Prisma
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;
