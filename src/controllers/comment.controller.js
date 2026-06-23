const commentRepository = require('../repositories/comment.repository');
const appCache = require('../services/cache.service');

const getCommentsByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const cachekey = `comments_${post_id}`;

        const cachedComments = appCache.get(cachekey);
      /*  if (cachedComments) {
        console.log(`[Cache Hit]: Comentarios para el post con id ${post_id} desde la memoria RAM`);
        return res.status(200).json(cachedComments);
        }
        */
        console.log(`[Cache Miss]: Consultando a la base de datos de MongoDB...`);

        const comments = await commentRepository.obtenerPorPost(post_id);

        appCache.set(cachekey, comments);
        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const postCommentByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { idUser, contenido } = req.body;

        const user = await commentRepository.verificarUsuario(idUser);
        if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await commentRepository.crear(post_id, idUser, contenido);
        await commentRepository.actualizarFechaPost(post_id);

        appCache.del(`comments_${post_id}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Comentario creado para el post con id ${post_id}`);
        
        return res.status(201).json({ message: 'Comentario creado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const putCommentByPost = async (req, res) => {
    try {
        const { post_id, comment_id } = req.params;
        const { contenido } = req.body;

        await commentRepository.actualizar(comment_id, contenido);
        await commentRepository.actualizarFechaPost(post_id);

        appCache.del(`comments_${post_id}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Comentario con id ${comment_id} actualizado`);
        
        return res.status(200).json({ message: 'Comentario actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const deleteCommentByPost = async (req, res) => {
    try {
        const { post_id, comment_id } = req.params;

        await commentRepository.eliminar(comment_id);
        await commentRepository.actualizarFechaPost(post_id);

        appCache.del(`comments_${post_id}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Comentario con id ${comment_id} eliminado`);
        
        return res.status(200).json({ message: 'Comentario eliminado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    module.exports = {
    getCommentsByPost,
    postCommentByPost,
    putCommentByPost,
    deleteCommentByPost
};