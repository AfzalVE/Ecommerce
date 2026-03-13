import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }) {

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  /* NOT LOGGED IN */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* ADMIN ROUTE */

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}