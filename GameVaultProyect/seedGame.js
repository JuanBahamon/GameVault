import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./src/firebase/firebase.js";

const games = [
  {
    name: "Expedition 33",
    genre: "RPG / Por turnos",
    price: 39.99,
    sales: 1520,
    badge: "hot",
    emoji: "⚔️",
    description:
      "Un RPG por turnos épico con mundo semi abierto. Decisiones que cambian el destino del reino.",
    tags: ["Mundo semi abierto", "RPG", "Por turnos"],
    rating: 4.8,
    requirements: {
      os: "Windows 10",
      cpu: "i7-12700KF",
      gpu: "RTX 2060",
      ram: "16 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Cyberpunk 2077",
    genre: "Shooter / Accion",
    price: 49.99,
    sales: 3200,
    badge: "hot",
    emoji: "🤖",
    description:
      "Mundo abierto cyberpunk con narrativa profunda y combate en primera persona.",
    tags: ["Mundo abierto", "Shooter", "Accion"],
    rating: 4.6,
    requirements: {
      os: "Windows 10",
      cpu: "i7-8700K",
      gpu: "RTX 2060",
      ram: "16 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Need 4 Speed",
    genre: "Racing / Accion",
    price: 29.99,
    sales: 980,
    badge: "sale",
    emoji: "🏎️",
    description:
      "Carreras ilegales a alta velocidad con personalización total de vehículos.",
    tags: ["Racing", "Accion", "Multijugador"],
    rating: 4.2,
    requirements: {
      os: "Windows 10",
      cpu: "i5-8400",
      gpu: "GTX 1070",
      ram: "12 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Minecraft",
    genre: "SandBox / Aventura",
    price: 19.99,
    sales: 5000,
    badge: "",
    emoji: "⛏️",
    description:
      "Construye, explora y sobrevive en un mundo generado proceduralmente.",
    tags: ["SandBox", "Aventura", "Multijugador"],
    rating: 4.9,
    requirements: {
      os: "Windows 7+",
      cpu: "i5-4690",
      gpu: "GTX 700",
      ram: "8 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Victoria 2",
    genre: "Estrategia / Accion",
    price: 9.99,
    sales: 420,
    badge: "",
    emoji: "🧠",
    description:
      "Juego de gran estrategia ambientado en el siglo XIX. Gestiona tu nación.",
    tags: ["Estrategia", "Historia", "Simulacion"],
    rating: 4.5,
    requirements: {
      os: "Windows XP+",
      cpu: "Cualquiera",
      gpu: "Integrada",
      ram: "2 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Lies of P",
    genre: "RPG / Accion",
    price: 26.99,
    sales: 870,
    badge: "new",
    emoji: "🎭",
    description:
      "Souls-like inspirado en Pinocho. Combate técnico y atmosfera oscura.",
    tags: ["Souls-like", "RPG", "Accion"],
    rating: 4.7,
    requirements: {
      os: "Windows 10",
      cpu: "i7-8700",
      gpu: "RTX 2070",
      ram: "16 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Ark Survival",
    genre: "SandBox / Aventura",
    price: 21.99,
    sales: 1100,
    badge: "",
    emoji: "🦕",
    description:
      "Sobrevive en una isla prehistórica llena de dinosaurios. Construye y domestica.",
    tags: ["SandBox", "Supervivencia", "Multijugador"],
    rating: 4.1,
    requirements: {
      os: "Windows 10",
      cpu: "i7-6700K",
      gpu: "GTX 1070",
      ram: "16 GB",
    },
    createdAt: Timestamp.now(),
  },

  {
    name: "Fifa 33",
    genre: "Deportes / Accion",
    price: 20.99,
    sales: 2800,
    badge: "new",
    emoji: "⚽",
    description:
      "La simulación de fútbol más completa del mercado. Modos carrera y Ultimate Team.",
    tags: ["Deportes", "Multijugador", "Simulacion"],
    rating: 4.0,
    requirements: {
      os: "Windows 10",
      cpu: "i5-9600K",
      gpu: "GTX 1660",
      ram: "12 GB",
    },
    createdAt: Timestamp.now(),
  },
];

const seed = async () => {
  try {
    console.log("🌱 Sembrando juegos en Firestore...");

    for (const game of games) {
      const docRef = await addDoc(collection(db, "games"), game);

      console.log(`✅ ${game.name} → ${docRef.id}`);
    }

    console.log("🎮 ¡Listo! Todos los juegos fueron agregados.");
  } catch (error) {
    console.error("❌ Error agregando juegos:", error);
  }
};

seed();