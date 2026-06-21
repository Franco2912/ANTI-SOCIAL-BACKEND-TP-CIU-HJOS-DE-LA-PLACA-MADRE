const User = require('../db/models/User');
const Post = require('../db/models/Post');
const Comment = require('../db/models/Comment');

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
        return await User.findByIdAndUpdate(id, datosActualizados, { new: true });
    }

    async eliminar(id) {
        return await User.findByIdAndDelete(id);
    }

    // Trae las publicaciones creadas por el usuario inyectando sus comentarios correspondientes
    async obtenerPostsDeUsuario(userId) {
        const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

        const posts = await Post.find({ idUser: userId }).lean();

        for (let post of posts) {
        post.Comments = await Comment.find({
            idPost: post._id,
            createdAt: { $gte: fechaLimite }
        }).sort({ createdAt: -1 });

        post.idPost = post._id;
        }
        return posts;
    }

    // --- MÉTODOS DEL BONUS (Followers & Following) ---

    async obtenerPerfilConSeguidores(id) {
        return await User.findById(id)
        .select('nickName nombre apellido followers following')
        .populate('followers', 'nickName') // Transforma los ObjectIds en objetos con nickName
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