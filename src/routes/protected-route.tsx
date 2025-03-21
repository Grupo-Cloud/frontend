import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedRoute() {
  const { auth } = useAuth();

  if (!auth?.access_token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}