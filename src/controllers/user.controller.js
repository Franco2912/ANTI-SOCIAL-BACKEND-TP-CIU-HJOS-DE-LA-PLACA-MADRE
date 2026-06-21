const userRepository = require('../repositories/user.repository');

const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.obtenerTodos();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.obtenerPorId(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const getPostsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const userPosts = await userRepository.obtenerPostsDeUsuario(id);
        return res.status(200).json(userPosts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error  del servidor' });
    }
    };

    const postUser = async (req, res) => {
    try {
        const user = await userRepository.crear(req.body);
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const putUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.actualizar(id, req.body);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userRepository.eliminar(id);
        return res.status(200).json({ message: 'Usuario eliminado de la base de datos' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    // --- CONTROLADORES DEL BONUS (Followers & Following) ---

    const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const userProfile = await userRepository.obtenerPerfilConSeguidores(id);
        if (!userProfile) return res.status(404).json({ error: 'Perfil no encontrado' });
        return res.status(200).json(userProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
    };

    const followUser = async (req, res) => {
    try {
        const { followerInstance, followingInstance } = req;

        await userRepository.seguir(followerInstance, followingInstance);

        return res.status(200).json({ 
        message: '¡Operación de seguimiento procesada con éxito!' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar el follow" });
    }
    };

    const unfollowUser = async (req, res) => {
    try {
        const { followerInstance, followingInstance } = req;

        await userRepository.dejarDeSeguir(followerInstance, followingInstance);

        return res.status(200).json({ message: "Dejaste de seguir a este usuario con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar el unfollow" });
    }
    };

    module.exports = {
    getAllUsers, getUserById, getPostsByUserId, postUser, putUser, deleteUser, 
    getUserProfileById, followUser, unfollowUser
};