const postRepository = require('../repositories/post.repository');
const { descargarImagen, eliminarImagen } = require('../services/postimages.services');
const {setCache} = require ('../services/redis.service');

// --- CONTROLADORES DE POSTS ---
const getAllPosts = async (req, res) => {
    try {
        const posts = await postRepository.obtenerTodos();

        setCache(req.cacheKey, posts).catch(console.error) 

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "error del Servidor" });
    }
    };

    const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;      


        
        const post = await postRepository.obtenerPorId(postId);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });
       
        setCache(req.cacheKey, post).catch(console.error)
        
        return res.status(200).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const postNewPost = async (req, res) => {
    try {
        const post = await postRepository.crear(req.body);
        
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
        
        // guardamos la lista de imagenes en el cache
        setCache(req.cacheKey, post.images).catch(console.error);

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
        const tags = post?.tags || [];
        setCache(req.cacheKey, tags).catch(console.error);
        return res.status(200).json(tags);
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
