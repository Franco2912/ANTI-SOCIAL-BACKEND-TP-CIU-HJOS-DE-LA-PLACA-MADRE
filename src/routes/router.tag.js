const { Router } = require('express');
const {
    getAllTags
} = require('../controllers/tag.controller');
const { checkCache } = require('../middlewares/redis.Middleware');
const router = Router();

// Generador de clave dinámica para tags (con filtro y paginación)
const tagsKeyBuilder = (req) => {
  const nombre = req.query.nombre ?? req.query.name;
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 20;
  
  return nombre 
    ? `tags_search_${nombre}_p${page}_l${limit}`
    : `tags_all_p${page}_l${limit}`;
};

router.get('/tags', checkCache(tagsKeyBuilder), getAllTags);

module.exports = router
