import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { app } from './config.js';

const auth = getAuth(app);

// Cambiar el nombre de la variable de loginForm a flip-card__form
const loginForm = document.querySelector('.flip-card__front .flip-card__form');
const errorMessage = document.getElementById('error-message-login'); // Asegúrate de que este elemento existe en tu HTML
const forgotPasswordLink = document.getElementById("forgot-password"); // Asegúrate de que este elemento existe en tu HTML

// Cambiar el listener de 'submit' para el formulario de login
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Cambiar la forma de obtener los inputs
    const email = document.querySelector('.flip-card__front input[name="email"]').value;
    const password = document.querySelector('.flip-card__front input[name="password"]').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verificar si el correo ha sido verificado
        if (user.emailVerified) {
            // Redirigir a la página principal si el correo está verificado
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
        }
    } catch (error) {
        errorMessage.textContent = 'Correo electrónico o contraseña incorrectos.';
    }   
});

// Cambiar el listener para el enlace de restablecimiento de contraseña
if (forgotPasswordLink) { // Verifica que el elemento existe
    forgotPasswordLink.addEventListener("click", async function(event) {
        event.preventDefault();
        
        // Corregir la referencia al campo de correo
        const email = document.querySelector('.flip-card__front input[name="email"]').value;

        // Verificar si el correo ha sido introducido
        if (!email) {
            alert('Introduce tu correo electrónico');
            return;
        }

        try {
            // Enviar correo para reestablecer la contraseña
            await sendPasswordResetEmail(auth, email);
            alert("Se ha enviado un correo para restablecer tu contraseña");
        } catch (error) {
            alert("Error al enviar el correo de restablecimiento. Verifica el correo ingresado.");
        }
    });
}
