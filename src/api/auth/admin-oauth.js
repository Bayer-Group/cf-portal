const NodeCache = require('node-cache')
const tokenCache = new NodeCache({ stdTTL: 28800})
const {cf_client} = require('../env/default_bindings')
var agent = require('superagent-promise')(require('superagent'), Promise)
const cacheKey = 'token'
const cacheKeyFull = 'tokenFull'

module.exports.getToken = () => {
  console.log('Env', cf_client.url, cf_client.clientId)
  const body = {
    client_id: cf_client.clientId,
    client_secret: cf_client.clientSecret,
    grant_type: 'client_credentials'
  }
  if (tokenCache.get(cacheKey)) {
    return Promise.resolve(tokenCache.get(cacheKey))
  } else {
    return agent.post(cf_client.url + '/oauth/token', body)
    .set('content-type', 'application/x-www-form-urlencoded')
    .then((res) => {
      tokenCache.set(cacheKey, res.body.access_token)
      return Promise.resolve(res.body.access_token)
    })
  }
}

module.exports.getTokenFull = () => {
  console.log('Env', cf_client.url, cf_client.clientId)
  const body = {
    client_id: cf_client.clientId,
    client_secret: cf_client.clientSecret,
    grant_type: 'client_credentials'
  }
  if (tokenCache.get(cacheKeyFull)) {
    return Promise.resolve(tokenCache.get(cacheKeyFull))
  } else {
    return agent.post(cf_client.url + '/oauth/token', body)
    .set('content-type', 'application/x-www-form-urlencoded')
    .then((res) => {
      tokenCache.set(cacheKeyFull, res.body)
      return Promise.resolve(res.body)
    })
  }
}
