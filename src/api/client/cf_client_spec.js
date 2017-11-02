const should = require('chai').should()
const {getToken,AppsInstance,OrgsInstance} = require('./cf_client')
const Apps = AppsInstance()
const Orgs = OrgsInstance()
const Promise = require('bluebird')
import eachOf from 'async/eachOf'
// import series from 'async/series'
const eachPromise = Promise.promisify(eachOf)
const {getAllApps} = require('../client-cache/apps')

describe('cf-client', function () {
  const pageCount = 1
  const filter = {
    'results-per-page': 100,
    'page': pageCount
  }
  let totalPages = 0
  let calcTotalPages = 0
  let totalResults = 0

  let theToken = {}

  before( function (done) {
    this.timeout(0)
    console.log('running before')
    getToken().then((getTokenRes) => {
        theToken = getTokenRes
        Apps.setToken(theToken)
        done()
    }).catch((err) => {
      console.log('error found')
      console.error(err)
      done(err)
    })
  })

  it ('grabs the first page',  function (done) {
    Apps.getApps(filter).then((getAppsRes) => {
      // console.log(getAppsRes)
      totalPages = getAppsRes.total_pages
      totalResults = getAppsRes.total_results
      const resourcesLength = getAppsRes.resources.length
      calcTotalPages = resourcesLength
      totalResults.should.be.gte(1)
      getAppsRes.resources.should.have.length.gte(1)
      done()
    }).catch((err) => {
      console.log('error found')
      console.error(err)
      done(err)
    })
  })
  .timeout(8000)

  it ('grabs all the apps from apps.js', function (done) {
    totalPages.should.be.gte(0)
    Apps.getApps().then((res)=> {
      res.resources.length.should.equal(50)
      done()
    }).catch((err) => {
      console.log(err)
      done(err)
    })
  })
  .timeout(0)

  it(' grabs the orgs', (done) => {
    Orgs.setToken(theToken)
    Orgs.getOrganizations().then((getSummRes) => {
      getSummRes.resources.should.have.length.gte(1)
      done()
    }).catch((err) => {
      console.log('error found')
      console.error(err)
      done(err)
    })
  })
})