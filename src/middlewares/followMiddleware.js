const mongoose = require('mongoose');
const User = require('../db/models/User');

const validateFollow = async (req, res, next) => {
    try {
        const { idFollower, idFollowing } = req.params;

        if (!mongoose.Types.ObjectId.isValid(idFollower) || !mongoose.Types.ObjectId.isValid(idFollowing)) {
            return res.status(400).json({ error: 'Los IDs provistos deben ser identificadores validos de MongoDB (ObjectId)' });
        }

        if (idFollower === idFollowing) {
            return res.status(400).json({ error: 'Un usuario no puede seguirse a sí mismo' });
        }

        const follower = await User.findById(idFollower);
        const following = await User.findById(idFollowing);

        if (!follower || !following) {
            return res.status(404).json({ error: 'Uno o ambos usuarios no existen' });
        }

        req.followerInstance = follower; // Guardamos las instancias de los usuarios en el objeto req para usarlas luego en el controlador
        req.followingInstance = following;

        next();
    } catch (error) {
        console.error('Error en validateFollow:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
}

const validateUnfollow = async (req, res, next) => {
    try {
        const { idFollower, idFollowing } = req.params;

        if (!mongoose.Types.ObjectId.isValid(idFollower) || !mongoose.Types.ObjectId.isValid(idFollowing)) {
            return res.status(400).json({ error: 'Los IDs provistos deben ser identificadores validos de MongoDB (ObjectId)' });
        }

        const follower = await User.findById(idFollower);
        const following = await User.findById(idFollowing);
        if (!follower || !following) {
            return res.status(404).json({ error: 'Uno o ambos usuarios no existen' });
        }

        req.followerInstance = follower;
        req.followingInstance = following;

        next();
    } catch (error) {
        console.error('Error en validateUnfollow:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
}


module.exports = { validateFollow, validateUnfollow }