import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa solo lo que necesitas

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAz6t8aV_h7sR0afQiC-O8nEMJ0BT7Kr6Y",
    authDomain: "agenda-2024-45049.firebaseapp.com",
    projectId: "agenda-2024-45049",
    storageBucket: "agenda-2024-45049.firebasestorage.app",
    messagingSenderId: "854237284386",
    appId: "1:854237284386:web:7a824e249b22097fede27b"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obtener la base de datos Firestore
export const baseDeDato = getFirestore(app); // Usamos getFirestore para obtener la instancia de Firestore

export default app;
