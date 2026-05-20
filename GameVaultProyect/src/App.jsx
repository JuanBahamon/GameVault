import AppRoutes from "./routes/AppRoutes";
import { ProveedorAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";

function App() {
  return (
    <ProveedorAuth>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </ProveedorAuth>
  );
}

export default App;