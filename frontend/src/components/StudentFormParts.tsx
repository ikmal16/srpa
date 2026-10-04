import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import type { Country } from "../services/countryService";

/**
 * Shared presentation for the student Add / Edit forms, so both pages are
 * visibly the same form system. No business logic lives here.
 */

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

export const ArrowLeftIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ChevronDownIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const AlertCircleIcon = ({
  className = "h-4 w-4",
}: {
  className?: string;
}) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </Svg>
);

export const UserIcon = () => (
  <Svg>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
  </Svg>
);

export const AcademicIcon = () => (
  <Svg>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
    <path d="M22 9v6" />
  </Svg>
);

export const GlobeIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
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

/* ---------- Tokens ---------- */

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

const inputClass =
  "block h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 " +
  "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none " +
  "focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

function stateClass(invalid: boolean): string {
  return invalid
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
    : "border-slate-300 hover:border-slate-400 focus:border-blue-900 focus:ring-blue-900/10";
}

/* ---------- Motion ---------- */

/** Short fade + rise on mount. Purely visual; respects reduced motion. */
export function Reveal({
  delay = 0,
  children,
}: {
  delay?: number;
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
      }`}
    >
      {children}
    </div>
  );
}

/* ---------- Validation (UI only) ---------- */

export type FieldName =
  | "name"
  | "matric_no"
  | "program"
  | "country_code"
  | "passport_expiry";

const ERROR_TEXT: Record<FieldName, string> = {
  name: "Masukkan nama penuh.",
  matric_no: "Masukkan nombor matrik.",
  program: "Masukkan program pengajian.",
  country_code: "Pilih negara.",
  passport_expiry: "Pilih tarikh luput pasport.",
};

export interface ControlProps {
  id: string;
  name: string;
  required: boolean;
  onBlur: () => void;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  className: string;
}

/**
 * Tracks which fields were visited or failed native validation so inline
 * messages can appear beside them. It never blocks or alters submission:
 * the browser's own `required` checks still decide whether the form submits.
 */
export function useStudentFormValidation(values: Record<FieldName, string>) {
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  function markTouched(field: FieldName) {
    setTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }

  const isInvalid = (field: FieldName) =>
    Boolean(touched[field]) && !values[field];

  function controlProps(field: FieldName): ControlProps {
    const invalid = isInvalid(field);
    return {
      id: field,
      name: field,
      required: true,
      onBlur: () => markTouched(field),
      "aria-invalid": invalid ? true : undefined,
      "aria-describedby": invalid ? `${field}-error` : undefined,
      className: `${inputClass} ${stateClass(invalid)}`,
    };
  }

  /** Replaces the browser's validation bubble with inline messages. */
  function handleInvalid(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    markTouched(target.name as FieldName);

    const first = event.currentTarget.querySelector<HTMLElement>(
      "input:invalid, select:invalid, textarea:invalid",
    );
    if (first === target) first.focus();
  }

  return { isInvalid, controlProps, handleInvalid };
}

/* ---------- Page pieces ---------- */

export function FormPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export function FormPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Reveal>
      <header className="mb-6">
        <Link
          to="/students"
          className={`-ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium text-blue-900 transition-colors duration-150 hover:bg-blue-50 motion-reduce:transition-none ${focusRing}`}
        >
          <ArrowLeftIcon />
          Kembali ke Senarai Pelajar
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {description} Ruang yang ditandakan dengan{" "}
          <span className="font-semibold text-red-600">*</span> adalah wajib.
        </p>
      </header>
    </Reveal>
  );
}

/** Card + server error banner + form + footer actions. */
export function StudentFormCard({
  error,
  loading,
  onSubmit,
  onInvalid,
  context,
  actions,
  children,
}: {
  error: string;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInvalid: (event: FormEvent<HTMLFormElement>) => void;
  /** Optional strip above the form, e.g. which record is being edited. */
  context?: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal delay={60}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {context}

        {error && (
          <div
            role="alert"
            className="flex gap-2.5 border-b border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-700 sm:px-6"
          >
            <AlertCircleIcon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} onInvalidCapture={onInvalid}>
          <fieldset
            disabled={loading}
            className="m-0 min-w-0 divide-y divide-slate-100 border-0 p-0"
          >
            {children}
          </fieldset>
          {actions}
        </form>
      </div>
    </Reveal>
  );
}

export function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="px-5 py-6 sm:px-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-900">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Field({
  field,
  label,
  hint,
  showError,
  wide = false,
  children,
}: {
  field: FieldName;
  label: string;
  hint?: string;
  showError: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={field}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        <span className="ml-0.5 text-red-600" aria-hidden="true">
          *
        </span>
        <span className="sr-only"> (required)</span>
      </label>

      {children}

      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}

      {/* Inline validation message: collapses smoothly when the field is valid */}
      <div
        id={`${field}-error`}
        aria-hidden={!showError}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
          showError
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="flex items-center gap-1.5 pt-1.5 text-xs font-medium text-red-700">
            <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" />
            {ERROR_TEXT[field]}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CountrySelect({
  countries,
  value,
  onChange,
  loading,
  controlProps,
}: {
  countries: Country[];
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  controlProps: ControlProps;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
        {...controlProps}
        className={`${controlProps.className} appearance-none pr-9`}
      >
        <option value="">
          {loading ? "Loading countries..." : "Pilih negara"}
        </option>

        {countries.map((country) => (
          <option key={country.country_code} value={country.country_code}>
            {country.country_name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

export function FormActions({
  loading,
  disabled = false,
  submitLabel,
  loadingLabel,
}: {
  loading: boolean;
  disabled?: boolean;
  submitLabel: string;
  loadingLabel: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
      <button
        type="button"
        onClick={() => navigate("/students")}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${focusRing}`}
      >
        Batal
      </button>

      <button
        type="submit"
        disabled={loading || disabled}
        aria-busy={loading}
        className={`inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 active:bg-blue-950 disabled:cursor-not-allowed disabled:bg-blue-900/70 motion-reduce:transition-none ${focusRing}`}
      >
        {loading && <Spinner />}
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}

/** Loading placeholder shaped like the form, used while a record loads. */
export function FormSkeleton() {
  const bar =
    "animate-pulse rounded bg-slate-200/70 motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading student...</span>
      <div className={`${bar} h-4 w-36`} />
      <div className={`${bar} mt-4 h-8 w-48`} />
      <div className={`${bar} mt-2 h-4 w-72 max-w-full`} />

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className={`${bar} h-10 w-1/2`} />
        </div>
        {[1, 2, 3].map((section) => (
          <div
            key={section}
            className="border-b border-slate-100 px-5 py-6 sm:px-6"
          >
            <div className={`${bar} mb-5 h-5 w-40`} />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className={`${bar} h-10`} />
              <div className={`${bar} h-10`} />
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-3 bg-slate-50 px-5 py-4 sm:px-6">
          <div className={`${bar} h-10 w-24`} />
          <div className={`${bar} h-10 w-40`} />
        </div>
      </div>
    </div>
  );
}
