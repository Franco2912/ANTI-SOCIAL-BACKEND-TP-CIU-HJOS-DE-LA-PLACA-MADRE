const { Router } = require('express')
const router = Router()

const Post  = require('../db/models/Post')
const {
    getPostById,
    getAllPosts,
    postNewPost,
    putPost,
    deletePost,
    getAllImages,
    getImageById,
    postImages,   
    putImages,
    deleteImage,
    deleteAllImages,
    addTag,
    getAllTagsByPostId,
    unlinkTag,
} = require('../controllers/post.controllers')

const { validateExistsModel, validarTagByName } = require('../middlewares/genericMiddleware')
const { validatePutImage } = require('../middlewares/validateImage')
const { sanitizeTagName } = require('../middlewares/tagMiddleware')
const schemaValidator = require('../middlewares/schemaValidator')
const { schemaPost } = require('../schemas/postSchema')
const {checkCache, deleteCache} = require('../middlewares/redis.Middleware')

/* ayuda tecnica de que hace cada middleware de redis:

    checkCache(() => 'posts'): guarda en el cache una lista con todos los posts
    checkCache(req => `post_${req.params.postId}`) : guarda el post por el cual se esta consultando en el cache
    deleteCache( () => 'posts' ) = borra la lista con todos los posts del cache
    deleteCache(req => `post_${req.params.id}`) = borra del cache el post que se modifica o elimina

    checkCache( req => `images_${req.params.postId}`) = guarda en el cache una lista de todas las fotos del post consultado
    deleteCache(req => `images_${req.params.postId}`) = borra la lista de fotos del post del cual se va a cambiar o borrar una o todas las fotos
    


*/
// Obtener todos los posts
router.get('/posts', checkCache(() => 'posts'), getAllPosts)

// Obtener un post por id
router.get('/post/:postId', validateExistsModel(Post, 'postId'), checkCache(req => `post_${req.params.postId}`), getPostById)

// Crear un nuevo post 
router.post('/post', schemaValidator(schemaPost), deleteCache( () => 'posts' ) ,postNewPost)

// Actualizar un post
router.put('/post/:id', schemaValidator(schemaPost), validateExistsModel(Post), deleteCache( () => 'posts' ),  deleteCache(req => `post_${req.params.id}`), putPost)

// Eliminar un post
router.delete('/post/:id', validateExistsModel(Post), deleteCache( () => 'posts' ),  deleteCache(req => `post_${req.params.id}`),  deletePost)


// ------------------ RUTAS DE IMÁGENES ------------------

// Obtener todas las imágenes de un post
router.get('/post/:postId/images', validateExistsModel(Post, 'postId'), checkCache( req => `images_${req.params.postId}`) ,getAllImages)

// Obtiene una imagen específica del post
router.get('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), getImageById)

// Agregar imágenes al post
router.post('/post/:postId/images', validateExistsModel(Post, 'postId'),deleteCache(req => `images_${req.params.postId}`), deleteCache(req => `post_${req.params.postId}`), deleteCache( () => 'posts' ), postImages)

// modificar una imagen
router.put('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), deleteCache(req => `images_${req.params.postId}`), deleteCache(req => `post_${req.params.postId}`), deleteCache( () => 'posts' ) , validatePutImage, putImages)

// Borra una imagen del post por id
router.delete('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), deleteCache(req => `images_${req.params.postId}`), deleteCache(req => `post_${req.params.postId}`), deleteCache( () => 'posts' ) , deleteImage)

// Borra todas las imágenes de un post
router.delete('/post/:postId/images', validateExistsModel(Post, 'postId'), deleteCache(req => `images_${req.params.postId}`), deleteCache(req => `post_${req.params.postId}`), deleteCache( () => 'posts' ) ,  deleteAllImages)


// ------------------ RUTAS DE TAGS ------------------

// Obtener todos los tags de un post
router.get('/posts/:postId/tags', validateExistsModel(Post, 'postId'), getAllTagsByPostId)

// Agregar un tag al post 
router.post('/posts/:postId/tags', validateExistsModel(Post, 'postId'), sanitizeTagName, addTag)

// Eliminar un tag del post
router.delete('/posts/:postId/tags/:tagName', validateExistsModel(Post, 'postId'), sanitizeTagName, validarTagByName, unlinkTag)

module.exports = router