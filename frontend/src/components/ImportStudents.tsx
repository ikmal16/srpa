import { useState } from "react";
import { apiFetch } from "../services/api";

interface ImportStudentsProps {
  onImported: () => void;
}

export default function ImportStudents({ onImported }: ImportStudentsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleImport() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch("/students/import", {
        method: "POST",
        headers: {},
        body: formData,
      });

      setMessage("Students imported successfully.");
      setFile(null);

      onImported();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to import students.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Import Students
          </label>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setMessage("");
              setError("");
            }}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleImport}
          disabled={!file || loading}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
