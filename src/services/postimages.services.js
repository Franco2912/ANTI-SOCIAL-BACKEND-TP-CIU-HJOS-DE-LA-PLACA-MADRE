const https = require('node:https');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises')
const path = require('node:path');
const { PostImage } = require('../db/models');


const descargarImagen = (url, nombreArchivo) => {

    const rutaNuevaFoto = path.join(
        __dirname, 
        '../../public/images', 
        nombreArchivo);
    
    return new Promise((resolve, reject) => {
        
        const archivo = fs.createWriteStream(rutaNuevaFoto);

        https.get(url, response => {

            response.pipe(archivo);

            archivo.on('finish', () => {
                archivo.close();
                resolve(rutaNuevaFoto);
            });

        }).on('error', err => {

            fs.unlink(rutaNuevaFoto, () => {});
            reject(err);

        })
    })
}

const eliminarImagen = async (urlImagen) =>{
    
    const rutaDeImagen = path.join(
        __dirname,
        '../../public',
        urlImagen
    )

    await fsPromises.unlink(rutaDeImagen)
}

const eliminarTodasLasImagenesDePostId = async (postId) => {

    const images = await PostImage.findAll({
        where:{
            idPost : postId
        }
    })

    for (const img of images){
        await eliminarImagen(img.url)
    }

}

module.exports = {
    descargarImagen, eliminarImagen, eliminarTodasLasImagenesDePostId
}