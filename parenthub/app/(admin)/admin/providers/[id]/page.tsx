/**
 * ADMIN PROVIDER DETAIL - app/(admin)/providers/[id]/page.tsx
 *
 * Purpose: View and manage individual provider
 *
 * Features:
 * - Provider profile view
 * - Status management
 * - Admin notes
 * - Activity history
 */

"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// Mock provider data
const mockProvider = {
  id: "1",
  name: "Maya Cohen",
  category: "Babysitter",
  categoryHe: "בייביסיטר",
  city: "Tel Aviv",
  status: "PENDING" as "PENDING" | "ACTIVE" | "SUSPENDED",
  email: "maya@example.com",
  phone: "0501234567",
  description: "Experienced babysitter with 5+ years caring for children of all ages. CPR certified and fluent in Hebrew and English.",
  services: ["Babysitting", "Overnight care", "School pickup"],
  priceBand: "MIDRANGE",
  languages: ["Hebrew", "English"],
  neighborhoods: ["Florentin", "Neve Tzedek"],
  createdAt: "2024-01-15",
  views: 0,
  leads: 0,
  adminNotes: [],
};

const mockActivity = [
  { id: "1", action: "Profile submitted", time: "2 hours ago", user: "Maya Cohen" },
  { id: "2", action: "Email verified", time: "2 hours ago", user: "System" },
  { id: "3", action: "Phone verified", time: "1 hour ago", user: "System" },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminProviderDetailPage({ params }: Props) {
  const { id } = use(params);
  const [provider, setProvider] = useState(mockProvider);
  const [newNote, setNewNote] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<"approve" | "suspend" | "delete" | null>(null);

  const handleStatusChange = (action: "approve" | "suspend" | "delete") => {
    setStatusAction(action);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    if (statusAction === "approve") {
      setProvider({ ...provider, status: "ACTIVE" });
    } else if (statusAction === "suspend") {
      setProvider({ ...provider, status: "SUSPENDED" });
    }
    setShowStatusModal(false);
    setStatusAction(null);
  };

  const addNote = () => {
    if (newNote.trim()) {
      // In production, save to API
      setNewNote("");
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/providers"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  provider.status === "ACTIVE" && "bg-green-100 text-green-700",
                  provider.status === "PENDING" && "bg-amber-100 text-amber-700",
                  provider.status === "SUSPENDED" && "bg-red-100 text-red-700"
                )}
              >
                {provider.status}
              </span>
            </div>
            <p className="text-gray-500">{provider.category} • {provider.city}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {provider.status === "PENDING" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("approve")}
            >
              <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </Button>
          )}
          {provider.status === "ACTIVE" && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("suspend")}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              Suspend
            </Button>
          )}
          {provider.status === "SUSPENDED" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("approve")}
            >
              Reactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-900">{provider.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{provider.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900">{provider.phone}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Services</label>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service) => (
                    <span key={service} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Price Band</label>
                  <p className="text-gray-900">{provider.priceBand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Languages</label>
                  <p className="text-gray-900">{provider.languages.join(", ")}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Service Areas</label>
                <p className="text-gray-900">{provider.neighborhoods.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
            <div className="space-y-4">
              {mockActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.time} • {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Profile Views</span>
                <span className="font-semibold text-gray-900">{provider.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Leads</span>
                <span className="font-semibold text-gray-900">{provider.leads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{new Date(provider.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
            {provider.adminNotes.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No notes yet</p>
            ) : (
              <div className="space-y-2 mb-4">
                {/* Notes would be rendered here */}
              </div>
            )}
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button variant="outline" size="sm" onClick={addNote} className="w-full">
                Add Note
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href={`/provider/${id}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Public Profile
              </Link>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </button>
              <button
                onClick={() => handleStatusChange("delete")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusAction === "approve" && "Approve Provider"}
              {statusAction === "suspend" && "Suspend Provider"}
              {statusAction === "delete" && "Delete Provider"}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusAction === "approve" && "This will make the provider visible to parents in search results."}
              {statusAction === "suspend" && "This will hide the provider from search results. You can reactivate later."}
              {statusAction === "delete" && "This will permanently delete the provider and all associated data. This cannot be undone."}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant={statusAction === "delete" ? "outline" : "primary"}
                className={cn(
                  "flex-1",
                  statusAction === "delete" && "bg-red-600 text-white hover:bg-red-700 border-red-600"
                )}
                onClick={confirmStatusChange}
              >
                {statusAction === "approve" && "Approve"}
                {statusAction === "suspend" && "Suspend"}
                {statusAction === "delete" && "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
