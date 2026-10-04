import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
            International Student System
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              to="/students"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Students
            </Link>

            <Link
              to="/reports"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Reports
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>

            <p className="text-xs capitalize text-gray-500">{user?.role}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
