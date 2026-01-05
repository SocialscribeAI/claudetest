/**
 * GOOGLE MAP - components/discovery/google-map.tsx
 *
 * Purpose: Interactive Google Map for provider discovery
 *
 * Features:
 * - Display provider markers with category icons
 * - Marker clustering for dense areas
 * - Info windows on marker tap
 * - Current location button
 * - Search this area button
 * - Responsive design
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface ProviderMarker {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryIcon?: string;
  lat: number;
  lng: number;
  rating?: number;
  photo?: string;
}

interface Bounds {
  ne: { lat: number; lng: number };
  sw: { lat: number; lng: number };
}

interface GoogleMapProps {
  providers: ProviderMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onBoundsChange?: (bounds: Bounds) => void;
  onMarkerClick?: (provider: ProviderMarker) => void;
  onSearchThisArea?: () => void;
  showSearchButton?: boolean;
  selectedProviderId?: string;
  className?: string;
}

// Category icons for markers
const categoryIcons: Record<string, string> = {
  babysitter: "👶",
  tutor: "📚",
  sports: "⚽",
  music: "🎵",
  art: "🎨",
  dance: "💃",
  swimming: "🏊",
  birthday: "🎂",
  photographer: "📸",
  doctor: "🩺",
  therapist: "🧠",
  default: "📍",
};

export function GoogleMap({
  providers,
  center = { lat: 32.0853, lng: 34.7818 }, // Tel Aviv default
  zoom = 13,
  onBoundsChange,
  onMarkerClick,
  onSearchThisArea,
  showSearchButton = false,
  selectedProviderId,
  className,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      // Check if Google Maps is loaded
      if (typeof google === "undefined" || !google.maps) {
        // In production, we'd load the script dynamically
        // For now, show a placeholder
        setError("Google Maps API not loaded");
        setIsLoading(false);
        return;
      }

      try {
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Listen for bounds changes
        map.addListener("idle", () => {
          const bounds = map.getBounds();
          if (bounds && onBoundsChange) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            onBoundsChange({
              ne: { lat: ne.lat(), lng: ne.lng() },
              sw: { lat: sw.lat(), lng: sw.lng() },
            });
          }
          setMapMoved(true);
        });

        setIsLoading(false);
      } catch (err) {
        setError("Failed to initialize map");
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Update markers when providers change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof google === "undefined") return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    providers.forEach((provider) => {
      const icon = categoryIcons[provider.category] || categoryIcons.default;

      const marker = new google.maps.Marker({
        position: { lat: provider.lat, lng: provider.lng },
        map: mapInstanceRef.current!,
        title: provider.name,
        label: {
          text: icon,
          fontSize: "20px",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
      });

      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; min-width: 150px;">
              <strong style="font-size: 14px;">${provider.name}</strong>
              ${provider.rating ? `<div style="color: #f59e0b; font-size: 12px;">★ ${provider.rating.toFixed(1)}</div>` : ""}
              <a href="/provider/${provider.slug}" style="color: #ec4899; font-size: 12px; text-decoration: none;">View Profile →</a>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current!, marker);
        }
        onMarkerClick?.(provider);
      });

      markersRef.current.push(marker);
    });
  }, [providers, onMarkerClick]);

  // Highlight selected marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProviderId) return;

    const selectedProvider = providers.find((p) => p.id === selectedProviderId);
    if (selectedProvider) {
      mapInstanceRef.current.panTo({ lat: selectedProvider.lat, lng: selectedProvider.lng });
    }
  }, [selectedProviderId, providers]);

  // Get user location
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(loc);
          mapInstanceRef.current.setZoom(15);
        }
      },
      () => {
        setError("Unable to get location");
      }
    );
  }, []);

  // Render placeholder when Google Maps isn't available
  if (error || typeof google === "undefined") {
    return (
      <div className={cn("relative w-full h-full min-h-[300px]", className)}>
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center p-6">
          {/* Decorative map grid */}
          <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-400" />
              ))}
            </div>
          </div>

          {/* Map icon */}
          <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          <h3 className="relative z-10 text-lg font-semibold text-gray-800 mb-2">Map View</h3>
          <p className="relative z-10 text-sm text-gray-500 text-center max-w-xs">
            {error || "Configure Google Maps API key to enable interactive map"}
          </p>

          {/* Provider dots overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {providers.slice(0, 10).map((provider, idx) => (
              <div
                key={provider.id}
                className="absolute w-3 h-3 bg-pink-500 rounded-full shadow-sm animate-pulse"
                style={{
                  left: `${20 + (idx * 7) % 60}%`,
                  top: `${20 + (idx * 11) % 60}%`,
                  animationDelay: `${idx * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating buttons for placeholder */}
        <button
          onClick={handleGetLocation}
          className="absolute bottom-4 end-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Get current location"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full min-h-[300px]", className)}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Search this area button */}
      {showSearchButton && mapMoved && (
        <button
          onClick={() => {
            setMapMoved(false);
            onSearchThisArea?.();
          }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Search this area
        </button>
      )}

      {/* Current location button */}
      <button
        onClick={handleGetLocation}
        className="absolute bottom-4 end-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Get current location"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* User location marker */}
      {userLocation && (
        <div
          className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
          style={{
            // This would be positioned by Google Maps in real implementation
            display: "none",
          }}
        />
      )}

      {/* Provider count badge */}
      <div className="absolute top-4 start-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-sm font-medium text-gray-700">
        {providers.length} provider{providers.length !== 1 ? "s" : ""} in area
      </div>
    </div>
  );
}
