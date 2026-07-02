const userRepository = require('../repositories/user.repository');
const asyncHandler = require('../middlewares/asyncHandler');
const { findResourceOrFail } = require ('../utils/findResourceOrFail')
const setCacheAndResponseData = require('../utils/setCacheAndResponseData')

const getAllUsers = asyncHandler(
    async (req, res) => {

        const users = await userRepository.obtenerTodos();
        
        return setCacheAndResponseData(req, res, users)
    }
)

const getUserById = asyncHandler(
    async (req, res) => {
        const { id } = req.params;
        const user = await findResourceOrFail(userRepository, id, 'Usuario')
        
        return setCacheAndResponseData(req, res, user)       
    }
)

const getPostsByUserId = asyncHandler( 
    async (req, res) => {
        const { id } = req.params;
        const userPosts = await userRepository.obtenerPostsDeUsuario(id);

        return setCacheAndResponseData(req, res, userPosts)
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
        const datosActualizados = req.body;
        if (req.file) {
            // Guardamos la ruta donde se guardó la imagen
            datosActualizados.fotoPerfil = `/uploads/${req.file.filename}`;
        }
        console.log("Datos que se van a guardar en MongoDB:", datosActualizados);

        const user = await userRepository.actualizar(id, datosActualizados);
        return res.status(200).json(user);
    }
)

const deleteUser = asyncHandler( 
    async (req, res) => {
        const { id } = req.params;

        await userRepository.eliminarConDependencias(id);

        return res.status(200).json({ message: 'Usuario eliminado de la base de datos' });
    }
);

// --- CONTROLADORES DEL BONUS (Followers & Following) ---

const getUserProfileById = asyncHandler( 
        async (req, res) => {
            const { id } = req.params;
            const userProfile = await userRepository.obtenerPerfilConSeguidores(id);
            if (!userProfile) return res.status(404).json({ error: 'Perfil no encontrado' }); 

            return setCacheAndResponseData(req, res, userProfile)    
    }
)

const followUser = asyncHandler(    
    async (req, res) => {    
        const { idFollower, idFollowing } = req.params;

        await userRepository.seguir(idFollower, idFollowing);

        return res.status(200).json({message: '¡Operación de seguimiento procesada con éxito!'});
    }
)

const unfollowUser = asyncHandler( 
    async (req, res) => {
    
        const { idFollower, idFollowing } = req.params;

        await userRepository.dejarDeSeguir(idFollower, idFollowing);

        return res.status(200).json({ message: "Dejaste de seguir a este usuario con éxito" });
    }
);

    module.exports = {
    getAllUsers, getUserById, getPostsByUserId, postUser, putUser, deleteUser, 
    getUserProfileById, followUser, unfollowUser
};
