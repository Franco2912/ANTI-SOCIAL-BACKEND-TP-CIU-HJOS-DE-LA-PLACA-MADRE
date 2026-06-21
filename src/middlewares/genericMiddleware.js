const mongoose = require('mongoose');
const Post = require('../db/models/Post'); // Importamos Post en lugar de Tag

const validateExistsModel = (Modelo, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const id = req.params[paramName]

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ 
                    error: `El parametro ${paramName} debe ser un ID de MongoDB (ObjectId) valido` 
                });
            }

            const instancia = await Modelo.findById(id);

            if (!instancia) {
                return res.status(404).json({ error: `El recurso con id ${id} en el modelo ${Modelo.name} no existe` })
            }

            req.modelo = instancia
            next()
        } catch (error) {
            console.error(`Error de validacion en ${Modelo.name}:`, error)
            return res.status(500).json({ error: 'Error del servidor' })
        }
    }
}

const validarById = (Modelo) => {
    return async (req, res, next) => {
        try {
            const id = req.params.id || req.params.postId || req.params.post_id;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error_message: 'El ID provisto no tiene un formato valido' });
            }

            const instance = await Modelo.findById(id);

            if (!instance) {
                return res.status(404).json({ error_message: `el id ${id} no fue encontrado` });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error del servidor' });
        }
    };
};

const validarTagByName = async (req, res, next) => {
    try {
        const tagName = req.params.tagName || req.body.tagName;

        if (!tagName) {
            return res.status(400).json({ error_message: 'El parametro tagName es requerido' });
        }

        const existeTag = await Post.findOne({ tags: tagName });

        if (!existeTag) {
            return res.status(404).json({ error_message: `El tag "${tagName}" no existe en ninguna publicacion` });
        }

        req.tag = tagName; 
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { validarById, validarTagByName, validateExistsModel }
