/**
 * CONTEXTS INDEX - contexts/index.ts
 *
 * Purpose: Central export for React contexts
 *
 * Available contexts:
 * - LocationContext: User's current location
 * - AuthContext: Authentication state (provided by NextAuth)
 * - ThemeContext: Theme preferences (future)
 * - ToastContext: Toast notifications
 *
 * Usage:
 * import { LocationProvider, useLocationContext } from "@/contexts";
 */

export * from "./location-context";
