/**
 * CLASS NAME UTILITY - lib/utils/cn.ts
 *
 * Purpose: Merge Tailwind classes with conflict resolution
 *
 * Uses:
 * - clsx for conditional classes
 * - tailwind-merge for deduplication
 *
 * Usage:
 * import { cn } from "@/lib/utils/cn";
 *
 * // Merge classes
 * cn("px-4 py-2", "px-6") // => "py-2 px-6"
 *
 * // Conditional classes
 * cn("base", isActive && "active", { "disabled": isDisabled })
 *
 * // In components
 * <button className={cn("btn", className)}>
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
