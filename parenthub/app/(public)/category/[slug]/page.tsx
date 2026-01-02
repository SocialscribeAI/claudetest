/**
 * CATEGORY PAGE - app/(public)/category/[slug]/page.tsx
 *
 * Purpose: Display all providers in a specific category
 *
 * Features:
 * - Category header with icon and description
 * - Provider list filtered by category
 * - Subcategory chips (if category has children)
 * - Same filters/sort as search page
 * - Map toggle available
 *
 * Dynamic route params:
 * - slug: category slug (e.g., "lactation-consultants")
 *
 * Components used:
 * - CategoryHeader
 * - ProviderList
 * - FilterSheet
 * - MapToggle
 *
 * API calls:
 * - GET /api/categories/[slug] (category details)
 * - GET /api/providers?category=[slug] (providers in category)
 *
 * Analytics events:
 * - category_view
 * - results_shown
 * - result_click
 */

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Category: {slug}</h1>
      {/* TODO: Implement category page */}
    </main>
  );
}
