'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./db/data/mongodb');
const postRoutes = require('./routes/router.post');
const userRoutes = require('./routes/router.user');
const commentRoutes = require('./routes/router.comment');
const tagRoutes = require('./routes/router.tag');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(commentRoutes);
app.use(tagRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

async function start() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error crítico al iniciar la aplicación:', error.message);
        process.exit(1);
    }
}

start();

module.exports = app;
