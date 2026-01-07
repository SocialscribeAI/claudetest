/**
 * PRISMA CLIENT SINGLETON - lib/db.ts
 *
 * Purpose: Single Prisma client instance for the application
 *
 * This prevents multiple Prisma Client instances during development
 * which can exhaust database connections.
 *
 * Usage:
 * import { prisma } from "@/lib/db";
 * const users = await prisma.user.findMany();
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

export default prisma;
