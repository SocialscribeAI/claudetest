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
 */

import { PrismaClient } from "@prisma/client";
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
  console.log("🏢 Seeding sample providers...");

  const sampleProviders = [
    {
      name: "גן השמש",
      category: "baby-classes",
      city: "תל אביב",
      neighborhood: "רמת אביב",
      lat: 32.1133,
      lng: 34.8044,
      price: "MIDRANGE",
    },
    {
      name: "יועצת שינה מאיה",
      category: "sleep-consultants",
      city: "תל אביב",
      neighborhood: "הצפון הישן",
      lat: 32.0853,
      lng: 34.7818,
      price: "PREMIUM",
    },
    {
      name: "הנקה בשמחה",
      category: "lactation-consultants",
      city: "רמת גן",
      neighborhood: "מרום נווה",
      lat: 32.0680,
      lng: 34.8248,
      price: "MIDRANGE",
    },
    {
      name: "עיסוי תינוקות עדין",
      category: "baby-massage",
      city: "גבעתיים",
      neighborhood: "בורוכוב",
      lat: 32.0714,
      lng: 34.8106,
      price: "BUDGET",
    },
    {
      name: "בייביסיטר מיכל",
      category: "babysitters",
      city: "תל אביב",
      neighborhood: "נווה צדק",
      lat: 32.0622,
      lng: 34.7654,
      price: "BUDGET",
    },
    {
      name: "מטפלת אורית",
      category: "nannies",
      city: "הרצליה",
      neighborhood: "הרצליה פיתוח",
      lat: 32.1656,
      lng: 34.8466,
      price: "PREMIUM",
    },
    {
      name: "חנות בייבי לאב",
      category: "baby-stores",
      city: "תל אביב",
      neighborhood: "דיזנגוף סנטר",
      lat: 32.0770,
      lng: 34.7749,
      price: "MIDRANGE",
    },
    {
      name: "צילומי ניובורן שירה",
      category: "photographers",
      city: "ראשון לציון",
      neighborhood: "מזרח",
      lat: 31.9730,
      lng: 34.7925,
      price: "PREMIUM",
    },
    {
      name: "דולה רחל",
      category: "doulas",
      city: "ירושלים",
      neighborhood: "רחביה",
      lat: 31.7767,
      lng: 35.2167,
      price: "MIDRANGE",
    },
    {
      name: "ד״ר כהן רופא ילדים",
      category: "pediatricians",
      city: "חיפה",
      neighborhood: "כרמל",
      lat: 32.8031,
      lng: 34.9875,
      price: "MIDRANGE",
    },
    {
      name: "מתפתחים יחד",
      category: "child-development",
      city: "פתח תקווה",
      neighborhood: "מרכז",
      lat: 32.0841,
      lng: 34.8878,
      price: "MIDRANGE",
    },
    {
      name: "אמא ותינוק בתנועה",
      category: "mommy-and-me",
      city: "תל אביב",
      neighborhood: "פלורנטין",
      lat: 32.0558,
      lng: 34.7670,
      price: "BUDGET",
    },
    {
      name: "טיפול אחרי לידה",
      category: "postpartum-care",
      city: "רעננה",
      neighborhood: "מרכז",
      lat: 32.1836,
      lng: 34.8708,
      price: "PREMIUM",
    },
    {
      name: "השכרת ציוד לתינוק",
      category: "equipment-rental",
      city: "נתניה",
      neighborhood: "מרכז",
      lat: 32.3286,
      lng: 34.8556,
      price: "BUDGET",
    },
    {
      name: "חוג מוזיקה לתינוקות",
      category: "baby-classes",
      city: "תל אביב",
      neighborhood: "שרונה",
      lat: 32.0731,
      lng: 34.7864,
      price: "MIDRANGE",
    },
  ];

  for (let i = 0; i < sampleProviders.length; i++) {
    const sample = sampleProviders[i];
    const category = await prisma.category.findUnique({
      where: { slug: sample.category },
    });

    if (!category) {
      console.log(`⚠️ Category not found: ${sample.category}`);
      continue;
    }

    // Create a user for this provider
    const userEmail = `provider${i + 1}@example.com`;
    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });

    if (existingUser) {
      console.log(`⏭️ Skipping ${sample.name} - already exists`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        name: sample.name,
        email: userEmail,
        phone: `05012345${(i + 10).toString().padStart(2, "0")}`,
        phoneVerified: new Date(),
        role: "PROVIDER",
      },
    });

    const slug = sample.name
      .toLowerCase()
      .replace(/[^\w\s\u0590-\u05FF]/g, "")
      .replace(/\s+/g, "-");

    await prisma.provider.create({
      data: {
        userId: user.id,
        name: sample.name,
        slug: `${slug}-${i + 1}`,
        description: `שירותי ${sample.name} איכותיים ב${sample.city}. אנחנו מתמחים במתן שירות מקצועי ואישי לכל משפחה.`,
        bio: `${sample.name} - מספקים שירות מעולה כבר 5 שנים.`,
        phone: `05012345${(i + 10).toString().padStart(2, "0")}`,
        whatsapp: `05012345${(i + 10).toString().padStart(2, "0")}`,
        address: `רחוב הרצל ${i + 1}, ${sample.city}`,
        city: sample.city,
        neighborhoods: JSON.stringify([sample.neighborhood]),
        lat: sample.lat,
        lng: sample.lng,
        priceBand: sample.price,
        languages: JSON.stringify(["עברית", "אנגלית"]),
        services: JSON.stringify(["ייעוץ", "ביקור בית", "תמיכה טלפונית"]),
        photos: JSON.stringify([]),
        status: "ACTIVE",
        isAvailable: true,
        isVerified: i % 3 === 0, // Every 3rd provider is verified
        featuredRank: i < 3 ? 10 - i : 0, // First 3 are featured
      },
    });

    // Create the category relation
    await prisma.categoryProvider.create({
      data: {
        providerId: (await prisma.provider.findUnique({ where: { userId: user.id } }))!.id,
        categoryId: category.id,
      },
    });

    // Add some reviews
    if (i < 10) {
      const reviewUser = await prisma.user.create({
        data: {
          name: `משתמש ${i + 100}`,
          email: `reviewer${i + 100}@example.com`,
          role: "USER",
        },
      });

      const provider = await prisma.provider.findUnique({ where: { userId: user.id } });

      await prisma.review.create({
        data: {
          userId: reviewUser.id,
          providerId: provider!.id,
          rating: 4 + (i % 2), // 4 or 5 stars
          text: `שירות מעולה! ממליצה בחום על ${sample.name}. מאוד מקצועי ואדיב.`,
          status: "APPROVED",
          photos: JSON.stringify([]),
        },
      });
    }
  }

  console.log(`✅ Seeded ${sampleProviders.length} sample providers`);
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
