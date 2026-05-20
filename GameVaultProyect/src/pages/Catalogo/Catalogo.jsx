import { useState } from "react";
import Navbar from "../../components/Shared/Navbar/Navbar";
import GameCard from "../../components/GameCard/GameCard";
import useJuegos from "../../hooks/useGames";
import styles from "./Catalogo.module.scss";

const GENEROS = ["Todos", "RPG", "Accion", "Shooter", "Racing", "Aventura", "Estrategia", "Indie", "SandBox"];
const OPCIONES_ORDEN = [
  { etiqueta: "Más recientes", valor: "recientes" },
  { etiqueta: "Precio: menor a mayor", valor: "asc" },
  { etiqueta: "Precio: mayor a menor", valor: "desc" },
];

const Catalogo = () => {
  const { filtrados, cargando, filtrarPorGenero, filtrarPorPrecio, ordenarPorPrecio, reiniciarFiltros } = useJuegos();
  const [generoActivo, setGeneroActivo] = useState("Todos");
  const [ordenActivo, setOrdenActivo] = useState("recientes");
  const [rangoPrecio, setRangoPrecio] = useState({ min: "", max: "" });

  const manejarGenero = (genero) => {
    setGeneroActivo(genero);
    filtrarPorGenero(genero);
  };

  const manejarOrden = (valor) => {
    setOrdenActivo(valor);
    if (valor === "asc") ordenarPorPrecio("asc");
    else if (valor === "desc") ordenarPorPrecio("desc");
    else reiniciarFiltros();
  };

  const manejarFiltroPrecio = () => {
    const min = parseFloat(rangoPrecio.min) || 0;
    const max = parseFloat(rangoPrecio.max) || 99999;
    filtrarPorPrecio(min, max);
  };

  const manejarReinicio = () => {
    setGeneroActivo("Todos");
    setOrdenActivo("recientes");
    setRangoPrecio({ min: "", max: "" });
    reiniciarFiltros();
  };

  return (
    <div className={styles.pagina}>
      <Navbar />

      <div className={styles.encabezado}>
        <h1>Catálogo</h1>
        <span className={styles.contador}>{filtrados.length} juegos</span>
      </div>

      {/* FILTROS */}
      <div className={styles.filtros}>

        {/* Géneros */}
        <div className={styles.generos}>
          {GENEROS.map((genero) => (
            <button
              key={genero}
              className={`${styles.pastillaGenero} ${generoActivo === genero ? styles.activo : ""}`}
              onClick={() => manejarGenero(genero)}
            >
              {genero}
            </button>
          ))}
        </div>

        {/* Ordenar + Precio */}
        <div className={styles.controles}>
          <select
            className={styles.selector}
            value={ordenActivo}
            onChange={(e) => manejarOrden(e.target.value)}
          >
            {OPCIONES_ORDEN.map((op) => (
              <option key={op.valor} value={op.valor}>{op.etiqueta}</option>
            ))}
          </select>

          <div className={styles.filtroPrecio}>
            <input
              type="number"
              placeholder="Min $"
              value={rangoPrecio.min}
              onChange={(e) => setRangoPrecio({ ...rangoPrecio, min: e.target.value })}
              className={styles.inputPrecio}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max $"
              value={rangoPrecio.max}
              onChange={(e) => setRangoPrecio({ ...rangoPrecio, max: e.target.value })}
              className={styles.inputPrecio}
            />
            <button className={styles.btnAplicar} onClick={manejarFiltroPrecio}>
              Aplicar
            </button>
          </div>

          <button className={styles.btnReiniciar} onClick={manejarReinicio}>
            Limpiar
          </button>
        </div>
      </div>

      {/* CUADRÍCULA */}
      <div className={styles.contenido}>
        {cargando ? (
          <div className={styles.cargando}>Cargando juegos...</div>
        ) : filtrados.length === 0 ? (
          <div className={styles.vacio}>
            No hay juegos con esos filtros.
            <button onClick={manejarReinicio} className={styles.btnReiniciar} style={{ marginLeft: "1rem" }}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={styles.cuadricula}>
            {filtrados.map((juego) => (
              <GameCard key={juego.id} juego={juego} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;