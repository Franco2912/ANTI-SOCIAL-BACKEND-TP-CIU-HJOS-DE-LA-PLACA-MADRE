const { setCache } = require('../services/redis.service');

const setCacheAndResponseData = async (req, res, data) => {
    setCache(req.cacheKey, data).catch(console.error)
    return res.status(200).json(data); 
}

module.exports = setCacheAndResponseData;
