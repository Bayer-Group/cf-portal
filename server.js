var config = require('./config/index.js')

var path = require('path')
var express = require('express')
const routes = require('./src/api/routes')
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.build.port

var app = express()

app.use('/rest', routes)

// Put all server routes before here
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

/* Init caches here */
const cfCache = require('./src/api/client-cache/aggregrate')

// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
console.log('StaticPath:', staticPath)

app.use(staticPath, express.static(path.join(__dirname, '/dist/static')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

var server = app.listen(port, () => {
  cfCache.initialize()
})

console.info('server started on port %s', port)

module.exports = server
