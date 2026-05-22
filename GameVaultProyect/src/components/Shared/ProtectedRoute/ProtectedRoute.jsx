import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProtectedRoute = ({ requireAdmin = false, requiereAdmin = false }) => {
  const { usuario, datosUsuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if ((requireAdmin || requiereAdmin) && datosUsuario?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
