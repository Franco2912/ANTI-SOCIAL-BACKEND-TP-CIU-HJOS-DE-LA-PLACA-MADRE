const Comment = require('../db/models/Comment');
const Post = require('../db/models/Post');
const User = require('../db/models/User');

class CommentRepository {
  // Simula el actualizarFechaPost_ que usabas en SQLite
    async actualizarFechaPost(postId) {
        return await Post.findByIdAndUpdate(
        postId, 
        { updatedAt: new Date() }, 
        { new: true }
        );
    }

    async verificarUsuario(userId) {
        return await User.findById(userId);
    }

    async obtenerPorPost(postId) {
        // Regla de negocio de los X meses configurables por .env
        const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

        return await Comment.find({
        idPost: postId,
        createdAt: { $gte: fechaLimite } // Trae solo los más nuevos que la fecha límite
        })
        .populate('idUser', 'idUser nickName') // Popula simulando los attributes del TP1
        .sort({ createdAt: -1 })
        .lean(); // Reemplaza al order: [['createdAt', 'DESC']]
    }

    async crear(idPost, idUser, contenido) {
        return await Comment.create({ idPost, idUser, contenido });
    }

    async actualizar(commentId, contenido) {
        return await Comment.findByIdAndUpdate(
        commentId, 
        { contenido }, 
        { new: true }
        );
    }

    async eliminar(commentId) {
        return await Comment.findByIdAndDelete(commentId);
    }

    // Elimina comentarios en posts específicos
    async eliminarPorPosts(postIds) {
        return await Comment.deleteMany({ idPost: { $in: postIds } });
    }

    // Elimina comentarios creados por un usuario
    async eliminarPorUsuario(userId) {
        return await Comment.deleteMany({ idUser: userId });
    }
}

module.exports = new CommentRepository();