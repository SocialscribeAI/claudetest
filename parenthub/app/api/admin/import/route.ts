/**
 * ADMIN BULK IMPORT API - app/api/admin/import/route.ts
 *
 * Purpose: Bulk import providers from CSV
 *
 * POST /api/admin/import/validate
 * - Validate CSV data before import
 *
 * Request:
 * - Content-Type: multipart/form-data
 * - file: CSV file
 * - mapping: JSON mapping config
 *
 * Response:
 * {
 *   valid: boolean,
 *   totalRows: number,
 *   validRows: number,
 *   errors: [
 *     { row: number, field: string, error: string }
 *   ],
 *   preview: Provider[] (first 5 valid rows)
 * }
 *
 * ---
 *
 * POST /api/admin/import/execute
 * - Execute the import
 *
 * Request body:
 * {
 *   fileId: string (from validate step),
 *   skipErrors: boolean,
 *   status: "pending" | "active" (status for imported)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   imported: number,
 *   skipped: number,
 *   errors: Error[]
 * }
 *
 * ---
 *
 * GET /api/admin/import/template
 * - Download CSV template
 *
 * Response:
 * - CSV file download
 *
 * ---
 *
 * GET /api/admin/import/history
 * - Get import history
 *
 * Response:
 * {
 *   imports: [
 *     {
 *       id, filename, rowCount, importedCount,
 *       status, createdBy, createdAt
 *     }
 *   ]
 * }
 *
 * Auth: Admin role required
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Implement bulk import
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function GET(request: NextRequest) {
  // TODO: Implement import history/template
  return NextResponse.json({ imports: [] });
}
