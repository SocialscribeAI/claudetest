/**
 * PROVIDER INSIGHTS PAGE - app/(provider)/insights/page.tsx
 *
 * Purpose: Analytics and performance metrics for providers
 *
 * Features:
 * - Views over time chart
 * - Click breakdown by action type
 * - Performance metrics
 * - Time period selector
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

// Mock insights data
const mockInsights = {
  summary: {
    totalViews: 1247,
    viewsChange: 12,
    totalClicks: 342,
    clicksChange: 8,
    totalLeads: 45,
    leadsChange: -3,
    conversionRate: 3.6,
    conversionChange: 0.5,
  },
  viewsChart: [
    { date: "Mon", views: 45 },
    { date: "Tue", views: 52 },
    { date: "Wed", views: 48 },
    { date: "Thu", views: 61 },
    { date: "Fri", views: 55 },
    { date: "Sat", views: 38 },
    { date: "Sun", views: 43 },
  ],
  clickBreakdown: [
    { type: "Phone Call", count: 124, percentage: 36 },
    { type: "WhatsApp", count: 98, percentage: 29 },
    { type: "Navigate", count: 72, percentage: 21 },
    { type: "Website", count: 48, percentage: 14 },
  ],
  topTimes: [
    { day: "Thursday", time: "10:00 - 12:00", views: 89 },
    { day: "Sunday", time: "18:00 - 20:00", views: 76 },
    { day: "Monday", time: "09:00 - 11:00", views: 68 },
  ],
  topCities: [
    { city: "Tel Aviv", views: 523, percentage: 42 },
    { city: "Ramat Gan", views: 287, percentage: 23 },
    { city: "Givatayim", views: 198, percentage: 16 },
    { city: "Herzliya", views: 142, percentage: 11 },
    { city: "Other", views: 97, percentage: 8 },
  ],
  categoryAverage: {
    views: 890,
    clicks: 245,
    conversionRate: 2.8,
  },
};

type Period = "7d" | "30d" | "90d";

export default function InsightsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const insights = mockInsights;

  const maxViews = Math.max(...insights.viewsChart.map((d) => d.views));

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-500">Track your profile performance</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as Period)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                period === p.value
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Profile Views",
            value: insights.summary.totalViews.toLocaleString(),
            change: insights.summary.viewsChange,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ),
          },
          {
            label: "Total Clicks",
            value: insights.summary.totalClicks.toLocaleString(),
            change: insights.summary.clicksChange,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            ),
          },
          {
            label: "Leads",
            value: insights.summary.totalLeads.toLocaleString(),
            change: insights.summary.leadsChange,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
          {
            label: "Conversion",
            value: `${insights.summary.conversionRate}%`,
            change: insights.summary.conversionChange,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              {stat.icon}
              <span className="text-sm">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.change >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {stat.change >= 0 ? "+" : ""}{stat.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h2>
        <div className="h-48 flex items-end justify-between gap-2">
          {insights.viewsChart.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t-lg transition-all hover:from-pink-600 hover:to-rose-500"
                style={{ height: `${(day.views / maxViews) * 100}%` }}
              />
              <span className="mt-2 text-xs text-gray-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Click Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Click Breakdown</h2>
          <div className="space-y-4">
            {insights.clickBreakdown.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Viewing Times */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Best Performing Times</h2>
          <div className="space-y-3">
            {insights.topTimes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.day}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <div className="text-end">
                  <p className="font-medium text-gray-900">{item.views}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Viewer Locations</h2>
        <div className="space-y-3">
          {insights.topCities.map((city) => (
            <div key={city.city} className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-600">{city.city}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                  style={{ width: `${city.percentage}%` }}
                />
              </div>
              <span className="w-16 text-end text-sm font-medium text-gray-900">
                {city.views}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Comparison */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          How You Compare
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Your performance compared to the average babysitter in your area
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Views",
              yours: insights.summary.totalViews,
              average: insights.categoryAverage.views,
            },
            {
              label: "Clicks",
              yours: insights.summary.totalClicks,
              average: insights.categoryAverage.clicks,
            },
            {
              label: "Conversion",
              yours: insights.summary.conversionRate,
              average: insights.categoryAverage.conversionRate,
              isPercentage: true,
            },
          ].map((metric) => {
            const isAboveAverage = metric.yours > metric.average;
            return (
              <div key={metric.label} className="text-center">
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                <p className={cn(
                  "text-xl font-bold",
                  isAboveAverage ? "text-green-600" : "text-gray-900"
                )}>
                  {metric.isPercentage ? `${metric.yours}%` : metric.yours.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {metric.isPercentage ? `${metric.average}%` : metric.average.toLocaleString()}
                </p>
                {isAboveAverage && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Above average
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
}
