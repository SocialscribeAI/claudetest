/**
 * USER PROFILE PAGE - app/(user)/profile/page.tsx
 *
 * Purpose: User account settings and profile management
 *
 * Features:
 * - Display and edit user info
 * - Notification settings
 * - Language preference
 * - Logout and account deletion
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock user data
const mockUser = {
  id: "user-1",
  name: "Sarah Cohen",
  phone: "+972501234567",
  email: "sarah@example.com",
  preferredLocation: "Tel Aviv",
  language: "en",
  notifications: {
    sms: true,
    email: false,
    push: true,
  },
  createdAt: "2024-01-01",
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ ...user, ...editForm });
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = async () => {
    // In production, call logout API
    window.location.href = "/login";
  };

  const toggleNotification = (key: keyof typeof user.notifications) => {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="p-2 -m-2 text-white/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">My Profile</h1>
          </div>

          {/* Avatar and name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-white/80">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-4">
        {/* Account Info Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-pink-600 text-sm font-medium hover:text-pink-700"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: user.name, email: user.email });
                  }}
                  className="text-gray-500 text-sm font-medium hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-pink-600 text-sm font-medium hover:text-pink-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-900">{user.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">{user.email || "Not set"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Member since</span>
                <span className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Preferences Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-gray-900">Preferred Location</span>
                <p className="text-sm text-gray-500">Default search area</p>
              </div>
              <button className="text-pink-600 font-medium">
                {user.preferredLocation}
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-gray-900">Language</span>
                <p className="text-sm text-gray-500">App display language</p>
              </div>
              <select
                value={user.language}
                onChange={(e) => setUser({ ...user, language: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="en">English</option>
                <option value="he">עברית</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>

          <div className="space-y-4">
            {[
              { key: "sms" as const, label: "SMS Notifications", description: "Receive updates via SMS" },
              { key: "email" as const, label: "Email Notifications", description: "Receive updates via email" },
              { key: "push" as const, label: "Push Notifications", description: "Receive app notifications" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <span className="text-gray-900">{item.label}</span>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    user.notifications[item.key] ? "bg-pink-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      user.notifications[item.key] ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Provider Section */}
        <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-4 border border-pink-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Become a Provider</h3>
              <p className="text-sm text-gray-600">Share your services with parents</p>
            </div>
            <Link
              href="/signup?type=provider"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Log Out
            </button>
            <button className="w-full py-3 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 transition-colors">
              Delete Account
            </button>
          </div>
        </section>

        {/* Footer Links */}
        <div className="text-center py-6 text-sm text-gray-500">
          <div className="flex justify-center gap-4">
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            <span>•</span>
            <Link href="/support" className="hover:text-gray-700">Support</Link>
          </div>
          <p className="mt-4">ParentHub v1.0.0</p>
        </div>
      </div>
    </main>
  );
}
