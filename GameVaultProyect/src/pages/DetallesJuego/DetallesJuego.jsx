import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import Navbar from "../../components/Shared/Navbar/Navbar";
import TarjetaResena from "../../components/ReviewCard/ReviewCard";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase/firebase";
import { formatoPrecio } from "../../helpers/generalFunctions";
import styles from "./DetallesJuego.module.scss";

const etiquetasBadge = {
  new: "Nuevo",
  hot: "Popular",
  sale: "Oferta",
};

const obtenerEstado = (badge) => etiquetasBadge[badge] || "Disponible";

const crearResenasBase = (juego) => [
  {
    nombreUsuario: "LauraGamer",
    calificacion: Math.round(juego.rating || 5),
    comentario: "Muy buen ritmo de juego, se siente completo y entretenido desde el inicio.",
    fecha: "Hoy",
  },
  {
    nombreUsuario: "PixelMaster",
    calificacion: 4,
    comentario: "La jugabilidad destaca bastante. Ideal para quienes disfrutan este genero.",
    fecha: "Ayer",
  },
  {
    nombreUsuario: "NicoPlay",
    calificacion: 5,
    comentario: "Excelente compra, el precio esta bien para la cantidad de contenido.",
    fecha: "Esta semana",
  },
];

const DetallesJuego = () => {
  const { id } = useParams();
  const { agregarAlCarro, itemsCarro } = useCart();
  const [juego, setJuego] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const estaEnCarro = itemsCarro.some((item) => item.id === id);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const snapJuego = await getDoc(doc(db, "games", id));

        if (!snapJuego.exists()) {
          setError("No encontramos este juego.");
          return;
        }

        const datosJuego = { id: snapJuego.id, ...snapJuego.data() };
        setJuego(datosJuego);

        const consultaResenas = query(collection(db, "reviews"), where("gameId", "==", id));
        const snapResenas = await getDocs(consultaResenas);
        const datosResenas = snapResenas.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setResenas(datosResenas.length > 0 ? datosResenas : crearResenasBase(datosJuego));
      } catch (err) {
        console.error("Error cargando detalle:", err);
        setError("No se pudo cargar el detalle del juego.");
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className={styles.pagina}>
        <Navbar />
        <div className={styles.estadoPagina}>Cargando detalle del juego...</div>
      </div>
    );
  }

  if (error || !juego) {
    return (
      <div className={styles.pagina}>
        <Navbar />
        <div className={styles.estadoPagina}>
          <h1>{error || "Juego no disponible"}</h1>
          <Link to="/catalogo" className={styles.btnVolver}>
            Volver al catalogo
          </Link>
        </div>
      </div>
    );
  }

  const etiquetas = juego.tags?.length ? juego.tags : [juego.genre, obtenerEstado(juego.badge)];
  const requisitos = juego.requirements || {};

  return (
    <div className={styles.pagina}>
      <Navbar />

      <main className={styles.contenido}>
        <section className={styles.detalle}>
          <article className={styles.columnaInfo}>
            <div className={styles.iconoGrande}>{juego.emoji || "🎮"}</div>

            <h1>{juego.name}</h1>
            <div className={styles.calificacion}>
              <span>{"★".repeat(Math.round(juego.rating || 0))}</span>
              <span>{"☆".repeat(5 - Math.round(juego.rating || 0))}</span>
              <strong>{Number(juego.rating || 0).toFixed(1)}</strong>
            </div>

            <div className={styles.metaJuego}>
              <span>{juego.genre || "Sin genero"}</span>
              <span>{obtenerEstado(juego.badge)}</span>
            </div>

            <p className={styles.descripcion}>{juego.description}</p>

            <div className={styles.etiquetas}>
              {etiquetas.filter(Boolean).map((etiqueta) => (
                <span key={etiqueta}>{etiqueta}</span>
              ))}
            </div>
          </article>

          <aside className={styles.columnaCompra}>
            <strong className={styles.precio}>{formatoPrecio(juego.price ?? 0)}</strong>
            <button
              type="button"
              className={styles.btnCarrito}
              disabled={estaEnCarro}
              onClick={() => agregarAlCarro(juego)}
            >
              {estaEnCarro ? "Ya esta en el carrito" : "Agregar al carrito"}
            </button>

            <hr />

            <h2>Requisitos del sistema</h2>
            <div className={styles.requisitos}>
              <div>
                <span>Sistema operativo</span>
                <strong>{requisitos.os || "No especificado"}</strong>
              </div>
              <div>
                <span>Procesador</span>
                <strong>{requisitos.cpu || "No especificado"}</strong>
              </div>
              <div>
                <span>Grafica</span>
                <strong>{requisitos.gpu || "No especificado"}</strong>
              </div>
              <div>
                <span>Memoria RAM</span>
                <strong>{requisitos.ram || "No especificado"}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.resenas}>
          <div className={styles.tituloSeccion}>
            <h2>Resenas del juego</h2>
            <span>{resenas.length} comentarios</span>
          </div>

          <div className={styles.listaResenas}>
            {resenas.map((resena, indice) => (
              <TarjetaResena key={resena.id || indice} resena={resena} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetallesJuego;
