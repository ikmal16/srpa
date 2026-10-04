import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import { getUser } from "../services/authService";
import type { Student } from "../services/studentService";

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

const ArrowLeftIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

const PencilIcon = () => (
  <Svg>
    <path d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3z" />
    <path d="M14.5 7.5l3 3" />
  </Svg>
);

const UserIcon = () => (
  <Svg>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
  </Svg>
);

const GlobeIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Svg>
);

const PassportIcon = () => (
  <Svg>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M9 16.5h6" />
  </Svg>
);

const AcademicIcon = () => (
  <Svg>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
    <path d="M22 9v6" />
  </Svg>
);

const CheckCircleIcon = ({
  className = "h-3.5 w-3.5",
}: {
  className?: string;
}) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </Svg>
);

const ClockIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const AlertTriangleIcon = ({
  className = "h-3.5 w-3.5",
}: {
  className?: string;
}) => (
  <Svg className={className}>
    <path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    <path d="M12 9.5v4M12 17h.01" />
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

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
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

function Section({
  title,
  icon,
  accent = "bg-slate-200",
  className = "",
  children,
}: {
  title: string;
  icon: ReactNode;
  accent?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 hover:border-slate-300 motion-reduce:transition-none ${className}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-0.5 ${accent}`}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
        <span className="text-blue-900">{icon}</span>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 wrap-break-words text-sm text-slate-900">
        {children || "—"}
      </dd>
    </div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/students"
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -ml-1.5 text-sm font-medium text-blue-900 transition-colors duration-150 hover:bg-blue-50 motion-reduce:transition-none ${focusRing}`}
    >
      <ArrowLeftIcon />
      Back to Students
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

function DetailsSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading student...</span>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-4 h-8 w-56" />

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const user = getUser();
  const isPegawai = user?.role === "pegawai";

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
      <PageShell>
        <DetailsSkeleton />
      </PageShell>
    );
  }

  if (error || !student) {
    return (
      <PageShell>
        <BackLink />
        <div
          role="alert"
          className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
        >
          <AlertTriangleIcon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          <span>{error || "Student not found."}</span>
        </div>
      </PageShell>
    );
  }

  const isExpired = student.passport_status === "expired";
  const isExpiring = student.passport_status === "expiring_soon";
  const passportAccent = isExpired
    ? "bg-red-600"
    : isExpiring
      ? "bg-amber-500"
      : "bg-green-600";

  return (
    <PageShell>
      {/* Page header */}
      <Reveal>
        <header className="mb-6">
          <BackLink />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
              Student Details
            </h1>

            {isPegawai && (
              <Link
                to={`/students/${student.id}/edit`}
                className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 active:bg-blue-950 motion-reduce:transition-none ${focusRing}`}
              >
                <PencilIcon />
                Edit Student
              </Link>
            )}
          </div>
        </header>
      </Reveal>

      {/* Profile summary */}
      <Reveal delay={60}>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-xl font-semibold tracking-tight text-white"
                aria-hidden="true"
              >
                {getInitials(student.name)}
              </span>

              <div className="min-w-0">
                <h2 className="wrap-break-words text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  {student.name}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {student.matric_no}
                </p>

                <div className="mt-2.5 flex items-center gap-2.5 text-sm text-slate-700">
                  {student.flag_url && (
                    <img
                      src={student.flag_url}
                      alt={`${student.country_name} flag`}
                      className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-slate-200"
                    />
                  )}
                  <span>{student.country_name}</span>
                  <span className="text-xs font-medium text-slate-400">
                    {student.country_code}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <span className="text-xs font-medium text-slate-500">
                Passport status
              </span>
              <StatusBadge status={student.passport_status} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Information sections */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Reveal delay={120}>
            <Section title="Personal Information" icon={<UserIcon />}>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Field label="Full Name">{student.name}</Field>
              </dl>
            </Section>
          </Reveal>

          <Reveal delay={180}>
            <Section title="Academic Information" icon={<AcademicIcon />}>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Field label="Matric No.">{student.matric_no}</Field>
                <Field label="Program">{student.program}</Field>
              </dl>
            </Section>
          </Reveal>

          <Reveal delay={240}>
            <Section
              title="Country and Nationality"
              icon={<GlobeIcon />}
              accent="bg-teal-600/70"
            >
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Field label="Country">
                  <span className="inline-flex items-center gap-2.5">
                    {student.flag_url && (
                      <img
                        src={student.flag_url}
                        alt=""
                        className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-slate-200"
                      />
                    )}
                    <span>{student.country_name}</span>
                    <span className="text-xs font-medium text-slate-400">
                      {student.country_code}
                    </span>
                  </span>
                </Field>
                <Field label="Official Country Name">
                  {student.official_country_name}
                </Field>
                <Field label="Region">{student.region}</Field>
              </dl>
            </Section>
          </Reveal>
        </div>

        {/* Passport: shown first on small screens when it needs attention */}
        <Reveal
          delay={150}
          className={isExpired || isExpiring ? "max-lg:order-first" : ""}
        >
          <Section
            title="Passport Information"
            icon={<PassportIcon />}
            accent={passportAccent}
            className="lg:sticky lg:top-20"
          >
            <dl className="space-y-5">
              <Field label="Passport Expiry">
                <span className="tabular-nums">
                  {new Date(student.passport_expiry).toLocaleDateString()}
                </span>
              </Field>

              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Passport Status
                </dt>
                <dd className="mt-1.5">
                  <StatusBadge status={student.passport_status} />
                </dd>
              </div>
            </dl>

            {isExpiring && (
              <div
                role="status"
                className="mt-5 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-800"
              >
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Passport expires within 30 days.</span>
              </div>
            )}

            {isExpired && (
              <div
                role="status"
                className="mt-5 flex gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
              >
                <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Passport has expired.</span>
              </div>
            )}
          </Section>
        </Reveal>
      </div>
    </PageShell>
  );
}
