const userRepository = require('../repositories/user.repository');
const { setCache } = require('../services/redis.service');
const asyncHandler = require('../middlewares/asyncHandler');

const getAllUsers = asyncHandler(
    async (req, res) => {
        const users = await userRepository.obtenerTodos();
    
        setCache(req.cacheKey, users).catch(console.error);
        return res.status(200).json(users);
    }
)

const getUserById = asyncHandler(
    async (req, res) => {
        const { id } = req.params;
        const user = await userRepository.obtenerPorId(id);

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        setCache(req.cacheKey, user).catch(console.error);

        return res.status(200).json(user);
    }
)

const getPostsByUserId = asyncHandler( 
    async (req, res) => {
        const { id } = req.params;
        const userPosts = await userRepository.obtenerPostsDeUsuario(id);

        setCache(req.cacheKey, userPosts).catch(console.error);

        return res.status(200).json(userPosts);    
    }
)

const postUser = asyncHandler(
    async (req, res) => {    
        const user = await userRepository.crear(req.body);
        return res.status(201).json(user);
    }
);

const putUser = asyncHandler(
    async (req, res) => {    
        const { id } = req.params;
        const user = await userRepository.actualizar(id, req.body);
        
        return res.status(200).json(user);
    }
)

const deleteUser = asyncHandler( 
    async (req, res) => {
        const { id } = req.params;

        await userRepository.eliminar(id);

        return res.status(200).json({ message: 'Usuario eliminado de la base de datos' });
    }
);

// --- CONTROLADORES DEL BONUS (Followers & Following) ---

const getUserProfileById = asyncHandler( 
        async (req, res) => {
            const { id } = req.params;
            const userProfile = await userRepository.obtenerPerfilConSeguidores(id);

            if (!userProfile) return res.status(404).json({ error: 'Perfil no encontrado' });

            setCache(req.cacheKey, userProfile).catch(console.error);

            return res.status(200).json(userProfile);
    }
)

const followUser = asyncHandler(    
    async (req, res) => {    
        const { followerInstance, followingInstance } = req;

        await userRepository.seguir(followerInstance, followingInstance);

        return res.status(200).json({message: '¡Operación de seguimiento procesada con éxito!'});
    }
)

const unfollowUser = asyncHandler( 
    async (req, res) => {
    
        const { followerInstance, followingInstance } = req;

        await userRepository.dejarDeSeguir(followerInstance, followingInstance);

        return res.status(200).json({ message: "Dejaste de seguir a este usuario con éxito" });
    }
);

    module.exports = {
    getAllUsers, getUserById, getPostsByUserId, postUser, putUser, deleteUser, 
    getUserProfileById, followUser, unfollowUser
};
