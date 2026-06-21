'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const postRoutes = require('./routes/router.post');
const userRoutes = require('./routes/router.user');
const commentRoutes = require('./routes/router.comment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unahur-red-social';

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(commentRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// 5. Conexión a MongoDB y arranque del servidor HTTP
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB con Mongoose.');
        
        // Levanta el servidor Express SÓLO si la base de datos conectó correctamente
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error crítico: No se pudo conectar a MongoDB:', error.message);
        process.exit(1); 
    });

module.exports = app;