const { eliminarImagen } = require('../services/postimages.services');

const deleteMultipleImages = async (images) => {
    for (const image of images) {
        await eliminarImagen(image.url);
    }
};

module.exports = deleteMultipleImages;