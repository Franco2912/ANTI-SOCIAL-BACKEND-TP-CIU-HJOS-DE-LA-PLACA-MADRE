const { NotFoundError } = require('./findResourceOrFail');

const findInArrayOrFail = (array, condicion, entidad) => {
    const elemento = array.find(condicion);
    
    if (!elemento) {
        throw new NotFoundError(`${entidad} no encontrado`);
    }
    return elemento;
};

module.exports = findInArrayOrFail;