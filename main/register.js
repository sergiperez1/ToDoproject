import { auth } from './config.js';  // Importar la instancia de auth desde config.js
import { createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { db } from './config.js';  // Importar la base de datos Firestore desde config.js


const registerForm = document.querySelector('.flip-card__back .flip-card__form');
const errorMessage = document.getElementById('error-message-register'); 

registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Cambiar la forma de obtener los inputs
    const name = document.querySelector('.flip-card__back input[placeholder="Name"]').value;
    const email = document.querySelector('.flip-card__back input[name="email"]').value;
    const password = document.querySelector('.flip-card__back input[name="password"]').value;
    const confirmPassword = document.querySelector('.flip-card__back input[placeholder="Password"]').value; // Cambiar según el input en el HTML

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    // Validar que la contraseña cumpla con los requisitos
    if (!validatePassword(password)) {
        errorMessage.textContent = 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
        return;
    }

    try {
        // Crear un nuevo usuario con email y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Enviar verificación de correo
        await sendEmailVerification(user);
        alert('Se ha enviado un correo de verificación. Por favor, verifica tu correo electrónico antes de iniciar sesión.');

        // Guardar los datos del usuario en Firestore
        await setDoc(doc(collection(db, 'usuario'), user.uid), {
            nombre: name,
            email: email,
            userId: user.uid
        });

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'login.html';

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

// Función para validar la contraseña según los requisitos
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return regex.test(password);
}
