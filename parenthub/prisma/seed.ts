/**
 * SEED SCRIPT - prisma/seed.ts
 *
 * Purpose: Seed database with initial data
 *
 * Seeds:
 * - 15 default categories
 * - 1 admin user
 * - 20 sample providers (for development)
 *
 * Usage:
 * npx prisma db seed
 *
 * Or add to package.json:
 * "prisma": { "seed": "ts-node prisma/seed.ts" }
 */

import { PrismaClient, PriceBand, ProviderStatus } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../constants/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Seed categories
  console.log("📁 Seeding categories...");
  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    const cat = DEFAULT_CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        nameHe: cat.nameHe,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        sortOrder: i,
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${DEFAULT_CATEGORIES.length} categories`);

  // Seed admin user
  console.log("👤 Seeding admin user...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@parenthub.co.il" },
    update: {},
    create: {
      email: "admin@parenthub.co.il",
      name: "Admin",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Seed sample providers (development only)
  if (process.env.NODE_ENV !== "production") {
    console.log("🏢 Seeding sample providers...");

    const sampleProviders = [
      {
        name: "Maya Sleep Solutions",
        nameHe: "מאיה יועצת שינה",
        category: "sleep-consultants",
        city: "Tel Aviv",
        lat: 32.0853,
        lng: 34.7818,
      },
      {
        name: "Gentle Beginnings Lactation",
        nameHe: "ייעוץ הנקה עדין",
        category: "lactation-consultants",
        city: "Tel Aviv",
        lat: 32.0741,
        lng: 34.7922,
      },
      {
        name: "Baby Bliss Massage",
        nameHe: "עיסוי תינוקות בליס",
        category: "baby-massage",
        city: "Ramat Gan",
        lat: 32.0680,
        lng: 34.8248,
      },
      // Add more sample providers as needed
    ];

    for (const sample of sampleProviders) {
      const category = await prisma.category.findUnique({
        where: { slug: sample.category },
      });

      if (!category) continue;

      // Create a user for this provider
      const user = await prisma.user.create({
        data: {
          name: sample.name,
          email: `${sample.category}@example.com`.replace("-", ""),
          role: "PROVIDER",
        },
      });

      await prisma.provider.create({
        data: {
          userId: user.id,
          name: sample.name,
          slug: sample.name.toLowerCase().replace(/\s+/g, "-"),
          description: `Professional ${sample.name} services in ${sample.city}. We provide high-quality care for your family.`,
          phone: "+972501234567",
          address: `123 Main Street, ${sample.city}`,
          city: sample.city,
          lat: sample.lat,
          lng: sample.lng,
          priceBand: PriceBand.MIDRANGE,
          languages: ["Hebrew", "English"],
          services: ["Consultation", "Home visits", "Online support"],
          status: ProviderStatus.ACTIVE,
          isAvailable: true,
          categories: {
            connect: { id: category.id },
          },
        },
      });
    }

    console.log(`✅ Seeded ${sampleProviders.length} sample providers`);
  }

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
