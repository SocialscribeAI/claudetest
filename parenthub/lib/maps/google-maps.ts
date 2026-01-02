/**
 * GOOGLE MAPS UTILITIES - lib/maps/google-maps.ts
 *
 * Purpose: Google Maps API utilities and helpers
 *
 * Functions:
 * - loadGoogleMaps: Load Google Maps API script
 * - calculateDistance: Haversine distance between points
 * - calculateETA: Estimated time based on distance
 * - geocodeAddress: Address to coordinates
 * - reverseGeocode: Coordinates to address
 * - createMarkerIcon: Custom marker icons by category
 * - fitBounds: Calculate bounds for markers
 *
 * Configuration:
 * - API key from environment
 * - Libraries: places, geometry
 * - Language: Hebrew
 * - Region: Israel
 *
 * Usage:
 * import { loadGoogleMaps, calculateDistance } from "@/lib/maps/google-maps";
 * await loadGoogleMaps();
 * const distance = calculateDistance(lat1, lng1, lat2, lng2);
 */

import { Loader } from "@googlemaps/js-api-loader";

let mapsLoaded = false;

/**
 * Load Google Maps API
 */
export async function loadGoogleMaps(): Promise<typeof google> {
  if (mapsLoaded && typeof google !== "undefined") {
    return google;
  }

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
    libraries: ["places", "geometry"],
    language: "he",
    region: "IL",
  });

  const google = await loader.load();
  mapsLoaded = true;
  return google;
}

/**
 * Calculate distance between two points (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate ETA in minutes
 * @param distance Distance in km
 * @param mode Transport mode
 */
export function calculateETA(distance: number, mode: "walk" | "drive" = "drive"): number {
  const speed = mode === "walk" ? 5 : 30; // km/h
  return Math.round((distance / speed) * 60);
}

/**
 * Get user's current location
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Default center (Tel Aviv)
 */
export const DEFAULT_CENTER = {
  lat: 32.0853,
  lng: 34.7818,
};

/**
 * Default zoom level
 */
export const DEFAULT_ZOOM = 13;
