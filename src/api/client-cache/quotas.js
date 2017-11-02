const NodeCache = require( "node-cache" )
const quotasCache = new NodeCache({ stdTTL: 591, checkperiod: 296 })
const {OrganizationsQuota,refreshToken} = require('../client/cf_client')
const Quotas = OrganizationsQuota()
const cacheKey = 'quotas'
var self = module.exports = {}
let quotas = []

module.exports.getOrgQuotas = () => {
  if (quotasCache.get(cacheKey)) {
    console.log(Date.now())
    console.log('Got orgs from cache')
    return Promise.resolve(quotasCache.get(cacheKey))
  } else {
    console.log(Date.now())
    console.log('retrieving new quotas')
    return refreshToken(Quotas).then((Quotas) => {
      return Quotas.getQuotaDefinitions().then((quotasRes) => {
        console.log('Got quotas')
        console.log(quotasRes)
        quotas = quotasRes.resources
        quotasCache.set(cacheKey, quotas)
        return Promise.resolve(quotas)
      })
    })
  }
}

module.exports.getOrgQuota = (guid) => {
  if (quotasCache.get(cacheKey)) {
    console.log(Date.now())
    console.log('Got orgs from cache')
    return Promise.resolve(quotasCache.get(cacheKey))
  } else {
    console.log(Date.now())
    console.log('retrieving new quotas')
    return refreshToken(Quotas).then((Quotas) => {
      return Quotas.getQuotaDefinition(guid).then((quotasRes) => {
        console.log('Got quotas')
        console.log(quotasRes)  
        quotasCache.set(cacheKey, quotasRes)
        return Promise.resolve(quotasRes)
      })
    })
  }
}

module.exports.getSpaceQuotas = () => {
  if (quotasCache.get(cacheKey)) {
    console.log(Date.now())
    console.log('Got orgs from cache')
    return Promise.resolve(quotasCache.get(cacheKey))
  } else {
    console.log(Date.now())
    console.log('retrieving new quotas')
    return refreshToken(Quotas).then((Quotas) => {
      return Quotas.getQuotaDefinition(guid).then((quotasRes) => {
        console.log('Got quotas')
        console.log(quotasRes)  
        quotasCache.set(cacheKey, quotasRes)
        return Promise.resolve(quotasRes)
      })
    })
  }  
}