import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatoPrecio } from "../../helpers/generalFunctions";
import styles from "./GameCard.module.scss";

const GameCard = ({ juego }) => {
  const { agregarAlCarro, itemsCarro } = useCart();
  const estaEnCarro = itemsCarro.find((item) => item.id === juego.id);

  return (
    <div className={styles.tarjeta}>
      <Link to={`/game/${juego.id}`} className={styles.miniatura}>
        <span className={styles.emoji}>{juego.emoji}</span>
        {juego.badge && (
          <span className={`${styles.etiqueta} ${styles[juego.badge]}`}>
            {juego.badge === "new" ? "Nuevo" : juego.badge === "hot" ? "Hot" : "Oferta"}
          </span>
        )}
      </Link>

      <div className={styles.info}>
        <Link to={`/game/${juego.id}`} className={styles.nombre}>
          {juego.name}
        </Link>
        <div className={styles.genero}>{juego.genre}</div>
        <div className={styles.pie}>
          <span className={styles.precio}>{formatoPrecio(juego.price ?? 0)}</span>
          <button
            className={`${styles.btnAgregar} ${estaEnCarro ? styles.enCarro : ""}`}
            onClick={() => agregarAlCarro(juego)}
            disabled={!!estaEnCarro}
          >
            {estaEnCarro ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;