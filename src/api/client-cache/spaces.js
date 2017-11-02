const {SpacesInstance, refreshToken, fetchAllPages} = require('../client/cf_client')
const Spaces = SpacesInstance()
const {cache} = require('../static-cache')
const _ = require('underscore')
const Promise = require('bluebird')
let filter = { 'results-per-page': 100, 'page': 1 }
const moment = require('moment')
var async = require('asyncawait/async')
var awaits = require('asyncawait/await')
const {log} = require('../../../log_conf')
const dateFmt = 'MMMM Do YYYY, h:mm:ss a'

const refreshAndSetCache = async(() => {
  let theSpaces = []
  log.info(`refreshing spaces-cache:${moment().format(dateFmt)}`)
  filter.page = 1
  const instanceWithToken = awaits(refreshToken(Spaces))
  const initialSpaces = awaits(instanceWithToken.getSpaces(filter))
  theSpaces = theSpaces.concat(initialSpaces.resources)
  const totalSpaces = initialSpaces.total_results
  const totalPages = initialSpaces.total_pages

  if (totalPages > 1) {
    const remainingSpaces = awaits(fetchAllPages(instanceWithToken, 'getSpaces', totalPages, filter))
    log.debug('More spaces returned', remainingSpaces.length)
    theSpaces = _.flatten(theSpaces.concat(remainingSpaces))
    log.info(`Spaces-Returned:${theSpaces.length}`)
    if (theSpaces.length !== totalSpaces) {
      throw new Error(`Error while retrieving spaces. ${theSpaces.length}/${totalSpaces} being returned`)
    }
  }
  const now = moment().format(dateFmt)
  cache.set(self.cacheKey, {all: theSpaces, updated: now})

  log.info(`spaces-cache updated time: ${cache.get(self.cacheKey).updated}`)
  return Promise.resolve(true)
})

var self = module.exports = {}

module.exports.cacheKey = 'spaces'

module.exports.getSpaces = async((initialize) => {
  try {
    if (initialize) {
      log.info('initializing spaces-cache')
      awaits((refreshAndSetCache())) // Load first time
      setInterval(refreshAndSetCache, 180000) // Initialize automatic refresh
      return Promise.resolve(cache.get(self.cacheKey))
    } else if (!initialize && cache.get(self.cacheKey)) {
      log.info('return spaces from cache')
      return Promise.resolve(cache.get(self.cacheKey))
    } else throw new Error('You should never get here.')
  } catch (e) {
    console.error(e)
    throw e
  }
})

/* Doesnt use cache */
module.exports.getSpace = (guid) => {
  return refreshToken(Spaces).then((Spaces) => {
    return Spaces.getSpace(guid).then((getSpaceRes) => {
      return Promise.resolve(getSpaceRes)
    })
  })
}

module.exports.getSpaceSummary = (guid) => {
  return refreshToken(Spaces).then((Spaces) => {
    return Spaces.getSummary(guid).then((getSpaceRes) => {
      return Promise.resolve(getSpaceRes)
    })
  })
}

module.exports.getSpaceApps = (guid) => {
  return refreshToken(Spaces).then((Spaces) => {
    return Spaces.getSpaceApps(guid).then((getSpaceRes) => {
      return Promise.resolve(getSpaceRes)
    })
  })
}
