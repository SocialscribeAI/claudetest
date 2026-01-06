/**
 * PROVIDER PROFILE EDITOR - app/(provider)/edit-profile/page.tsx
 *
 * Purpose: Edit provider's business profile
 *
 * Features:
 * - Photo upload/management
 * - Business name and description
 * - Category and services
 * - Price band selector
 * - Languages and service area
 * - Weekly schedule editor
 * - Contact info
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

// Mock provider data
const mockProvider = {
  name: "Maya Cohen",
  description: "Experienced babysitter with 5+ years caring for children of all ages. CPR certified and fluent in Hebrew and English. I provide engaging activities and prioritize safety above all.",
  category: "babysitters",
  services: ["Babysitting", "Overnight care", "School pickup", "Homework help"],
  priceBand: "MIDRANGE" as "BUDGET" | "MIDRANGE" | "PREMIUM",
  languages: ["Hebrew", "English"],
  city: "Tel Aviv",
  neighborhoods: ["Florentin", "Neve Tzedek", "Kerem HaTeimanim"],
  schedule: {
    sunday: { enabled: true, start: "08:00", end: "18:00" },
    monday: { enabled: true, start: "08:00", end: "18:00" },
    tuesday: { enabled: true, start: "08:00", end: "18:00" },
    wednesday: { enabled: true, start: "08:00", end: "18:00" },
    thursday: { enabled: true, start: "08:00", end: "18:00" },
    friday: { enabled: true, start: "08:00", end: "14:00" },
    saturday: { enabled: false, start: "08:00", end: "18:00" },
  },
  phone: "0501234567",
  whatsapp: "0501234567",
  email: "maya@example.com",
  website: "",
  photos: [
    { id: "1", url: "/images/providers/maya.jpg", isPrimary: true },
    { id: "2", url: "/images/providers/maya-2.jpg", isPrimary: false },
  ],
};

const categories = [
  { id: "babysitters", label: "Babysitter" },
  { id: "nannies", label: "Nanny" },
  { id: "tutors", label: "Tutor" },
  { id: "music-lessons", label: "Music Teacher" },
  { id: "art-classes", label: "Art Teacher" },
  { id: "swim-lessons", label: "Swim Instructor" },
  { id: "sports", label: "Sports Coach" },
  { id: "therapists", label: "Therapist" },
];

const allLanguages = ["Hebrew", "English", "Russian", "Arabic", "French", "Spanish"];

const days = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

export default function EditProfilePage() {
  const [provider, setProvider] = useState(mockProvider);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newService, setNewService] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const addService = () => {
    if (newService.trim() && !provider.services.includes(newService.trim())) {
      setProvider({
        ...provider,
        services: [...provider.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setProvider({
      ...provider,
      services: provider.services.filter((s) => s !== service),
    });
  };

  const toggleLanguage = (lang: string) => {
    if (provider.languages.includes(lang)) {
      setProvider({
        ...provider,
        languages: provider.languages.filter((l) => l !== lang),
      });
    } else {
      setProvider({
        ...provider,
        languages: [...provider.languages, lang],
      });
    }
  };

  const toggleDay = (day: string) => {
    setProvider({
      ...provider,
      schedule: {
        ...provider.schedule,
        [day]: {
          ...provider.schedule[day as keyof typeof provider.schedule],
          enabled: !provider.schedule[day as keyof typeof provider.schedule].enabled,
        },
      },
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500">Update your business information</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Photos Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {provider.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square">
              <div className="w-full h-full bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {photo.isPrimary && (
                <span className="absolute top-2 start-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
              <button className="absolute top-2 end-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">Add Photo</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Upload up to 6 photos. First photo will be your primary image.
        </p>
      </section>

      {/* Basic Info Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <Input
              value={provider.name}
              onChange={(e) => setProvider({ ...provider, name: e.target.value })}
              placeholder="Your business name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={provider.description}
              onChange={(e) => setProvider({ ...provider, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Tell parents about yourself and your services..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {provider.description.length}/500 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={provider.category}
              onChange={(e) => setProvider({ ...provider, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.services.map((service) => (
            <span
              key={service}
              className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm"
            >
              {service}
              <button
                onClick={() => removeService(service)}
                className="w-4 h-4 hover:text-pink-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Add a service..."
            onKeyDown={(e) => e.key === "Enter" && addService()}
          />
          <Button variant="outline" onClick={addService}>
            Add
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a price band that represents your general pricing
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "BUDGET", label: "Budget", symbol: "₪" },
            { value: "MIDRANGE", label: "Mid-Range", symbol: "₪₪" },
            { value: "PREMIUM", label: "Premium", symbol: "₪₪₪" },
          ].map((band) => (
            <button
              key={band.value}
              onClick={() => setProvider({ ...provider, priceBand: band.value as typeof provider.priceBand })}
              className={cn(
                "p-4 rounded-xl border-2 transition-colors text-center",
                provider.priceBand === band.value
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="text-2xl font-bold text-pink-600 mb-1">{band.symbol}</div>
              <div className="text-sm text-gray-600">{band.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Languages Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {allLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                provider.languages.includes(lang)
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Service Area Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={provider.city}
              onChange={(e) => setProvider({ ...provider, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="Tel Aviv">Tel Aviv</option>
              <option value="Jerusalem">Jerusalem</option>
              <option value="Haifa">Haifa</option>
              <option value="Ramat Gan">Ramat Gan</option>
              <option value="Herzliya">Herzliya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Neighborhoods
            </label>
            <div className="flex flex-wrap gap-2">
              {provider.neighborhoods.map((hood) => (
                <span
                  key={hood}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm"
                >
                  {hood}
                  <button className="w-4 h-4 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button className="px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-pink-500 hover:text-pink-500">
                + Add area
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability Schedule</h2>
        <div className="space-y-3">
          {days.map((day) => {
            const schedule = provider.schedule[day.key as keyof typeof provider.schedule];
            return (
              <div key={day.key} className="flex items-center gap-4">
                <button
                  onClick={() => toggleDay(day.key)}
                  className={cn(
                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                    schedule.enabled
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "border-gray-300"
                  )}
                >
                  {schedule.enabled && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={cn(
                  "w-24 text-sm font-medium",
                  schedule.enabled ? "text-gray-900" : "text-gray-400"
                )}>
                  {day.label}
                </span>
                {schedule.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule.start}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="time"
                      value={schedule.end}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              value={provider.phone}
              onChange={(e) => setProvider({ ...provider, phone: e.target.value })}
              placeholder="050-123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <Input
              type="tel"
              value={provider.whatsapp}
              onChange={(e) => setProvider({ ...provider, whatsapp: e.target.value })}
              placeholder="050-123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={provider.email}
              onChange={(e) => setProvider({ ...provider, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website <span className="text-gray-400">(optional)</span>
            </label>
            <Input
              type="url"
              value={provider.website}
              onChange={(e) => setProvider({ ...provider, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </section>

      {/* Save Button (bottom) */}
      <div className="flex justify-end gap-3 py-6">
        <Button variant="outline">
          Save as Draft
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Publishing..." : "Publish Changes"}
        </Button>
      </div>
    </div>
  );
}
