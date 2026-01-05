/**
 * HOME PAGE - app/(public)/page.tsx
 *
 * Purpose: Main landing page for ParentHub
 *
 * Features:
 * - Hero section with app value proposition
 * - Search bar for quick provider search
 * - Category grid for browsing
 * - Featured providers section
 * - Near you section (location-based)
 */

import Link from "next/link";
import { SearchBar } from "@/components/discovery/search-bar";
import { CategoryTile } from "@/components/common/category-tile";
import { ProviderCard } from "@/components/common/provider-card";

// Mock data - would come from API in production
const categories = [
  { id: "1", slug: "babysitters", name: "Babysitters", nameHe: "בייביסיטר", providerCount: 156 },
  { id: "2", slug: "tutoring", name: "Tutoring", nameHe: "שיעורים פרטיים", providerCount: 89 },
  { id: "3", slug: "music-lessons", name: "Music Lessons", nameHe: "שיעורי מוזיקה", providerCount: 67 },
  { id: "4", slug: "sports-activities", name: "Sports", nameHe: "ספורט", providerCount: 124 },
  { id: "5", slug: "art-classes", name: "Art Classes", nameHe: "שיעורי אמנות", providerCount: 45 },
  { id: "6", slug: "swim-lessons", name: "Swimming", nameHe: "שחייה", providerCount: 38 },
  { id: "7", slug: "dance-classes", name: "Dance", nameHe: "ריקוד", providerCount: 52 },
  { id: "8", slug: "therapists", name: "Therapists", nameHe: "מטפלים", providerCount: 73 },
];

const featuredProviders = [
  {
    id: "1",
    slug: "maya-cohen",
    name: "Maya Cohen",
    category: "babysitters",
    categoryHe: "בייביסיטר",
    photo: "/images/providers/maya.jpg",
    rating: 4.9,
    reviewCount: 47,
    priceBand: "MIDRANGE" as const,
    isVerified: true,
    isFeatured: true,
    city: "Tel Aviv",
  },
  {
    id: "2",
    slug: "david-levi",
    name: "David Levi",
    category: "tutoring",
    categoryHe: "מורה פרטי",
    photo: "/images/providers/david.jpg",
    rating: 4.8,
    reviewCount: 62,
    priceBand: "PREMIUM" as const,
    isVerified: true,
    isFeatured: true,
    city: "Herzliya",
  },
  {
    id: "3",
    slug: "sarah-music",
    name: "Sarah's Music Studio",
    category: "music-lessons",
    categoryHe: "שיעורי מוזיקה",
    photo: "/images/providers/sarah.jpg",
    rating: 5.0,
    reviewCount: 28,
    priceBand: "MIDRANGE" as const,
    isVerified: true,
    isFeatured: true,
    city: "Ramat Gan",
  },
];

const nearbyProviders = [
  {
    id: "4",
    slug: "yael-swim",
    name: "Yael Swimming",
    category: "swim-lessons",
    categoryHe: "שיעורי שחייה",
    photo: "/images/providers/yael.jpg",
    rating: 4.7,
    reviewCount: 35,
    priceBand: "BUDGET" as const,
    distance: 1.2,
    isAvailable: true,
    city: "Tel Aviv",
  },
  {
    id: "5",
    slug: "art-together",
    name: "Art Together",
    category: "art-classes",
    categoryHe: "סטודיו לאמנות",
    photo: "/images/providers/art.jpg",
    rating: 4.6,
    reviewCount: 19,
    priceBand: "MIDRANGE" as const,
    distance: 2.5,
    city: "Tel Aviv",
  },
  {
    id: "6",
    slug: "dance-kids",
    name: "Dance Kids Studio",
    category: "dance-classes",
    categoryHe: "סטודיו ריקוד",
    photo: "/images/providers/dance.jpg",
    rating: 4.9,
    reviewCount: 44,
    priceBand: "MIDRANGE" as const,
    distance: 3.1,
    isAvailable: true,
    city: "Givatayim",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -end-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -start-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find the perfect care for your child
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover trusted babysitters, tutors, and activities near you
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <SearchBar
                placeholder="Search for babysitters, tutors, activities..."
                variant="hero"
                size="lg"
              />
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Babysitters", "Tutoring", "Sports", "Music"].map((item) => (
                <Link
                  key={item}
                  href={`/search?category=${item.toLowerCase()}`}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <Link
              href="/categories"
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                showCount
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-pink-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Providers</h2>
              <p className="text-gray-600 text-sm mt-1">Top-rated providers in your area</p>
            </div>
            <Link
              href="/search?featured=true"
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Near You Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Near You</h2>
              <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tel Aviv
              </p>
            </div>
            <Link
              href="/map"
              className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View map
            </Link>
          </div>

          <div className="space-y-4">
            {nearbyProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                variant="horizontal"
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium transition-colors"
            >
              See all providers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Location Permission Banner (shown conditionally) */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-start">
              <h3 className="font-semibold text-gray-900">Enable location for better results</h3>
              <p className="text-sm text-gray-600">Find providers closest to you with distance information</p>
            </div>
            <button className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
              Enable Location
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Search",
                description: "Find providers by category, location, or search for specific services",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: 2,
                title: "Compare",
                description: "Read reviews, check availability, and compare prices to find the best fit",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
              },
              {
                step: 3,
                title: "Connect",
                description: "Contact providers directly and book the perfect care for your child",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl mb-4 shadow-lg">
                  {item.icon}
                  <span className="absolute -top-2 -end-2 w-6 h-6 bg-white text-pink-600 rounded-full text-sm font-bold flex items-center justify-center shadow">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a service provider?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join ParentHub and connect with thousands of parents looking for services like yours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?type=provider"
              className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              Register as Provider
            </Link>
            <Link
              href="/about/providers"
              className="px-8 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
