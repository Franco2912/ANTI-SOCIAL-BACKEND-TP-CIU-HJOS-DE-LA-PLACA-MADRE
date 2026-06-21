
const schemaValidator = (schema) => {

    return (req,res,next) => {
        const result = schema.validate(req.body, { abortEarly: false, convert: false })
        if(result.error){
            return res.status(400).json({
                error: result.error.details.map(e => {
                    return { atributo: e.path[0], error: e.message}
                })
            })
        }
        next()
    }

    
}

module.exports = schemaValidator