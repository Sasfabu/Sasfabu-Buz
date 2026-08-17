// Importar las herramientas oficiales de Firebase desde internet
import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";

// ====== AQUÍ PEGA TU CONFIGURACIÓN DE FIREBASE ======
// Reemplaza todo este bloque con los datos que copiaste de tu pantalla de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0...",
    authDomain: "://firebaseapp.com",
    projectId: "sasfabu-buz",
    storageBucket: "://appspot.com",
    messagingSenderId: "987654321012",
    appId: "1:987654321012:web:a1b2c3d4e5f6g7h8i9j0"
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
