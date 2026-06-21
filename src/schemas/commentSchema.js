const Joi = require('joi')

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createCommentSchema = Joi.object({
    idUser:  Joi.string().regex(objectIdRegex).required().messages({
        "string.base": "el idUser debe ser una cadena de texto (string)",
        "string.pattern.base": "el idUser debe ser un ID valido de MongoDB (24 caracteres hexadecimales)",
        'any.required': 'El idUser es obligatorio'
    }),
    contenido: Joi.string().trim().min(1).max(255).required().messages({
        'string.base': 'El contenido debe ser texto',
        'string.empty': 'El contenido no puede estar vacio',
        'string.min': 'El contenido debe tener al menos 1 caracter',
        'string.max': 'El contenido no puede superar los 255 caracteres',
        'any.required': 'El contenido es obligatorio'
    })
})

const updateCommentSchema = Joi.object({
    contenido: Joi.string().trim().min(1).max(255).required().messages({
        'string.base': 'El contenido debe ser texto',
        'string.empty': 'El contenido no puede estar vacio',
        'string.min': 'El contenido debe tener al menos 1 caracter',
        'string.max': 'El contenido no puede superar los 255 caracteres',
        'any.required': 'El contenido es obligatorio'
    })
})

module.exports = {
    createCommentSchema,
    updateCommentSchema
}
