const {endpoint} = require('../client/cf_client')
const {getToken} = require('../auth/admin-oauth')
const {log} = require('../../../log_conf')
var agent = require('superagent-promise')(require('superagent'), Promise)

module.exports.getEvents = (appGuid) => {
  return getToken().then((token) => {
    log.info(`Getting events for ${appGuid}`)
    return agent.get(endpoint + `/v2/events?q=actee:${appGuid}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return Promise.resolve(res.body)
    })
  })
}
