import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getStudents } from "../services/studentService";
import type { Student } from "../services/studentService";
import { getUser } from "../services/authService";
import { getDashboardStats } from "../services/reportService";

/* ---------- Icons (inline outline SVGs) ---------- */

function Svg({
  className = "h-5 w-5",
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

const UsersIcon = () => (
  <Svg>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20v-1a5.5 5.5 0 015.5-5.5h2A5.5 5.5 0 0115.5 19v1" />
    <path d="M16 4.6a3.5 3.5 0 010 6.8M18.5 14a5 5 0 013 4.5V20" />
  </Svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Svg>
);

const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const AlertTriangleIcon = () => (
  <Svg>
    <path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    <path d="M12 9.5v4M12 17h.01" />
  </Svg>
);

const ListIcon = () => (
  <Svg>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </Svg>
);

const UserPlusIcon = () => (
  <Svg>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20v-1a5.5 5.5 0 015.5-5.5h2a5.5 5.5 0 013 .9" />
    <path d="M18 14v6M15 17h6" />
  </Svg>
);

const ReportIcon = () => (
  <Svg>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path d="M14 3v5h5" />
    <path d="M9 17v-3M12 17v-5M15 17v-2" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

/* ---------- Helpers & small components ---------- */

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

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

type Tone = "blue" | "teal" | "amber" | "red";

const TONES: Record<Tone, { tile: string; value: string; bar: string }> = {
  blue: {
    tile: "bg-blue-50 text-blue-900",
    value: "text-slate-900",
    bar: "bg-blue-900",
  },
  teal: {
    tile: "bg-teal-50 text-teal-700",
    value: "text-slate-900",
    bar: "bg-teal-600",
  },
  amber: {
    tile: "bg-amber-50 text-amber-700",
    value: "text-amber-700",
    bar: "bg-amber-500",
  },
  red: {
    tile: "bg-red-50 text-red-700",
    value: "text-red-700",
    bar: "bg-red-600",
  },
};

function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
  highlight = true,
}: {
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
  tone: Tone;
  /** When false the number stays neutral (e.g. a semantic count of zero). */
  highlight?: boolean;
}) {
  const t = TONES[tone];
  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md motion-reduce:transition-none">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${t.bar} opacity-80`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p
            className={`mt-2 text-3xl font-semibold tabular-nums tracking-tight ${
              highlight ? t.value : "text-slate-900"
            }`}
          >
            {value.toLocaleString()}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${t.tile}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function ActionLink({
  to,
  icon,
  title,
  description,
  primary = false,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors duration-150 motion-reduce:transition-none ${focusRing} ${
        primary
          ? "border-blue-900 bg-blue-900 text-white hover:bg-blue-800"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
          primary ? "bg-white/10 text-white" : "bg-slate-100 text-blue-900"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span
          className={`block truncate text-xs ${primary ? "text-blue-200" : "text-slate-500"}`}
        >
          {description}
        </span>
      </span>
      <span
        className={`shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none ${
          primary ? "text-blue-200" : "text-slate-400"
        }`}
      >
        <ChevronRightIcon />
      </span>
    </Link>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200/70 motion-reduce:animate-none ${className}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard...</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-5 w-36" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-32" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Selamat datang, {user?.name}.
          </p>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Key statistics */}
            <section aria-label="Key statistics">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal delay={0}>
                  <StatCard
                    label="Jumlah Pelajar"
                    value={totalStudents}
                    hint="Rekod pelajar yang didaftar"
                    icon={<UsersIcon />}
                    tone="blue"
                  />
                </Reveal>
                <Reveal delay={60}>
                  <StatCard
                    label="Negara"
                    value={totalCountries}
                    hint="Kebangsaan yang diwakili"
                    icon={<GlobeIcon />}
                    tone="teal"
                  />
                </Reveal>
                <Reveal delay={120}>
                  <StatCard
                    label="Tamat Tempoh Segera"
                    value={expiringSoon}
                    hint="Dalam 30 hari"
                    icon={<ClockIcon />}
                    tone="amber"
                    highlight={expiringSoon > 0}
                  />
                </Reveal>
                <Reveal delay={180}>
                  <StatCard
                    label="Tamat Tempoh"
                    value={expired}
                    hint="Perlu tindakan seterusnya"
                    icon={<AlertTriangleIcon />}
                    tone="red"
                    highlight={expired > 0}
                  />
                </Reveal>
              </div>
            </section>

            {/* Quick actions + recent students */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Quick actions: first on mobile/tablet, right column on desktop */}
              <Reveal delay={240} className="lg:col-start-3 lg:row-start-1">
                <section
                  aria-labelledby="quick-actions-heading"
                  className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h2
                    id="quick-actions-heading"
                    className="text-base font-semibold text-slate-900"
                  >
                    Tindakan Cepat
                  </h2>

                  <div className="mt-4 space-y-2.5">
                    <ActionLink
                      to="/students"
                      primary
                      icon={<ListIcon />}
                      title="View Students"
                      description="Browse and search student records"
                    />

                    {isPegawai && (
                      <ActionLink
                        to="/students/create"
                        icon={<UserPlusIcon />}
                        title="Add Student"
                        description="Register a new international student"
                      />
                    )}

                    <ActionLink
                      to="/reports"
                      icon={<ReportIcon />}
                      title="View Reports"
                      description="Review summaries and reports"
                    />
                  </div>
                </section>
              </Reveal>

              {/* Recent students */}
              <Reveal
                delay={300}
                className="lg:col-span-2 lg:col-start-1 lg:row-start-1"
              >
                <section
                  aria-labelledby="recent-students-heading"
                  className="h-full rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <h2
                      id="recent-students-heading"
                      className="text-base font-semibold text-slate-900"
                    >
                      Pelajar Terkini
                    </h2>
                    <Link
                      to="/students"
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-blue-900 transition-colors duration-150 hover:bg-blue-50 motion-reduce:transition-none ${focusRing}`}
                    >
                      Lihat semua
                      <ChevronRightIcon />
                    </Link>
                  </div>

                  {students.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                      {students.slice(0, 5).map((student) => (
                        <li
                          key={student.id}
                          className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 hover:bg-slate-50 motion-reduce:transition-none"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-blue-900 ring-1 ring-slate-200"
                            aria-hidden="true"
                          >
                            {getInitials(student.name)}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {student.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {student.matric_no}
                            </p>
                          </div>

                          <span className="inline-flex max-w-[45%] shrink-0 items-center gap-1.5 text-sm text-slate-600">
                            <GlobeIcon className="h-4 w-4 shrink-0 text-teal-600" />
                            <span className="truncate">
                              {student.country_name}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center px-5 py-12 text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <UsersIcon />
                      </span>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No students available.
                      </p>
                      {isPegawai && (
                        <Link
                          to="/students/create"
                          className={`mt-3 rounded-md px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-50 ${focusRing}`}
                        >
                          Add Student
                        </Link>
                      )}
                    </div>
                  )}
                </section>
              </Reveal>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
