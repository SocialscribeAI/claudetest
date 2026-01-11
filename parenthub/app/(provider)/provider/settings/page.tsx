/**
 * PROVIDER SETTINGS PAGE - app/(provider)/settings/page.tsx
 *
 * Purpose: Provider account and business settings
 *
 * Features:
 * - Account info management
 * - Notification preferences
 * - Listing status controls
 * - Danger zone actions
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

// Mock settings data
const mockSettings = {
  account: {
    phone: "0501234567",
    email: "maya@example.com",
  },
  notifications: {
    newLeads: true,
    profileViews: false,
    weeklyReport: true,
    marketingEmails: false,
  },
  listing: {
    status: "ACTIVE" as "ACTIVE" | "PAUSED",
    pausedReason: "",
    pauseExpiry: null as string | null,
  },
};

export default function ProviderSettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pauseDuration, setPauseDuration] = useState("1week");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handlePauseListing = async () => {
    // Simulate pause
    setSettings({
      ...settings,
      listing: { ...settings.listing, status: "PAUSED" },
    });
    setShowPauseModal(false);
  };

  const handleResumeListing = () => {
    setSettings({
      ...settings,
      listing: { ...settings.listing, status: "ACTIVE" },
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm === "DELETE") {
      // In production, call delete API
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <Input
                type="tel"
                value={settings.account.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    account: { ...settings.account, phone: e.target.value },
                  })
                }
                className="flex-1"
              />
              <Button variant="outline">Verify</Button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used for login and lead notifications
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={settings.account.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  account: { ...settings.account, email: e.target.value },
                })
              }
            />
            <p className="mt-1 text-sm text-gray-500">
              Used for receipts and account notifications
            </p>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            {
              key: "newLeads" as const,
              label: "New Lead Alerts",
              description: "Get notified when someone contacts you",
            },
            {
              key: "profileViews" as const,
              label: "Profile View Updates",
              description: "Daily summary of profile views",
            },
            {
              key: "weeklyReport" as const,
              label: "Weekly Performance Report",
              description: "Weekly email with insights and tips",
            },
            {
              key: "marketingEmails" as const,
              label: "Marketing & Tips",
              description: "Occasional tips to improve your profile",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <span className="text-gray-900">{item.label}</span>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  settings.notifications[item.key] ? "bg-pink-500" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    settings.notifications[item.key] ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Listing Status Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Listing Status</h2>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                settings.listing.status === "ACTIVE" ? "bg-green-500" : "bg-amber-500"
              )}
            />
            <div>
              <p className="font-medium text-gray-900">
                {settings.listing.status === "ACTIVE" ? "Your listing is live" : "Your listing is paused"}
              </p>
              <p className="text-sm text-gray-500">
                {settings.listing.status === "ACTIVE"
                  ? "Parents can find and contact you"
                  : "Your profile is hidden from search"}
              </p>
            </div>
          </div>
          {settings.listing.status === "ACTIVE" ? (
            <button
              onClick={() => setShowPauseModal(true)}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={handleResumeListing}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Resume
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Pausing your listing will hide it from search results. Your profile data will be preserved.
        </p>
      </section>

      {/* Support Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Support</h2>
        <div className="space-y-3">
          <Link
            href="/support"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-900">Help Center</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-900">Contact Support</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-red-100">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your provider listing and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          Delete My Listing
        </button>
      </section>

      {/* Save Button */}
      <div className="flex justify-end py-6">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pause Your Listing
            </h3>
            <p className="text-gray-500 mb-4">
              Your profile will be hidden from search results. You can resume at any time.
            </p>
            <div className="space-y-2 mb-6">
              {[
                { value: "1week", label: "1 Week" },
                { value: "2weeks", label: "2 Weeks" },
                { value: "1month", label: "1 Month" },
                { value: "indefinite", label: "Until I resume" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors",
                    pauseDuration === option.value
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="pauseDuration"
                    value={option.value}
                    checked={pauseDuration === option.value}
                    onChange={(e) => setPauseDuration(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      pauseDuration === option.value ? "border-pink-500" : "border-gray-300"
                    )}
                  >
                    {pauseDuration === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPauseModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handlePauseListing}
              >
                Pause Listing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Your Listing?
            </h3>
            <p className="text-gray-500 text-center mb-4">
              This will permanently delete your provider profile, all reviews, and analytics data. This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type DELETE to confirm
              </label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
              >
                Cancel
              </Button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
