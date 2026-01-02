/**
 * CONSTANTS INDEX - constants/index.ts
 *
 * Purpose: Central export for application constants
 *
 * Available:
 * - DEFAULT_CATEGORIES: Category list with icons
 * - getCategoryIcon: Get icon for category
 * - DEFAULT_LOCATION: Tel Aviv coordinates
 * - PRICE_BANDS: Price band labels
 * - LANGUAGES: Available languages
 *
 * Usage:
 * import { DEFAULT_CATEGORIES, DEFAULT_LOCATION } from "@/constants";
 */

export * from "./categories";

// Default location (Tel Aviv)
export const DEFAULT_LOCATION = {
  lat: 32.0853,
  lng: 34.7818,
  city: "Tel Aviv",
};

// Price band labels
export const PRICE_BANDS = {
  1: { label: "Budget", labelHe: "חסכוני", symbol: "₪" },
  2: { label: "Mid-range", labelHe: "בינוני", symbol: "₪₪" },
  3: { label: "Premium", labelHe: "פרימיום", symbol: "₪₪₪" },
};

// Available languages
export const LANGUAGES = [
  { code: "he", name: "Hebrew", nameHe: "עברית" },
  { code: "en", name: "English", nameHe: "אנגלית" },
  { code: "ru", name: "Russian", nameHe: "רוסית" },
  { code: "ar", name: "Arabic", nameHe: "ערבית" },
  { code: "fr", name: "French", nameHe: "צרפתית" },
  { code: "es", name: "Spanish", nameHe: "ספרדית" },
];

// Distance radius options (in km)
export const DISTANCE_OPTIONS = [1, 3, 5, 10, 25, 50];

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 50,
};
