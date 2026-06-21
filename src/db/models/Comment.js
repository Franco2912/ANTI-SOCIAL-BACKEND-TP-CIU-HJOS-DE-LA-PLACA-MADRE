const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'El ID del post asociado es obligatorio']
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario creador es obligatorio']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido del comentario no puede estar vacío']
    }
    }, {
    timestamps: true, // Maneja automáticamente createdAt y updatedAt
    versionKey: false
});

// --- CAMPO VIRTUAL 'visible' ---
CommentSchema.virtual('visible').get(function() {
    const mesesLimite = Number.parseInt(process.env.COMMENT_EXPIRATION_MONTHS) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

    return this.createdAt >= fechaLimite;
});

// --- NORMALIZACIÓN DE FORMATO PARA EL FRONTEND ---
CommentSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.idComment = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Comment', CommentSchema);