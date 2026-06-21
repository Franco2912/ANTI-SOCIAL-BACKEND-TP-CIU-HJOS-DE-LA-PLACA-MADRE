const {Router} = require('express')
const { getCommentsByPost, postCommentByPost, putCommentByPost, deleteCommentByPost } = require('../controllers/comment.controller')
const { validarCreateComment, validarUpdateComment } = require('../middlewares/commentMiddleware')
const { validateExistsModel } = require('../middlewares/genericMiddleware')

const Post = require('../db/models/Post')
const Comment = require('../db/models/Comment')

const router = Router()

// obtiene los comentarios de un post por id
router.get('/post/:post_id/comments', validateExistsModel(Post, 'post_id'), getCommentsByPost)

// agrega un comentario nuevo al post por id
router.post('/post/:post_id/comment', validateExistsModel(Post, 'post_id'), validarCreateComment, postCommentByPost)

// modifica un comentario si pertenece al post indicado
router.put('/post/:post_id/comment/:comment_id', validateExistsModel(Post, 'post_id'), validateExistsModel(Comment, 'comment_id'), validarUpdateComment, putCommentByPost)

// elimina un comentario si pertenece al post indicado
router.delete('/post/:post_id/comment/:comment_id', validateExistsModel(Post, 'post_id'), validateExistsModel(Comment, 'comment_id'), deleteCommentByPost)


module.exports = router