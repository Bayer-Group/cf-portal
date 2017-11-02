const {getApps, getAppsByPage} = require('./apps')
const {getSpaces} = require('./spaces')
const {getOrgs} = require('./orgs')
const _ = require('underscore')
var async = require('asyncawait/async')
var awaits = require('asyncawait/await')
const NodeCache = require('node-cache')
const cache = new NodeCache({stdTTL: 190})
const {log} = require('../../../log_conf')
var self = module.exports = {}
cache.on('expired', function (key, value) {
  log.info('Cache expired')
})
var localApps = []

module.exports.cacheKey = 'aggregrate'

module.exports._reduceAppsJson = (appsJson) => {
  const reduceFunction = (filteredApps, curr) => {
    filteredApps.push(
      {
        name: curr.entity.name,
        guid: curr.metadata.guid,
        space_guid: curr.entity.space_guid,
        docker_image: curr.entity.docker_image,
        state: curr.entity.state,
        buildpack: curr.entity.buildpack || curr.entity.detected_buildpack
      }
    )
    return filteredApps
  }
  return _.reduce(appsJson, reduceFunction, [])
}

module.exports._reduceSpacesJson = (spacesJson) => {
  const reduceFunction = (filteredSpaces, curr) => {
    filteredSpaces.push(
      {
        space: curr.entity.name,
        space_guid: curr.metadata.guid,
        organization_guid: curr.entity.organization_guid
      }
    )
    return filteredSpaces
  }
  return _.reduce(spacesJson, reduceFunction, [])
}

module.exports._reduceOrgsJson = (orgs) => {
  const reduceFunction = (filteredOrgs, curr) => {
    filteredOrgs.push(
      {
        org: curr.entity.name,
        organization_guid: curr.metadata.guid
      }
    )
    return filteredOrgs
  }
  return _.reduce(orgs, reduceFunction, [])
}

module.exports.mergeByKey = (parentJson, childJson, mergeKey) => {
  return parentJson.map((item) => {
    return _.extend(item, _.findWhere(childJson, { [mergeKey]: item[`${mergeKey}`] }))
  })
}

module.exports.initialize = () => { return self.getAggregrate(true) }

module.exports.getAggregrate = async((initialize) => {
  log.info('getting agg')
  log.info('Initialize', Boolean(initialize))
  try {
    if (initialize || !cache.get(self.cacheKey)) {
      log.info('refreshing aggs')
      const allApps = awaits((getApps(initialize)))
      log.info(`All Apps: ${allApps.all.length}`)
      const filteredApps = self._reduceAppsJson(allApps.all)
      const mergedAppsSpaces = awaits(_getFilterMerge(getSpaces, self._reduceSpacesJson, filteredApps, 'space_guid', initialize))
      const allAggs = awaits(_getFilterMerge(getOrgs, self._reduceOrgsJson, mergedAppsSpaces, 'organization_guid', initialize))
      log.info(`Cache-Time:${allApps.updated}`)
      const aggregrated = {all: allAggs, updated: allApps.updated}
      cache.set(self.cacheKey, aggregrated)
      localApps = aggregrated.all
      return Promise.resolve(aggregrated)
    } else if (!initialize && cache.get(self.cacheKey)) {
      return Promise.resolve(cache.get(self.cacheKey))
    } else throw new Error('You should never get here')
  } catch (err) {
    console.error(err)
    throw err
  }
})

module.exports.getAggregrateByPage = async((pageNum = 1, resultsPerPage = 100) => {
  log.info(`getting agg for page ${pageNum}`)
  try {
    const allApps = awaits(getAppsByPage())
    const filteredApps = self._reduceAppsJson(allApps.resources)
    log.info(`Total-Pages:${allApps.total_pages}`)
    if (pageNum > allApps.total_pages) return Promise.reject('Invalid page number.')
    const mergedAppsSpaces = awaits(_getFilterMerge(getSpaces, self._reduceSpacesJson, filteredApps, 'space_guid'))
    return awaits(_getFilterMerge(getOrgs, self._reduceOrgsJson, mergedAppsSpaces, 'organization_guid'))
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
})

module.exports.filterByKey = (key, value, apps = localApps) => {
  log.debug('filtering', key, value, apps.length)
  return apps.filter((item) => { return item[key] === value })
}

const _getFilterMerge = async((getFunc, filterFunc, filteredApps, mergeKey, initialize) => {
  log.debug(`Merging`, initialize)
  const all = awaits(getFunc(initialize))
  const filtered = filterFunc(all.all)
  return self.mergeByKey(filteredApps, filtered, mergeKey)
})

