const genericSchemaValidator = require('../schemas/genericSchemaValidator')
const { createCommentSchema, updateCommentSchema } = require('../schemas/commentSchema')

const responderErroresDeValidacion_ = (res, error) => {
    return res.status(400).json({
        error: error.details.map((detail) => {
            return {
                atributo: detail.path[0],
                detalle: detail.message
            }
        })
    })
}

const validarCreateComment = (req, res, next) => {
    const { error, value } = genericSchemaValidator(createCommentSchema, req.body)

    if (error) {
        return responderErroresDeValidacion_(res, error) 
    }

    req.body = value
    next()
}

const validarUpdateComment = (req, res, next) => {
    const { error, value } = genericSchemaValidator(updateCommentSchema, req.body)

    if (error) {
        return responderErroresDeValidacion_(res, error)
    }

    req.body = value
    next()
}

module.exports = {
    validarCreateComment,
    validarUpdateComment
}
