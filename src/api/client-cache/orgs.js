const {OrgsInstance, refreshToken} = require('../client/cf_client')
const Orgs = OrgsInstance()
const _ = require('underscore')
var awaits = require('asyncawait/await')
var async = require('asyncawait/async')
const {cache} = require('../static-cache')
const moment = require('moment')
var self = module.exports = {}
const dateFmt = 'MMMM Do YYYY, h:mm:ss a'
const {log} = require('../../../log_conf')

const refreshAndSetCache = async(() => {
  log.info(`refreshing orgs-cache:${moment().format(dateFmt)}`)
  const orgsWithToken = awaits(refreshToken(Orgs))
  const theOrgs = awaits(orgsWithToken.getOrganizations())
  const now = moment().format(dateFmt)
  cache.set(self.cacheKey, {all: theOrgs.resources, updated: now})
  log.info(`orgs-cache updated time: ${cache.get(self.cacheKey).updated}`)
  return Promise.resolve(true)
})

module.exports.cacheKey = 'orgs'

module.exports.getOrgs = async((initialize) => {
  log.info('retrieving new orgs')
  try {
    if (initialize) {
      log.info('initializing orgs-cache')
      awaits(refreshAndSetCache())
      setInterval(refreshAndSetCache, 180000)
      if (!cache.get(self.cacheKey)) throw new Error('Cache unable to be set')
      return Promise.resolve(cache.get(self.cacheKey))
    } else if (!initialize && cache.get(self.cacheKey)) {
      log.info('returning values from cache')
      return Promise.resolve(cache.get(self.cacheKey))
    } else throw new Error('You should never get here.')
  } catch (e) {
    console.error(e)
    throw e
  }
})

/* Doesn't use cache */
module.exports.getOrg = (guid) => {
  return refreshToken(Orgs).then((Orgs) => {
    return Promise.resolve(Orgs.getOrganization(guid))
  })
}

module.exports.getSummary = (guid) => {
  return Promise.resolve(Orgs.getSummary(guid))
}

module.exports._filterByFields = (orgs) => {
  const reduceFunction = (filteredOrgs, curr) => {
    filteredOrgs.push({ guid: curr.metadata.guid, name: curr.entity.name })
    return filteredOrgs
  }
  return _.reduce(orgs, reduceFunction, [])
}

/* util functions */
module.exports.getNameByOrgGuid = async((orgGuid) => {
  const allTheOrgs = awaits(self.getOrgs())
  return allTheOrgs.filter((item) => { item.metadata.guid === orgGuid })
})
