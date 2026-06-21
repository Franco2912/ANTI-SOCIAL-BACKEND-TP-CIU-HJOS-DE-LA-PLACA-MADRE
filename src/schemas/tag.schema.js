const Joi = require('joi')

const schemaTag = Joi.object({
    tagName: Joi.string().min(1).max(255).required().messages({
        'string.base': 'El nombre del tag debe ser un string',
        'string.empty': 'El nombre del tag no puede estar vacío',
        'string.min': 'El nombre del tag no puede estar vacío',
        'string.max': 'El nombre del tag no puede exceder los 255 caracteres',
        'any.required': 'El nombre del tag es requerido',
    }),
})

module.exports = { schemaTag }
