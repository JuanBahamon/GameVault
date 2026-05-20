import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Register.module.scss";

const Register = () => {
  const { registrarse } = useAuth();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    nombreUsuario: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      return setError("Las contraseñas no coinciden");
    }
    if (formulario.contrasena.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }
    if (formulario.nombreUsuario.trim().length < 3) {
      return setError("El nombre de usuario debe tener al menos 3 caracteres");
    }

    setCargando(true);
    try {
      await registrarse(formulario.correo, formulario.contrasena, formulario.nombreUsuario);
      navegar("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado");
      } else {
        setError("Error al crear la cuenta, intenta de nuevo");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        <h2>Crea tu cuenta</h2>
        <p>Únete a la comunidad</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className={styles.grupoFormulario}>
            <label>Nombre de usuario</label>
            <input
              type="text"
              name="nombreUsuario"
              value={formulario.nombreUsuario}
              onChange={manejarCambio}
              placeholder="ProGamer123"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className={styles.grupoFormulario}>
            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formulario.confirmarContrasena}
              onChange={manejarCambio}
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.btnEnviar}
            disabled={cargando}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className={styles.pie}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;