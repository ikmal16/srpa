import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import type { Student } from "../services/studentService";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudent() {
      if (!id) {
        setError("Student ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(`/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load student.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-4xl p-6">
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading student...
          </div>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-4xl p-6">
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error || "Student not found."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <Link
            to="/students"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Students
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Student Details
          </h1>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="flex items-center gap-5 border-b border-gray-100 p-6">
            {student.flag_url && (
              <img
                src={student.flag_url}
                alt={`${student.country_name} flag`}
                className="h-12 w-20 rounded object-cover"
              />
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h2>

              <p className="mt-1 text-gray-500">{student.matric_no}</p>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>

              <p className="mt-1 text-gray-900">{student.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Matric No.</p>

              <p className="mt-1 text-gray-900">{student.matric_no}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Program</p>

              <p className="mt-1 text-gray-900">{student.program}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Country</p>

              <p className="mt-1 text-gray-900">
                {student.country_name} ({student.country_code})
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Official Country Name
              </p>

              <p className="mt-1 text-gray-900">
                {student.official_country_name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Region</p>

              <p className="mt-1 text-gray-900">{student.region}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Passport Expiry
              </p>

              <p className="mt-1 text-gray-900">
                {new Date(student.passport_expiry).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Passport Status
              </p>

              <div className="mt-1">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    student.passport_status === "expired"
                      ? "bg-red-100 text-red-700"
                      : student.passport_status === "expiring_soon"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {student.passport_status === "expiring_soon"
                    ? "Expiring Soon"
                    : student.passport_status.charAt(0).toUpperCase() +
                      student.passport_status.slice(1)}
                </span>

                {student.passport_status === "expiring_soon" && (
                  <p className="mt-2 text-sm font-medium text-yellow-700">
                    Passport expires within 30 days.
                  </p>
                )}

                {student.passport_status === "expired" && (
                  <p className="mt-2 text-sm font-medium text-red-700">
                    Passport has expired.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
