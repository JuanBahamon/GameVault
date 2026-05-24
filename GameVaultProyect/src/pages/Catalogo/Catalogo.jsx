import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar/Navbar";
import { formatoPrecio } from "../../helpers/generalFunctions";
import useJuegos from "../../hooks/useGames";
import styles from "./Catalogo.module.scss";

const opcionesOrden = [
  { valor: "reciente", etiqueta: "Más reciente" },
  { valor: "precio-asc", etiqueta: "Precio menor" },
  { valor: "precio-desc", etiqueta: "Precio mayor" },
  { valor: "rating", etiqueta: "Mejor calificados" },
  { valor: "ventas", etiqueta: "Más vendidos" },
];

const obtenerPrecio = (juego) => Number(juego.price ?? juego.precio ?? 0);

const obtenerCategoriasJuego = (juego) => {
  const generos = (juego.genre || "")
    .split("/")
    .map((genero) => genero.trim())
    .filter(Boolean);

  return [...new Set([...generos, ...(juego.tags || [])])];
};

const Catalogo = () => {
  const { juegos, cargando } = useJuegos();
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [orden, setOrden] = useState("reciente");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [rangoAplicado, setRangoAplicado] = useState({ min: "", max: "" });

  const categorias = useMemo(() => {
    const valores = juegos.flatMap((juego) => obtenerCategoriasJuego(juego));
    return ["Todos", ...new Set(valores)];
  }, [juegos]);

  const juegosFiltrados = useMemo(() => {
    const min = rangoAplicado.min === "" ? 0 : Number(rangoAplicado.min);
    const max = rangoAplicado.max === "" ? Infinity : Number(rangoAplicado.max);

    const resultado = juegos.filter((juego) => {
      const precio = obtenerPrecio(juego);
      const coincideCategoria =
        categoriaActiva === "Todos" ||
        obtenerCategoriasJuego(juego).some((categoria) =>
          categoria.toLowerCase().includes(categoriaActiva.toLowerCase())
        );

      return coincideCategoria && precio >= min && precio <= max;
    });

    return [...resultado].sort((a, b) => {
      if (orden === "precio-asc") return obtenerPrecio(a) - obtenerPrecio(b);
      if (orden === "precio-desc") return obtenerPrecio(b) - obtenerPrecio(a);
      if (orden === "rating") return (b.rating || 0) - (a.rating || 0);
      if (orden === "ventas") return (b.sales || 0) - (a.sales || 0);
      return 0;
    });
  }, [categoriaActiva, juegos, orden, rangoAplicado]);

  const aplicarFiltros = () => {
    setRangoAplicado({ min: precioMin, max: precioMax });
  };

  const limpiarFiltros = () => {
    setCategoriaActiva("Todos");
    setOrden("reciente");
    setPrecioMin("");
    setPrecioMax("");
    setRangoAplicado({ min: "", max: "" });
  };

  return (
    <div className={styles.pagina}>
      <Navbar />

      <main className={styles.contenido}>
        <section className={styles.encabezado}>
          <div>
            <span>Explora GameVault</span>
            <h1>Catálogo</h1>
          </div>
          <p>{cargando ? "Cargando juegos..." : `${juegosFiltrados.length} juegos disponibles`}</p>
        </section>

        <section className={styles.filtros}>
          <div className={styles.grupoCategorias}>
            <span className={styles.etiquetaFiltro}>Categoria</span>
            <div className={styles.pills}>
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  className={`${styles.pill} ${
                    categoriaActiva === categoria ? styles.pillActiva : ""
                  }`}
                  onClick={() => setCategoriaActiva(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.control}>
            <span className={styles.etiquetaFiltro}>Ordenamiento</span>
            <select value={orden} onChange={(evento) => setOrden(evento.target.value)}>
              {opcionesOrden.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.rangoPrecios}>
            <span className={styles.etiquetaFiltro}>Rango de precios</span>
            <div className={styles.inputsPrecio}>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Mínimo"
                value={precioMin}
                onChange={(evento) => setPrecioMin(evento.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Máximo"
                value={precioMax}
                onChange={(evento) => setPrecioMax(evento.target.value)}
              />
            </div>
          </div>

          <div className={styles.acciones}>
            <button type="button" className={styles.btnAplicar} onClick={aplicarFiltros}>
              Aplicar
            </button>
            <button type="button" className={styles.btnLimpiar} onClick={limpiarFiltros}>
              Limpiar
            </button>
          </div>
        </section>

        {cargando ? (
          <div className={styles.estado}>Cargando catálogo...</div>
        ) : juegosFiltrados.length === 0 ? (
          <div className={styles.estado}>No hay juegos que coincidan con los filtros.</div>
        ) : (
          <section className={styles.gridJuegos}>
            {juegosFiltrados.map((juego) => (
              <Link to={`/game/${juego.id}`} className={styles.tarjetaJuego} key={juego.id}>
                <div className={styles.iconoJuego}>
                  <span>{juego.emoji || "🎮"}</span>
                </div>
                <div className={styles.infoJuego}>
                  <h2>{juego.name}</h2>
                  <p>{juego.genre || "Sin categoria"}</p>
                  <strong>{formatoPrecio(obtenerPrecio(juego))}</strong>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Catalogo;
