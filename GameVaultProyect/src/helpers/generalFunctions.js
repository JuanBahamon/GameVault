export const formatoPrecio = (precio) => {
  if (precio === undefined || precio === null) return "GRATIS";
  if (precio === 0) return "GRATIS";
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