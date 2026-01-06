/**
 * ADMIN DASHBOARD - app/(admin)/dashboard/page.tsx
 *
 * Purpose: Main admin overview and quick access
 *
 * Features:
 * - Key metrics cards
 * - Pending approvals
 * - Recent activity feed
 * - Quick actions
 */

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Mock dashboard data
const mockStats = {
  providers: {
    total: 247,
    pending: 5,
    active: 234,
    suspended: 8,
  },
  users: {
    total: 3842,
    newThisWeek: 127,
  },
  searches: {
    today: 1284,
    thisWeek: 8923,
  },
  leads: {
    today: 342,
    thisWeek: 2156,
  },
};

const mockPendingProviders = [
  { id: "1", name: "David's Tutoring", category: "Tutor", city: "Tel Aviv", createdAt: "2 hours ago" },
  { id: "2", name: "Swim Academy", category: "Swim Lessons", city: "Herzliya", createdAt: "4 hours ago" },
  { id: "3", name: "Art Studio Kids", category: "Art Classes", city: "Ramat Gan", createdAt: "6 hours ago" },
  { id: "4", name: "Music Together", category: "Music Lessons", city: "Tel Aviv", createdAt: "8 hours ago" },
  { id: "5", name: "Sports Camp", category: "Sports", city: "Givatayim", createdAt: "12 hours ago" },
];

const mockRecentActivity = [
  { id: "1", type: "provider_approved", text: "Maya Cohen was approved", time: "10 min ago" },
  { id: "2", type: "review_flagged", text: "Review flagged for moderation", time: "25 min ago" },
  { id: "3", type: "provider_signup", text: "New provider: David's Tutoring", time: "2 hours ago" },
  { id: "4", type: "user_signup", text: "15 new users signed up", time: "3 hours ago" },
  { id: "5", type: "provider_suspended", text: "Provider suspended: Fake Services", time: "5 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Providers",
            value: mockStats.providers.total,
            change: `${mockStats.providers.pending} pending`,
            changeColor: "text-amber-600",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
            href: "/providers",
          },
          {
            label: "Total Users",
            value: mockStats.users.total.toLocaleString(),
            change: `+${mockStats.users.newThisWeek} this week`,
            changeColor: "text-green-600",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
            href: "/users",
          },
          {
            label: "Searches Today",
            value: mockStats.searches.today.toLocaleString(),
            change: `${mockStats.searches.thisWeek.toLocaleString()} this week`,
            changeColor: "text-gray-500",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ),
            href: "/analytics",
          },
          {
            label: "Leads Today",
            value: mockStats.leads.today,
            change: `${mockStats.leads.thisWeek.toLocaleString()} this week`,
            changeColor: "text-gray-500",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            ),
            href: "/analytics",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-gray-400">{stat.icon}</div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={cn("text-xs mt-1", stat.changeColor)}>{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* Alerts Banner */}
      {mockStats.providers.pending > 0 && (
        <Link
          href="/providers?status=pending"
          className="block bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-800">
                {mockStats.providers.pending} providers pending approval
              </p>
              <p className="text-sm text-amber-600">Click to review and approve</p>
            </div>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <Link href="/providers?status=pending" className="text-sm text-pink-600 hover:text-pink-700">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {mockPendingProviders.map((provider) => (
              <div key={provider.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">
                      {provider.category} • {provider.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{provider.createdAt}</span>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    activity.type === "provider_approved" && "bg-green-100",
                    activity.type === "review_flagged" && "bg-amber-100",
                    activity.type === "provider_signup" && "bg-blue-100",
                    activity.type === "user_signup" && "bg-purple-100",
                    activity.type === "provider_suspended" && "bg-red-100"
                  )}
                >
                  {activity.type === "provider_approved" && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {activity.type === "review_flagged" && (
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  )}
                  {activity.type === "provider_signup" && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  )}
                  {activity.type === "user_signup" && (
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {activity.type === "provider_suspended" && (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add Provider", href: "/providers/new", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
            { label: "Moderate Reviews", href: "/reviews?status=pending", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            { label: "View Analytics", href: "/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { label: "Import Providers", href: "/import", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
