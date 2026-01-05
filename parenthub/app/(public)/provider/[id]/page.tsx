/**
 * PROVIDER PROFILE PAGE - app/(public)/provider/[id]/page.tsx
 *
 * Purpose: Full profile page for a service provider
 *
 * Features:
 * - Photo gallery
 * - Provider info, bio, description
 * - Services, pricing, availability
 * - Reviews section
 * - Contact CTAs (sticky footer)
 */

import Link from "next/link";
import Image from "next/image";
import { StarRating } from "@/components/common/star-rating";
import { PriceBand } from "@/components/common/price-band";
import { DistanceBadge } from "@/components/common/distance-badge";

// Mock provider data - would come from API
const mockProvider = {
  id: "1",
  slug: "maya-cohen",
  name: "Maya Cohen",
  category: "babysitters",
  categoryHe: "בייביסיטר",
  photos: [
    "/images/providers/maya-1.jpg",
    "/images/providers/maya-2.jpg",
    "/images/providers/maya-3.jpg",
  ],
  rating: 4.9,
  reviewCount: 47,
  priceBand: "MIDRANGE" as const,
  isVerified: true,
  isFeatured: true,
  city: "Tel Aviv",
  neighborhood: "Florentin",
  distance: 0.8,
  phone: "+972501234567",
  whatsapp: "+972501234567",
  bio: "Experienced babysitter with 5+ years of caring for children ages 0-10. First aid certified, patient, creative, and passionate about child development.",
  description: `I've been working with children for over 5 years and absolutely love what I do. I specialize in infant care and early childhood development, creating engaging activities that promote learning through play.

I'm first aid and CPR certified, and have experience with special needs children. I'm fluent in Hebrew and English.

My approach is to create a safe, fun, and stimulating environment where children can explore and grow. I believe in positive reinforcement and age-appropriate boundaries.`,
  services: [
    { name: "Babysitting", nameHe: "שמרטפות", price: "50-70₪/hr" },
    { name: "Overnight care", nameHe: "שמירה לילית", price: "300-400₪" },
    { name: "Weekend care", nameHe: "סוף שבוע", price: "By arrangement" },
  ],
  languages: ["Hebrew", "English", "Russian"],
  availability: {
    sunday: ["08:00-18:00"],
    monday: ["08:00-18:00"],
    tuesday: ["08:00-18:00"],
    wednesday: ["08:00-18:00"],
    thursday: ["08:00-18:00"],
    friday: ["08:00-14:00"],
    saturday: null,
  },
  serviceRadius: 5,
  address: "Florentin, Tel Aviv",
  lat: 32.0533,
  lng: 34.7693,
};

const mockReviews = [
  {
    id: "1",
    author: "Sarah L.",
    rating: 5,
    date: "2 weeks ago",
    text: "Maya is absolutely wonderful with our twins. She's patient, creative, and always comes prepared with fun activities. Highly recommend!",
  },
  {
    id: "2",
    author: "David K.",
    rating: 5,
    date: "1 month ago",
    text: "We've been using Maya for over a year now and couldn't be happier. Our daughter loves her!",
  },
  {
    id: "3",
    author: "Rachel M.",
    rating: 4,
    date: "2 months ago",
    text: "Very reliable and professional. Good communication and always on time.",
  },
];

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { id } = await params;
  const provider = mockProvider; // In production, fetch from API

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="p-2 -m-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {/* Photo counter */}
        <div className="absolute bottom-4 end-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          1 / {provider.photos.length}
        </div>
        {/* Badges */}
        <div className="absolute top-4 start-4 flex gap-2">
          {provider.isFeatured && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
              Featured
            </span>
          )}
          {provider.isVerified && (
            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Provider Info */}
      <div className="container mx-auto px-4 py-6">
        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
            <p className="text-gray-500">{provider.categoryHe}</p>
          </div>
          <PriceBand band={provider.priceBand} size="lg" />
        </div>

        {/* Rating & Location */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <StarRating rating={provider.rating} count={provider.reviewCount} />
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {provider.neighborhood}, {provider.city}
          </span>
          {provider.distance && (
            <DistanceBadge distance={provider.distance} />
          )}
        </div>

        {/* Bio */}
        <p className="mt-6 text-gray-700 leading-relaxed">
          {provider.bio}
        </p>

        {/* Services */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services & Pricing</h2>
          <div className="space-y-3">
            {provider.services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.nameHe}</p>
                </div>
                <span className="text-pink-600 font-medium">{service.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {provider.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
              const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
              const available = provider.availability[days[idx] as keyof typeof provider.availability];
              return (
                <div key={idx} className="space-y-1">
                  <span className="text-gray-500">{day}</span>
                  <div
                    className={`py-2 rounded-lg ${
                      available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {available ? "Yes" : "-"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {provider.description}
          </p>
        </section>

        {/* Service Area */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h2>
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Within {provider.serviceRadius}km of {provider.neighborhood}</span>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Reviews ({provider.reviewCount})
            </h2>
            <button className="text-pink-600 text-sm font-medium hover:text-pink-700">
              Write a review
            </button>
          </div>

          {/* Rating breakdown */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{provider.rating}</div>
                <StarRating rating={provider.rating} showCount={false} />
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{stars}</span>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${stars === 5 ? 80 : stars === 4 ? 15 : 5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {review.author[0]}
                    </div>
                    <span className="font-medium text-gray-900">{review.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <StarRating rating={review.rating} showCount={false} size="sm" />
                <p className="mt-2 text-gray-700 text-sm">{review.text}</p>
              </div>
            ))}
          </div>

          {provider.reviewCount > 3 && (
            <button className="w-full mt-4 py-3 text-pink-600 font-medium hover:bg-pink-50 rounded-xl transition-colors">
              Show all {provider.reviewCount} reviews
            </button>
          )}
        </section>
      </div>

      {/* Sticky Contact Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-30">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <a
              href={`tel:${provider.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
            <a
              href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
