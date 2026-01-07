/**
 * ADMIN CATEGORIES - app/(admin)/categories/page.tsx
 *
 * Purpose: Manage category taxonomy
 *
 * Features:
 * - Category list with provider counts
 * - Add/edit categories
 * - Toggle active status
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

// Mock categories data
const mockCategories = [
  { id: "1", slug: "babysitters", name: "Babysitters", nameHe: "בייביסיטר", providerCount: 87, isActive: true },
  { id: "2", slug: "nannies", name: "Nannies", nameHe: "מטפלות", providerCount: 34, isActive: true },
  { id: "3", slug: "tutors", name: "Tutors", nameHe: "מורים פרטיים", providerCount: 56, isActive: true },
  { id: "4", slug: "music-lessons", name: "Music Lessons", nameHe: "שיעורי מוזיקה", providerCount: 23, isActive: true },
  { id: "5", slug: "art-classes", name: "Art Classes", nameHe: "שיעורי אמנות", providerCount: 18, isActive: true },
  { id: "6", slug: "swim-lessons", name: "Swim Lessons", nameHe: "שיעורי שחייה", providerCount: 15, isActive: true },
  { id: "7", slug: "sports", name: "Sports", nameHe: "ספורט", providerCount: 12, isActive: false },
  { id: "8", slug: "therapists", name: "Therapists", nameHe: "מטפלים", providerCount: 8, isActive: true },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameHe: "",
    slug: "",
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", nameHe: "", slug: "" });
    setShowModal(true);
  };

  const openEditModal = (category: typeof mockCategories[0]) => {
    setEditingCategory(category);
    setFormData({ name: category.name, nameHe: category.nameHe, slug: category.slug });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
    } else {
      setCategories([
        ...categories,
        {
          id: String(categories.length + 1),
          ...formData,
          providerCount: 0,
          isActive: true,
        },
      ]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Manage service categories</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Providers</th>
              <th className="px-6 py-3 text-start text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-end text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.nameHe}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    {category.slug}
                  </code>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {category.providerCount}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(category.id)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      category.isActive ? "bg-green-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                        category.isActive ? "translate-x-7" : "translate-x-1"
                      )}
                    />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {category.providerCount === 0 && (
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (English)
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Babysitters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Hebrew)
                </label>
                <Input
                  value={formData.nameHe}
                  onChange={(e) => setFormData({ ...formData, nameHe: e.target.value })}
                  placeholder="e.g., בייביסיטר"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., babysitters"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL-friendly identifier (lowercase, no spaces)
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSave}
              >
                {editingCategory ? "Save Changes" : "Add Category"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
