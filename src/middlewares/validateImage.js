const mongoose = require('mongoose');

const validatePutImage = async (req, res, next) => {
    try {
        const idPost = req.params.postId;
        const urlImages = req.body.urlImages;        

        if (!idPost || !mongoose.Types.ObjectId.isValid(idPost)) {
            return res.status(400).json({ 
                message: "El parámetro postId debe ser un ID de MongoDB (ObjectId) válido" 
            });
        }

        if (!urlImages || !Array.isArray(urlImages) || urlImages.length !== 1) {
            return res.status(400).json({ 
                message: "Solo se puede enviar una imagen a la vez" 
            });
        }

        next();
    } catch (error) {
        console.error('Error en validatePutImage:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { validatePutImage };