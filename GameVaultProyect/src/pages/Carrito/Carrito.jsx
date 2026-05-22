import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import Navbar from "../../components/Shared/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase/firebase";
import { formatoPrecio } from "../../helpers/generalFunctions";
import styles from "./Carrito.module.scss";

const obtenerCategoria = (juego) => {
  if (juego.tags?.length) return juego.tags[0];
  if (juego.badge === "new") return "Nuevo";
  if (juego.badge === "hot") return "Popular";
  if (juego.badge === "sale") return "Oferta";
  return "Videojuego";
};

const obtenerPrecio = (juego) => Number(juego.price ?? juego.precio ?? 0);

const prepararJuegoComprado = (juego) => ({
  id: juego.id,
  nombre: juego.name || juego.nombre,
  genero: juego.genre || "Sin genero",
  categoria: obtenerCategoria(juego),
  precio: obtenerPrecio(juego),
  emoji: juego.emoji || "🎮",
});

const Carrito = () => {
  const { usuario } = useAuth();
  const { itemsCarro, eliminarDelCarro, vaciarCarro } = useCart();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const pagoPendienteProcesado = useRef(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  const subtotal = itemsCarro.reduce((total, juego) => total + obtenerPrecio(juego), 0);
  const descuento = subtotal >= 100 ? subtotal * 0.1 : 0;
  const impuestos = (subtotal - descuento) * 0.19;
  const total = subtotal - descuento + impuestos;

  const registrarCompra = useCallback(async () => {
    if (!usuario || itemsCarro.length === 0) return;

    setProcesandoPago(true);
    setErrorPago("");

    try {
      const juegosComprados = itemsCarro.map(prepararJuegoComprado);

      await addDoc(collection(db, "ordenes"), {
        usuarioId: usuario.uid,
        juegos: juegosComprados,
        subtotal,
        descuento,
        impuestos,
        total,
        estado: "completado",
        creadoEn: serverTimestamp(),
      });

      await setDoc(
        doc(db, "usuarios", usuario.uid),
        {
          biblioteca: arrayUnion(...juegosComprados),
        },
        { merge: true }
      );

      setModalExito(true);
      navegar("/carrito", { replace: true, state: {} });
    } catch (error) {
      console.error("Error procesando pago:", error);
      setErrorPago("No se pudo completar el pago. Intentalo nuevamente.");
    } finally {
      setProcesandoPago(false);
    }
  }, [descuento, impuestos, itemsCarro, navegar, subtotal, total, usuario]);

  const manejarPago = () => {
    if (itemsCarro.length === 0 || procesandoPago) return;

    if (!usuario) {
      navegar("/login", {
        state: {
          returnTo: "/carrito",
          checkoutAfterLogin: true,
        },
      });
      return;
    }

    registrarCompra();
  };

  const cerrarModalExito = () => {
    setModalExito(false);
    vaciarCarro();
  };

  useEffect(() => {
    if (
      usuario &&
      ubicacion.state?.checkoutAfterLogin &&
      itemsCarro.length > 0 &&
      !pagoPendienteProcesado.current
    ) {
      pagoPendienteProcesado.current = true;
      registrarCompra();
    }
  }, [usuario, ubicacion.state, itemsCarro.length, registrarCompra]);

  return (
    <div className={styles.pagina}>
      <Navbar />

      <main className={styles.contenido}>
        <section className={styles.productos}>
          <div className={styles.encabezado}>
            <span>Productos agregados</span>
            <strong>{itemsCarro.length}</strong>
          </div>

          {itemsCarro.length === 0 ? (
            <div className={styles.vacio}>
              <h2>Tu carrito esta vacio</h2>
              <p>Agrega juegos desde el catalogo para verlos aqui.</p>
            </div>
          ) : (
            <div className={styles.listaProductos}>
              {itemsCarro.map((juego) => (
                <article className={styles.producto} key={juego.id}>
                  <div className={styles.iconoJuego}>{juego.emoji || "🎮"}</div>

                  <div className={styles.infoJuego}>
                    <h2>{juego.name || juego.nombre}</h2>
                    <p>
                      {juego.genre || "Sin genero"} / {obtenerCategoria(juego)}
                    </p>
                  </div>

                  <strong className={styles.precio}>
                    {formatoPrecio(obtenerPrecio(juego))}
                  </strong>

                  <button
                    type="button"
                    className={styles.btnEliminar}
                    onClick={() => eliminarDelCarro(juego.id)}
                    aria-label={`Eliminar ${juego.name || juego.nombre}`}
                  >
                    X
                  </button>
                </article>
              ))}
            </div>
          )}

          <Link to="/catalogo" className={styles.btnSeguir}>
            + Seguir comprando
          </Link>
        </section>

        <aside className={styles.resumen}>
          <h1>Carrito de compras</h1>

          <div className={styles.lineaResumen}>
            <span>Subtotal</span>
            <strong>{formatoPrecio(subtotal, false)}</strong>
          </div>
          <div className={styles.lineaResumen}>
            <span>Descuento aplicado</span>
            <strong>-{formatoPrecio(descuento, false)}</strong>
          </div>
          <div className={styles.lineaResumen}>
            <span>Impuestos</span>
            <strong>{formatoPrecio(impuestos, false)}</strong>
          </div>

          <div className={styles.totalFinal}>
            <span>Total final</span>
            <strong>{formatoPrecio(total)}</strong>
          </div>

          {errorPago && <div className={styles.errorPago}>{errorPago}</div>}

          <button
            type="button"
            className={styles.btnPago}
            disabled={itemsCarro.length === 0 || procesandoPago}
            onClick={manejarPago}
          >
            {procesandoPago ? "Procesando..." : "Proceder al pago"}
          </button>
        </aside>
      </main>

      {modalExito && (
        <div className={styles.fondoModal} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2>Pago exitoso</h2>
            <p>Tu compra fue registrada y los juegos se agregaron a tu biblioteca.</p>
            <button type="button" className={styles.btnPago} onClick={cerrarModalExito}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
