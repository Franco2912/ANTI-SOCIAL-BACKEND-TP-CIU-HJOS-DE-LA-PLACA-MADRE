const {Router} = require('express')

const {getAllUsers, getUserById, getPostsByUserId, postUser, putUser, deleteUser, getUserProfileById, followUser, unfollowUser} = require('../controllers/user.controller') //SCRUD

const { validateExistsModel} = require('../middlewares/genericMiddleware')// Middleware para validar que el recurso existe antes de ejecutar el controlador
const { validateSchema } = require('../schemas/genericSchemaValidator')// Middleware para validar el cuerpo de la solicitud con un esquema de Joi
const { validateFollow, validateUnfollow } = require('../middlewares/followMiddleware') // Middleware para validar las operaciones de seguir y dejar de seguir

const { schemaUser } = require('../schemas/user.schema')// Esquema de validación para la creación de un usuario

const { User } = require('../db/models') // Importamos el modelo de User para usarlo en el middleware de validación de existencia

const router = Router()

router.get('/usuarios', getAllUsers)
router.get('/usuario/:id', validateExistsModel(User), getUserById)
router.get('/usuario/:id/posts', validateExistsModel(User), getPostsByUserId)

router.post('/usuario', validateSchema(schemaUser), postUser)

router.put('/usuario/:id', validateSchema(schemaUser), validateExistsModel(User), putUser)

router.delete('/usuario/:id', validateExistsModel(User), deleteUser)

//bonus followers y followings
router.get('/usuario/:id/profile', validateExistsModel(User), getUserProfileById)

router.post('/usuario/:idFollower/follow/:idFollowing', validateFollow, followUser);
router.post('/usuario/:idFollower/unfollow/:idFollowing', validateUnfollow, unfollowUser);

module.exports = router