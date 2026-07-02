const mongoose = require('mongoose');

const PostImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria']
    }
    }, { 
    timestamps: true // Te da createdAt y updatedAt individuales para cada foto si lo necesitan
});

// Esquema principal de la Publicación
const PostSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Mantiene la referencia relacional al usuario creador
        required: [true, 'El ID del usuario creador es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la publicación es obligatoria']
    },
    
    //  IMÁGENES EMBEBIDAS: Array de objetos usando el subesquema
    images: [PostImageSchema],
    
    // TAGS EMBEBIDOS: Al ser NoSQL, un simple array de strings es óptimo para los tags del post
    tags: [{
        type: String,
        trim: true
    }]

    }, {
    timestamps: true, // MongoDB maneja automáticamente createdAt y updatedAt sin necesidad de ganchos (hooks) manuales
    versionKey: false // Quita el campo __v interno que genera Mongoose por defecto
});

    // --- NORMALIZACIÓN DE FORMATO PARA EL FRONTEND ---
    // Esto emula el comportamiento de Sequelize mapeando el _id de Mongo a idPost automáticamente al enviar JSONs
    PostSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.idPost = ret._id;
        
        // Mapeamos también los _id internos de las imágenes si el front los espera como idPostImage
        if (ret.images) {
        ret.images = ret.images.map(img => ({
            idPostImage: img._id,
            url: img.url
        }));
        }

        if (doc.Comments) {
            ret.Comments = doc.Comments;
        } else if (ret.Comments === undefined) {
            ret.Comments = []; // 
        }
        
        delete ret._id;
    }
});

module.exports = mongoose.model('Post', PostSchema);