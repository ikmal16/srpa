import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../services/authService";

interface RoleRouteProps {
  allowedRoles: Array<"pegawai" | "pensyarah">;
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = getUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
