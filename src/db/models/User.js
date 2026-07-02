const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nickName: {
        type: String,
        unique: true,
        required: [true, 'El nickName es obligatorio'],
        trim: true,
        maxlength: [20, 'El nickName no puede superar los 20 caracteres']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [12, 'El nombre no puede superar los 12 caracteres']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        maxlength: [12, 'El apellido no puede superar los 12 caracteres']
    },
    
    fotoPerfil: {
        type: String,
        default: null
    },

    // SEGUIDORES (Bonus): Array de IDs que apuntan a la misma colección User
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // SEGUIDOS (Bonus): Array de IDs que apuntan a la misma colección User
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

    }, {
    timestamps: true, 
    versionKey: false
});

// --- NORMALIZACIÓN DE FORMATO PARA EL FRONTEND ---
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        // Mapea el _id interno de Mongo al idUser que espera tu controlador y frontend
        ret.idUser = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('User', UserSchema);