const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta a la carpeta 'public/images'
const uploadDir = path.join(__dirname, '../../public/images'); 

// Aseguramos que la carpeta exista programáticamente
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Usamos la ruta absoluta
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
module.exports = upload;
