const {cf_api} = require('../env/default_bindings')
const _ = require('underscore')
const endpoint = cf_api.url
const password = cf_api.password
const username = cf_api.username
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 589, checkperiod: 295 })
const cacheKey = 'creds'
const eachOf = require('async/eachOf')
const bbPromise = require('bluebird')
const eachOfProm = bbPromise.promisify(eachOf)
const {log} = require('../../../log_conf')

myCache.on('expired', (k, v) => {
  log.info(Date.now())
  log.info(`${k} has expired`)
})
var self = module.exports = {}

module.exports.endpoint = endpoint

module.exports.refreshToken = (Instance) => {
  if (myCache.get(cacheKey)) {
    log.info('Founds creds in cache')
    Instance.setToken(myCache.get(cacheKey))
    return Promise.resolve(Instance)
  } else { // let's set it
    return self._getToken().then((creds) => {
      log.info(Date.now())
      log.info('retrieved new token')
      myCache.set(cacheKey, creds)
      Instance.setToken(myCache.get(cacheKey))
      return Promise.resolve(Instance)
    })
  }
}

module.exports.getToken = () => {
  if (myCache.get(cacheKey)) {
    log.info('Founds creds in cache')
    return Promise.resolve(myCache.get(cacheKey))
  } else { // let's set it
    return self._getToken().then((creds) => {
      log.info(Date.now())
      log.info('retrieved new token')
      myCache.set(cacheKey, creds)
      return Promise.resolve(myCache.get(cacheKey))
    }).catch((err) => {
      console.error(err)
      throw err
    })
  }
}
module.exports._getToken = () => {
  const CloudController = new (require('cf-client')).CloudController(endpoint)
  const UsersUAA = new (require('cf-client')).UsersUAA()
  return CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint)
    log.info('got info')
    return UsersUAA.login(username, password)
  })
}

function DelayPromise (delay) {
  // return a function that accepts a single variable
  return function (data) {
    // this function returns a promise.
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // a promise that is resolved after "delay" milliseconds with the data provided
        resolve(data)
      }, delay)
    })
  }
}

/*
  for some reason passing in cfinstance.cfendpoint ( e.g. Spaces.getSpaces) doesnt work
*/
module.exports.fetchAllPages = (cfinstance, cfendpoint, totalPages, filter) => {
  console.info(JSON.stringify(filter, null, 2))
  log.info('getting remaining pages')
  filter.page = 2
  const gatheredResults = []
  const counter = Array(totalPages).fill().map((_, i) => i + 1)
  counter.shift() // We already have page 1
  return eachOfProm(counter, (value, key, callback) => {
    filter.page = value
    // return cfinstance[cfendpoint](filter).then((endpointRes) => {
    return cfinstance[cfendpoint](filter).then(DelayPromise(100)).then((endpointRes) => {
      gatheredResults.push(endpointRes.resources)
      return callback(null)
    })
  }).then((someRes) => { return Promise.resolve(_.flatten(gatheredResults)) })
}

module.exports.AppsInstance = () => { return new (require('cf-client')).Apps(self.endpoint) }

module.exports.OrgsInstance = () => { return new (require('cf-client')).Organizations(self.endpoint) }

module.exports.SpacesInstance = () => { return new (require('cf-client')).Spaces(self.endpoint) }

module.exports.OrganizationsQuota = () => { return new (require('cf-client')).OrganizationsQuota(self.endpoint) }

module.exports.SpacesQuota = () => { return new (require('cf-client')).SpacesQuota(self.endpoint) }

module.exports.LogsInstance = () => { return new (require('cf-client')).Logs(self.endpoint) }

module.exports.EventsInstance = () => { return new (require('cf-client')).Events(self.endpoint) }
