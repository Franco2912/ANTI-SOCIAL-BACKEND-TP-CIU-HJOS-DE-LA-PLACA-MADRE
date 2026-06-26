const postRepository = require('../repositories/post.repository');
const { descargarImagen, eliminarImagen } = require('../services/postimages.services');

const asyncHandler = require('../middlewares/asyncHandler');
const { findResourceOrFail } = require ('../utils/findResourceOrFail')
const setCacheAndResponseData = require('../utils/setCacheAndResponseData')
const findInArrayOrFail = require('../utils/findInArrayOrFail')
const processAndSaveImage = require('../utils/processAndSaveImage')
const deleteMultipleImages = require('../utils/deleteMultipleImages')

// --- CONTROLADORES DE POSTS ---
const getAllPosts = asyncHandler( 
    async (req, res) => {
    
        const posts = await postRepository.obtenerTodos();

        return setCacheAndResponseData(req, res, posts)
    }
);

const getPostById = asyncHandler( 
    async (req, res) => {
    
        const { postId } = req.params;              
        
        const post = await findResourceOrFail(postRepository, postId, 'Post')     
        
        return setCacheAndResponseData(req, res, post)       
    }
);

const postNewPost = asyncHandler( 
    async (req, res) => {
    
        const post = await postRepository.crear(req.body);
        
        return res.status(201).json(post);
    
    }
);

const putPost = asyncHandler(
    async (req, res) => {
    
        const { id } = req.params;
        const post = await postRepository.actualizar(id, req.body);

        return res.status(200).json(post);    
    }
);

const deletePost = asyncHandler(
    async (req, res) => {
    
        const { id } = req.params;
        const post = await findResourceOrFail(postRepository, id, 'Post') 
            
        // Eliminamos del disco local las fotos asociadas antes de borrar el post
        if (post.images && post.images.length > 0) {
           await deleteMultipleImages(post.images)
        }

        await postRepository.eliminar(id);
       
        return res.status(200).json({ message: `el post fue eliminado` });    
    }
);

// --- CONTROLADORES DE IMÁGENES ---

const getAllImages = asyncHandler(
    async (req, res) => {
        const id = req.params.postId
        const post = await findResourceOrFail(postRepository, id, 'Post' )
        
        return setCacheAndResponseData(req, res, post.images || [] )             
    }
);

const getImageById = asyncHandler( 
    async (req, res) => {    
        const id = req.params.postId
        const post = await findResourceOrFail(postRepository, id, 'Post') 
                
        const image = findInArrayOrFail(post.images, img => img._id.toString() === req.params.imageId, 'Imagen')             
        
        return setCacheAndResponseData(req, res, image);    
    }
);

const postImages = asyncHandler(
    async (req, res) => {    
        const { postId } = req.params;
        const { urlImages } = req.body;
        const newImages = [];

        for (const url of urlImages) {

        newImages.push({ url: await processAndSaveImage(url) });

        }

        await postRepository.agregarImagenes(postId, newImages);
        await postRepository.actualizarFechaPost(postId); 
    
        return res.status(201).json({ message: 'Fotos agregadas correctamente' });    
    }
);

const putImages = asyncHandler(
    async (req, res) => {
    
        const { postId, imageId } = req.params;
        const post = await findResourceOrFail(postRepository, postId, 'Post')        
        const image = findInArrayOrFail(post?.images, img => img._id.toString() === imageId, 'Imagen')      

        const urlVieja = image.url;
        const url = req.body.urlImages[0];
        const rutaImagen = await processAndSaveImage(url,'mod')
        
        await postRepository.actualizarUrlImagen(postId, imageId, rutaImagen);
        await eliminarImagen(urlVieja);
        await postRepository.actualizarFechaPost(postId);

        return res.status(200).json({ message: "se modifico la imagen" });    
    }
);

const deleteImage = asyncHandler(
    async (req, res) => {
    
        const { postId, imageId } = req.params
        const post = await findResourceOrFail(postRepository, postId, 'Post')
        const image = findInArrayOrFail(post.images,img => img._id.toString() === imageId, 'Imagen')         

        await postRepository.eliminarImagen(postId, imageId)
        await eliminarImagen(image.url)
        await postRepository.actualizarFechaPost(postId)
       
        return res.status(200).json({ message: 'Foto eliminada con éxito' })
    }
);

const deleteAllImages = asyncHandler( 
    async (req, res) => {
        const { postId } = req.params;
        const post = await findResourceOrFail(postRepository, postId, 'Post')      
        
        if (!post || post.images.length === 0) return res.status(404).json({ message: "el post no tiene imagenes" });

        await deleteMultipleImages(post.images)
      
        await postRepository.eliminarTodasLasImagenes(postId);
        await postRepository.actualizarFechaPost(postId);

        return res.status(200).json({ message: 'Todas las fotos del posteo fueron eliminadas' });
    
    }
);

// --- CONTROLADORES DE TAGS ---

    const addTag = asyncHandler( 
        async (req, res) => {
    
        const { postId } = req.params;
        const { tagName } = req.body;
        const yaTieneTag = await postRepository.verificarSiTieneTag(postId, tagName);
        
        if (yaTieneTag) {
        return res.status(200).json({ message: 'El post ya tiene este tag' });
        }

        await postRepository.agregarTag(postId, tagName);
        await postRepository.actualizarFechaPost(postId);
       

        return res.status(201).json({ message: 'Tag agregado al post', tag: { nombre: tagName } });
    
    }
);

const getAllTagsByPostId = asyncHandler(
    async (req, res) => {
    
        const { postId } = req.params;
        const post = await findResourceOrFail(postRepository, postId, 'Post') 
        
        const tags = post?.tags || [];

        return setCacheAndResponseData(req, res, tags)        
    }
);

const unlinkTag = asyncHandler(
    async (req, res) => {
    
        const { postId, tagName } = req.params;

        const tieneTag = await postRepository.verificarSiTieneTag(postId, tagName);
        
        if (!tieneTag) {
        return res.status(409).json({ error: 'El tag no está vinculado a este post' });
        }

        await postRepository.removerTag(postId, tagName);
        await postRepository.actualizarFechaPost(postId);      

        return res.status(200).json({ message: 'Tag desvinculado del post', tagRemoved: false });
    }
);

    module.exports = {
    getPostById, getAllImages, getImageById, postImages, putImages, deleteImage, deleteAllImages,
    getAllPosts, postNewPost, putPost, deletePost,
    addTag, getAllTagsByPostId, unlinkTag
};
