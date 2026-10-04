import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getStudents } from "../services/studentService";
import type { Student } from "../services/studentService";
import Pagination from "../components/Pagination";
import { apiFetch } from "../services/api";
import { getUser } from "../services/authService";
import ImportStudents from "../components/ImportStudents";
import ExportStudents from "../components/ExportStudents";
import Navbar from "../components/Navbar";

/* ---------- Icons (inline outline SVGs) ---------- */

function Svg({
  className = "h-4.5 w-4.5",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const SearchIcon = () => (
  <Svg>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);

const XIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

const PlusIcon = () => (
  <Svg>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

const EyeIcon = () => (
  <Svg>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

const PencilIcon = () => (
  <Svg>
    <path d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3z" />
    <path d="M14.5 7.5l3 3" />
  </Svg>
);

const TrashIcon = () => (
  <Svg>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
    <path d="M9 7V4h6v3" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg className="h-3.5 w-3.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </Svg>
);

const ClockIcon = () => (
  <Svg className="h-3.5 w-3.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const AlertTriangleIcon = () => (
  <Svg className="h-3.5 w-3.5">
    <path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    <path d="M12 9.5v4M12 17h.01" />
  </Svg>
);

const UsersIcon = () => (
  <Svg className="h-6 w-6">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20v-1a5.5 5.5 0 015.5-5.5h2A5.5 5.5 0 0115.5 19v1" />
    <path d="M16 4.6a3.5 3.5 0 010 6.8M18.5 14a5 5 0 013 4.5V20" />
  </Svg>
);

/* ---------- Shared pieces ---------- */

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

/** Short fade + rise on mount. Purely visual; respects reduced motion. */
function Reveal({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition duration-500 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Same labelling as before: "expiring_soon" -> "Expiring Soon", otherwise capitalised. */
function statusLabel(status: string): string {
  return status === "expiring_soon"
    ? "Expiring Soon"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "expired"
      ? "bg-red-50 text-red-700 ring-red-600/20"
      : status === "expiring_soon"
        ? "bg-amber-50 text-amber-800 ring-amber-600/25"
        : "bg-green-50 text-green-700 ring-green-600/20";

  const icon =
    status === "expired" ? (
      <AlertTriangleIcon />
    ) : status === "expiring_soon" ? (
      <ClockIcon />
    ) : (
      <CheckCircleIcon />
    );

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}
    >
      {icon}
      {statusLabel(status)}
    </span>
  );
}

function CountryCell({ student }: { student: Student }) {
  return (
    <div className="flex items-center gap-2.5">
      {student.flag_url && (
        <img
          src={student.flag_url}
          alt={`${student.country_name} flag`}
          className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-slate-200"
        />
      )}
      <span className="text-slate-800">{student.country_name}</span>
      <span className="text-xs font-medium text-slate-400">
        {student.country_code}
      </span>
    </div>
  );
}

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 motion-reduce:transition-none " +
  focusRing;

const textBtn =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none " +
  focusRing;

function RowActions({
  student,
  isPegawai,
  onDelete,
  variant,
}: {
  student: Student;
  isPegawai: boolean;
  onDelete: (id: number) => void;
  variant: "icons" | "labels";
}) {
  if (variant === "icons") {
    return (
      <div className="flex items-center justify-end gap-0.5">
        <Link
          to={`/students/${student.id}`}
          title="View"
          aria-label={`View ${student.name}`}
          className={`${iconBtn} hover:bg-slate-100 hover:text-blue-900`}
        >
          <EyeIcon />
        </Link>

        {isPegawai && (
          <>
            <Link
              to={`/students/${student.id}/edit`}
              title="Edit"
              aria-label={`Edit ${student.name}`}
              className={`${iconBtn} hover:bg-slate-100 hover:text-blue-900`}
            >
              <PencilIcon />
            </Link>

            <button
              type="button"
              onClick={() => onDelete(student.id)}
              title="Delete"
              aria-label={`Delete ${student.name}`}
              className={`${iconBtn} hover:bg-red-50 hover:text-red-700`}
            >
              <TrashIcon />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        to={`/students/${student.id}`}
        className={`${textBtn} border-slate-200 text-slate-700 hover:bg-slate-50`}
      >
        <EyeIcon />
        View
      </Link>

      {isPegawai && (
        <>
          <Link
            to={`/students/${student.id}/edit`}
            className={`${textBtn} border-slate-200 text-blue-900 hover:bg-blue-50`}
          >
            <PencilIcon />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(student.id)}
            className={`${textBtn} border-slate-200 text-red-700 hover:bg-red-50`}
          >
            <TrashIcon />
            Delete
          </button>
        </>
      )}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200/70 motion-reduce:animate-none ${className}`}
    />
  );
}

function TableSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <span className="sr-only">Loading students...</span>
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/5" />
            </div>
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

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

  const thBase = "px-4 py-3 text-xs font-semibold text-slate-600";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <Reveal>
          <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
                Pelajar Antarabangsa
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Menunjukkan senarai pelajar antarabangsa yang didaftarkan dalam
                sistem.
              </p>
            </div>

            {isPegawai && (
              <Link
                to="/students/create"
                className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 active:bg-blue-950 motion-reduce:transition-none ${focusRing}`}
              >
                <PlusIcon />
                Add Student
              </Link>
            )}
          </header>
        </Reveal>

        {/* Toolbar: search + import/export
            z-20 keeps the Import popover above the table card below. */}
        <Reveal delay={60}>
          <div className="relative z-20 mb-4 space-y-3">
            {/* Row 1: Search — full width, breathing room */}
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari pelajar mengikut nama, nombor matrik, program atau negara"
                aria-label="Search students"
                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-900/10 motion-reduce:transition-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                  title="Clear search"
                  className={`absolute inset-y-0 right-1.5 my-auto flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 motion-reduce:transition-none ${focusRing}`}
                >
                  <XIcon />
                </button>
              )}
            </div>

            {/* Row 2: Data actions — import + export grouped on the right */}
            {isPegawai && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ImportStudents
                  onImported={() => {
                    setCurrentPage(1);
                  }}
                />
                <ExportStudents />
              </div>
            )}

            {!isPegawai && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ExportStudents />
              </div>
            )}
          </div>
        </Reveal>

        {loading && <TableSkeleton />}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <Reveal delay={120}>
            {/* z-0 keeps this card below the toolbar's popover layer. */}
            <div className="relative z-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {students.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <UsersIcon />
                  </span>
                  <p className="mt-4 text-base font-semibold text-slate-800">
                    Tiada rekod pelajar untuk dipaparkan.
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    {search
                      ? "Tiada rekod yang sepadan dengan carian anda. Semak ejaan atau cuba nama, nombor matrik, program atau negara yang berbeza."
                      : "Tiada rekod pelajar untuk dipaparkan."}
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setCurrentPage(1);
                        }}
                        className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 motion-reduce:transition-none ${focusRing}`}
                      >
                        Clear search
                      </button>
                    )}
                    {isPegawai && !search && (
                      <Link
                        to="/students/create"
                        className={`inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 motion-reduce:transition-none ${focusRing}`}
                      >
                        <PlusIcon />
                        Tambah Pelajar
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop / tablet table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-160 text-left text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                          <th scope="col" className={thBase}>
                            Pelajar
                          </th>
                          <th
                            scope="col"
                            className={`${thBase} hidden lg:table-cell`}
                          >
                            Program
                          </th>
                          <th scope="col" className={thBase}>
                            Negara
                          </th>
                          <th
                            scope="col"
                            className={`${thBase} whitespace-nowrap`}
                          >
                            Tamat Tempoh Pasport
                          </th>
                          <th scope="col" className={thBase}>
                            Status
                          </th>
                          <th scope="col" className={`${thBase} text-right`}>
                            Tindakan
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                          <tr
                            key={student.id}
                            className="transition-colors duration-150 hover:bg-slate-50 motion-reduce:transition-none"
                          >
                            <td className="px-4 py-3.5">
                              <p className="font-medium text-slate-900">
                                {student.name}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {student.matric_no}
                              </p>
                              {/* Program folds under the name below lg */}
                              <p className="mt-0.5 text-xs text-slate-500 lg:hidden">
                                {student.program}
                              </p>
                            </td>

                            <td className="hidden px-4 py-3.5 text-slate-600 lg:table-cell">
                              {student.program}
                            </td>

                            <td className="px-4 py-3.5">
                              <CountryCell student={student} />
                            </td>

                            <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-600">
                              {new Date(
                                student.passport_expiry,
                              ).toLocaleDateString()}
                            </td>

                            <td className="px-4 py-3.5">
                              <StatusBadge status={student.passport_status} />
                            </td>

                            <td className="px-4 py-3.5">
                              <RowActions
                                student={student}
                                isPegawai={isPegawai}
                                onDelete={handleDelete}
                                variant="icons"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <ul className="divide-y divide-slate-100 md:hidden">
                    {students.map((student) => (
                      <li key={student.id} className="space-y-3 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {student.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {student.matric_no}
                            </p>
                          </div>
                          <StatusBadge status={student.passport_status} />
                        </div>

                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                          <dt className="text-slate-500">Program</dt>
                          <dd className="text-slate-800">{student.program}</dd>

                          <dt className="text-slate-500">Country</dt>
                          <dd>
                            <CountryCell student={student} />
                          </dd>

                          <dt className="text-slate-500">Passport expiry</dt>
                          <dd className="tabular-nums text-slate-800">
                            {new Date(
                              student.passport_expiry,
                            ).toLocaleDateString()}
                          </dd>
                        </dl>

                        <RowActions
                          student={student}
                          isPegawai={isPegawai}
                          onDelete={handleDelete}
                          variant="labels"
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Pagination, integrated as the table footer */}
              <div className="border-t border-slate-200 bg-slate-50/60">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}
