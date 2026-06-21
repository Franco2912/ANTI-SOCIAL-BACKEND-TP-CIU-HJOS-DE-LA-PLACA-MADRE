const Post = require('../db/models/Post');

class TagRepository {
    async obtenerTodosPaginados({ nombre, page, limit }) {
        const matchStage = {};
        
        // Si viene la query de búsqueda, aplicamos Regex (Equivalente al LIKE de SQL)
        if (nombre && String(nombre).trim() !== '') {
        const trimmed = String(nombre).trim();
        matchStage.tags = { $regex: trimmed, $options: 'i' }; // 'i' para que sea Insensitive (da igual Mayús/Minús)
        }

        const skip = (page - 1) * limit;

        // Usamos el framework de agregaciones de MongoDB para extraer, ordenar y paginar los tags únicos
        const resultado = await Post.aggregate([
        // 1. Descomponemos el array de tags embebido en documentos individuales
        { $unwind: "$tags" },
        // 2. Filtramos por nombre si corresponde
        { $match: matchStage.tags ? { tags: matchStage.tags } : {} },
        // 3. Agrupamos por el nombre del tag para asegurar que sean únicos (Distinct)
        { $group: { _id: "$tags" } },
        // 4. Renombramos la salida para mantener el formato id/nombre del TP1
        { $project: { _id: 0, nombre: "$_id" } },
        // 5. Ordenamos alfabéticamente de forma ascendente
        { $sort: { nombre: 1 } },
        // 6. Facet nos permite contar el total de registros y paginar en una sola consulta
        {
            $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }]
            }
        }
        ]);

        const data = resultado[0]?.data || [];
        const total = resultado[0]?.totalCount[0]?.count || 0;

        return { data, total };
    }
}

module.exports = new TagRepository();