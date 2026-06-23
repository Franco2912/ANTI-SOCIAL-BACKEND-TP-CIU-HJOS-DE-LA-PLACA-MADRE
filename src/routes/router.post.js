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

// Obtener todos los posts
router.get('/posts', getAllPosts)

// Obtener un post por id
router.get('/post/:postId', validateExistsModel(Post, 'postId'), getPostById)

// Crear un nuevo post 
router.post('/post', schemaValidator(schemaPost), postNewPost)

// Actualizar un post
router.put('/post/:id', schemaValidator(schemaPost), validateExistsModel(Post), putPost)

// Eliminar un post
router.delete('/post/:id', validateExistsModel(Post), deletePost)


// ------------------ RUTAS DE IMÁGENES ------------------

// Obtener todas las imágenes de un post
router.get('/post/:postId/images', validateExistsModel(Post, 'postId'), getAllImages)

// Obtiene una imagen específica del post
router.get('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), getImageById)

// Agregar imágenes al post
router.post('/post/:postId/images', validateExistsModel(Post, 'postId'), postImages)

router.put('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), validatePutImage, putImages)

// Borra una imagen del post por id
router.delete('/post/:postId/image/:imageId', validateExistsModel(Post, 'postId'), deleteImage)

// Borra todas las imágenes de un post
router.delete('/post/:postId/images', validateExistsModel(Post, 'postId'), deleteAllImages)


// ------------------ RUTAS DE TAGS ------------------

// Obtener todos los tags de un post
router.get('/posts/:postId/tags', validateExistsModel(Post, 'postId'), getAllTagsByPostId)

// Agregar un tag al post 
router.post('/posts/:postId/tags', validateExistsModel(Post, 'postId'), sanitizeTagName, addTag)

// Eliminar un tag del post
router.delete('/posts/:postId/tags/:tagName', validateExistsModel(Post, 'postId'), sanitizeTagName, validarTagByName, unlinkTag)

module.exports = router