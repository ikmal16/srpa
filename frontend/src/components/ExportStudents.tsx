import { useState } from "react";

export default function ExportStudents() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);

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
      link.download = "students.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export students.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCsv() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);

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
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Exporting..." : "Export XLSX"}
      </button>

      <button
        type="button"
        onClick={handleExportCsv}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Exporting..." : "Export CSV"}
      </button>
    </div>
  );
}
