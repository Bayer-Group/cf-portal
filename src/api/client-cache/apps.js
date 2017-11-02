const {AppsInstance, refreshToken, fetchAllPages} = require('../client/cf_client')
const Apps = AppsInstance()
const Promise = require('bluebird')
let filter = { 'results-per-page': 100, 'page': 1 }
const keysNoNo = require('./filtered_keys')
var async = require('asyncawait/async')
var awaits = require('asyncawait/await')
const {cache} = require('../static-cache')
const self = module.exports = {}
const moment = require('moment-timezone')
const {log} = require('../../../log_conf')
const dateFmt = 'MMMM Do YYYY, h:mm:ss a'

const _filterEnvJson = (apps) => {
  if (Array.isArray(apps)) {
    return apps.map((item) => {
      keysNoNo.forEach((theKey) => { delete item.entity[theKey] })
      return item
    })
  } else {
    keysNoNo.forEach((theKey) => {
      if (apps.entity) delete apps.entity[theKey]
      else delete apps[theKey]
    })
    return apps
  }
}

const refreshAndSetCache = async(() => {
  log.info(`getting new apps`)
  const now = moment().clone().tz('America/Chicago').format(dateFmt)

  const appsWithToken = awaits(refreshToken(Apps))
  const getFirstRes = awaits(appsWithToken.getApps(filter))
  const totalPages = getFirstRes.total_pages
  const remainingApps = awaits(fetchAllPages(appsWithToken, 'getApps', totalPages, filter))
  const allApps = _filterEnvJson(remainingApps.concat(getFirstRes.resources))

  log.debug(`Total-Apps:${getFirstRes.total_results}`)
  log.debug(`Returning apps:${allApps.length}`)
  cache.set(self.cacheKey, {updated: now, all: allApps})
  log.info(`apps-cache updated`)
  return Promise.resolve(true)
})

module.exports.cacheKey = 'appsObjects'

module.exports.getApps = async((initialize) => {
  log.info('getting apps fresh', initialize)
  filter.page = 1
  try {
    if (initialize) {
      log.info('Initializing app-cache')
      awaits(refreshAndSetCache()) // Load cache first time
      setInterval(refreshAndSetCache, 180000) // Initialize automatic refresh
      if (!cache.get(self.cacheKey)) throw new Error('Cache unable to be set')
      return Promise.resolve(cache.get(self.cacheKey))
    } else if (!initialize && cache.get(self.cacheKey)) {
      log.info('Getting apps from cache')
      return Promise.resolve(cache.get(self.cacheKey))
    } else throw new Error('You should never get here.')
  } catch (e) {
    log.error(e)
    throw e
  }
})

/* These calls do not utilize the cache */
module.exports.getAppsByPage = (pageNum = 1, resultsPerPage = 50) => {
  let filter = { 'results-per-page': resultsPerPage || 50, 'page': pageNum || 1 }
  return refreshToken(Apps).then((Apps) => {
    return Apps.getApps(filter).then((appsRes) => {
      appsRes.resources = _filterEnvJson(appsRes.resources)
      return Promise.resolve(appsRes)
    })
  })
}

module.exports.getApp = (guid) => {
  return refreshToken(Apps).then((Apps) => {
    return Apps.getApp(guid).then((getAppRes) => {
      return Promise.resolve(_filterEnvJson(getAppRes))
    })
  })
}

module.exports.getStats = (guid) => {
  return refreshToken(Apps).then((Apps) => {
    return Apps.getStats(guid).then((getAppRes) => {
      return Promise.resolve(getAppRes[0])
    })
  })
}

module.exports.getAppSummary = (guid) => {
  return refreshToken(Apps).then((Apps) => {
    return Apps.getSummary(guid).then((getAppRes) => {
      return Promise.resolve(_filterEnvJson(getAppRes))
    })
  })
}

module.exports.getAppRoutes = (guid) => {
  return refreshToken(Apps).then((Apps) => {
    return Apps.getAppRoutes(guid).then((guidRes) => {
      return Promise.resolve(guidRes)
    })
  })
}
