// AVISO DE DIAGNÓSTICO: Si ves esta alerta al cargar la página, significa que la caché se rompió con éxito
alert("¡Sistema de inicio de sesión cargado correctamente!");

import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";

// Tus credenciales reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-D3GcXWVcIWXw4CeAaKhiUZ-q2MrBjIs",
  authDomain: "://firebaseapp.com",
  projectId: "sasfabu-buz",
  storageBucket: "sasfabu-buz.firebasestorage.app",
  messagingSenderId: "61061141106",
  appId: "1:61061141106:web:b25b3401ac1f774e62a8eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        alert("Procesando datos... Conectando con Firebase.");

        const email = document.getElementById("emailInput").value.trim();
        const password = document.getElementById("passwordInput").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("¡Ingreso exitoso!");
                window.location.href = "index.html"; 
            })
            .catch((error) => {
                console.error("Error completo:", error);
                alert("Error de acceso: " + error.message);
            });
    });
} else {
    alert("Error interno: No se encontró el formulario en el HTML.");
}
