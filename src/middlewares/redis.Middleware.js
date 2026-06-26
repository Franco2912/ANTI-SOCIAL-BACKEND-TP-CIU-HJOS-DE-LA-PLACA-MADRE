const {getCache, delCache} = require("../services/redis.service");

// funcion generica para consultar por todas las entidades en el cache
const checkCache = (keyBuilder) => {

  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);
      

      const data = await getCache(key);

      if (data) {
        console.log(`[Cache Hit] ${key}`);
        return res.status(200).json(data);  
      }

      console.log(`[Cache Miss] ${key}`);

      // Guardo la key para que el controller la reutilice
      req.cacheKey = key;      

      next();
    } catch (error) {
      next(error);
    }
  };
};

const deleteCache = (keyBuilder) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);
      await delCache(key);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkCache,
  deleteCache
};
