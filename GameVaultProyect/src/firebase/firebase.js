// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5MO9fvWxnO-GApmgZ2xEbMEazx5ixbnA",
  authDomain: "gamevaultbd-59a1e.firebaseapp.com",
  databaseURL: "https://gamevaultbd-59a1e-default-rtdb.firebaseio.com",
  projectId: "gamevaultbd-59a1e",
  storageBucket: "gamevaultbd-59a1e.firebasestorage.app",
  messagingSenderId: "192684920083",
  appId: "1:192684920083:web:7c4b7f11e2161a66bb9ee6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

