import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const ContextoAuth = createContext();

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const registrarse = async (correo, contrasena, nombreUsuario) => {
    const resultado = await createUserWithEmailAndPassword(auth, correo, contrasena);
    await updateProfile(resultado.user, { displayName: nombreUsuario });
    await setDoc(doc(db, "usuarios", resultado.user.uid), {
      uid: resultado.user.uid,
      nombreUsuario,
      correo,
      rol: "usuario",
      biblioteca: [],
      creadoEn: new Date(),
    });
    return resultado;
  };

  const iniciarSesion = (correo, contrasena) =>
    signInWithEmailAndPassword(auth, correo, contrasena);

  const cerrarSesion = () => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      if (usuarioFirebase) {
        const snap = await getDoc(doc(db, "usuarios", usuarioFirebase.uid));
        if (snap.exists()) setDatosUsuario(snap.data());
      } else {
        setDatosUsuario(null);
      }
      setCargando(false);
    });
    return unsub;
  }, []);

  return (
    <ContextoAuth.Provider
      value={{
        usuario,
        datosUsuario,
        cargando,
        registrarse,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {!cargando && children}
    </ContextoAuth.Provider>
  );
};

export const useAuth = () => useContext(ContextoAuth);