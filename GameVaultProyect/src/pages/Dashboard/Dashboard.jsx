import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { ListaEnlazada } from "../../helpers/estructurasDeDatos";
import Navbar from "../../components/Shared/Navbar/Navbar";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const { usuario, datosUsuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Cargar órdenes del usuario
        const consultaOrdenes = query(
          collection(db, "ordenes"),
          where("usuarioId", "==", usuario.uid)
        );
        const snapOrdenes = await getDocs(consultaOrdenes);
        const datosOrdenes = snapOrdenes.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setOrdenes(datosOrdenes);

        // Usar ListaEnlazada para historial de juegos comprados
        const lista = new ListaEnlazada(10);
        datosOrdenes.forEach((orden) => {
          orden.juegos?.forEach((juego) => lista.agregar(juego));
        });
        setHistorial(lista.aArreglo());
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };
    if (usuario) obtenerDatos();
  }, [usuario]);

  const totalHoras = ordenes.length * 12;
  const totalJuegos = historial.length;
  const totalResenas = ordenes.length * 2;

  return (
    <div className={styles.pagina}>
      <Navbar />

      <div className={styles.contenido}>
        <div className={styles.encabezado}>
          <h2>Hola, {datosUsuario?.nombreUsuario || "Gamer"} 👋</h2>
          <p>Tu biblioteca personal de juegos</p>
        </div>

        {/* ESTADÍSTICAS */}
        <div className={styles.estadisticas}>
          <div className={styles.tarjetaStat}>
            <div className={styles.numeroStat} style={{ color: "var(--accent)" }}>
              {totalJuegos}
            </div>
            <div className={styles.etiquetaStat}>Juegos en biblioteca</div>
          </div>
          <div className={styles.tarjetaStat}>
            <div className={styles.numeroStat} style={{ color: "var(--blue)" }}>
              {totalHoras}h
            </div>
            <div className={styles.etiquetaStat}>Horas de juego</div>
          </div>
          <div className={styles.tarjetaStat}>
            <div className={styles.numeroStat} style={{ color: "var(--green)" }}>
              {totalResenas}
            </div>
            <div className={styles.etiquetaStat}>
              Reseñas escritas
            </div>
          </div>
          <div className={styles.tarjetaStat}>
            <div className={styles.numeroStat} style={{ color: "var(--accent2)" }}>
              {ordenes.length}
            </div>
            <div className={styles.etiquetaStat}>Órdenes realizadas</div>
          </div>
        </div>

        {/* BIBLIOTECA */}
        <div className={styles.seccionBiblioteca}>
          <h3>MI <span>BIBLIOTECA</span></h3>

          {cargando ? (
            <div className={styles.cargando}>Cargando biblioteca...</div>
          ) : historial.length === 0 ? (
            <div className={styles.vacio}>
              <p>Aún no tienes juegos comprados.</p>
              <a href="/catalogo" className={styles.btnAccent}>
                Explorar catálogo
              </a>
            </div>
          ) : (
            <div className={styles.cuadriculaBiblioteca}>
              {historial.map((juego, indice) => (
                <div key={indice} className={styles.tarjetaBiblioteca}>
                  <div className={styles.emojiBiblioteca}>{juego.emoji}</div>
                  <div className={styles.nombreBiblioteca}>{juego.nombre}</div>
                  <div className={styles.precioBiblioteca}>
                    ${juego.precio?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ÓRDENES */}
        {ordenes.length > 0 && (
          <div className={styles.seccionOrdenes}>
            <h3>MIS <span>ÓRDENES</span></h3>
            <div className={styles.tablaOrdenes}>
              <div className={styles.encabezadoTabla}>
                <span>ID</span>
                <span>Juegos</span>
                <span>Total</span>
                <span>Estado</span>
              </div>
              {ordenes.map((orden) => (
                <div key={orden.id} className={styles.filaOrden}>
                  <span className={styles.idOrden}>
                    #{orden.id.slice(0, 6).toUpperCase()}
                  </span>
                  <span>{orden.juegos?.length || 0} juego(s)</span>
                  <span className={styles.totalOrden}>
                    ${orden.total?.toFixed(2)}
                  </span>
                  <span className={styles.estadoCompletado}>
                    {orden.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;