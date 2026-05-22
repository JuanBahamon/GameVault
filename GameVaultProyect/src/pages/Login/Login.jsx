import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.scss";

const Login = () => {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await iniciarSesion(formulario.correo, formulario.contrasena);
      navegar("/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        <h2>¡Bienvenid@!</h2>
        <p>Únete a la comunidad</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className={styles.grupoFormulario}>
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="gamer@email.com"
              required
            />
          </div>

          <div className={styles.grupoFormulario}>
            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formulario.contrasena}
              onChange={manejarCambio}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.btnEnviar}
            disabled={cargando}
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className={styles.pie}>
          ¿No tienes cuenta?{" "}
          <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
