import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Shared/ProtectedRoute/ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";

const UserRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
    </Route>
  </Routes>
);

export default UserRoutes;