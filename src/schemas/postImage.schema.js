const Joi = require("joi")


const schemaPostImage = Joi.object({
    urlImages: Joi.array()
    .items(
        Joi.string().uri().min(1).max(200).required().messages({
            "string.base" : "Cada URL debe ser un string",
            "string.empty" : "Cada URL no puede estar vacía",
            "string.uri" : "Cada URL debe ser una URL válida",
            "string.min" : "Cada URL no puede estar vacía",
            "string.max" : "Cada URL no puede exceder los 200 caracteres"
        })
    ).required().min(1).max(10).unique().messages({
        "array.unique" : "Las URLs deben ser únicas",
        "array.base" : "Las imagenes a cargar deben estar en un array",
        "array.min" : "Debe cargar al menos una imagen",
        "array.max" : "No puede cargar más de 10 imágenes",
        "any.required" : "Las imágenes son requeridas"
    })
})


module.exports = { schemaPostImage }