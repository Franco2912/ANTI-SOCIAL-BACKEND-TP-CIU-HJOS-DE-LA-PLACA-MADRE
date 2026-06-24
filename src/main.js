'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const postRoutes = require('./routes/router.post');
const userRoutes = require('./routes/router.user');
const commentRoutes = require('./routes/router.comment');
const {initRedis} = require('./services/redis.service');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(commentRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


async function start() {
    try{
        // Conexion a MongoDB
        await mongoose.connect(MONGO_URI)
        console.log('Conexión exitosa a MongoDB con Mongoose.')

       // Conexion a redis
       await initRedis()
       

       app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
       })
    }catch(error){
        console.error('Error al iniciar la aplicacion', error)
        process.exit(1)
    }
}

start();

module.exports = app;