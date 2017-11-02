const NodeCache = require('node-cache')
const staticCache = new NodeCache()

module.exports.cache = staticCache

