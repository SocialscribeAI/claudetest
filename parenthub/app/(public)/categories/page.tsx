"use client";

/**
 * CATEGORIES PAGE - app/(public)/categories/page.tsx
 *
 * Lists all available categories
 */

import Link from "next/link";
import { useCategories } from "@/hooks/use-api";

const categoryIcons: Record<string, string> = {
  "sleep-consultants": "🌙",
  "lactation-consultants": "🤱",
  "babysitters": "👶",
  "tutors": "📚",
  "doulas": "🤰",
  "baby-classes": "🎨",
  "nannies": "🧑‍🍼",
  "activities": "⚽",
  "photographers": "📷",
  "therapists": "🧠",
  "pediatricians": "👨‍⚕️",
  "nutritionists": "🥗",
};

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Browse Categories</h1>
          <p className="text-white/80 mt-2">Find the perfect service for your family</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {categoryIcons[category.slug] || category.icon || "📍"}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
                  {category.name}
                </h3>
                {category.nameHe && (
                  <p className="text-gray-500 text-sm text-center" dir="rtl">
                    {category.nameHe}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-1 text-pink-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View providers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/search"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search All</h3>
                <p className="text-gray-500 text-sm">Find any provider</p>
              </div>
            </Link>
            <Link
              href="/map"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Map View</h3>
                <p className="text-gray-500 text-sm">Explore nearby</p>
              </div>
            </Link>
            <Link
              href="/signup?type=provider"
              className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-4 text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Become a Provider</h3>
                <p className="text-white/80 text-sm">Join our network</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
