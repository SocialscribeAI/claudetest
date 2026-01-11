/**
 * HOME PAGE - app/(public)/page.tsx
 *
 * Purpose: Main landing page for ParentHub
 * Now connected to real APIs via React Query
 */

import Link from "next/link";
import { SearchBar } from "@/components/discovery/search-bar";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { NearbyProviders } from "@/components/home/NearbyProviders";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -end-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -start-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Find the perfect care for your child</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover trusted babysitters, tutors, and activities near you
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar placeholder="Search for babysitters, tutors, activities..." variant="hero" size="lg" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["sleep-consultants", "baby-classes", "babysitters", "doulas"].map((slug) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors capitalize"
                >
                  {slug.replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
          </svg>
        </div>
      </section>

      <CategoriesGrid />
      <FeaturedProviders />
      <NearbyProviders />

      {/* How It Works */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Search", desc: "Find providers by category or location" },
              { step: 2, title: "Compare", desc: "Read reviews and compare prices" },
              { step: 3, title: "Connect", desc: "Contact providers directly" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a service provider?</h2>
          <p className="text-lg text-white/90 mb-8">Join ParentHub and connect with parents</p>
          <Link
            href="/signup?type=provider"
            className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            Register as Provider
          </Link>
        </div>
      </section>
    </main>
  );
}
