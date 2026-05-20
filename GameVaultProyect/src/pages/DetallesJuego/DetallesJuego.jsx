import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Grafo } from "../../helpers/estructurasDeDatos";
import { formatoPrecio, obtenerIniciales } from "../../helpers/generalFunctions";
import Navbar from "../../components/Shared/Navbar/Navbar";
import TarjetaResena from "../../components/ReviewCard/ReviewCard";
import styles from "./DetallesJuego.module.scss";

const DetallesJuego = () => {
    const { id } = useParams();
    const navegar = useNavigate();
    const { agregarAlCarro, itemsCarro } = useCart();
    const { usuario, datosUsuario } = useAuth();

    const [juego, setJuego] = useState(null);
    const [resenas, setResenas] = useState([]);
    const [recomendados, setRecomendados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nuevaResena, setNuevaResena] = useState({ calificacion: 5, comentario: "" });
    const [enviando, setEnviando] = useState(false);

    const estaEnCarro = itemsCarro.find((item) => item.id === id);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                // Cargar juego
                const snapJuego = await getDoc(doc(db, "games", id));
                if (!snapJuego.exists()) { navegar("/catalogo"); return; }
                const datosJuego = { id: snapJuego.id, ...snapJuego.data() };
                setJuego(datosJuego);

                // Cargar reseñas
                const consultaResenas = query(
                    collection(db, "games", id, "resenas"),
                    orderBy("creadoEn", "desc")
                );
                const snapResenas = await getDocs(consultaResenas);
                setResenas(snapResenas.docs.map((d) => ({ id: d.id, ...d.data() })));

                // Cargar todos los juegos para grafo de recomendaciones
                const snapTodos = await getDocs(collection(db, "games"));
                const todos = snapTodos.docs.map((d) => ({ id: d.id, ...d.data() }));

                // Construir grafo por género y tags
                const grafo = new Grafo();
                todos.forEach((j) => grafo.agregarJuego(j.id));
                todos.forEach((j1) => {
                    todos.forEach((j2) => {
                        if (j1.id !== j2.id && j1.genre === j2.genre) {
                            grafo.agregarRelacion(j1.id, j2.id, 2);
                        } else if (j1.id !== j2.id && j1.tags?.some((t) => j2.tags?.includes(t))) {
                            grafo.agregarRelacion(j1.id, j2.id, 1);
                        }
                    });
                });

                const idsRecomendados = grafo.obtenerRecomendaciones(id, 3);
                const juegosRecomendados = idsRecomendados
                    .map((rid) => todos.find((j) => j.id === rid))
                    .filter(Boolean);
                setRecomendados(juegosRecomendados);

            } catch (err) {
                console.error("Error:", err);
            } finally {
                setCargando(false);
            }
        };
        obtenerDatos();
    }, [id]);

    const manejarResena = async (e) => {
        e.preventDefault();
        if (!usuario) return navegar("/login");
        if (!nuevaResena.comentario.trim()) return;
        setEnviando(true);
        try {
            const resena = {
                nombreUsuario: datosUsuario?.nombreUsuario || usuario.email,
                calificacion: nuevaResena.calificacion,
                comentario: nuevaResena.comentario,
                fecha: new Date().toLocaleDateString("es-CO"),
                creadoEn: Timestamp.now(),
            };
            await addDoc(collection(db, "games", id, "resenas"), resena);
            setResenas((prev) => [resena, ...prev]);
            setNuevaResena({ calificacion: 5, comentario: "" });
        } catch (err) {
            console.error("Error al enviar reseña:", err);
        } finally {
            setEnviando(false);
        }
    };

    if (cargando) return (
        <div className={styles.pagina}>
            <Navbar />
            <div className={styles.cargando}>Cargando juego...</div>
        </div>
    );

    if (!juego) return null;

    return (
        <div className={styles.pagina}>
            <Navbar />

            <div className={styles.miga}>
                <span onClick={() => navegar("/catalogo")}>← Volver al catálogo</span>
            </div>

            <div className={styles.disposicion}>

                {/* IZQUIERDA */}
                <div className={styles.izquierda}>
                    <div className={styles.portada}>
                        <span className={styles.emojiPortada}>{juego.emoji}</span>
                    </div>

                    <h1 className={styles.titulo}>{juego.name}</h1>

                    <div className={styles.meta}>
                        <span className={styles.estrellas}>
                            {"★".repeat(Math.round(juego.rating))}{"☆".repeat(5 - Math.round(juego.rating))}
                        </span>
                        <span className={styles.punto}>·</span>
                        <span>{juego.genre}</span>
                        <span className={styles.punto}>·</span>
                        <span className={styles.stock}>En stock</span>
                    </div>

                    <p className={styles.descripcion}>{juego.description}</p>

                    <div className={styles.etiquetas}>
                        {juego.tags?.map((etiqueta) => (
                            <span key={etiqueta} className={styles.etiqueta}>{etiqueta}</span>
                        ))}
                    </div>

                    {/* RESEÑAS */}
                    <div className={styles.seccionResenas}>
                        <h2>RESEÑAS DE <span>JUGADORES</span></h2>

                        {usuario ? (
                            <form onSubmit={manejarResena} className={styles.formularioResena}>
                                <div className={styles.selectorCalificacion}>
                                    <label>Tu valoración:</label>
                                    <select
                                        value={nuevaResena.calificacion}
                                        onChange={(e) => setNuevaResena({ ...nuevaResena, calificacion: Number(e.target.value) })}
                                        className={styles.selector}
                                    >
                                        {[5, 4, 3, 2, 1].map((n) => (
                                            <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Escribe tu reseña..."
                                    value={nuevaResena.comentario}
                                    onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                                    className={styles.areaTexto}
                                    rows={3}
                                    required
                                />
                                <button type="submit" className={styles.btnEnviar} disabled={enviando}>
                                    {enviando ? "Enviando..." : "Publicar reseña"}
                                </button>
                            </form>
                        ) : (
                            <div className={styles.avisoLogin}>
                                <span onClick={() => navegar("/login")}>Inicia sesión</span> para dejar una reseña
                            </div>
                        )}

                        <div className={styles.listaResenas}>
                            {resenas.length === 0 ? (
                                <p className={styles.sinResenas}>Sé el primero en reseñar este juego.</p>
                            ) : (
                                resenas.map((r) => <TarjetaResena key={r.id} resena={r} />)
                            )}
                        </div>
                    </div>
                </div>

                {/* DERECHA */}
                <div className={styles.derecha}>

                    {/* COMPRA */}
                    <div className={styles.cajaCompra}>
                        <div className={styles.precio}>{formatoPrecio(juego.price ?? 0)}</div>
                        {juego.price > 0 && (
                            <div className={styles.precioAnterior}>${(juego.price * 1.3).toFixed(2)}</div>
                        )}
                        <button
                            className={`${styles.btnAgregar} ${estaEnCarro ? styles.enCarro : ""}`}
                            onClick={() => agregarAlCarro({ ...juego, id })}
                            disabled={!!estaEnCarro}
                        >
                            {estaEnCarro ? "✓ En el carrito" : "Agregar al carrito"}
                        </button>
                        <button className={styles.btnVerCarro} onClick={() => navegar("/carrito")}>
                            Ver carrito
                        </button>

                        {/* Requisitos */}
                        <div className={styles.requisitos}>
                            <h4>Requisitos del sistema</h4>
                            {juego.requirements && Object.entries(juego.requirements).map(([k, v]) => (
                                <div key={k} className={styles.filaRequisito}>
                                    <span>{k.toUpperCase()}</span>
                                    <span>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECOMENDACIONES */}
                    {recomendados.length > 0 && (
                        <div className={styles.recomendados}>
                            <h4>También te puede gustar</h4>
                            {recomendados.map((j) => (
                                <div
                                    key={j.id}
                                    className={styles.tarjetaRecomendado}
                                    onClick={() => navegar(`/game/${j.id}`)}
                                >
                                    <span className={styles.emojiRecomendado}>{j.emoji}</span>
                                    <div>
                                        <div className={styles.nombreRecomendado}>{j.name}</div>
                                        <div className={styles.generoRecomendado}>{j.genre}</div>
                                    </div>
                                    <span className={styles.precioRecomendado}>{formatoPrecio(j.price ?? 0)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetallesJuego;