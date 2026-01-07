/**
 * API HOOKS - hooks/use-api.ts
 *
 * Purpose: React Query hooks for API data fetching
 *
 * Hooks:
 * - useProviders: Fetch providers with filters
 * - useProvider: Fetch single provider by ID
 * - useCategories: Fetch all categories
 * - useSearch: Search providers
 * - useReviews: Fetch reviews for a provider
 *
 * Uses React Query for:
 * - Automatic caching
 * - Background refetching
 * - Loading/error states
 * - Optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Provider {
  id: string;
  name: string;
  slug: string;
  photo: string | null;
  photos: string[];
  description: string;
  categories: Category[];
  rating: number | null;
  reviewCount: number;
  priceBand: 1 | 2 | 3;
  city: string;
  address: string;
  lat: number;
  lng: number;
  distance: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  phone: string;
  whatsapp: string | null;
  services: string[];
}

export interface Category {
  id: string;
  name: string;
  nameHe: string;
  slug: string;
  icon: string | null;
  description?: string;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  userName: string;
  createdAt: string;
}

export interface ProvidersResponse {
  providers: Provider[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProviderFilters {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  q?: string;
  sort?: "distance" | "rating" | "featured";
  price?: string;
  available?: boolean;
  page?: number;
  limit?: number;
}

// API functions
async function fetchProviders(filters: ProviderFilters): Promise<ProvidersResponse> {
  const params = new URLSearchParams();

  if (filters.lat) params.set("lat", filters.lat.toString());
  if (filters.lng) params.set("lng", filters.lng.toString());
  if (filters.radius) params.set("radius", filters.radius.toString());
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.price) params.set("price", filters.price);
  if (filters.available) params.set("available", "true");
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.limit) params.set("limit", filters.limit.toString());

  const res = await fetch(`/api/providers?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

async function fetchProvider(id: string): Promise<Provider> {
  const res = await fetch(`/api/providers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch provider");
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories || data;
}

async function fetchReviews(providerId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews/${providerId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const data = await res.json();
  return data.reviews || data;
}

async function searchProviders(query: string): Promise<Provider[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search");
  const data = await res.json();
  return data.results || data.providers || [];
}

// Hooks

/**
 * Fetch providers with filters
 */
export function useProviders(filters: ProviderFilters = {}) {
  return useQuery({
    queryKey: ["providers", filters],
    queryFn: () => fetchProviders(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single provider by ID
 */
export function useProvider(id: string | null) {
  return useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProvider(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
  });
}

/**
 * Fetch reviews for a provider
 */
export function useReviews(providerId: string | null) {
  return useQuery({
    queryKey: ["reviews", providerId],
    queryFn: () => fetchReviews(providerId!),
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search providers
 */
export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProviders(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Prefetch providers for a category (for faster navigation)
 */
export function usePrefetchCategory() {
  const queryClient = useQueryClient();

  return (categorySlug: string) => {
    queryClient.prefetchQuery({
      queryKey: ["providers", { category: categorySlug }],
      queryFn: () => fetchProviders({ category: categorySlug }),
    });
  };
}
