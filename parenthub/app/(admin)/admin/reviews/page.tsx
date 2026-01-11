/**
 * ADMIN REVIEWS - app/(admin)/reviews/page.tsx
 *
 * Purpose: Review moderation queue
 *
 * Features:
 * - Pending reviews queue
 * - Approve/reject actions
 * - Review filtering
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    providerId: "1",
    providerName: "Maya Cohen",
    userName: "Sarah L.",
    rating: 5,
    text: "Maya was wonderful with our kids! She's patient, engaging, and the children absolutely loved her. Highly recommend!",
    status: "PENDING" as "PENDING" | "APPROVED" | "REJECTED",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    providerId: "3",
    providerName: "Sarah's Music Studio",
    userName: "David K.",
    rating: 4,
    text: "Great piano lessons for my daughter. Sarah is very skilled and makes learning fun. Would be 5 stars but scheduling can be tricky.",
    status: "PENDING",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    providerId: "1",
    providerName: "Maya Cohen",
    userName: "Rachel M.",
    rating: 5,
    text: "Best babysitter we've ever had! Always on time, great communication, and the kids can't wait to see her.",
    status: "APPROVED",
    createdAt: "1 day ago",
  },
  {
    id: "4",
    providerId: "6",
    providerName: "Yael Swimming",
    userName: "Unknown User",
    rating: 1,
    text: "SPAM CONTENT - This review contains inappropriate advertising links and promotional content.",
    status: "REJECTED",
    createdAt: "2 days ago",
  },
  {
    id: "5",
    providerId: "2",
    providerName: "David's Tutoring",
    userName: "Amit S.",
    rating: 5,
    text: "David helped my son improve his math grades significantly. Very patient and explains concepts clearly.",
    status: "PENDING",
    createdAt: "6 hours ago",
  },
];

type StatusFilter = "all" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredReviews = reviews.filter((review) => {
    return statusFilter === "all" || review.status === statusFilter;
  });

  const statusCounts = {
    all: reviews.length,
    PENDING: reviews.filter((r) => r.status === "PENDING").length,
    APPROVED: reviews.filter((r) => r.status === "APPROVED").length,
    REJECTED: reviews.filter((r) => r.status === "REJECTED").length,
  };

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r)));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "REJECTED" as const } : r)));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn("w-4 h-4", star <= rating ? "text-amber-400" : "text-gray-200")}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-gray-500">Approve or reject user reviews</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
          { value: "REJECTED", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value as StatusFilter)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              statusFilter === tab.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            {tab.label}
            <span className="ms-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
              {statusCounts[tab.value as StatusFilter]}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Link
                    href={`/providers/${review.providerId}`}
                    className="font-medium text-gray-900 hover:text-pink-600"
                  >
                    {review.providerName}
                  </Link>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      review.status === "APPROVED" && "bg-green-100 text-green-700",
                      review.status === "PENDING" && "bg-amber-100 text-amber-700",
                      review.status === "REJECTED" && "bg-red-100 text-red-700"
                    )}
                  >
                    {review.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>by {review.userName}</span>
                  <span>•</span>
                  <span>{review.createdAt}</span>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            <p className="text-gray-700 mb-4">{review.text}</p>

            {review.status === "PENDING" && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleApprove(review.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => handleReject(review.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
