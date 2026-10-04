import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getStudents } from "../services/studentService";
import type { Student } from "../services/studentService";
import { getUser } from "../services/authService";
import { getDashboardStats } from "../services/reportService";

export default function Dashboard() {
  const user = getUser();
  const isPegawai = user?.role === "pegawai";

  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCountries, setTotalCountries] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expired, setExpired] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [studentsResponse, stats] = await Promise.all([
          getStudents(1),
          getDashboardStats(),
        ]);

        setStudents(studentsResponse.data);
        setTotalStudents(stats.totalStudents);
        setTotalCountries(stats.countries);
        setExpiringSoon(stats.expiringSoon);
        setExpired(stats.expired);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-2 text-gray-600">Welcome back, {user?.name}.</p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalStudents}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Countries</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalCountries}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  Expiring Soon
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {expiringSoon}
                </p>

                <p className="mt-1 text-xs text-gray-500">Within 30 days</p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">Expired</p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {expired}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h2>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/students"
                    className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    View Students
                  </Link>

                  {isPegawai && (
                    <Link
                      to="/students/create"
                      className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Add Student
                    </Link>
                  )}

                  <Link
                    to="/reports"
                    className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Reports
                  </Link>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Students
                </h2>

                <div className="mt-5 space-y-3">
                  {students.slice(0, 5).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {student.matric_no}
                        </p>
                      </div>

                      <span className="text-sm text-gray-600">
                        {student.country_name}
                      </span>
                    </div>
                  ))}

                  {students.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No students available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
