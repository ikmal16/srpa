import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents } from "../services/studentService";
import type { Student } from "../services/studentService";
import Pagination from "../components/Pagination";
import { apiFetch } from "../services/api";
import { getUser } from "../services/authService";
import ImportStudents from "../components/ImportStudents";
import ExportStudents from "../components/ExportStudents";
import Navbar from "../components/Navbar";

export default function Students() {
  const user = getUser();
  const isPegawai = user?.role === "pegawai";

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const response = await getStudents(currentPage, search);

        setStudents(response.data);
        setLastPage(response.last_page);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load students.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [search, currentPage]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/students/${id}`, {
        method: "DELETE",
      });

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.id !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete student.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              International Students
            </h1>

            <p className="mt-1 text-gray-500">
              Manage and view international student records.
            </p>
            <div className="mt-4">
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, matric no., program or country..."
                className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {isPegawai && (
              <div className="mt-4">
                <ImportStudents
                  onImported={() => {
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
            <div className="mt-4">
              <ExportStudents />
            </div>
          </div>

          {loading && (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              Loading students...
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <div className="overflow-hidden rounded-xl bg-white shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Matric No.</th>
                      <th className="px-6 py-4 font-semibold">Program</th>
                      <th className="px-6 py-4 font-semibold">Country</th>
                      <th className="px-6 py-4 font-semibold">
                        Passport Expiry
                      </th>
                      <th className="px-6 py-4 font-semibold">Status</th>

                      {isPegawai && (
                        <th className="px-6 py-4 font-semibold">Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {student.name}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.matric_no}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.program}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {student.flag_url && (
                              <img
                                src={student.flag_url}
                                alt={`${student.country_name} flag`}
                                className="h-5 w-8 rounded object-cover"
                              />
                            )}

                            <span>
                              {student.country_name} ({student.country_code})
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {new Date(
                            student.passport_expiry,
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              student.passport_status === "expired"
                                ? "bg-red-100 text-red-700"
                                : student.passport_status === "expiring_soon"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {student.passport_status === "expiring_soon"
                              ? "Expiring Soon"
                              : student.passport_status
                                  .charAt(0)
                                  .toUpperCase() +
                                student.passport_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/students/${student.id}`}
                              className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              View
                            </Link>

                            {isPegawai && (
                              <>
                                <Link
                                  to={`/students/${student.id}/edit`}
                                  className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                                >
                                  Edit
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(student.id)}
                                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {students.length === 0 && (
                      <tr>
                        <td
                          colSpan={isPegawai ? 7 : 6}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
