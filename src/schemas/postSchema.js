const Joi = require('joi')

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const schemaPost = Joi.object({
    idUser: Joi.string().regex(objectIdRegex).required().messages({
        "string.base": "el idUser debe ser una cadena de texto (string)",
        "string.pattern.base": "el idUser debe ser un ID valido de MongoDB (24 caracteres hexadecimales)",
        "any.required": "el atributo idUser debe existir"
    }),
    descripcion: Joi.string().min(3).max(100).required().messages({
        "string.empty": "la descripcion no puede estar vacia",
        "string.min": "la descripcion debe tener minimo 3 caracteres",
        "string.max": "la descripcion debe tener maximo 100 caracteres",
        "any.required": "el atributo descripcion debe existir",
    })
})

module.exports = { schemaPost }
