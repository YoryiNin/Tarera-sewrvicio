import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fetch from 'node-fetch';  // Si necesitas hacer solicitudes a Firestore desde el backend

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'public')));  // Servir archivos estáticos desde el directorio 'public'

// Ruta para mostrar la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

// Ruta para listar los contactos desde Firestore (usando la API REST de Firebase)
app.get('/contactos', async (req, res) => {
    try {
        // Hacer una solicitud GET a Firestore para obtener los contactos
        const response = await fetch('https://firestore.googleapis.com/v1/projects/agenda-2024-45049/databases/(default)/documents/contactos');
        const data = await response.json();
        
        // Verificar la respuesta completa para depuración
        console.log('Respuesta de Firestore:', JSON.stringify(data, null, 2)); // Mostrar la respuesta con formato legible

        if (data && data.documents) {
            // Extraer solo los datos relevantes y formatearlos correctamente
            const contactos = data.documents.map(doc => {
                const fields = doc.fields || {}; // Asegurarnos de que 'fields' no sea undefined
                console.log('Campos de documento:', fields); // Verificar los campos del documento

                return {
                    id: doc.name.split('/').pop(),  // Obtener ID del documento desde la URL
                    nombre: fields.nombre && fields.nombre.stringValue ? fields.nombre.stringValue : 'Sin nombre', // Verificamos si existe 'nombre'
                    telefono: fields.telefono && fields.telefono.stringValue ? fields.telefono.stringValue : 'Sin teléfono', // Verificamos si existe 'telefono'
                    correo: fields.correo && fields.correo.stringValue ? fields.correo.stringValue : 'Sin correo', // Verificamos si existe 'correo'
                };
            });

            console.log('Contactos extraídos:', JSON.stringify(contactos, null, 2)); // Ver los datos extraídos

            res.json(contactos);  // Devuelve los contactos formateados
        } else {
            res.status(500).json({ error: 'No se encontraron contactos en la respuesta de Firestore.' });
        }
    } catch (error) {
        console.error('Error al obtener los contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

// Ruta para almacenar un contacto en Firestore (usando la API REST de Firebase)
app.post('/contactos', async (req, res) => {
    try {
        const nuevoContacto = req.body;

        // Hacer una solicitud POST a Firestore para agregar el nuevo contacto
        const response = await fetch('https://firestore.googleapis.com/v1/projects/agenda-2024-45049/databases/(default)/documents/contactos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: {
                    nombre: { stringValue: nuevoContacto.nombre },
                    telefono: { stringValue: nuevoContacto.telefono },
                    correo: { stringValue: nuevoContacto.correo },
                },
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            // Firestore no devuelve los datos completos, pero sí la referencia al documento
            const id = data.name.split('/').pop();  // Obtener el ID del documento
            res.status(201).json({
                message: 'Contacto agregado con éxito',
                id,
                nombre: nuevoContacto.nombre,
                telefono: nuevoContacto.telefono,
                correo: nuevoContacto.correo
            });
        } else {
            res.status(400).json({ error: 'Error al agregar el contacto', details: data });
        }

    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        res.status(500).json({ error: 'Error al guardar el contacto' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
