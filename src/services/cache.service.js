const NodeCache = require('node-cache');
// stdTTL: 120 significa que por defecto los datos duran 120 segundos guardados.
// checkperiod: 240 significa que cada 4 minutos limpia lo que expiró para liberar RAM.
const appCache = new NodeCache({ stdTTL: 120, checkperiod: 240 });

module.exports = appCache;