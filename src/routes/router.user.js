const {Router} = require('express')

const {getAllUsers, getUserById, getPostsByUserId, postUser, putUser, deleteUser, getUserProfileById, followUser, unfollowUser} = require('../controllers/user.controller')

const { validateExistsModel} = require('../middlewares/genericMiddleware')
const { validateSchema } = require('../schemas/genericSchemaValidator')
const { validateFollow, validateUnfollow } = require('../middlewares/followMiddleware')
const { checkCache, deleteCache } = require('../middlewares/redis.Middleware')
const upload = require('../middlewares/upload');

const { schemaUser } = require('../schemas/user.schema')

const User = require('../db/models/User')

const router = Router()

router.get('/usuarios', checkCache(() => 'usuarios'), getAllUsers)
router.get('/usuario/:id', validateExistsModel(User), checkCache(req => `usuario_${req.params.id}`), getUserById)
router.get('/usuario/:id/posts', validateExistsModel(User), checkCache(req => `usuario_posts_${req.params.id}`), getPostsByUserId)

router.post('/usuario', validateSchema(schemaUser), deleteCache(() => 'usuarios'), postUser)

router.put('/usuario/:id', validateSchema(schemaUser), validateExistsModel(User), deleteCache(() => 'usuarios'), deleteCache(req => `usuario_${req.params.id}`), upload.single('fotoPerfil'),putUser)

router.delete('/usuario/:id', validateExistsModel(User), deleteCache(() => 'usuarios'), deleteCache(req => `usuario_${req.params.id}`), deleteUser)


// extra follows

router.get('/usuario/:id/profile', validateExistsModel(User), checkCache(req => `usuario_profile_${req.params.id}`), getUserProfileById)

router.post('/usuario/:idFollower/follow/:idFollowing', validateFollow, deleteCache(req => `usuario_profile_${req.params.idFollower}`), deleteCache(req => `usuario_profile_${req.params.idFollowing}`), followUser);
router.post('/usuario/:idFollower/unfollow/:idFollowing', validateUnfollow, deleteCache(req => `usuario_profile_${req.params.idFollower}`), deleteCache(req => `usuario_profile_${req.params.idFollowing}`), unfollowUser);

module.exports = router
