// Función para obtener y mostrar los contactos desde el backend
async function obtenerContactos() {
    try {
        const response = await fetch('/contactos');
        const contactos = await response.json();
        const listaContactos = document.getElementById('contactos-list');
        listaContactos.innerHTML = ''; // Limpiar la lista antes de mostrar nuevos

        contactos.forEach(contacto => {
            const li = document.createElement('li');
            li.textContent = `${contacto.nombre} - ${contacto.telefono} - ${contacto.correo}`;
            listaContactos.appendChild(li);
        });

        // Guardar los contactos para filtrarlos después
        window.contactos = contactos;
    } catch (error) {
        console.error('Error al obtener los contactos:', error);
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

        // Mostrar mensaje de éxito
        const mensaje = document.getElementById('mensaje');
        mensaje.textContent = "Contacto agregado con éxito!";
        mensaje.style.color = 'green';

        // Limpiar los campos de formulario
        document.getElementById('contact-form').reset();

        obtenerContactos(); // Recargar la lista después de agregar
    } catch (error) {
        console.error('Error al agregar el contacto:', error);
    }
});

// Función para buscar contactos
document.getElementById('search').addEventListener('input', () => {
    const query = document.getElementById('search').value.toLowerCase();

    // Filtrar los contactos en base al término de búsqueda
    const contactosFiltrados = window.contactos.filter(contacto => {
        return contacto.nombre.toLowerCase().includes(query) || 
               contacto.telefono.includes(query);
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

// Cargar los contactos al cargar la página
window.onload = obtenerContactos;
