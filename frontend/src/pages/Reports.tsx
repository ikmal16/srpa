import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getReports,
  exportStudentDistributionReport,
} from "../services/reportService";
import type { ReportResponse } from "../services/reportService";
import Navbar from "../components/Navbar";

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

const UsersIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
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

const MapIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
);

const BarsIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg className="h-4.5 w-4.5">
    <path d="M12 4v11M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </Svg>
);

const AlertCircleIcon = () => (
  <Svg className="mt-0.5 h-4.5 w-4.5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </Svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path d="M14 3v5h5" />
    <path d="M9 17v-3M12 17v-5M15 17v-2" />
  </Svg>
);

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 animate-spin motion-reduce:animate-none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
    >
      <AlertCircleIcon />
      <span>{message}</span>
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

function ReportsSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading reports...</span>
      <Skeleton className="h-8 w-52" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

type Tone = "blue" | "teal";

const TONES: Record<Tone, { tile: string; bar: string; fill: string }> = {
  blue: {
    tile: "bg-blue-50 text-blue-900",
    bar: "bg-blue-900",
    fill: "bg-blue-900",
  },
  teal: {
    tile: "bg-teal-50 text-teal-700",
    bar: "bg-teal-600",
    fill: "bg-teal-600",
  },
};

function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone: Tone;
}) {
  const t = TONES[tone];
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md motion-reduce:transition-none">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${t.bar} opacity-80`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${t.tile}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 truncate text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function ReportCard({
  title,
  subtitle,
  icon,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-blue-900">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FileIcon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-medium text-slate-700">{text}</p>
    </div>
  );
}

/** One ranked row: label on the left, count and share on the right, proportional bar beneath. */
function DistributionRow({
  leading,
  label,
  code,
  total,
  max,
  sum,
  tone,
}: {
  leading?: ReactNode;
  label: string;
  code?: string;
  total: number;
  max: number;
  sum: number;
  tone: Tone;
}) {
  const width = max > 0 ? Math.max((total / max) * 100, total > 0 ? 2 : 0) : 0;
  const share = sum > 0 ? ((total / sum) * 100).toFixed(1) : "0.0";

  return (
    <li className="px-5 py-3 transition-colors duration-150 hover:bg-slate-50 motion-reduce:transition-none">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {leading}
          <span className="truncate text-sm font-medium text-slate-800">
            {label}
          </span>
          {code && (
            <span className="shrink-0 text-xs font-medium text-slate-400">
              {code}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-baseline gap-2 text-right">
          <span className="text-base font-semibold tabular-nums text-slate-900">
            {total}
          </span>
          <span className="w-12 text-xs tabular-nums text-slate-500">
            {share}%
          </span>
        </div>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full ${TONES[tone].fill}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </li>
  );
}

/* ---------- Page ---------- */

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
      <PageShell>
        <ReportsSkeleton />
      </PageShell>
    );
  }

  // Nothing loaded: show the error on its own. If the report is already on
  // screen (e.g. an export failed), the error appears as a banner instead.
  if (error && !report) {
    return (
      <PageShell>
        <ErrorBanner message={error} />
      </PageShell>
    );
  }

  /* Figures below are derived from the report data already returned by the API. */
  const byCountry = report?.by_country ?? [];
  const byRegion = report?.by_region ?? [];

  const countrySum = byCountry.reduce(
    (sum, item) => sum + Number(item.total),
    0,
  );

  const regionSum = byRegion.reduce((sum, item) => sum + Number(item.total), 0);

  const countryMax = byCountry.reduce(
    (max, item) => Math.max(max, Number(item.total)),
    0,
  );

  const regionMax = byRegion.reduce(
    (max, item) => Math.max(max, Number(item.total)),
    0,
  );
  const topCountry = byCountry.reduce<(typeof byCountry)[number] | null>(
    (top, item) => (top === null || item.total > top.total ? item : top),
    null,
  );

  const hasData = byCountry.length > 0 || byRegion.length > 0;

  return (
    <PageShell>
      {/* Page header */}
      <Reveal>
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
              Laporan Pelajar
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Laporan ringkasan dan taburan pelajar antarabangsa.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            disabled={exporting}
            aria-busy={exporting}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 active:bg-blue-950 disabled:cursor-not-allowed disabled:bg-blue-900/70 motion-reduce:transition-none ${focusRing}`}
          >
            {exporting ? <Spinner /> : <DownloadIcon />}
            {exporting ? "Exporting..." : "Export Distribution Report"}
          </button>
        </header>
      </Reveal>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {!hasData ? (
        <Reveal delay={60}>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <BarsIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-base font-semibold text-slate-800">
                No report data available.
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Distribution figures will appear here once student records have
                been added.
              </p>
            </div>
          </div>
        </Reveal>
      ) : (
        <>
          {/* Summary figures */}
          <section
            aria-label="Summary"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Reveal delay={60}>
              <StatCard
                label="Jumlah Pelajar"
                value={countrySum.toLocaleString()}
                hint="Diwakili oleh semua negara dan wilayah"
                icon={<UsersIcon />}
                tone="blue"
              />
            </Reveal>
            <Reveal delay={120}>
              <StatCard
                label="Negara"
                value={byCountry.length.toLocaleString()}
                hint="Kebangsaan yang diwakili"
                icon={<GlobeIcon className="h-5 w-5" />}
                tone="teal"
              />
            </Reveal>
            <Reveal delay={180}>
              <StatCard
                label="Rantau"
                value={byRegion.length.toLocaleString()}
                hint="Regions represented"
                icon={<MapIcon className="h-5 w-5" />}
                tone="teal"
              />
            </Reveal>
            <Reveal delay={240}>
              <StatCard
                label="Negara Terbesar"
                value={topCountry ? topCountry.total.toLocaleString() : "0"}
                hint={
                  topCountry
                    ? (topCountry.country_name ?? "Unknown country")
                    : "No data"
                }
                icon={<BarsIcon className="h-5 w-5" />}
                tone="blue"
              />
            </Reveal>
          </section>

          {/* Distribution */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Reveal delay={300} className="lg:col-span-2">
              <ReportCard
                title="Pelajar mengikut Negara"
                subtitle="Bilangan pelajar dan saraan daripada jumlah keseluruhan."
                icon={<GlobeIcon className="h-4.5 w-4.5" />}
                className="h-full"
              >
                {byCountry.length > 0 ? (
                  <ul
                    tabIndex={0}
                    aria-label="Students by country"
                    className={`divide-y divide-slate-100 py-1 lg:max-h-152 lg:overflow-y-auto ${focusRing}`}
                  >
                    {byCountry.map((item) => (
                      <DistributionRow
                        key={item.country_name}
                        leading={
                          item.flag_url ? (
                            <img
                              src={item.flag_url}
                              alt={`${item.country_name} flag`}
                              className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-slate-200"
                            />
                          ) : undefined
                        }
                        label={item.country_name ?? "Unknown country"}
                        code={item.country_code}
                        total={item.total}
                        max={countryMax}
                        sum={countrySum}
                        tone="blue"
                      />
                    ))}
                  </ul>
                ) : (
                  <EmptyNote text="No country data available." />
                )}
              </ReportCard>
            </Reveal>

            <Reveal delay={360}>
              <ReportCard
                title="Pelajar mengikut Rantau"
                subtitle="Bilangan pelajar dan saraan daripada jumlah keseluruhan."
                icon={<MapIcon className="h-4.5 w-4.5" />}
                className="h-full"
              >
                {byRegion.length > 0 ? (
                  <ul
                    tabIndex={0}
                    aria-label="Students by region"
                    className={`divide-y divide-slate-100 py-1 lg:max-h-152 lg:overflow-y-auto ${focusRing}`}
                  >
                    {byRegion.map((item) => (
                      <DistributionRow
                        key={item.region}
                        label={item.region ?? "Unknown region"}
                        total={item.total}
                        max={regionMax}
                        sum={regionSum}
                        tone="teal"
                      />
                    ))}
                  </ul>
                ) : (
                  <EmptyNote text="No region data available." />
                )}
              </ReportCard>
            </Reveal>
          </div>
        </>
      )}
    </PageShell>
  );
}
