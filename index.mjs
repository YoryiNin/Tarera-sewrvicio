import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import firebaseAdmin from 'firebase-admin';
import fs from 'fs';

const app = express();
const port = 3000;


const serviceAccount = JSON.parse(
    fs.readFileSync('C:/Users/Yntoxicboy/Downloads/servicio-web-agenda-master/servicio-web-agenda-master/proyecto-pw-45308-firebase-adminsdk-9t463-23b8d57fbf.json')
);


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://proyecto-pw-45308.firebaseio.com",  
});


const db = firebaseAdmin.firestore();

app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});


app.get('/contactos', async (req, res) => {
    try {
        const contactosSnapshot = await db.collection('contactos').get();
        const contactos = contactosSnapshot.docs.map(doc => doc.data());
        res.json(contactos);
    } catch (error) {
        console.error('Error al obtener los contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

// Ruta para almacenar un contacto en Firestore
app.post('/contactos', async (req, res) => {
    try {
        const nuevoContacto = req.body;

        // Agregar el nuevo contacto a la colección 'contactos'
        const contactoRef = await db.collection('contactos').add(nuevoContacto);
        res.status(201).json({
            message: 'Contacto agregado con éxito',
            nuevoContacto: { id: contactoRef.id, ...nuevoContacto },
        });
    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        res.status(500).json({ error: 'Error al guardar el contacto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
