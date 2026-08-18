// Importar las herramientas oficiales de Firebase desde internet
import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";

// ====== AQUÍ PEGA TU CONFIGURACIÓN DE FIREBASE ======
// Reemplaza todo este bloque con los datos que copiaste de tu pantalla de Firebase
// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-D3GcXWVcIWXw4CeAaKhiUZ-q2MrBjIs",
  authDomain: "sasfabu-buz.firebaseapp.com",
  projectId: "sasfabu-buz",
  storageBucket: "sasfabu-buz.firebasestorage.app",
  messagingSenderId: "61061141106",
  appId: "1:61061141106:web:b25b3401ac1f774e62a8eb"
};


// ====================================================

// Inicializar la conexión con el servidor de Google
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar cuando el vendedor hace clic en el botón "Ingresar al Panel"
document.getElementById("btn-login").addEventListener("click", () => {
    const correo = document.getElementById("input-correo").value;
    const contrasena = document.getElementById("input-password").value;

    if (!correo || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validar las credenciales en la nube de forma segura
    signInWithEmailAndPassword(auth, correo, contrasena)
        .then((userCredential) => {
            // Si el correo y contraseña son correctos, lo redirige a su panel privado
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Error de login:", error.code);
            alert("Error: Correo o contraseña incorrectos. Revisa los datos o verifica que el usuario exista en Firebase Authentication.");
        });
});
