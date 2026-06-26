const { descargarImagen } = require('../services/postimages.services');

const processAndSaveImage = async (url, prefix = '') => {
    const nombreArchivo = Date.now() + prefix + '-' + Math.random() + '.jpg';
    await descargarImagen(url, nombreArchivo);
    const imagenNueva = `/images/${nombreArchivo}`
    
    return imagenNueva
};

module.exports = processAndSaveImage;