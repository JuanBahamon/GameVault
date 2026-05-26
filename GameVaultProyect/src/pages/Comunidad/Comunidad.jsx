import { useEffect, useRef, useState } from "react";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { rtdb } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { obtenerIniciales } from "../../helpers/generalFunctions";
import Navbar from "../../components/Shared/Navbar/Navbar";
import styles from "./Comunidad.module.scss";

const SALAS = [
    { id: "general", nombre: "General", icono: "🌐" },
    { id: "fps", nombre: "FPS", icono: "🔫" },
    { id: "rpg", nombre: "RPG y aventura", icono: "⚔️" },
    { id: "racing", nombre: "Racing", icono: "🏎️" },
    { id: "indie", nombre: "Indie", icono: "🧠" },
];

const COLORES_AVATAR = [
    "rgba(230,50,50,0.2)", "rgba(58,123,255,0.2)",
    "rgba(31,202,122,0.2)", "rgba(124,58,237,0.2)",
    "rgba(255,140,0,0.2)"
];

const Comunidad = () => {
    const { usuario, datosUsuario } = useAuth();
    const [salaActiva, setSalaActiva] = useState("general");
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const refMensajes = useRef(null);

    useEffect(() => {
        const referencia = ref(rtdb, `salas/${salaActiva}/mensajes`);
        const unsub = onValue(referencia, (snap) => {
            const datos = snap.val();
            if (datos) {
                const lista = Object.entries(datos).map(([id, msg]) => ({ id, ...msg }));
                setMensajes(lista.slice(-50));
            } else {
                setMensajes([]);
            }
        });
        return () => unsub();
    }, [salaActiva]);

    useEffect(() => {
        if (refMensajes.current) {
            refMensajes.current.scrollTop = refMensajes.current.scrollHeight;
        }
    }, [mensajes]);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !usuario) return;
        try {
            await push(ref(rtdb, `salas/${salaActiva}/mensajes`), {
                texto: nuevoMensaje,
                nombreUsuario: datosUsuario?.nombreUsuario || usuario.email,
                uid: usuario.uid,
                hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
                creadoEn: serverTimestamp(),
            });
            setNuevoMensaje("");
        } catch (err) {
            console.error("Error al enviar mensaje:", err);
        }
    };

    const obtenerColorAvatar = (uid = "") => {
        const indice = uid.charCodeAt(0) % COLORES_AVATAR.length;
        return COLORES_AVATAR[indice];
    };

    return (
        <div className={styles.pagina}>
            <Navbar />
            <div className={styles.disposicion}>

                <div className={styles.barraLateral}>
                    <h3>Salas</h3>
                    {SALAS.map((sala) => (
                        <div
                            key={sala.id}
                            className={`${styles.sala} ${salaActiva === sala.id ? styles.activa : ""}`}
                            onClick={() => setSalaActiva(sala.id)}
                        >
                            <span className={styles.iconoSala}>{sala.icono}</span>
                            <span className={styles.nombreSala}>{sala.nombre}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.chatPrincipal}>
                    <div className={styles.encabezadoChat}>
                        <div className={styles.puntoCOnline} />
                        <h3>
                            # {SALAS.find((s) => s.id === salaActiva)?.nombre}
                        </h3>
                    </div>

                    <div className={styles.mensajes} ref={refMensajes}>
                        {mensajes.length === 0 ? (
                            <div className={styles.sinMensajes}>
                                Sé el primero en escribir en esta sala 👋
                            </div>
                        ) : (
                            mensajes.map((msg) => (
                                <div key={msg.id} className={styles.mensaje}>
                                    <div
                                        className={styles.avatarMsg}
                                        style={{ background: obtenerColorAvatar(msg.uid) }}
                                    >
                                        {obtenerIniciales(msg.nombreUsuario)}
                                    </div>
                                    <div className={styles.cuerpoMsg}>
                                        <div className={styles.metaMsg}>
                                            <span className={styles.usuarioMsg}>{msg.nombreUsuario}</span>
                                            <span className={styles.horaMsg}>{msg.hora}</span>
                                        </div>
                                        <div className={styles.textoMsg}>{msg.texto}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={enviarMensaje} className={styles.formularioMensaje}>
                        {usuario ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={`Escribe en #${SALAS.find((s) => s.id === salaActiva)?.nombre}...`}
                                    value={nuevoMensaje}
                                    onChange={(e) => setNuevoMensaje(e.target.value)}
                                    className={styles.inputMensaje}
                                />
                                <button type="submit" className={styles.btnEnviar}>
                                    Enviar
                                </button>
                            </>
                        ) : (
                            <div className={styles.avisoLogin}>
                                <a href="/login">Inicia sesión</a> para participar en el chat
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Comunidad;