const commentRepository = require('../repositories/comment.repository');
const userRepository = require('../repositories/user.repository');

const asyncHandler = require('../middlewares/asyncHandler');
const { findResourceOrFail } = require('../utils/findResourceOrFail');
const setCacheAndResponseData = require('../utils/setCacheAndResponseData')

const getCommentsByPost = asyncHandler( 
    async (req, res) => {
    
        const { post_id } = req.params;             
                   
        const comments = await commentRepository.obtenerPorPost(post_id);      

        return setCacheAndResponseData(req, res, comments)
    }
);

const postCommentByPost = asyncHandler( 
    async (req, res) => {
        const { post_id } = req.params;
        const { idUser, contenido } = req.body;

        const user = await findResourceOrFail( userRepository, idUser, 'Usuario') 
        
        await commentRepository.crear(post_id, idUser, contenido);
        await commentRepository.actualizarFechaPost(post_id);      
        
        return res.status(201).json({ message: 'Comentario creado exitosamente' });
    }
);

const putCommentByPost = asyncHandler(
    async (req, res) => {
    
        const { post_id, comment_id } = req.params;
        const { contenido } = req.body;

        await commentRepository.actualizar(comment_id, contenido);
        await commentRepository.actualizarFechaPost(post_id);      
        
        return res.status(200).json({ message: 'Comentario actualizado exitosamente' });
    }
);

const deleteCommentByPost = asyncHandler(
    async (req, res) => {
        const { post_id, comment_id } = req.params;

        await commentRepository.eliminar(comment_id);
        await commentRepository.actualizarFechaPost(post_id);
               
        return res.status(200).json({ message: 'Comentario eliminado' });
    
    }
);

    module.exports = {
    getCommentsByPost,
    postCommentByPost,
    putCommentByPost,
    deleteCommentByPost
};
