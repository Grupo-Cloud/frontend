import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}