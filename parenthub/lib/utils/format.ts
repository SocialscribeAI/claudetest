/**
 * FORMATTING UTILITIES - lib/utils/format.ts
 *
 * Purpose: Data formatting functions
 *
 * Functions:
 * - formatPhone: Format phone number for display
 * - formatPrice: Format price with currency
 * - formatDistance: Format distance (m/km)
 * - formatDate: Format date for display
 * - formatRelativeTime: "2 hours ago", "yesterday"
 * - formatRating: Format rating number
 * - slugify: Create URL-safe slug
 * - truncate: Truncate text with ellipsis
 *
 * Localization:
 * - Hebrew number formatting
 * - RTL-aware formatting
 */

/**
 * Format phone number for display
 * Input: "972501234567" or "+972501234567"
 * Output: "050-123-4567"
 */
export function formatPhone(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");

  // Handle Israeli numbers
  if (digits.startsWith("972")) {
    const local = digits.slice(3);
    return `0${local.slice(0, 2)}-${local.slice(2, 5)}-${local.slice(5)}`;
  }

  // Already local format
  if (digits.startsWith("0")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} מ'`;
  }
  return `${km.toFixed(1)} ק"מ`;
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;

  return date.toLocaleDateString("he-IL");
}

/**
 * Create URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
