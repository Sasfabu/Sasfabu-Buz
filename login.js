import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";

// Tus credenciales reales descubiertas en los pasos anteriores
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
        
        const email = document.getElementById("emailInput").value.trim();
        const password = document.getElementById("passwordInput").value;

        // Conexión directa a los servidores de Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("¡Ingreso exitoso!");
                window.location.href = "index.html"; // Te envía a la página principal de tu panel
            })
            .catch((error) => {
                console.error("Error completo:", error);
                alert("Error de acceso: Asegúrate de que el correo y contraseña coincidan.");
            });
    });
}
