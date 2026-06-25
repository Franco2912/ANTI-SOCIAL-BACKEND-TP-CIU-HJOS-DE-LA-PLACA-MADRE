const tagRepository = require('../repositories/tag.repository');
const { setCache } = require('../services/redis.service');
const asyncHandler = require('../middlewares/asyncHandler');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getAllTags = asyncHandler(
    async (req, res) => {
    
        const nombreQuery = req.query.nombre ?? req.query.name;

        let page = Number.parseInt(req.query.page, 10);
        let limit = Number.parseInt(req.query.limit, 10);

        if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
        if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
        limit = Math.min(limit, MAX_LIMIT);

        
        const { data, total } = await tagRepository.obtenerTodosPaginados({
        nombre: nombreQuery,
        page,
        limit
        });

        const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

        const response = {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            },
        };

        setCache(req.cacheKey, response).catch(console.error);

        return res.status(200).json(response);
    
    }
);

    module.exports = {
    getAllTags,
};
