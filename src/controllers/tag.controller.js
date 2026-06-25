const tagRepository = require('../repositories/tag.repository');
const asyncHandler = require('../middlewares/asyncHandler');
const setCacheAndResponseData = require('../utils/setCacheAndResponse')

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


        return setCacheAndResponseData(req, res, response)
    }
);

    module.exports = {
    getAllTags,
};
