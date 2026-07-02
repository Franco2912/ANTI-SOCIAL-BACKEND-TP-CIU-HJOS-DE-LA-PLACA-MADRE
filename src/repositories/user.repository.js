const User = require('../db/models/User');
const Post = require('../db/models/Post');
const commentRepository = require('./comment.repository');
const { eliminarImagen } = require('../services/postimages.services');

class UserRepository {
    async obtenerTodos() {
        return await User.find().lean();
    }

    async obtenerPorId(id) {
        return await User.findById(id).lean();
    }

    async crear(datosUsuario) {
        return await User.create(datosUsuario);
    }

    async actualizar(id, datosActualizados) {
        return await User.findByIdAndUpdate(id, { $set: datosActualizados }, { new: true });
    }

    async eliminar(id) {
        return await User.findByIdAndDelete(id);
    }

    async eliminarConDependencias(id) {
        const posts = await Post.find({ idUser: id }).select('_id images').lean();
        const postIds = posts.map((post) => post._id);

        await commentRepository.eliminarPorPosts(postIds);
        await Post.deleteMany({ idUser: id });

        await commentRepository.eliminarPorUsuario(id);

        await User.updateMany(
            { $or: [{ followers: id }, { following: id }] },
            { $pull: { followers: id, following: id } }
        );

        // luca: Toma solo las imagenes existentes; algunos posts pueden no tener el array images definido.
        const images = posts.flatMap((post) => post.images || []);
        const deleteImagesPromises = images.map((image) => eliminarImagen(image.url));
        await Promise.allSettled(deleteImagesPromises);

        return await User.findByIdAndDelete(id);
    }

    // Trae las publicaciones creadas por el usuario inyectando sus comentarios correspondientes
    async obtenerPostsDeUsuario(userId) {
        const fechaLimite = commentRepository.calcularFechaLimite();
        const posts = await Post.find({ idUser: userId }).lean();
        return await commentRepository.adjuntarComentariosAPosts(posts, fechaLimite);
    }

    // --- MÉTODOS DEL BONUS (Followers & Following) ---

    async obtenerPerfilConSeguidores(id) {
        return await User.findById(id)
        .select('_id nickName nombre apellido fotoPerfil followers following')
        .populate('followers', 'nickName')
        .populate('following', 'nickName')
        .lean();
    }

    async seguir(followerId, followingId) {
        // Al que sigue (follower) se le agrega en su array 'following' al usuario destino
        await User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } });
        // Al usuario destino (following) se le agrega en su array 'followers' al que lo empezó a seguir
        await User.findByIdAndUpdate(followingId, { $addToSet: { followers: followerId } });
    }

    async dejarDeSeguir(followerId, followingId) {
        // Se remueve de los respectivos arrays usando $pull
        await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
        await User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } });
    }
}

module.exports = new UserRepository();