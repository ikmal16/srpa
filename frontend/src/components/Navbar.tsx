import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";

/**
 * If the project already has a university logo asset, import it and set it here, e.g.
 *   import logo from "../assets/university-logo.png";
 *   const LOGO_SRC: string | null = logo;
 * When null, a compact "SRPA" monogram is shown instead.
 */
const LOGO_SRC: string | null = null;

/* ---------- Icons (inline outline SVGs, no extra dependency) ---------- */

type IconProps = { className?: string };

function Svg({
  className = "h-4.5 w-4.5",
  children,
}: IconProps & { children: ReactNode }) {
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

const DashboardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Svg>
);

const StudentsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
    <path d="M22 9v6" />
  </Svg>
);

const ReportsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path d="M14 3v5h5" />
    <path d="M9 17v-3M12 17v-5M15 17v-2" />
  </Svg>
);

const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Svg>
);

const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

/* ---------- Navigation config (same routes as before) ---------- */

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { to: "/students", label: "Pelajar", Icon: StudentsIcon },
  { to: "/reports", label: "Laporan", Icon: ReportsIcon },
];

/* ---------- Helpers ---------- */

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function roleBadgeClass(role?: string): string {
  // Lecturer = teal (academic/global accent), everything else (officer/admin) = navy.
  if (role && role.toLowerCase().includes("lecturer")) {
    return "bg-teal-50 text-teal-700 ring-teal-600/20";
  }
  return "bg-blue-50 text-blue-900 ring-blue-900/15";
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

/* ---------- Brand ---------- */

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/dashboard"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-md ${focusRing}`}
      aria-label="Sistem Rekod Pelajar Antarabangsa - Dashboard"
    >
      {LOGO_SRC ? (
        <img src={LOGO_SRC} alt="" className="h-8 w-auto" />
      ) : (
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-[11px] font-bold tracking-tight text-white transition-colors group-hover:bg-blue-800"
          aria-hidden="true"
        >
          SRPA
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-blue-950 sm:text-[15px]">
          Sistem Rekod Pelajar Antarabangsa
        </span>
        <span className="hidden text-[11px] text-slate-500 sm:block">
          International Student Records System
        </span>
      </span>
    </Link>
  );
}

/* ---------- Navbar ---------- */

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const roleLabel = user?.role ? String(user.role) : "";

  return (
    <nav
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_1px_2px_rgba(15,42,82,0.06)] backdrop-blur supports-backdrop-filter:bg-white/85"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: brand + desktop nav */}
        <div className="flex min-w-0 items-center gap-6 lg:gap-8">
          <Brand />

          <div className="hidden h-14 items-stretch gap-1 md:flex">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "relative inline-flex items-center gap-2 px-3 text-sm font-medium transition-colors duration-150",
                    "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:bg-teal-600",
                    "after:transition-transform after:duration-200 motion-reduce:transition-none motion-reduce:after:transition-none",
                    focusRing,
                    isActive
                      ? "text-blue-900 after:scale-x-100"
                      : "text-slate-600 hover:text-blue-900 after:scale-x-0 hover:after:scale-x-50 hover:after:bg-slate-300",
                  ].join(" ")
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right: user + logout (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-blue-900 ring-1 ring-slate-200"
              aria-hidden="true"
            >
              {getInitials(user?.name)}
            </span>
            <div className="hidden min-w-0 flex-col items-start leading-tight lg:flex">
              <span className="max-w-40 truncate text-sm font-medium text-slate-800">
                {user?.name}
              </span>
              {roleLabel && (
                <span
                  className={`mt-0.5 rounded px-1.5 py-px text-[11px] font-medium capitalize ring-1 ring-inset ${roleBadgeClass(
                    roleLabel,
                  )}`}
                >
                  {roleLabel}
                </span>
              )}
            </div>
          </div>

          <span className="h-6 w-px bg-slate-200" aria-hidden="true" />

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 motion-reduce:transition-none ${focusRing}`}
          >
            <LogoutIcon />
            <span className="hidden lg:inline">Log Keluar</span>
            <span className="sr-only lg:hidden">Lo Keluar</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-900 motion-reduce:transition-none md:hidden ${focusRing}`}
        >
          {menuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`grid border-slate-200 bg-slate-50 transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden ${
          menuOpen
            ? "visible grid-rows-[1fr] border-t"
            : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-4 pb-4 pt-3 transition-opacity duration-200 motion-reduce:transition-none sm:px-6 ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Signed-in user */}
            <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-blue-900 ring-1 ring-slate-200"
                aria-hidden="true"
              >
                {getInitials(user?.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.name}
                </p>
                {roleLabel && (
                  <span
                    className={`mt-0.5 inline-block rounded px-1.5 py-px text-[11px] font-medium capitalize ring-1 ring-inset ${roleBadgeClass(
                      roleLabel,
                    )}`}
                  >
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  tabIndex={menuOpen ? 0 : -1}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
                      focusRing,
                      isActive
                        ? "border-teal-600 bg-white text-blue-900 shadow-sm"
                        : "border-transparent text-slate-600 hover:bg-white hover:text-blue-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Logout */}
            <div className="mt-3 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={handleLogout}
                tabIndex={menuOpen ? 0 : -1}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-white hover:text-slate-900 motion-reduce:transition-none ${focusRing}`}
              >
                <LogoutIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
