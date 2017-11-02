const vcap = require('cfenv')
const services = vcap.getAppEnv().getServices()
const local = vcap.getAppEnv().isLocal
console.info('Local:', local)
module.exports = {
  cf_api: {
    password: local ? process.env.cfapi_pw : services.cf_api.credentials.password,
    username: local ? process.env.cfapi_user : services.cf_api.credentials.username,
    url: local ? process.env.api_url : services.cf_api.credentials.url
  },
  cf_client: {
    clientId: local ? process.env.cf_client_id : services.cf_client.credentials.clientId,
    clientSecret: local ? process.env.cf_client_secret : services.cf_client.credentials.clientSecret,
    url: local ? process.env.uaa_url : services.cf_client.credentials.url
  }
}
