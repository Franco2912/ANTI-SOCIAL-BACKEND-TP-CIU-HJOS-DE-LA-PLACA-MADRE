const Post = require('../db/models/Post');
const Comment = require('../db/models/Comment');

class PostRepository {

    async actualizarFechaPost(postId) {
        return await Post.findByIdAndUpdate(
        postId,
        { updatedAt: new Date() },
        { new: true }
        );
    }

    // Trae todos los posts. Al estar las imágenes y los tags incrustados, 
    // solo necesitamos popular los comentarios asociados.
    async obtenerTodos() {
        const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

        // Buscamos los posts y populamos los comentarios aplicando el filtro de vigencia de meses
        const posts = await Post.find().lean();
        
        for (let post of posts) {
        post.Comments = await Comment.find({
            idPost: post._id,
            createdAt: { $gte: fechaLimite }
        }).sort({ createdAt: -1 });
        
        // Mapeos para consistencia idPost
        post.idPost = post._id;
        }
        return posts;
    }

    async obtenerPorId(postId) {
        const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

        const post = await Post.findById(postId).lean();
        if (!post) return null;

        post.Comments = await Comment.find({
        idPost: postId,
        createdAt: { $gte: fechaLimite }
        }).sort({ createdAt: -1 });

        post.idPost = post._id;
        return post;
    }

    async crear(datosPost) {
        return await Post.create(datosPost);
    }

    async actualizar(postId, datosActualizados) {
        return await Post.findByIdAndUpdate(postId, datosActualizados, { new: true });
    }

    async eliminar(postId) {
        return await Post.findByIdAndDelete(postId);
    }

    // --- MÉTODOS PARA IMÁGENES EMBEBIDAS ---
    async agregarImagenes(postId, nuevasImagenes) {
        return await Post.findByIdAndUpdate(
        postId,
        { $push: { images: { $each: nuevasImagenes } } },
        { new: true }
        );
    }

    async actualizarUrlImagen(postId, imageId, nuevaUrl) {
        return await Post.updateOne(
        { _id: postId, "images._id": imageId },
        { $set: { "images.$.url": nuevaUrl } }
        );
    }

    async eliminarImagen(postId, imageId) {
        return await Post.findByIdAndUpdate(
        postId,
        { $pull: { images: { _id: imageId } } },
        { new: true }
        );
    }

    async eliminarTodasLasImagenes(postId) {
        return await Post.findByIdAndUpdate(
        postId,
        { $set: { images: [] } },
        { new: true }
        );
    }

    // --- MÉTODOS PARA TAGS (Strings en array nativo) ---
    async verificarSiTieneTag(postId, tagName) {
        const post = await Post.findOne({ _id: postId, tags: tagName });
        return !!post;
    }

    async agregarTag(postId, tagName) {
        return await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { tags: tagName } }, // $addToSet evita duplicados de forma nativa
        { new: true }
        );
    }

    async removerTag(postId, tagName) {
        return await Post.findByIdAndUpdate(
        postId,
        { $pull: { tags: tagName } },
        { new: true }
        );
    }
}

module.exports = new PostRepository();