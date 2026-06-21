const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://root:example@localhost:27017/usuarios?authSource=admin'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;