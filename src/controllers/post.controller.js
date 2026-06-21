const postRepository = require('../repositories/post.repository');
const appCache = require('../services/cache.service');
const { descargarImagen, eliminarImagen } = require('../services/postimages.services');

// --- CONTROLADORES DE POSTS ---
const getAllPosts = async (req, res) => {
    try {
        const cacheKey = 'all_posts_key';
        const cachedPosts = appCache.get(cacheKey);

        if (cachedPosts) {
        console.log('[Cache Hit]: Sirviendo los posts desde la memoria RAM');
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cachedPosts);
        }

        console.log('[Cache Miss]: Consultando a la base de datos de MongoDB...');
        const posts = await postRepository.obtenerTodos();

        appCache.set(cacheKey, posts);
        res.set('X-Cache', 'MISS');
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "error del Servidor" });
    }
    };

    const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const cacheKey = `post_${postId}`;
        const cachedPost = appCache.get(cacheKey);

        if (cachedPost) {
        console.log(`[Cache Hit]: Sirviendo el post ${postId} desde la memoria RAM`);
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cachedPost);
        }

        console.log(`[Cache Miss]: Consultando a la base de datos por el post ${postId}...`);
        const post = await postRepository.obtainerPorId(postId);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });

        appCache.set(cacheKey, post);
        res.set('X-Cache', 'MISS');
        return res.status(200).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const postNewPost = async (req, res) => {
    try {
        const post = await postRepository.crear(req.body);
        appCache.del('all_posts_key');
        console.log('[Cache Cleaned]: Se borró la caché de posts por nueva publicación');
        return res.status(201).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const putPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postRepository.actualizar(id, req.body);

        appCache.del('all_posts_key');
        appCache.del(`post_${id}`);
        console.log(`[Cache Cleaned]: Se borró la caché de posts y del post ${id} por actualización`);
        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postRepository.obtenerPorId(id);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });

        // Eliminamos del disco local los archivos asociados antes de borrar el post
        if (post.images && post.images.length > 0) {
        for (const img of post.images) {
            await eliminarImagen(img.url);
        }
        }

        await postRepository.eliminar(id);

        appCache.del('all_posts_key');
        appCache.del(`post_${id}`);
        console.log(`[Cache Cleaned]: Se borró la caché de posts y del post ${id} por eliminación`);
        return res.status(200).json({ message: `el post fue eliminado` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error de servidor" });
    }
    };

    // --- CONTROLADORES DE IMÁGENES ---

    const getAllImages = async (req, res) => {
    try {
        const post = await postRepository.obtenerPorId(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });
        return res.status(200).json(post.images || []);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const getImageById = async (req, res) => {
    try {
        const post = await postRepository.obtenerPorId(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });
        
        const image = post.images.find(img => img._id.toString() === req.params.imageId);
        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
        
        return res.status(200).json(image);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const postImages = async (req, res) => {
    try {
        const { postId } = req.params;
        const { urlImages } = req.body;
        const newImages = [];

        for (const url of urlImages) {
        const nombreArchivo = Date.now() + '-' + Math.random() + '.jpg';
        await descargarImagen(url, nombreArchivo);
        newImages.push({ url: `/images/${nombreArchivo}` });
        }

        await postRepository.agregarImagenes(postId, newImages);
        await postRepository.actualizarFechaPost(postId);

        appCache.del('all_posts_key');
        appCache.del(`post_${postId}`);
        console.log(`[Cache Cleaned]: Se borró la caché del post ${postId} por agregar imágenes`);

        return res.status(201).json({ message: 'Fotos agregadas correctamente' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: 'Error del servidor' });
    }
    };

    const putImages = async (req, res) => {
    try {
        const { postId, imageId } = req.params;
        const post = await postRepository.obtenerPorId(postId);
        const image = post?.images.find(img => img._id.toString() === imageId);
        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });

        const urlVieja = image.url;
        const url = req.body.urlImages[0];
        const nombreArchivo = Date.now() + 'mod-' + Math.random() + '.jpg';

        await descargarImagen(url, nombreArchivo);
        await postRepository.actualizarUrlImagen(postId, imageId, `/images/${nombreArchivo}`);
        await eliminarImagen(urlVieja);
        await postRepository.actualizarFechaPost(postId);

        appCache.del('all_posts_key');
        appCache.del(`post_${postId}`);

        return res.status(200).json({ message: "se modifico la imagen" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: 'Error del servidor' });
    }
    };

    const deleteImage = async (req, res) => {
    try {
        const { postId, imageId } = req.params;
        const post = await postRepository.obtenerPorId(postId);
        const image = post?.images.find(img => img._id.toString() === imageId);
        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });

        await postRepository.eliminarImagen(postId, imageId);
        await eliminarImagen(image.url);
        await postRepository.actualizarFechaPost(postId);

        appCache.del('all_posts_key');
        appCache.del(`post_${postId}`);
        console.log(`[Cache Cleaned]: Se borró la caché del post ${postId} por eliminar una imagen`);
        return res.status(200).json({ message: 'Foto eliminada con éxito' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: 'Error del servidor' });
    }
    };

    const deleteAllImages = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postRepository.obtenerPorId(postId);
        if (!post || post.images.length === 0) return res.status(404).json({ message: "el post no tiene imagenes" });

        for (const image of post.images) {
        await eliminarImagen(image.url);
        }

        await postRepository.eliminarTodasLasImagenes(postId);
        await postRepository.actualizarFechaPost(postId);

        appCache.del(`post_${postId}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Se borró la caché del post ${postId} por eliminar todas las imágenes`);
        return res.status(200).json({ message: 'Todas las fotos del posteo fueron eliminadas' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: 'Error del servidor' });
    }
    };

    // --- CONTROLADORES DE TAGS ---

    const addTag = async (req, res) => {
    try {
        const { postId } = req.params;
        const { tagName } = req.body;

        const yaTieneTag = await postRepository.verificarSiTieneTag(postId, tagName);
        if (yaTieneTag) {
        return res.status(200).json({ message: 'El post ya tiene este tag' });
        }

        await postRepository.agregarTag(postId, tagName);
        await postRepository.actualizarFechaPost(postId);

        appCache.del(`post_${postId}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Se borró la caché del post ${postId} por agregar un tag`);

        return res.status(201).json({ message: 'Tag agregado al post', tag: { nombre: tagName } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const getAllTagsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postRepository.obtenerPorId(postId);
        return res.status(200).json(post?.tags || []);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const unlinkTag = async (req, res) => {
    try {
        const { postId, tagName } = req.params;

        const tieneTag = await postRepository.verificarSiTieneTag(postId, tagName);
        if (!tieneTag) {
        return res.status(409).json({ error: 'El tag no está vinculado a este post' });
        }

        await postRepository.removerTag(postId, tagName);
        await postRepository.actualizarFechaPost(postId);

        appCache.del(`post_${postId}`);
        appCache.del('all_posts_key');
        console.log(`[Cache Cleaned]: Se borró la caché del post ${postId} por eliminar un tag`);

        return res.status(200).json({ message: 'Tag desvinculado del post', tagRemoved: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    module.exports = {
    getPostById, getAllImages, getImageById, postImages, putImages, deleteImage, deleteAllImages,
    getAllPosts, postNewPost, putPost, deletePost,
    addTag, getAllTagsByPostId, unlinkTag
};