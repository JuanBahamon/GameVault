import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Shared/ProtectedRoute/ProtectedRoute";
import Admin from "../pages/Admin/Admin";

const AdminRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute requireAdmin />}>
      <Route path="/" element={<Admin />} />
    </Route>
  </Routes>
);

export default AdminRoutes;