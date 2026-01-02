/**
 * CATEGORY CONSTANTS - constants/categories.ts
 *
 * Purpose: Default category data and icons
 *
 * Used for:
 * - Seeding database
 * - Fallback if API fails
 * - Category icon mapping
 *
 * Categories for ParentHub:
 * 1. Sleep Consultants - יועצות שינה
 * 2. Lactation Consultants - יועצות הנקה
 * 3. Baby Massage - עיסוי תינוקות
 * 4. Baby Classes - חוגי תינוקות
 * 5. Babysitters - בייביסיטרים
 * 6. Nannies - מטפלות
 * 7. Baby Stores - חנויות לתינוקות
 * 8. Photographers - צלמים
 * 9. Doulas - דולות
 * 10. Pediatricians - רופאי ילדים
 * 11. Child Development - התפתחות הילד
 * 12. Mommy & Me - אמא ותינוק
 * 13. Postpartum Care - טיפול לאחר לידה
 * 14. Baby Equipment Rental - השכרת ציוד
 * 15. Other - אחר
 */

export interface DefaultCategory {
  slug: string;
  name: string;
  nameHe: string;
  icon: string;
  description: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    slug: "sleep-consultants",
    name: "Sleep Consultants",
    nameHe: "יועצות שינה",
    icon: "🌙",
    description: "Help your baby sleep better with professional guidance",
  },
  {
    slug: "lactation-consultants",
    name: "Lactation Consultants",
    nameHe: "יועצות הנקה",
    icon: "🍼",
    description: "Expert breastfeeding support and guidance",
  },
  {
    slug: "baby-massage",
    name: "Baby Massage",
    nameHe: "עיסוי תינוקות",
    icon: "👶",
    description: "Soothing massage therapy for babies",
  },
  {
    slug: "baby-classes",
    name: "Baby Classes",
    nameHe: "חוגי תינוקות",
    icon: "🎨",
    description: "Fun and educational classes for babies and toddlers",
  },
  {
    slug: "babysitters",
    name: "Babysitters",
    nameHe: "בייביסיטרים",
    icon: "👩‍👧",
    description: "Trusted babysitters for occasional care",
  },
  {
    slug: "nannies",
    name: "Nannies",
    nameHe: "מטפלות",
    icon: "🏠",
    description: "Full-time or part-time nanny services",
  },
  {
    slug: "baby-stores",
    name: "Baby Stores",
    nameHe: "חנויות לתינוקות",
    icon: "🛒",
    description: "Shops for baby products and essentials",
  },
  {
    slug: "photographers",
    name: "Baby Photographers",
    nameHe: "צלמי תינוקות",
    icon: "📸",
    description: "Capture precious moments with professional photos",
  },
  {
    slug: "doulas",
    name: "Doulas",
    nameHe: "דולות",
    icon: "🤰",
    description: "Birth and postpartum doula support",
  },
  {
    slug: "pediatricians",
    name: "Pediatricians",
    nameHe: "רופאי ילדים",
    icon: "⚕️",
    description: "Children's healthcare specialists",
  },
  {
    slug: "child-development",
    name: "Child Development",
    nameHe: "התפתחות הילד",
    icon: "🧸",
    description: "Specialists in child development and therapy",
  },
  {
    slug: "mommy-and-me",
    name: "Mommy & Me",
    nameHe: "אמא ותינוק",
    icon: "💕",
    description: "Activities for parents and babies together",
  },
  {
    slug: "postpartum-care",
    name: "Postpartum Care",
    nameHe: "טיפול לאחר לידה",
    icon: "🌸",
    description: "Support services for new mothers",
  },
  {
    slug: "equipment-rental",
    name: "Equipment Rental",
    nameHe: "השכרת ציוד",
    icon: "🚼",
    description: "Rent baby equipment and gear",
  },
  {
    slug: "other",
    name: "Other Services",
    nameHe: "שירותים נוספים",
    icon: "✨",
    description: "Other baby and parenting services",
  },
];

/**
 * Get category icon by slug
 */
export function getCategoryIcon(slug: string): string {
  const category = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
  return category?.icon || "📍";
}
