"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ImportStep = "upload" | "mapping" | "preview" | "importing" | "complete";

interface ColumnMapping {
  csvColumn: string;
  appField: string;
}

interface ImportHistory {
  id: string;
  fileName: string;
  date: string;
  rowsImported: number;
  rowsFailed: number;
  status: "success" | "partial" | "failed";
}

const appFields = [
  { key: "name", label: "שם העסק", required: true },
  { key: "category", label: "קטגוריה", required: true },
  { key: "description", label: "תיאור", required: false },
  { key: "phone", label: "טלפון", required: true },
  { key: "email", label: "אימייל", required: false },
  { key: "city", label: "עיר", required: true },
  { key: "address", label: "כתובת", required: false },
  { key: "website", label: "אתר אינטרנט", required: false },
];

const mockHistory: ImportHistory[] = [
  { id: "1", fileName: "providers_jan.csv", date: "2024-01-15", rowsImported: 45, rowsFailed: 2, status: "partial" },
  { id: "2", fileName: "new_providers.xlsx", date: "2024-01-10", rowsImported: 23, rowsFailed: 0, status: "success" },
  { id: "3", fileName: "bulk_upload.csv", date: "2024-01-05", rowsImported: 0, rowsFailed: 15, status: "failed" },
];

export default function AdminImportPage() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns] = useState(["Business Name", "Type", "Phone Number", "City", "Email", "Description"]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([
    { csvColumn: "Business Name", appField: "name" },
    { csvColumn: "Type", appField: "category" },
    { csvColumn: "Phone Number", appField: "phone" },
    { csvColumn: "City", appField: "city" },
    { csvColumn: "Email", appField: "email" },
    { csvColumn: "Description", appField: "description" },
  ]);
  const [importProgress, setImportProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStep("mapping");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep("mapping");
    }
  };

  const updateMapping = (csvColumn: string, appField: string) => {
    setMappings(mappings.map((m) => (m.csvColumn === csvColumn ? { ...m, appField } : m)));
  };

  const startImport = () => {
    setStep("importing");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStep("complete");
      }
    }, 500);
  };

  const resetImport = () => {
    setStep("upload");
    setFile(null);
    setImportProgress(0);
  };

  const mockPreviewData = [
    { name: "גן השמש", category: "גני ילדים", phone: "050-1234567", city: "תל אביב", valid: true },
    { name: "חוג כדורגל", category: "ספורט", phone: "052-9876543", city: "ירושלים", valid: true },
    { name: "", category: "מוזיקה", phone: "invalid", city: "חיפה", valid: false, errors: ["שם חסר", "טלפון לא תקין"] },
    { name: "עזרה בשיעורים", category: "לימודים", phone: "054-5555555", city: "באר שבע", valid: true },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ייבוא ספקים</h1>
          <p className="text-gray-600 mt-1">ייבוא ספקים מקובץ CSV או Excel</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          הורד תבנית
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          {[
            { key: "upload", label: "העלאת קובץ" },
            { key: "mapping", label: "מיפוי עמודות" },
            { key: "preview", label: "תצוגה מקדימה" },
            { key: "complete", label: "סיום" },
          ].map((s, i, arr) => (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s.key || (step === "importing" && s.key === "preview")
                      ? "bg-pink-500 text-white"
                      : ["complete"].includes(step) && i < arr.findIndex((x) => x.key === "complete")
                      ? "bg-green-500 text-white"
                      : step === "complete" && s.key === "complete"
                      ? "bg-green-500 text-white"
                      : arr.findIndex((x) => x.key === step) > i
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {arr.findIndex((x) => x.key === step) > i || step === "complete" ? "✓" : i + 1}
                </div>
                <span className="text-xs text-gray-600 mt-1 hidden sm:block">{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-24 h-0.5 mx-2",
                    arr.findIndex((x) => x.key === step) > i ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
              dragActive ? "border-pink-500 bg-pink-50" : "border-gray-300"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">גרור קובץ לכאן</p>
            <p className="text-gray-600 mb-4">או</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg cursor-pointer hover:from-pink-600 hover:to-rose-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              בחר קובץ
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-4">קבצים נתמכים: CSV, XLSX, XLS</p>
          </div>
        </div>
      )}

      {/* Mapping Step */}
      {step === "mapping" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">מיפוי עמודות</h2>
              <p className="text-gray-600 text-sm">קובץ: {file?.name}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {csvColumns.map((col) => {
              const mapping = mappings.find((m) => m.csvColumn === col);
              return (
                <div key={col} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">עמודה בקובץ</p>
                    <p className="font-medium text-gray-900">{col}</p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">שדה באפליקציה</p>
                    <select
                      value={mapping?.appField || ""}
                      onChange={(e) => updateMapping(col, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">-- דלג --</option>
                      {appFields.map((field) => (
                        <option key={field.key} value={field.key}>
                          {field.label} {field.required && "*"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setStep("upload");
                setFile(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              חזרה
            </button>
            <button
              onClick={() => setStep("preview")}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
            >
              המשך לתצוגה מקדימה
            </button>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">תצוגה מקדימה</h2>
              <p className="text-gray-600 text-sm">בדוק את הנתונים לפני הייבוא</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-green-600">✓ 3 תקינים</span>
              <span className="text-sm text-red-600">✗ 1 שגיאות</span>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">סטטוס</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">שם</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">קטגוריה</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">טלפון</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">עיר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPreviewData.map((row, i) => (
                  <tr key={i} className={cn(!row.valid && "bg-red-50")}>
                    <td className="px-4 py-3">
                      {row.valid ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <div className="group relative">
                          <span className="text-red-600 cursor-help">✗</span>
                          <div className="absolute start-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            {row.errors?.join(", ")}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className={cn("px-4 py-3", !row.name && "text-red-600 italic")}>
                      {row.name || "חסר"}
                    </td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className={cn("px-4 py-3", row.phone === "invalid" && "text-red-600")}>
                      {row.phone}
                    </td>
                    <td className="px-4 py-3">{row.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("mapping")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              חזרה
            </button>
            <div className="flex gap-3">
              <button
                onClick={startImport}
                className="px-6 py-2 border border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
              >
                דלג על שגיאות וייבא
              </button>
              <button
                onClick={startImport}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
              >
                ייבא הכל
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Importing Step */}
      {step === "importing" && (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pink-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-pink-500 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">מייבא נתונים...</h2>
          <p className="text-gray-600 mb-6">נא להמתין</p>
          <div className="max-w-md mx-auto">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{importProgress}%</p>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">הייבוא הושלם!</h2>
          <p className="text-gray-600 mb-6">3 ספקים יובאו בהצלחה, 1 דולג</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={resetImport}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ייבוא נוסף
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors">
              צפה בספקים
            </button>
          </div>
        </div>
      )}

      {/* Import History */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">היסטוריית ייבואים</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">קובץ</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">תאריך</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">יובאו</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">נכשלו</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.fileName}</td>
                  <td className="px-4 py-3 text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-green-600">{item.rowsImported}</td>
                  <td className="px-4 py-3 text-red-600">{item.rowsFailed}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        item.status === "success"
                          ? "bg-green-100 text-green-800"
                          : item.status === "partial"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {item.status === "success" ? "הצלחה" : item.status === "partial" ? "חלקי" : "נכשל"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
