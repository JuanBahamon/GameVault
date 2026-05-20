import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Shared/ProtectedRoute/ProtectedRoute";
import Home from "../pages/Home/Home";
import Catalogo from "../pages/Catalogo/Catalogo";
import DetallesJuego from "../pages/DetallesJuego/DetallesJuego";
import Carrito from "../pages/Carrito/Carrito";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Mapa from "../pages/Mapa/Mapa";
import Comunidad from "../pages/Comunidad/Comunidad";
import Dashboard from "../pages/Dashboard/Dashboard";
import Admin from "../pages/Admin/Admin";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/game/:id" element={<DetallesJuego />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/comunidad" element={<Comunidad />} />

      {/* Rutas privadas usuario */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Rutas privadas admin */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;