import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/Shared/Navbar/Navbar";
import styles from "./Mapa.module.scss";

// Fix icono leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIAS = ["Todos", "Tiendas", "Eventos", "Cyber Cafés", "Torneos"];

const UBICACIONES = [
  { id: 1, nombre: "GameStop Cali", tipo: "Tiendas", lat: 3.4516, lng: -76.5320, descripcion: "Tienda oficial de videojuegos" },
  { id: 2, nombre: "Torneo FPS", tipo: "Torneos", lat: 3.4600, lng: -76.5200, descripcion: "Torneo este sábado — Premios en efectivo" },
  { id: 3, nombre: "Cyber Zone", tipo: "Cyber Cafés", lat: 3.4480, lng: -76.5400, descripcion: "PCs gamer de alta gama" },
  { id: 4, nombre: "RetroGames", tipo: "Tiendas", lat: 3.4550, lng: -76.5150, descripcion: "Videojuegos retro y coleccionables" },
  { id: 5, nombre: "Game On Event", tipo: "Eventos", lat: 3.4420, lng: -76.5300, descripcion: "Feria gamer este fin de semana" },
  { id: 6, nombre: "PlayZone Café", tipo: "Cyber Cafés", lat: 3.4650, lng: -76.5450, descripcion: "Café + gaming lounge" },
];

const COLORES_TIPO = {
  Tiendas: "#e63232",
  Torneos: "#3a7bff",
  "Cyber Cafés": "#1fca7a",
  Eventos: "#ff8c00",
};

const Mapa = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [ubicacionesFiltradas, setUbicacionesFiltradas] = useState(UBICACIONES);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);

  const manejarCategoria = (categoria) => {
    setCategoriaActiva(categoria);
    if (categoria === "Todos") {
      setUbicacionesFiltradas(UBICACIONES);
    } else {
      setUbicacionesFiltradas(UBICACIONES.filter((u) => u.tipo === categoria));
    }
  };

  const crearIcono = (tipo) => L.divIcon({
    className: "",
    html: `<div style="
      background:${COLORES_TIPO[tipo] || "#e63232"};
      width:14px;height:14px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <div className={styles.pagina}>
      <Navbar />

      <div className={styles.encabezado}>
        <h1>Mapa <span>Gamer</span></h1>
        <p>Encuentra tiendas, eventos y cyber cafés cerca de ti</p>
      </div>

      {/* FILTROS */}
      <div className={styles.filtros}>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            className={`${styles.pastilla} ${categoriaActiva === cat ? styles.activa : ""}`}
            onClick={() => manejarCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.disposicion}>

        {/* MAPA */}
        <div className={styles.contenedorMapa}>
          <MapContainer
            center={[3.4516, -76.5320]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {ubicacionesFiltradas.map((ubicacion) => (
              <Marker
                key={ubicacion.id}
                position={[ubicacion.lat, ubicacion.lng]}
                icon={crearIcono(ubicacion.tipo)}
                eventHandlers={{
                  click: () => setUbicacionSeleccionada(ubicacion),
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "DM Sans, sans-serif", minWidth: "150px" }}>
                    <strong style={{ color: "#e63232" }}>{ubicacion.nombre}</strong>
                    <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>{ubicacion.tipo}</p>
                    <p style={{ margin: 0, fontSize: "12px" }}>{ubicacion.descripcion}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LISTA */}
        <div className={styles.lista}>
          <h3>Ubicaciones ({ubicacionesFiltradas.length})</h3>
          {ubicacionesFiltradas.map((ubicacion) => (
            <div
              key={ubicacion.id}
              className={`${styles.tarjetaUbicacion} ${ubicacionSeleccionada?.id === ubicacion.id ? styles.seleccionada : ""}`}
              onClick={() => setUbicacionSeleccionada(ubicacion)}
            >
              <div
                className={styles.puntoDot}
                style={{ background: COLORES_TIPO[ubicacion.tipo] || "var(--accent)" }}
              />
              <div className={styles.infoUbicacion}>
                <div className={styles.nombreUbicacion}>{ubicacion.nombre}</div>
                <div className={styles.tipoUbicacion}>{ubicacion.tipo}</div>
                <div className={styles.descUbicacion}>{ubicacion.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mapa;