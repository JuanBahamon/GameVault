import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { usuario, datosUsuario, cerrarSesion } = useAuth();
  const { itemsCarro } = useCart();
  const navegar = useNavigate();

  const manejarCierreSesion = async () => {
    await cerrarSesion();
    navegar("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        GAME<span>WORLD</span>
      </Link>

      <div className={styles.enlaces}>
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/mapa">Mapa</Link>
        <Link to="/comunidad">Comunidad</Link>
      </div>

      <div className={styles.acciones}>
        <Link to="/carrito" className={styles.btnCarro}>
          Carrito
          {itemsCarro.length > 0 && (
            <span className={styles.insigniaCarro}>{itemsCarro.length}</span>
          )}
        </Link>

        {usuario ? (
          <>
            <Link to="/dashboard" className={styles.btnFantasma}>
              {datosUsuario?.nombreUsuario || "Mi cuenta"}
            </Link>
            {datosUsuario?.rol === "admin" && (
              <Link to="/admin" className={styles.btnFantasma}>
                Admin
              </Link>
            )}
            <button onClick={manejarCierreSesion} className={styles.btnAccent}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.btnFantasma}>
              Iniciar sesión
            </Link>
            <Link to="/register" className={styles.btnAccent}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;