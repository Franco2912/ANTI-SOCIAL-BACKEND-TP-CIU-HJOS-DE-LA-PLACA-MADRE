const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve( fn(req,res,next) ).catch((error) => {
        console.error(error)
        const estado = error.statusCode || 500
        res.status(estado).json({ error: error.message })    
    })
}

module.exports = asyncHandler;