/**
 * ADMIN BULK IMPORT API - app/api/admin/import/route.ts
 *
 * Purpose: Bulk import providers from JSON data
 *
 * POST - Import providers from JSON array
 * GET - Get import history and CSV template
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

// Provider import schema
const providerImportSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  phone: z.string().min(9),
  email: z.string().email().optional().nullable(),
  address: z.string().min(5),
  city: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  categorySlug: z.string().optional(),
  services: z.array(z.string()).optional(),
  priceBand: z.enum(["BUDGET", "MIDRANGE", "PREMIUM"]).optional(),
  languages: z.array(z.string()).optional(),
});

const importRequestSchema = z.object({
  providers: z.array(providerImportSchema),
  skipErrors: z.boolean().default(false),
  status: z.enum(["PENDING", "ACTIVE"]).default("PENDING"),
});

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
    const validation = importRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { providers: providersData, skipErrors, status } = validation.data;

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as Array<{ index: number; name: string; error: string }>,
    };

    // Get all categories for lookup
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    // Process each provider
    for (let i = 0; i < providersData.length; i++) {
      const data = providersData[i];

      try {
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

        // Check for existing phone
        let existingUser = await prisma.user.findUnique({
          where: { phone: data.phone },
        });

        let userId: string;

        if (existingUser) {
          // Check if user already has a provider
          const existingProvider = await prisma.provider.findUnique({
            where: { userId: existingUser.id },
          });

          if (existingProvider) {
            throw new Error("User with this phone already has a provider profile");
          }

          userId = existingUser.id;
        } else {
          // Create new user
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

        // Look up category
        const categoryId = data.categorySlug
          ? categoryMap.get(data.categorySlug)
          : undefined;

        // Create provider
        await prisma.provider.create({
          data: {
            userId,
            name: data.name,
            slug,
            description: data.description,
            phone: data.phone,
            email: data.email,
            address: data.address,
            city: data.city,
            lat: data.lat,
            lng: data.lng,
            services: data.services || [],
            priceBand: data.priceBand || "MIDRANGE",
            languages: data.languages || ["he"],
            photos: [],
            status,
            approvedBy: status === "ACTIVE" ? authResult.userId : null,
            approvedAt: status === "ACTIVE" ? new Date() : null,
            categories: categoryId
              ? { connect: { id: categoryId } }
              : undefined,
          },
        });

        results.imported++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.errors.push({
          index: i,
          name: data.name,
          error: errorMessage,
        });

        if (!skipErrors) {
          // Log import attempt
          await prisma.importLog.create({
            data: {
              filename: "api-import",
              rowCount: providersData.length,
              importedCount: results.imported,
              errorCount: results.errors.length,
              errors: results.errors,
              status: "failed",
              createdBy: authResult.userId,
            },
          });

          return NextResponse.json({
            success: false,
            imported: results.imported,
            errors: results.errors,
            message: `Import stopped at row ${i + 1}. Set skipErrors=true to continue on errors.`,
          });
        }

        results.skipped++;
      }
    }

    // Log successful import
    await prisma.importLog.create({
      data: {
        filename: "api-import",
        rowCount: providersData.length,
        importedCount: results.imported,
        errorCount: results.errors.length,
        errors: results.errors.length > 0 ? results.errors : undefined,
        status: "completed",
        createdBy: authResult.userId,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
    });
  } catch (error) {
    console.error("Admin import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const action = searchParams.get("action");

    if (action === "template") {
      // Return CSV template
      const template = `name,description,phone,email,address,city,lat,lng,categorySlug,services,priceBand,languages
"Example Provider","A great service provider for parents. We offer quality care and education for children.","0501234567","example@email.com","123 Main Street","Tel Aviv",32.0853,34.7818,"babysitters","Babysitting|Night Care","MIDRANGE","he|en"`;

      return new NextResponse(template, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=provider-import-template.csv",
        },
      });
    }

    // Return import history
    const imports = await prisma.importLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      imports: imports.map((imp) => ({
        id: imp.id,
        filename: imp.filename,
        rowCount: imp.rowCount,
        importedCount: imp.importedCount,
        errorCount: imp.errorCount,
        status: imp.status,
        createdBy: imp.createdBy,
        createdAt: imp.createdAt,
        completedAt: imp.completedAt,
      })),
    });
  } catch (error) {
    console.error("Admin import history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
