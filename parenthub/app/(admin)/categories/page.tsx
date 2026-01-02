/**
 * ADMIN CATEGORIES - app/(admin)/categories/page.tsx
 *
 * Purpose: Manage category taxonomy
 *
 * Features:
 * - Hierarchical category tree view
 * - Drag and drop reordering
 * - Add new category (with parent selection)
 * - Edit category (name, slug, icon, description)
 * - Toggle category active/inactive
 * - View provider count per category
 * - Merge categories option
 * - Delete category (with reassignment)
 *
 * Auth required: Yes (admin role)
 *
 * Components used:
 * - CategoryTree
 * - CategoryForm (modal)
 * - DragDropContainer
 * - ConfirmDialog
 *
 * API calls:
 * - GET /api/admin/categories
 * - POST /api/admin/categories
 * - PUT /api/admin/categories/[id]
 * - PUT /api/admin/categories/reorder
 * - DELETE /api/admin/categories/[id]
 *
 * Analytics events:
 * - admin_categories_view
 * - admin_category_create
 * - admin_category_edit
 * - admin_category_reorder
 */

export default function AdminCategoriesPage() {
  return (
    <main>
      <h1>Manage Categories</h1>
      {/* TODO: Implement categories management */}
    </main>
  );
}
