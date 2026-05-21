import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ArbolBST } from "../helpers/estructurasDeDatos";

const useJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [arbol, setArbol] = useState(null);

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const q = query(collection(db, "games"), orderBy("createdAt", "desc"));
        const instantanea = await getDocs(q);
        const datos = instantanea.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const bst = new ArbolBST();
        datos.forEach((juego) => bst.insertar({ ...juego, precio: juego.price || 0 }));
        setArbol(bst);

        setJuegos(datos);
        setFiltrados(datos);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerJuegos();
  }, []);

  const filtrarPorGenero = (genero) => {
    if (genero === "Todos") return setFiltrados(juegos);
    setFiltrados(juegos.filter((j) => j.genre?.includes(genero)));
  };

  const filtrarPorPrecio = (min, max) => {
    if (!arbol) return;
    const resultado = arbol.obtenerEnRango(min, max);
    setFiltrados(resultado);
  };

  const ordenarPorPrecio = (orden = "asc") => {
    if (!arbol) return;
    const ordenados = arbol.enOrden();
    setFiltrados(orden === "asc" ? ordenados : [...ordenados].reverse());
  };

  const reiniciarFiltros = () => setFiltrados(juegos);

  return { juegos, filtrados, cargando, filtrarPorGenero, filtrarPorPrecio, ordenarPorPrecio, reiniciarFiltros };
};

export default useJuegos;