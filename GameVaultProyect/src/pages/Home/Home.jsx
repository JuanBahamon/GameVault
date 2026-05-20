import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { MontiuloMaximo } from "../../helpers/estructurasDeDatos";
import { Link } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar/Navbar";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./Home.module.scss";

const Home = () => {
  const [juegosDestacados, setJuegosDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const q = query(collection(db, "games"), orderBy("createdAt", "desc"), limit(10));
        const instantanea = await getDocs(q);
        const juegos = instantanea.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // MontiuloMaximo para ordenar por ventas
        const monticulo = new MontiuloMaximo();
        juegos.forEach((juego) => monticulo.insertar({ ...juego, ventas: juego.sales || 0 }));
        const ordenados = monticulo.obtenerTopN(juegos.length);
        setJuegosDestacados(ordenados.length > 0 ? ordenados : juegos);
      } catch (err) {
        console.error("Error cargando juegos:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerJuegos();
  }, []);

  return (
    <div className={styles.pagina}>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroIzquierda}>
          <h1>
            ¡Tu universo gamer <span>comienza</span> aquí!
          </h1>
          <p>
            Más de 2,400 títulos digitales. Comunidad activa, torneos
            y reseñas reales de jugadores.
          </p>
          <div className={styles.accionesHero}>
            <Link to="/catalogo" className={styles.btnContorno}>Explorar catálogo</Link>
            <Link to="/comunidad" className={styles.btnContorno}>Unirse a la comunidad</Link>
          </div>
        </div>

        <div className={styles.heroDerecha}>
          <div className={styles.estadistica}>
            <span className={styles.numeroEstadistica}>2,400+</span>
            <span className={styles.etiquetaEstadistica}>Juegos disponibles</span>
          </div>
          <div className={styles.estadistica}>
            <span className={styles.numeroEstadistica}>89K</span>
            <span className={styles.etiquetaEstadistica}>Jugadores activos</span>
          </div>
          <div className={styles.estadistica}>
            <span className={styles.numeroEstadistica}>4.8★</span>
            <span className={styles.etiquetaEstadistica}>Valoración media</span>
          </div>
        </div>
      </section>

      {/* JUEGOS */}
      <section className={styles.seccion}>
        {cargando ? (
          <div className={styles.cargando}>Cargando juegos...</div>
        ) : juegosDestacados.length === 0 ? (
          <div className={styles.vacio}>No hay juegos disponibles aún.</div>
        ) : (
          <div className={styles.cuadriculaJuegos}>
            {juegosDestacados.map((juego) => (
              <GameCard key={juego.id} juego={juego} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;