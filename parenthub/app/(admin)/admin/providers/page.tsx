/**
 * ADMIN PROVIDERS LIST - app/(admin)/providers/page.tsx
 *
 * Purpose: Manage all provider listings
 *
 * Features:
 * - Data table with providers
 * - Status filters and search
 * - Bulk and row actions
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock providers data
const mockProviders = [
  { id: "1", name: "Maya Cohen", category: "Babysitter", city: "Tel Aviv", status: "ACTIVE", createdAt: "2024-01-15", views: 1247, leads: 45, email: "maya@example.com", phone: "0501234567" },
  { id: "2", name: "David's Tutoring", category: "Tutor", city: "Tel Aviv", status: "PENDING", createdAt: "2024-01-20", views: 0, leads: 0, email: "david@example.com", phone: "0501234568" },
  { id: "3", name: "Sarah's Music Studio", category: "Music Lessons", city: "Ramat Gan", status: "ACTIVE", createdAt: "2024-01-10", views: 892, leads: 28, email: "sarah@example.com", phone: "0501234569" },
  { id: "4", name: "Swim Academy", category: "Swim Lessons", city: "Herzliya", status: "PENDING", createdAt: "2024-01-21", views: 0, leads: 0, email: "swim@example.com", phone: "0501234570" },
  { id: "5", name: "Art Studio Kids", category: "Art Classes", city: "Ramat Gan", status: "PENDING", createdAt: "2024-01-21", views: 0, leads: 0, email: "art@example.com", phone: "0501234571" },
  { id: "6", name: "Yael Swimming", category: "Swim Lessons", city: "Tel Aviv", status: "ACTIVE", createdAt: "2024-01-05", views: 534, leads: 15, email: "yael@example.com", phone: "0501234572" },
  { id: "7", name: "Sports Camp TLV", category: "Sports", city: "Tel Aviv", status: "SUSPENDED", createdAt: "2023-12-01", views: 234, leads: 8, email: "sports@example.com", phone: "0501234573" },
  { id: "8", name: "Music Together", category: "Music Lessons", city: "Tel Aviv", status: "PENDING", createdAt: "2024-01-22", views: 0, leads: 0, email: "music@example.com", phone: "0501234574" },
];

type StatusFilter = "all" | "PENDING" | "ACTIVE" | "SUSPENDED";

export default function AdminProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter providers
  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProviders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProviders.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const statusCounts = {
    all: mockProviders.length,
    PENDING: mockProviders.filter((p) => p.status === "PENDING").length,
    ACTIVE: mockProviders.filter((p) => p.status === "ACTIVE").length,
    SUSPENDED: mockProviders.filter((p) => p.status === "SUSPENDED").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-gray-500">Manage provider listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Link href="/import">
            <Button variant="primary">
              <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Import
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "PENDING", label: "Pending" },
              { value: "ACTIVE", label: "Active" },
              { value: "SUSPENDED", label: "Suspended" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value as StatusFilter)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  statusFilter === tab.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {tab.label}
                <span className="ms-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                  {statusCounts[tab.value as StatusFilter]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-4 flex items-center justify-between">
          <span className="text-sm text-pink-800">
            {selectedIds.length} provider{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
              Approve
            </button>
            <button className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
              Suspend
            </button>
            <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-start">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProviders.length && filteredProviders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Provider</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">City</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Views</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Leads</th>
                <th className="px-4 py-3 text-end text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(provider.id)}
                      onChange={() => toggleSelect(provider.id)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{provider.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{provider.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        provider.status === "ACTIVE" && "bg-green-100 text-green-700",
                        provider.status === "PENDING" && "bg-amber-100 text-amber-700",
                        provider.status === "SUSPENDED" && "bg-red-100 text-red-700"
                      )}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{provider.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{provider.leads}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/providers/${provider.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {provider.status === "PENDING" && (
                        <button className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      {provider.status === "ACTIVE" && (
                        <button className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredProviders.length} of {mockProviders.length} providers
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
