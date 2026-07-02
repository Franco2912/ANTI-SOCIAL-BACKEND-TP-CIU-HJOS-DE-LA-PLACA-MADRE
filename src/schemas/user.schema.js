const Joi = require('joi');

// Definimos el esquema de validación para un usuario (POST y PUT)
const schemaUser = Joi.object({
    nickName: Joi.string()
        .alphanum() // Solo letras y números (sin espacios ni caracteres raros)
        .max(20)    // Coincide con el length: 20 de tu base de datos
        .required() // Es allowNull: false, así que es obligatorio
        .messages({
            'string.empty': 'El nickname no puede estar vacío',
            'string.max': 'El nickname no puede superar los 20 caracteres',
            'any.required': 'El nickname es un campo obligatorio'
        }),

    nombre: Joi.string()
        .max(12)    // Coincide con el length: 12 de tu base de datos
        .required()
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.max': 'El nombre no puede superar los 12 caracteres',
            'any.required': 'El nombre es un campo obligatorio'
        }),

    apellido: Joi.string()
        .max(12)    // Coincide con el length: 12 de tu base de datos
        .required()
        .messages({
            'string.empty': 'El apellido no puede estar vacío',
            'string.max': 'El apellido no puede superar los 12 caracteres',
            'any.required': 'El apellido es un campo obligatorio'
        }),
    fotoPerfil: Joi.string().uri().optional()
});

module.exports = { schemaUser };