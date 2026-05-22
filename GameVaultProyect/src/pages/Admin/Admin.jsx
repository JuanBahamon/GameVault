import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/Shared/Navbar/Navbar";
import styles from "./Admin.module.scss";

const estadoInicial = {
  name: "",
  genre: "",
  price: "",
  sales: "",
  rating: "",
  badge: "",
  emoji: "",
  description: "",
  tagsText: "",
  os: "",
  cpu: "",
  gpu: "",
  ram: "",
};

const normalizarNumero = (valor, respaldo = 0) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : respaldo;
};

const Admin = () => {
  const [juegos, setJuegos] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [juegoEditando, setJuegoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const obtenerJuegosDesdeFirebase = async () => {
    const consulta = query(collection(db, "games"), orderBy("createdAt", "desc"));
    const snap = await getDocs(consulta);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  };

  const recargarJuegos = async () => {
    try {
      setJuegos(await obtenerJuegosDesdeFirebase());
    } catch (error) {
      console.error("Error cargando juegos:", error);
      setMensaje("No se pudieron cargar los juegos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let activo = true;

    const cargarJuegos = async () => {
      try {
        const datos = await obtenerJuegosDesdeFirebase();
        if (activo) setJuegos(datos);
      } catch (error) {
        console.error("Error cargando juegos:", error);
        if (activo) setMensaje("No se pudieron cargar los juegos.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarJuegos();

    return () => {
      activo = false;
    };
  }, []);

  const estadisticas = useMemo(() => {
    const ventas = juegos.reduce((total, juego) => total + (juego.sales || 0), 0);
    const inventario = juegos.reduce((total, juego) => total + (juego.price || 0), 0);
    const calificacion =
      juegos.length === 0
        ? 0
        : juegos.reduce((total, juego) => total + (juego.rating || 0), 0) / juegos.length;

    return {
      totalJuegos: juegos.length,
      ventas,
      inventario,
      calificacion,
    };
  }, [juegos]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormulario(estadoInicial);
    setJuegoEditando(null);
    setMensaje("");
  };

  const cargarParaEditar = (juego) => {
    setJuegoEditando(juego.id);
    setFormulario({
      name: juego.name || "",
      genre: juego.genre || "",
      price: juego.price ?? "",
      sales: juego.sales ?? "",
      rating: juego.rating ?? "",
      badge: juego.badge || "",
      emoji: juego.emoji || "",
      description: juego.description || "",
      tagsText: juego.tags?.join(", ") || "",
      os: juego.requirements?.os || "",
      cpu: juego.requirements?.cpu || "",
      gpu: juego.requirements?.gpu || "",
      ram: juego.requirements?.ram || "",
    });
    setMensaje(`Editando ${juego.name}`);
  };

  const construirJuego = () => ({
    name: formulario.name.trim(),
    genre: formulario.genre.trim(),
    price: normalizarNumero(formulario.price),
    sales: normalizarNumero(formulario.sales),
    rating: normalizarNumero(formulario.rating),
    badge: formulario.badge,
    emoji: formulario.emoji.trim() || "🎮",
    description: formulario.description.trim(),
    tags: formulario.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    requirements: {
      os: formulario.os.trim(),
      cpu: formulario.cpu.trim(),
      gpu: formulario.gpu.trim(),
      ram: formulario.ram.trim(),
    },
  });

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!formulario.name.trim() || !formulario.genre.trim()) {
      setMensaje("El nombre y el genero son obligatorios.");
      return;
    }

    setGuardando(true);
    try {
      const datosJuego = construirJuego();

      if (juegoEditando) {
        await updateDoc(doc(db, "games", juegoEditando), datosJuego);
        setMensaje("Juego actualizado correctamente.");
      } else {
        await addDoc(collection(db, "games"), {
          ...datosJuego,
          createdAt: serverTimestamp(),
        });
        setMensaje("Juego creado correctamente.");
      }

      limpiarFormulario();
      setCargando(true);
      await recargarJuegos();
    } catch (error) {
      console.error("Error guardando juego:", error);
      setMensaje("No se pudo guardar el juego.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarJuego = async (juego) => {
    const confirmado = window.confirm(`Eliminar ${juego.name}?`);
    if (!confirmado) return;

    try {
      await deleteDoc(doc(db, "games", juego.id));
      setMensaje("Juego eliminado correctamente.");
      setCargando(true);
      await recargarJuegos();
    } catch (error) {
      console.error("Error eliminando juego:", error);
      setMensaje("No se pudo eliminar el juego.");
    }
  };

  return (
    <div className={styles.pagina}>
      <Navbar />

      <main className={styles.contenido}>
        <section className={styles.encabezado}>
          <div>
            <span className={styles.preTitulo}>Panel privado</span>
            <h1>Administracion de GameVault</h1>
            <p>Gestiona el catalogo de juegos.</p>
          </div>
          <button className={styles.btnSecundario} onClick={limpiarFormulario}>
            Nuevo juego
          </button>
        </section>

        <section className={styles.estadisticas}>
          <article className={styles.tarjetaStat}>
            <span className={styles.etiquetaStat}>Juegos</span>
            <strong>{estadisticas.totalJuegos}</strong>
          </article>
          <article className={styles.tarjetaStat}>
            <span className={styles.etiquetaStat}>Ventas registradas</span>
            <strong>{estadisticas.ventas}</strong>
          </article>
          <article className={styles.tarjetaStat}>
            <span className={styles.etiquetaStat}>Valor del catalogo</span>
            <strong>${estadisticas.inventario.toFixed(2)}</strong>
          </article>
          <article className={styles.tarjetaStat}>
            <span className={styles.etiquetaStat}>Rating promedio</span>
            <strong>{estadisticas.calificacion.toFixed(1)}</strong>
          </article>
        </section>

        <section className={styles.panel}>
          <form className={styles.formulario} onSubmit={manejarEnvio}>
            <div className={styles.tituloPanel}>
              <h2>{juegoEditando ? "Editar juego" : "Agregar juego"}</h2>
              {mensaje && <span>{mensaje}</span>}
            </div>

            <div className={styles.gridFormulario}>
              <label>
                Nombre
                <input
                  name="name"
                  value={formulario.name}
                  onChange={manejarCambio}
                  placeholder="Cyberpunk 2077"
                />
              </label>
              <label>
                Genero
                <input
                  name="genre"
                  value={formulario.genre}
                  onChange={manejarCambio}
                  placeholder="RPG / Accion"
                />
              </label>
              <label>
                Precio
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formulario.price}
                  onChange={manejarCambio}
                  placeholder="39.99"
                />
              </label>
              <label>
                Ventas
                <input
                  name="sales"
                  type="number"
                  min="0"
                  value={formulario.sales}
                  onChange={manejarCambio}
                  placeholder="1200"
                />
              </label>
              <label>
                Rating
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formulario.rating}
                  onChange={manejarCambio}
                  placeholder="4.8"
                />
              </label>
              <label>
                Etiqueta
                <select name="badge" value={formulario.badge} onChange={manejarCambio}>
                  <option value="">Sin etiqueta</option>
                  <option value="new">Nuevo</option>
                  <option value="hot">Hot</option>
                  <option value="sale">Oferta</option>
                </select>
              </label>
              <label>
                Emoji
                <input
                  name="emoji"
                  value={formulario.emoji}
                  onChange={manejarCambio}
                  placeholder="🎮"
                />
              </label>
              <label>
                Tags
                <input
                  name="tagsText"
                  value={formulario.tagsText}
                  onChange={manejarCambio}
                  placeholder="RPG, Mundo abierto, Accion"
                />
              </label>
            </div>

            <label className={styles.campoCompleto}>
              Descripcion
              <textarea
                name="description"
                value={formulario.description}
                onChange={manejarCambio}
                placeholder="Descripcion corta del juego"
              />
            </label>

            <div className={styles.subtitulo}>Requisitos</div>
            <div className={styles.gridFormulario}>
              <label>
                Sistema
                <input name="os" value={formulario.os} onChange={manejarCambio} />
              </label>
              <label>
                CPU
                <input name="cpu" value={formulario.cpu} onChange={manejarCambio} />
              </label>
              <label>
                GPU
                <input name="gpu" value={formulario.gpu} onChange={manejarCambio} />
              </label>
              <label>
                RAM
                <input name="ram" value={formulario.ram} onChange={manejarCambio} />
              </label>
            </div>

            <div className={styles.accionesFormulario}>
              <button type="submit" className={styles.btnPrincipal} disabled={guardando}>
                {guardando ? "Guardando..." : juegoEditando ? "Guardar cambios" : "Crear juego"}
              </button>
              <button type="button" className={styles.btnSecundario} onClick={limpiarFormulario}>
                Cancelar
              </button>
            </div>
          </form>

          <div className={styles.listado}>
            <div className={styles.tituloPanel}>
              <h2>Catalogo</h2>
              <span>{cargando ? "Cargando..." : `${juegos.length} juegos`}</span>
            </div>

            <div className={styles.tabla}>
              <div className={styles.encabezadoTabla}>
                <span>Juego</span>
                <span>Precio</span>
                <span>Ventas</span>
                <span>Rating</span>
                <span>Acciones</span>
              </div>

              {cargando ? (
                <div className={styles.estadoTabla}>Cargando juegos...</div>
              ) : juegos.length === 0 ? (
                <div className={styles.estadoTabla}>Aun no hay juegos en Firebase.</div>
              ) : (
                juegos.map((juego) => (
                  <div className={styles.filaTabla} key={juego.id}>
                    <span className={styles.nombreJuego}>
                      <span>{juego.emoji || "🎮"}</span>
                      <span>
                        <strong>{juego.name}</strong>
                        <small>{juego.genre}</small>
                      </span>
                    </span>
                    <span>${(juego.price || 0).toFixed(2)}</span>
                    <span>{juego.sales || 0}</span>
                    <span>{(juego.rating || 0).toFixed(1)}</span>
                    <span className={styles.accionesTabla}>
                      <button type="button" onClick={() => cargarParaEditar(juego)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => eliminarJuego(juego)}>
                        Eliminar
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
