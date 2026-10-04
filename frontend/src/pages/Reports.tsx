import { useEffect, useState } from "react";
import {
  getReports,
  exportStudentDistributionReport,
} from "../services/reportService";
import type { ReportResponse } from "../services/reportService";
import Navbar from "../components/Navbar";

export default function Reports() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const data = await getReports();
        setReport(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load reports.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  async function handleExportReport() {
    try {
      setExporting(true);
      setError("");

      await exportStudentDistributionReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export report.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 text-center shadow">
          Loading reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl rounded-xl bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Reports
              </h1>

              <p className="mt-1 text-gray-500">
                Overview of international students by country and region.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              disabled={exporting}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting ? "Exporting..." : "Export Distribution Report"}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Students by Country
              </h2>

              <div className="space-y-3">
                {report?.by_country.map((item) => (
                  <div
                    key={item.country_name}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.flag_url && (
                        <img
                          src={item.flag_url}
                          alt={`${item.country_name} flag`}
                          className="h-6 w-9 rounded object-cover"
                        />
                      )}

                      <span className="text-gray-700">
                        {item.country_name} ({item.country_code})
                      </span>
                    </div>

                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Students by Region
              </h2>

              <div className="space-y-3">
                {report?.by_region.map((item) => (
                  <div
                    key={item.region}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <span className="text-gray-700">{item.region}</span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
