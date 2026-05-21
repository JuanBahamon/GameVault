// ================================================
// ESTRUCTURA 1: LISTA ENLAZADA
// Uso: Historial de juegos visitados recientemente
// ================================================
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

export class ListaEnlazada {
  constructor(tamanoMaximo = 10) {
    this.cabeza = null;
    this.tamano = 0;
    this.tamanoMaximo = tamanoMaximo;
  }

  agregar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (this.incluye(valor.id)) this.eliminar(valor.id);
    nuevoNodo.siguiente = this.cabeza;
    this.cabeza = nuevoNodo;
    this.tamano++;
    if (this.tamano > this.tamanoMaximo) this.eliminarUltimo();
  }

  eliminar(id) {
    if (!this.cabeza) return;
    if (this.cabeza.valor.id === id) {
      this.cabeza = this.cabeza.siguiente;
      this.tamano--;
      return;
    }
    let actual = this.cabeza;
    while (actual.siguiente) {
      if (actual.siguiente.valor.id === id) {
        actual.siguiente = actual.siguiente.siguiente;
        this.tamano--;
        return;
      }
      actual = actual.siguiente;
    }
  }

  eliminarUltimo() {
    if (!this.cabeza) return;
    if (!this.cabeza.siguiente) { this.cabeza = null; this.tamano--; return; }
    let actual = this.cabeza;
    while (actual.siguiente.siguiente) actual = actual.siguiente;
    actual.siguiente = null;
    this.tamano--;
  }

  incluye(id) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.valor.id === id) return true;
      actual = actual.siguiente;
    }
    return false;
  }

  aArreglo() {
    const resultado = [];
    let actual = this.cabeza;
    while (actual) {
      resultado.push(actual.valor);
      actual = actual.siguiente;
    }
    return resultado;
  }
}

// ================================================
// ESTRUCTURA 2: PILA
// Uso: Navegación — historial de páginas visitadas
// ================================================
export class Pila {
  constructor() {
    this.elementos = [];
  }

  apilar(elemento) {
    this.elementos.push(elemento);
  }

  desapilar() {
    if (this.estaVacia()) return null;
    return this.elementos.pop();
  }

  cima() {
    return this.elementos[this.elementos.length - 1];
  }

  estaVacia() {
    return this.elementos.length === 0;
  }

  tamano() {
    return this.elementos.length;
  }

  aArreglo() {
    return [...this.elementos].reverse();
  }
}

// ================================================
// ESTRUCTURA 3: ÁRBOL BINARIO DE BÚSQUEDA
// Uso: Búsqueda y filtrado de juegos por precio
// ================================================
export class NodoArbol {
  constructor(juego) {
    this.juego = juego;
    this.izquierda = null;
    this.derecha = null;
  }
}

export class ArbolBST {
  constructor() {
    this.raiz = null;
  }

  insertar(juego) {
    const nuevoNodo = new NodoArbol(juego);
    if (!this.raiz) { this.raiz = nuevoNodo; return; }
    this._insertarNodo(this.raiz, nuevoNodo);
  }

  _insertarNodo(nodo, nuevoNodo) {
    if (nuevoNodo.juego.precio < nodo.juego.precio) {
      if (!nodo.izquierda) nodo.izquierda = nuevoNodo;
      else this._insertarNodo(nodo.izquierda, nuevoNodo);
    } else {
      if (!nodo.derecha) nodo.derecha = nuevoNodo;
      else this._insertarNodo(nodo.derecha, nuevoNodo);
    }
  }

  obtenerEnRango(precioMin, precioMax) {
    const resultado = [];
    this._buscarEnRango(this.raiz, precioMin, precioMax, resultado);
    return resultado;
  }

  _buscarEnRango(nodo, min, max, resultado) {
    if (!nodo) return;
    if (nodo.juego.precio > min) this._buscarEnRango(nodo.izquierda, min, max, resultado);
    if (nodo.juego.precio >= min && nodo.juego.precio <= max) resultado.push(nodo.juego);
    if (nodo.juego.precio < max) this._buscarEnRango(nodo.derecha, min, max, resultado);
  }

  enOrden() {
    const resultado = [];
    this._enOrden(this.raiz, resultado);
    return resultado;
  }

  _enOrden(nodo, resultado) {
    if (!nodo) return;
    this._enOrden(nodo.izquierda, resultado);
    resultado.push(nodo.juego);
    this._enOrden(nodo.derecha, resultado);
  }
}

// ================================================
// ESTRUCTURA 4: MONTÍCULO MÁXIMO (MAX-HEAP)
// Uso: Ranking de juegos más populares/vendidos
// ================================================
export class MontiuloMaximo {
  constructor() {
    this.monticulo = [];
  }

  insertar(juego) {
    this.monticulo.push(juego);
    this._subirBurbuja(this.monticulo.length - 1);
  }

  _subirBurbuja(indice) {
    while (indice > 0) {
      const padre = Math.floor((indice - 1) / 2);
      if (this.monticulo[padre].ventas >= this.monticulo[indice].ventas) break;
      [this.monticulo[padre], this.monticulo[indice]] = [this.monticulo[indice], this.monticulo[padre]];
      indice = padre;
    }
  }

  extraerMaximo() {
    if (this.monticulo.length === 0) return null;
    const maximo = this.monticulo[0];
    const ultimo = this.monticulo.pop();
    if (this.monticulo.length > 0) {
      this.monticulo[0] = ultimo;
      this._bajarBurbuja(0);
    }
    return maximo;
  }

  _bajarBurbuja(indice) {
    const longitud = this.monticulo.length;
    while (true) {
      let mayor = indice;
      const izquierda = 2 * indice + 1;
      const derecha = 2 * indice + 2;
      if (izquierda < longitud && this.monticulo[izquierda].ventas > this.monticulo[mayor].ventas) mayor = izquierda;
      if (derecha < longitud && this.monticulo[derecha].ventas > this.monticulo[mayor].ventas) mayor = derecha;
      if (mayor === indice) break;
      [this.monticulo[mayor], this.monticulo[indice]] = [this.monticulo[indice], this.monticulo[mayor]];
      indice = mayor;
    }
  }

  obtenerTopN(n) {
    const copia = new MontiuloMaximo();
    copia.monticulo = [...this.monticulo];
    const resultado = [];
    for (let i = 0; i < n && copia.monticulo.length > 0; i++) {
      resultado.push(copia.extraerMaximo());
    }
    return resultado;
  }

  tamano() {
    return this.monticulo.length;
  }
}

// ================================================
// ESTRUCTURA 5: GRAFO
// Uso: Sistema de recomendaciones entre juegos

export class Grafo {
  constructor() {
    this.listaAdyacencia = {};
  }

  agregarJuego(idJuego) {
    if (!this.listaAdyacencia[idJuego]) {
      this.listaAdyacencia[idJuego] = [];
    }
  }

  agregarRelacion(idJuego1, idJuego2, peso = 1) {
    this.agregarJuego(idJuego1);
    this.agregarJuego(idJuego2);
    this.listaAdyacencia[idJuego1].push({ id: idJuego2, peso });
    this.listaAdyacencia[idJuego2].push({ id: idJuego1, peso });
  }

  obtenerRecomendaciones(idJuego, limite = 3) {
    if (!this.listaAdyacencia[idJuego]) return [];
    return this.listaAdyacencia[idJuego]
      .sort((a, b) => b.peso - a.peso)
      .slice(0, limite)
      .map((rel) => rel.id);
  }

  bfs(idInicio, profundidad = 2) {
    const visitados = new Set();
    const cola = [{ id: idInicio, nivel: 0 }];
    const resultado = [];
    visitados.add(idInicio);

    while (cola.length > 0) {
      const { id, nivel } = cola.shift();
      if (nivel > 0) resultado.push(id);
      if (nivel >= profundidad) continue;
      for (const vecino of (this.listaAdyacencia[id] || [])) {
        if (!visitados.has(vecino.id)) {
          visitados.add(vecino.id);
          cola.push({ id: vecino.id, nivel: nivel + 1 });
        }
      }
    }
    return resultado;
  }
}