const postRepository = require('../repositories/post.repository');

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}  // -> creamos una clase de error personalizado que es hija de la clase error

const findResourceOrFail = async (repository, id, entidad) => {
    const recurso = await repository.obtenerPorId(id);

    if (!recurso) {
        throw new NotFoundError (`${entidad} no encontrado`);
    }
    return recurso;
};

module.exports = { NotFoundError, findResourceOrFail};
