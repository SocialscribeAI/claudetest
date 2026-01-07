"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  rating: number;
  reviews: number;
  city: string;
  lat: number;
  lng: number;
  price: string;
  verified: boolean;
}

const mockProviders: Provider[] = [
  { id: "1", name: "גן השמש", category: "גני ילדים", categoryIcon: "🏫", rating: 4.8, reviews: 124, city: "תל אביב", lat: 32.0853, lng: 34.7818, price: "₪₪", verified: true },
  { id: "2", name: "חוג כדורגל אלופים", category: "ספורט", categoryIcon: "⚽", rating: 4.6, reviews: 89, city: "תל אביב", lat: 32.0900, lng: 34.7750, price: "₪", verified: true },
  { id: "3", name: "מוזיקה לילדים", category: "מוזיקה", categoryIcon: "🎵", rating: 4.9, reviews: 156, city: "רמת גן", lat: 32.0700, lng: 34.8200, price: "₪₪", verified: false },
  { id: "4", name: "מתמטיקה בקלות", category: "לימודים", categoryIcon: "📚", rating: 4.7, reviews: 45, city: "גבעתיים", lat: 32.0750, lng: 34.8100, price: "₪₪₪", verified: true },
  { id: "5", name: "שמרטפות מיכל", category: "בייביסיטר", categoryIcon: "👶", rating: 4.5, reviews: 67, city: "תל אביב", lat: 32.0800, lng: 34.7900, price: "₪", verified: false },
  { id: "6", name: "גן הפרפרים", category: "גני ילדים", categoryIcon: "🏫", rating: 4.8, reviews: 98, city: "הרצליה", lat: 32.1650, lng: 34.8450, price: "₪₪", verified: true },
];

const categories = [
  { slug: "all", name: "הכל", icon: "📍" },
  { slug: "kindergartens", name: "גני ילדים", icon: "🏫" },
  { slug: "sports", name: "ספורט", icon: "⚽" },
  { slug: "music", name: "מוזיקה", icon: "🎵" },
  { slug: "tutoring", name: "לימודים", icon: "📚" },
  { slug: "babysitters", name: "בייביסיטר", icon: "👶" },
];

function MapContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapCenter] = useState({ lat: 32.0853, lng: 34.7818 });

  const filteredProviders = selectedCategory === "all"
    ? mockProviders
    : mockProviders.filter((p) => p.category.includes(categories.find((c) => c.slug === selectedCategory)?.name || ""));

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">חזרה</span>
        </Link>
        <h1 className="font-bold text-gray-900">מפת ספקים</h1>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-1 text-pink-600 font-medium"
        >
          {showList ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              מפה
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              רשימה
            </>
          )}
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat.slug
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {showList ? (
          /* List View */
          <div className="h-full overflow-y-auto bg-gray-50 p-4">
            <p className="text-sm text-gray-600 mb-4">{filteredProviders.length} ספקים באזור</p>
            <div className="space-y-3">
              {filteredProviders.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/provider/${provider.id}`}
                  className="block bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{provider.categoryIcon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{provider.name}</h3>
                        {provider.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{provider.category} · {provider.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">{provider.rating}</span>
                        <span className="text-sm text-gray-500">({provider.reviews})</span>
                        <span className="text-sm text-gray-400 ms-2">{provider.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Map View */
          <>
            {/* Map Container (placeholder - would use Google Maps) */}
            <div className="h-full bg-gray-200 relative">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Map Markers */}
              {filteredProviders.map((provider, index) => {
                const x = 20 + ((provider.lng - 34.77) * 500);
                const y = 20 + ((32.17 - provider.lat) * 500);
                return (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 z-10",
                      selectedProvider?.id === provider.id && "scale-125 z-20"
                    )}
                    style={{ left: `${Math.min(Math.max(x, 10), 90)}%`, top: `${Math.min(Math.max(y, 15), 85)}%` }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2",
                      selectedProvider?.id === provider.id
                        ? "bg-pink-500 border-white"
                        : "bg-white border-gray-200"
                    )}>
                      <span className="text-lg">{provider.categoryIcon}</span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                  </button>
                );
              })}

              {/* Map Controls */}
              <div className="absolute top-4 end-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>

              {/* Current Location Button */}
              <button className="absolute bottom-24 end-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Search This Area Button */}
              <button className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                חפש באזור זה
              </button>
            </div>

            {/* Selected Provider Info Card */}
            {selectedProvider && (
              <div className="absolute bottom-4 left-4 right-4 z-30">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="absolute top-2 end-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <Link href={`/provider/${selectedProvider.id}`} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{selectedProvider.categoryIcon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{selectedProvider.name}</h3>
                        {selectedProvider.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{selectedProvider.category} · {selectedProvider.city}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">{selectedProvider.rating}</span>
                          <span className="text-sm text-gray-500">({selectedProvider.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-500">{selectedProvider.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">טוען מפה...</p>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
