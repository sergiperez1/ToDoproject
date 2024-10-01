// Importar las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"; // Asegúrate de importar Firestore
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Tu configuración de Firebase
/*
const firebaseConfig = {
  apiKey: "process.env.FIREBASE_API_KEY",
  authDomain: "process.env.FIREBASE_AUTH_DOMAIN",
  projectId: "process.env.FIREBASE_PROJECT_ID",
  storageBucket: "process.env.FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "process.env.FIREBASE_MESSAGING_SENDER_ID",
  appId: "process.env.FIREBASE_APP_ID",
  measurementId: "process.env.FIREBASE_MEASUREMENT_ID"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyBr0qd_PViV3MOQfRc7Qj1i2fNEKcmpIqg",
  authDomain: "to-do-59cdf.firebaseapp.com",
  projectId: "to-do-59cdf",
  storageBucket: "to-do-59cdf.appspot.com",
  messagingSenderId: "760698732155",
  appId: "1:760698732155:web:cf5351e479149a1025ecde",
  measurementId: "G-W9PZGKHNRT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);  // Esta es la instancia de Firestore
const auth = getAuth(app);

// Exportar las instancias para usarlas en otros archivos
export { app, db, auth};
