import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "./PageLoader";

export default function ProtectedRoute() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return  <PageLoader />
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}