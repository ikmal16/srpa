import { useState } from "react";

export default function ExportStudents() {
  const [loading, setLoading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"xlsx" | "csv" | null>(null);

  async function handleExport() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setActiveFormat("xlsx");

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/export",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export students.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "pelajar_antarabangsa.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export students.");
    } finally {
      setLoading(false);
      setActiveFormat(null);
    }
  }

  async function handleExportCsv() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setActiveFormat("csv");

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/export/csv",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/csv",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export students.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export students as CSV.");
    } finally {
      setLoading(false);
      setActiveFormat(null);
    }
  }

  const isXlsxLoading = loading && activeFormat === "xlsx";
  const isCsvLoading = loading && activeFormat === "csv";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {/* XLSX Export — secondary/outline style */}
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isXlsxLoading ? (
          <>
            <LoadingSpinner />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <FileSpreadsheetIcon />
            <span>Export XLSX</span>
          </>
        )}
      </button>

      {/* CSV Export — secondary/outline style */}
      <button
        type="button"
        onClick={handleExportCsv}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCsvLoading ? (
          <>
            <LoadingSpinner />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <FileTextIcon />
            <span>Export CSV</span>
          </>
        )}
      </button>
    </div>
  );
}

/* ---------- Inline Icons (professional outline style) ---------- */

function FileSpreadsheetIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
