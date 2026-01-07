"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Period = "7d" | "30d" | "90d";

const mockAnalytics = {
  overview: {
    searches: 12453,
    searchesTrend: 8.2,
    activeUsers: 3421,
    activeUsersTrend: 12.5,
    newSignups: 234,
    newSignupsTrend: -3.1,
    totalLeads: 1876,
    leadsTrend: 15.3,
  },
  topSearches: [
    { query: "גן ילדים", count: 432, ctr: 45 },
    { query: "חוגי ספורט", count: 321, ctr: 38 },
    { query: "בייביסיטר", count: 287, ctr: 52 },
    { query: "שיעורי מוזיקה", count: 256, ctr: 41 },
    { query: "עזרה בשיעורים", count: 198, ctr: 35 },
  ],
  zeroResults: [
    { query: "טיפול בדיבור", count: 45 },
    { query: "ריפוי בעיסוק", count: 38 },
    { query: "פסיכולוג ילדים", count: 31 },
    { query: "קייטנות קיץ", count: 28 },
  ],
  topProviders: [
    { name: "גן השמש", views: 1234, leads: 89 },
    { name: "חוג כדורגל אלופים", views: 987, leads: 67 },
    { name: "מוזיקה לילדים", views: 876, leads: 54 },
    { name: "מתמטיקה בקלות", views: 765, leads: 43 },
    { name: "אנגלית לילדים", views: 654, leads: 38 },
  ],
  cityDistribution: [
    { city: "תל אביב", providers: 87, users: 1234 },
    { city: "ירושלים", providers: 65, users: 987 },
    { city: "חיפה", providers: 43, users: 654 },
    { city: "באר שבע", providers: 32, users: 432 },
    { city: "רמת גן", providers: 28, users: 321 },
  ],
  leadsByType: [
    { type: "שיחה", count: 756, percentage: 40 },
    { type: "WhatsApp", count: 658, percentage: 35 },
    { type: "ניווט", count: 462, percentage: 25 },
  ],
  dailyStats: [
    { date: "א", users: 450, searches: 1200, leads: 180 },
    { date: "ב", users: 520, searches: 1400, leads: 220 },
    { date: "ג", users: 480, searches: 1300, leads: 195 },
    { date: "ד", users: 610, searches: 1650, leads: 280 },
    { date: "ה", users: 550, searches: 1500, leads: 245 },
    { date: "ו", users: 320, searches: 800, leads: 120 },
    { date: "ש", users: 280, searches: 650, leads: 95 },
  ],
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const maxDailyUsers = Math.max(...mockAnalytics.dailyStats.map((d) => d.users));

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">אנליטיקס</h1>
          <p className="text-gray-600 mt-1">סקירת ביצועי הפלטפורמה</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["7d", "30d", "90d"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  period === p ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {p === "7d" ? "7 ימים" : p === "30d" ? "30 ימים" : "90 ימים"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            ייצוא
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "חיפושים", value: mockAnalytics.overview.searches.toLocaleString(), trend: mockAnalytics.overview.searchesTrend, icon: "🔍" },
          { label: "משתמשים פעילים", value: mockAnalytics.overview.activeUsers.toLocaleString(), trend: mockAnalytics.overview.activeUsersTrend, icon: "👥" },
          { label: "הרשמות חדשות", value: mockAnalytics.overview.newSignups.toLocaleString(), trend: mockAnalytics.overview.newSignupsTrend, icon: "✨" },
          { label: "לידים", value: mockAnalytics.overview.totalLeads.toLocaleString(), trend: mockAnalytics.overview.leadsTrend, icon: "📞" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.trend > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {stat.trend > 0 ? "↑" : "↓"} {Math.abs(stat.trend)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">פעילות יומית</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {mockAnalytics.dailyStats.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1" style={{ height: "160px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t"
                    style={{ height: `${(day.users / maxDailyUsers) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-pink-500 to-rose-500" />
              <span className="text-sm text-gray-600">משתמשים פעילים</span>
            </div>
          </div>
        </div>

        {/* Leads by Type */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">לידים לפי סוג</h2>
          <div className="space-y-4">
            {mockAnalytics.leadsByType.map((lead, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{lead.type}</span>
                  <span className="text-sm text-gray-600">{lead.count} ({lead.percentage}%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      i === 0 ? "bg-pink-500" : i === 1 ? "bg-green-500" : "bg-blue-500"
                    )}
                    style={{ width: `${lead.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-2xl font-bold text-gray-900">
              {mockAnalytics.overview.totalLeads.toLocaleString()}
            </p>
            <p className="text-center text-sm text-gray-600">סה״כ לידים</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top Searches */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">חיפושים פופולריים</h2>
          <div className="space-y-3">
            {mockAnalytics.topSearches.map((search, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-900">{search.query}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{search.count} חיפושים</span>
                  <span className="text-sm text-green-600">{search.ctr}% CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zero Results */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">חיפושים ללא תוצאות</h2>
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">הזדמנויות</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            חיפושים אלה לא מצאו תוצאות - הזדמנות להרחיב את מאגר הספקים
          </p>
          <div className="space-y-3">
            {mockAnalytics.zeroResults.map((search, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="font-medium text-gray-900">{search.query}</span>
                <span className="text-sm text-amber-700">{search.count} חיפושים</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ספקים מובילים</h2>
          <div className="space-y-3">
            {mockAnalytics.topProviders.map((provider, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <span className="font-medium text-gray-900">{provider.name}</span>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-gray-900">{provider.views.toLocaleString()} צפיות</p>
                  <p className="text-xs text-gray-600">{provider.leads} לידים</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">התפלגות גיאוגרפית</h2>
          <div className="space-y-3">
            {mockAnalytics.cityDistribution.map((city, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span className="font-medium text-gray-900">{city.city}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-sm font-medium text-gray-900">{city.providers} ספקים</p>
                    <p className="text-xs text-gray-600">{city.users.toLocaleString()} משתמשים</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
