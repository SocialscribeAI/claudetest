"use client";

import { useState, use } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const mockCategories: Record<string, { name: string; icon: string; description: string; subcategories: string[] }> = {
  "kindergartens": {
    name: "גני ילדים",
    icon: "🏫",
    description: "גני ילדים פרטיים וציבוריים לגילאי 3 חודשים עד 6 שנים",
    subcategories: ["משפחתון", "גן פרטי", "גן עירוני", "גן טבע"],
  },
  "sports": {
    name: "חוגי ספורט",
    icon: "⚽",
    description: "חוגי ספורט לילדים - כדורגל, כדורסל, שחייה, התעמלות ועוד",
    subcategories: ["כדורגל", "כדורסל", "שחייה", "התעמלות", "ג׳ודו"],
  },
  "music": {
    name: "מוזיקה",
    icon: "🎵",
    description: "שיעורי מוזיקה פרטיים וקבוצתיים, חוגי נגינה ושירה",
    subcategories: ["פסנתר", "גיטרה", "כינור", "תופים", "שירה"],
  },
  "tutoring": {
    name: "עזרה בלימודים",
    icon: "📚",
    description: "שיעורים פרטיים והכנה למבחנים בכל המקצועות",
    subcategories: ["מתמטיקה", "אנגלית", "עברית", "פיזיקה", "הכנה לבגרות"],
  },
  "babysitters": {
    name: "בייביסיטר",
    icon: "👶",
    description: "שירותי שמרטפות וטיפול בילדים בבית",
    subcategories: ["שמרטפות", "אומנת", "עזרה לאחר לידה"],
  },
};

const mockProviders = [
  { id: "1", name: "גן השמש", rating: 4.8, reviews: 124, city: "תל אביב", neighborhood: "רמת אביב", price: "₪₪", image: null, verified: true },
  { id: "2", name: "גן הילדים שלי", rating: 4.6, reviews: 89, city: "תל אביב", neighborhood: "הצפון הישן", price: "₪₪₪", image: null, verified: true },
  { id: "3", name: "גן קשת", rating: 4.9, reviews: 156, city: "רמת גן", neighborhood: "מרום נווה", price: "₪₪", image: null, verified: false },
  { id: "4", name: "משפחתון אורית", rating: 4.7, reviews: 45, city: "תל אביב", neighborhood: "נווה צדק", price: "₪", image: null, verified: true },
  { id: "5", name: "גן הפרפרים", rating: 4.5, reviews: 67, city: "גבעתיים", neighborhood: "בורוכוב", price: "₪₪", image: null, verified: false },
  { id: "6", name: "גן טבע ירוק", rating: 4.8, reviews: 98, city: "הרצליה", neighborhood: "הרצליה פיתוח", price: "₪₪₪", image: null, verified: true },
];

type SortOption = "relevance" | "rating" | "reviews" | "distance";

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = mockCategories[slug] || { name: slug, icon: "📁", description: "", subcategories: [] };

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזרה
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-white/90 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Chips */}
      {category.subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  !selectedSubcategory
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                הכל
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedSubcategory === sub
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">{mockProviders.length}</span> תוצאות
            {selectedSubcategory && <span> ב{selectedSubcategory}</span>}
          </p>
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="relevance">רלוונטיות</option>
              <option value="rating">דירוג</option>
              <option value="reviews">כמות ביקורות</option>
              <option value="distance">מרחק</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              סינון
            </button>

            {/* Map Toggle */}
            <Link
              href={`/map?category=${slug}`}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              מפה
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">כל הערים</option>
                  <option value="tel-aviv">תל אביב</option>
                  <option value="jerusalem">ירושלים</option>
                  <option value="haifa">חיפה</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טווח מחיר</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">הכל</option>
                  <option value="1">₪</option>
                  <option value="2">₪₪</option>
                  <option value="3">₪₪₪</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">דירוג מינימלי</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">הכל</option>
                  <option value="4.5">4.5+</option>
                  <option value="4">4+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מאומת</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">הכל</option>
                  <option value="verified">מאומתים בלבד</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="space-y-4">
          {mockProviders.map((provider) => (
            <Link
              key={provider.id}
              href={`/provider/${provider.id}`}
              className="block bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{category.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{provider.name}</h3>
                        {provider.verified && (
                          <span className="text-blue-500" title="מאומת">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{provider.city}, {provider.neighborhood}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{provider.price}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{provider.rating}</span>
                      <span className="text-sm text-gray-500">({provider.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
