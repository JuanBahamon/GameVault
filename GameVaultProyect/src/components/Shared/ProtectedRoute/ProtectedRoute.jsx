import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProtectedRoute = ({ requiereAdmin = false }) => {
  const { user, userData } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && userData?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;