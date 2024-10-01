import { db, auth } from './config.js';
import { collection, addDoc, updateDoc, deleteDoc, query, getDocs,getDoc, serverTimestamp, doc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

const crearModal = document.getElementById("crearModal");
const crearButton = document.getElementById("crear");
const eliminarButton = document.getElementById("eliminar");
const closeModalButton = document.getElementById("closeModal");
const submitTaskButton = document.getElementById("submitTask");
const modificarModal = document.getElementById("modificarModal");
const closeModModalButton = document.getElementById("closeModModal");
const modificarTaskButton = document.getElementById("modificarTask");
const listaTareas = document.getElementById("lista-tareas");
const filtro = document.getElementById("filtro");


let tareaIdGlobal = ""; // Guardar ID de la tarea que se va a modificar
let filtroTareas = 'todas'; // Inicializar filtro en 'todas'

async function cargarTareas() {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareasRef = collection(db, `usuario/${usuarioId}/tarea`);
            const q = query(tareasRef);
            const querySnapshot = await getDocs(q);

            listaTareas.innerHTML = ""; // Limpiar lista

            querySnapshot.forEach(doc => {
                const tarea = { id: doc.id, ...doc.data() };

                // Filtrar según el estado completado
                if (filtroTareas === 'pendientes' && tarea.completada) return;
                if (filtroTareas === 'completadas' && !tarea.completada) return;

                const li = document.createElement('li');
                li.classList.add('task-item');
                if (tarea.completada) li.classList.add('tarea-completada');

                // Crear el contenedor para el nuevo checkbox
                const toggleBorder = document.createElement('div');
                toggleBorder.className = 'toggle-border';

                // Crear el nuevo checkbox
                const checkbox = document.createElement('input');
                checkbox.id = `task-${tarea.id}`; // Asigna el ID correspondiente
                checkbox.type = 'checkbox';
                checkbox.checked = tarea.completada; // Estado actual de la tarea

                // Crear la etiqueta para el checkbox
                const label = document.createElement('label');
                label.htmlFor = `task-${tarea.id}`; // Asocia la etiqueta con el checkbox

                // Crear el div para el handle
                const handle = document.createElement('div');
                handle.className = 'handle';

                // Añadir el checkbox y el label al contenedor
                toggleBorder.appendChild(checkbox);
                toggleBorder.appendChild(label);
                label.appendChild(handle);

                const title = document.createElement('span');
                title.className = 'task-title';
                title.textContent = tarea.titulo;

                const desc = document.createElement('span');
                desc.className = 'task-desc';
                desc.textContent = tarea.descripcion;

                // Agregar los elementos al <li>
                li.appendChild(title);
                li.appendChild(desc);
                li.appendChild(toggleBorder);
                listaTareas.appendChild(li);

                // Evento para marcar/desmarcar tarea como completada o pendiente
                checkbox.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Evitar que el clic en el checkbox propague al <li>
                    if (tarea.completada) {
                        await pendienteTarea(tarea.id); // Marcar como pendiente
                    } else {
                        await completarTarea(tarea.id); // Marcar como completada
                    }
                    cargarTareas(); // Recargar las tareas con el filtro activo
                });

                // Abrir modal al hacer clic en la tarea
                li.addEventListener('click', (event) => {
                    // Asegurarnos de que el clic no proviene del checkbox ni del label
                    if (!event.target.closest('input[type="checkbox"]') && !event.target.closest('label')) {
                        abrirModalModificar(tarea.id, tarea.titulo, tarea.descripcion);
                    }
                });
            });
        } else {
            alert("El usuario no está autenticado o no tiene tareas.");
        }
    } catch (error) {
        console.error("Error al cargar las tareas: ", error);
    }
}

// Función para crear una nueva tarea
async function crearTarea(titulo, descripcion) {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareasRef = collection(db, `usuario/${usuarioId}/tarea`);
            await addDoc(tareasRef, {
                titulo,
                descripcion,
                completada: false,
                fechaCreacion: serverTimestamp()
            });

            cerrarModalCrear();
            cargarTareas(); // Recargar las tareas
        }
    } catch (error) {
        console.error("Error al crear la tarea: ", error);
    }
}

// Función para modificar una tarea existente
async function modificarTarea(tareaId, nuevoTitulo, nuevaDescripcion) {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareaRef = doc(db, `usuario/${usuarioId}/tarea`, tareaId);
            await updateDoc(tareaRef, {
                titulo: nuevoTitulo,
                descripcion: nuevaDescripcion
            });

            cerrarModalModificar();
            cargarTareas(); // Recargar las tareas
        }
    } catch (error) {
        console.error("Error al modificar la tarea: ", error);
    }
}

// Función para eliminar una tarea
async function eliminarTarea(tareaId) {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareaRef = doc(db, `usuario/${usuarioId}/tarea`, tareaId);
            await deleteDoc(tareaRef);

            cerrarModalModificar(); // Cerrar modal tras eliminar
            cargarTareas(); // Recargar las tareas
        }
    } catch (error) {
        console.error("Error al eliminar la tarea: ", error);
    }
}

// Función completar una tarea.
async function completarTarea(tareaId) {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareaRef = doc(db, `usuario/${usuarioId}/tarea`, tareaId);
            await updateDoc(tareaRef, {
                completada: true
            });
            cargarTareas();
        }
    } catch (error) {
        console.error("Error al completar la tarea: ", error);
    }
}

// Función para marcar una tarea como pendiente
async function pendienteTarea(tareaId) {
    try {
        const user = auth.currentUser;
        if (user) {
            const usuarioId = user.uid;
            const tareaRef = doc(db, `usuario/${usuarioId}/tarea`, tareaId);
            await updateDoc(tareaRef, {
                completada: false // Marcar como pendiente
            });
        }
    } catch (error) {
        console.error("Error al marcar la tarea como pendiente: ", error);
    }
}



// Función para abrir el modal de creación de tareas
function abrirModalCrear() {
    crearModal.classList.add("active");
    //crearModal.style.display = "block";
}

// Función para cerrar el modal de creación de tareas
function cerrarModalCrear() {
    //crearModal.style.display = "none";
    crearModal.classList.remove("active");
}

// Función para abrir el modal de modificación de tareas
function abrirModalModificar(tareaId, titulo, descripcion) {
    tareaIdGlobal = tareaId;
    document.getElementById("modificar-task-title").value = titulo;
    document.getElementById("modificar-task-desc").value = descripcion;
    //modificarModal.style.display = "block";
    modificarModal.classList.add("active");
}

// Función para cerrar el modal de modificación de tareas
function cerrarModalModificar() {
   // modificarModal.style.display = "none";
    modificarModal.classList.remove("active");
}


// Eventos para los botones y modales
crearButton.addEventListener("click", abrirModalCrear);
closeModalButton.addEventListener("click", cerrarModalCrear);
closeModModalButton.addEventListener("click", cerrarModalModificar);

// Evento para crear una nueva tarea
submitTaskButton.addEventListener("click", function () {
    const titulo = document.getElementById("new-task-title").value;
    const descripcion = document.getElementById("new-task-desc").value;

    if (titulo && descripcion) {
        crearTarea(titulo, descripcion);
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Evento para modificar una tarea
modificarTaskButton.addEventListener("click", function () {
    const nuevoTitulo = document.getElementById("modificar-task-title").value;
    const nuevaDescripcion = document.getElementById("modificar-task-desc").value;

    if (nuevoTitulo && nuevaDescripcion) {
        modificarTarea(tareaIdGlobal, nuevoTitulo, nuevaDescripcion);
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Evento para eliminar tarea desde el modal
eliminarButton.addEventListener("click", function () {
    eliminarTarea(tareaIdGlobal);
});

// Función para cerrar sesión
document.getElementById("logout").addEventListener("click", async function () {
    try {
        await signOut(auth);
        window.location.href = "register.html";
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
    }
});

// Evento para cambiar filtros
filtro.addEventListener("change", function () {
    filtroTareas = filtro.value;
    cargarTareas();
});

// Al cargar el estado del usuario, se cargan las tareas
onAuthStateChanged(auth, (user) => {
    if (user) {
        cargarTareas();
    } else {
        window.location.href = "login.html";
    }
});

