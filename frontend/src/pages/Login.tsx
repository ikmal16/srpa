import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

/**
 * If the project already has a university logo asset, import it and set it here, e.g.
 *   import logo from "../assets/university-logo.png";
 *   const LOGO_SRC: string | null = logo;
 * When null, a plain "SRPA" monogram is shown instead.
 */
const LOGO_SRC: string | null = null;

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

const MailIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Svg>
);

const LockIcon = () => (
  <Svg>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </Svg>
);

const AlertIcon = () => (
  <Svg className="mt-0.5 h-4.5 w-4.5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
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

/* ---------- Brand pieces ---------- */

function BrandMark({ light = false }: { light?: boolean }) {
  if (LOGO_SRC) {
    return <img src={LOGO_SRC} alt="" className="h-10 w-auto" />;
  }
  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 items-center justify-center rounded-md text-xs font-bold tracking-tight ${
        light
          ? "bg-white/10 text-white ring-1 ring-inset ring-white/25"
          : "bg-blue-900 text-white"
      }`}
    >
      SRPA
    </span>
  );
}

/** Quiet globe-like line work: concentric arcs, low contrast, purely decorative. */
function GlobeLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="200" cy="200" r="190" />
        <circle cx="200" cy="200" r="140" />
        <circle cx="200" cy="200" r="90" />
        <ellipse cx="200" cy="200" rx="70" ry="190" />
        <ellipse cx="200" cy="200" rx="140" ry="190" />
        <path d="M10 200h380M30 120h340M30 280h340" />
      </g>
    </svg>
  );
}

/* ---------- Shared classes ---------- */

const inputBase =
  "block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 " +
  "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none " +
  "focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

/* ---------- Page ---------- */

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Purely visual: triggers the page/card entrance transition.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldState = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
    : "border-slate-300 hover:border-slate-400 focus:border-blue-900 focus:ring-blue-900/10";

  return (
    <div
      className={`flex min-h-screen bg-slate-50 transition-opacity duration-500 motion-reduce:transition-none ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden w-[42%] max-w-xl shrink-0 overflow-hidden bg-blue-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <GlobeLines className="absolute -bottom-24 -right-28 h-120 w-120 text-teal-300/15" />

        <div className="relative flex items-center gap-3">
          <BrandMark light />
          <span className="text-sm font-semibold tracking-wide text-blue-100">
            SRPA
          </span>
        </div>

        <div className="relative max-w-sm">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Sistem Rekod Pelajar Antarabangsa
          </h1>
          <p className="mt-3 text-base leading-relaxed text-blue-200">
            International Student Records Management System
          </p>
          <div
            className="mt-8 h-0.5 w-10 rounded-full bg-teal-400"
            aria-hidden="true"
          />
        </div>

        <p className="relative text-xs text-blue-300/80">
          For authorised university officers and lecturers.
        </p>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <GlobeLines className="absolute -right-32 -top-32 h-120 w-120 text-blue-900/0.05 lg:hidden" />

        <div
          className={`relative w-full max-w-md transition-all duration-500 ease-out motion-reduce:transition-none ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {/* Compact brand header (mobile / tablet) */}
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <BrandMark />
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-blue-950">
              Sistem Rekod Pelajar Antarabangsa
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              International Student Records Management System
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-8px_rgba(15,42,82,0.14)] sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Log masuk
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Gunakan akaun universiti anda untuk log masuk ke sistem ini.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                id="login-error"
                className="mb-5 flex gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate={false}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@university.edu.my"
                    required
                    disabled={loading}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "login-error" : undefined}
                    className={`${inputBase} ${fieldState}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Kata laluan
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "login-error" : undefined}
                    className={`${inputBase} ${fieldState}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:bg-blue-950 disabled:cursor-not-allowed disabled:bg-blue-900/70 motion-reduce:transition-none"
              >
                {loading && <Spinner />}
                {loading ? "Log masuk..." : "Log masuk"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Sistem Rekod Pelajar Antarabangsa
          </p>
        </div>
      </main>
    </div>
  );
}
