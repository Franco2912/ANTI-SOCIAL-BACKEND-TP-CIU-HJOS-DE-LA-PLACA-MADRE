const Comment = require('../db/models/Comment');
const Post = require('../db/models/Post');
const User = require('../db/models/User');

class CommentRepository {
    // luca: Centraliza la regla de negocio de comentarios recientes para reutilizarla en posts y usuarios.
    calcularFechaLimite() {
        const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);
        return fechaLimite;
    }

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
        const fechaLimite = this.calcularFechaLimite();

        return await Comment.find({
            idPost: postId,
            createdAt: { $gte: fechaLimite } // Trae solo los mas nuevos que la fecha limite
        })
        .populate('idUser', 'idUser nickName') // Popula simulando los attributes del TP1
        .sort({ createdAt: -1 })
        .lean(); // Reemplaza al order: [['createdAt', 'DESC']]
    }

    // luca: Agrega a cada post sus comentarios recientes para mantener la forma de respuesta esperada por el endpoint de usuario.
    async adjuntarComentariosAPosts(posts, fechaLimite) {
        for (const post of posts) {
            post.Comments = await Comment.find({
                idPost: post._id,
                createdAt: { $gte: fechaLimite }
            })
            .populate('idUser', 'idUser nickName')
            .sort({ createdAt: -1 })
            .lean();

            post.idPost = post._id;
        }

        return posts;
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

    // luca: Se usa al borrar un usuario: primero elimina comentarios de todos sus posts.
    async eliminarPorPosts(postIds) {
        return await Comment.deleteMany({ idPost: { $in: postIds } });
    }

    // luca: Luego elimina comentarios hechos por ese usuario en posts de otras personas.
    async eliminarPorUsuario(userId) {
        return await Comment.deleteMany({ idUser: userId });
    }
}

module.exports = new CommentRepository();
