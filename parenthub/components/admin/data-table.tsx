/**
 * DATA TABLE - components/admin/data-table.tsx
 *
 * Purpose: Reusable data table for admin views
 *
 * Features:
 * - Sortable columns
 * - Row selection (single/multi)
 * - Pagination
 * - Column visibility toggle
 * - Row actions dropdown
 * - Bulk actions
 * - Search/filter row
 * - Loading state
 * - Empty state
 *
 * Props:
 * - columns: ColumnDef[]
 * - data: T[]
 * - isLoading: boolean
 * - pagination: { page, pageSize, total }
 * - onPageChange: (page: number) => void
 * - onSort: (column: string, direction: "asc" | "desc") => void
 * - onRowClick: (row: T) => void
 * - onSelectionChange: (selected: T[]) => void
 * - rowActions: ActionDef[]
 * - bulkActions: ActionDef[]
 *
 * Column definition:
 * {
 *   key: string,
 *   header: string,
 *   sortable: boolean,
 *   render: (value, row) => ReactNode
 * }
 */

"use client";

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-500">No data</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
