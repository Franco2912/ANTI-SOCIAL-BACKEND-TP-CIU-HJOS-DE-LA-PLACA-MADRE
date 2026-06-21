const genericSchemaValidator = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false }) 
    return { error, value }
}

const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error, value } = genericSchemaValidator(schema, req.body)

        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return res.status(400).json({ errors: errorMessages })
        }

        req.body = value
        next()
    }
}

module.exports = genericSchemaValidator 
module.exports.validateSchema = validateSchema 
