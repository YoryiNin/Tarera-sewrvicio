// Función para obtener y mostrar los contactos desde el backend
async function obtenerContactos() {
    try {
        const response = await fetch('/contactos');
        const datos = await response.json();
        const listaContactos = document.getElementById('contactos-list');
        listaContactos.innerHTML = ''; // Limpiar la lista antes de mostrar nuevos

        // Verifica si la respuesta contiene documentos de Firestore
        const contactos = datos.map(doc => {
            return {
                nombre: doc.nombre,
                telefono: doc.telefono,
                correo: doc.correo
            };
        });

        // Mostrar los contactos en la lista
        contactos.forEach(contacto => {
            const li = document.createElement('li');
            li.textContent = `${contacto.nombre} - ${contacto.telefono} - ${contacto.correo}`;
            listaContactos.appendChild(li);
        });

        // Guardar los contactos para filtrarlos después
        window.contactos = contactos;
    } catch (error) {
        console.error('Error al obtener los contactos:', error);
        // Mostrar mensaje de error
        mostrarMensajeError('No se pudieron cargar los contactos.');
    }
}

// Función para agregar un nuevo contacto
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoContacto = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };

    try {
        const response = await fetch('/contactos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoContacto)
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            // Mostrar mensaje de éxito
            const mensaje = document.getElementById('mensaje');
            mensaje.textContent = "Contacto agregado con éxito!";
            mensaje.style.color = 'green';

            // Limpiar los campos de formulario
            document.getElementById('contact-form').reset();

            // Agregar el contacto directamente en la lista de la página
            const listaContactos = document.getElementById('contactos-list');
            const li = document.createElement('li');
            li.textContent = `${data.nombre} - ${data.telefono} - ${data.correo}`;
            listaContactos.appendChild(li);

            // Opcional: Recargar todos los contactos para estar seguro
            // obtenerContactos(); // Descomentar si prefieres hacer una nueva llamada a la API
        } else {
            mostrarMensajeError(data.error || 'No se pudo agregar el contacto.');
        }

    } catch (error) {
        console.error('Error al agregar el contacto:', error);
        // Mostrar mensaje de error
        mostrarMensajeError('No se pudo agregar el contacto.');
    }
});

// Función para buscar contactos
document.getElementById('search').addEventListener('input', () => {
    const query = document.getElementById('search').value.toLowerCase();

    // Filtrar los contactos en base al término de búsqueda
    const contactosFiltrados = window.contactos.filter(contacto => {
        return contacto.nombre.toLowerCase().includes(query) || 
               contacto.telefono.includes(query) ||
               contacto.correo.toLowerCase().includes(query);  // También filtra por correo
    });

    mostrarContactos(contactosFiltrados); // Mostrar los contactos filtrados
});

// Función para mostrar los contactos filtrados o todos
function mostrarContactos(contactos) {
    const listaContactos = document.getElementById('contactos-list');
    listaContactos.innerHTML = '';

    contactos.forEach(contacto => {
        const li = document.createElement('li');
        li.textContent = `${contacto.nombre} - ${contacto.telefono} - ${contacto.correo}`;
        listaContactos.appendChild(li);
    });
}

// Función para mostrar mensajes de error en la interfaz
function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensaje');
    mensajeError.textContent = mensaje;
    mensajeError.style.color = 'red';
}

// Cargar los contactos al cargar la página
window.onload = obtenerContactos;
