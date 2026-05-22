export const formatoPrecio = (precio, mostrarGratis = true) => {
  if (precio === undefined || precio === null) return mostrarGratis ? "GRATIS" : "$0.00";
  if (precio === 0) return mostrarGratis ? "GRATIS" : `${Number(0).toFixed(2)}$`;
  return `${Number(precio).toFixed(2)}$`;
};

export const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });

export const truncarTexto = (texto, maxLength = 100) =>
  texto.length > maxLength ? texto.slice(0, maxLength) + "..." : texto;

export const obtenerIniciales = (nombre = "") =>
  nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);