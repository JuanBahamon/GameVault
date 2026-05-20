import { obtenerIniciales } from "../../helpers/generalFunctions";
import styles from "./ReviewCard.module.scss";

const TarjetaResena = ({ resena }) => {
  return (
    <div className={styles.tarjeta}>
      <div className={styles.encabezado}>
        <div className={styles.avatar}>
          {obtenerIniciales(resena.nombreUsuario)}
        </div>
        <div className={styles.meta}>
          <span className={styles.usuario}>{resena.nombreUsuario}</span>
          <span className={styles.estrellas}>
            {"★".repeat(resena.calificacion)}{"☆".repeat(5 - resena.calificacion)}
          </span>
        </div>
        <span className={styles.fecha}>{resena.fecha}</span>
      </div>
      <p className={styles.texto}>{resena.comentario}</p>
    </div>
  );
};

export default TarjetaResena;