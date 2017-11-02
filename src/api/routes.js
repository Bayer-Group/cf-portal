var express = require('express')
var router = express.Router()
const {getApps, getApp, getStats, getAppSummary, getAppRoutes, getAppsByPage} = require('./client-cache/apps')
const {getOrgs, getOrg, getSummary} = require('./client-cache/orgs')
const {getSpaces, getSpace, getSpaceSummary, getSpaceApps} = require('./client-cache/spaces')
const {getRecentLogs} = require('./client-cache/logs')
const {getAggregrate, getAggregrateByPage} = require('./client-cache/aggregrate')
const {getEvents, getLogs} = require('./client-cache/events')
const handleError = require('./util/response_with_error')

router.get('/apps/all', (req, res) => {
  getApps().then((all) => {
    return res.send(all)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid/events', (req, res) => {
  const guid = req.params.guid
  console.log(JSON.stringify(req.url, null, 2))
  getEvents(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid/logs', (req, res) => {
  const guid = req.params.guid
  console.log(JSON.stringify(req.url, null, 2))
  getRecentLogs(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid/routes', (req, res) => {
  const guid = req.params.guid
  getAppRoutes(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid/stats', (req, res) => {
  const guid = req.params.guid
  getStats(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid/summary', (req, res) => {
  const guid = req.params.guid
  getAppSummary(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/apps/:guid', (req, res) => {
  const guid = req.params.guid
  getApp(guid).then((getAppRes) => {
    return res.send(getAppRes)
  }).catch((err) => { handleError(res, err, 400) })
})

/*
  This route is paginated and can be used for a UI
  uses a query param called page to define page requested
  if no page is defined returns aggregrate endpoint
*/
router.get('/apps', (req, res) => {
  if (req.query.page) {
    const page = req.query.page
    getAppsByPage(page).then((getAppsRes) => {
      console.log('got-apps')
      if (getAppsRes.resources.length === 0) {
          // In case you send a page thats out of bounds
        return res.status(404).send('No apps found for that page')
      }
      return res.send(getAppsRes)
    }).catch((err) => { handleError(res, err, 400) })
  } else {
    console.info('getting agg')
    return getAggregrate().then((aggRes) => {
      return res.send(aggRes.all)
    }).catch((err) => { handleError(res, err, 400) })
  }
})

router.get('/orgs/:guid/summary', (req, res) => {
  const guid = req.params.guid
  getSummary(guid).then((summary) => { return res.send(summary) })
  .catch((err) => { handleError(res, err, 400) })
})

router.get('/orgs/:guid', (req, res) => {
  const guid = req.params.guid
  getOrg(guid).then((org) => { return res.send(org) })
  .catch((err) => { handleError(res, err, 400) })
})

router.get('/orgs', (req, res) => {
  getOrgs().then((getOrgsRes) => { return res.send(getOrgsRes) })
  .catch((err) => { handleError(res, err, 400) })
})

router.get('/spaces/:guid/apps', (req, res) => {
  const guid = req.params.guid
  getSpaceApps(guid).then((spaces) => {
    return res.send(spaces)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/spaces/:guid/summary', (req, res) => {
  const guid = req.params.guid
  getSpaceSummary(guid).then((spaces) => {
    return res.send(spaces)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/spaces/:guid', (req, res) => {
  const guid = req.params.guid
  getSpace(guid).then((spaces) => {
    return res.send(spaces)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/spaces', (req, res) => {
  getSpaces().then((spaces) => {
    return res.send(spaces)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/aggregrate/:page', (req, res) => {
  const pageNum = req.params.page
  console.log(pageNum)
  if (pageNum) {
    getAggregrateByPage(pageNum).then((aggRes) => {
      return res.send(aggRes)
    }).catch((err) => { handleError(res, err, 400) })
  } else {
    getAggregrate().then((aggRes) => {
      return res.send(aggRes)
    }).catch((err) => { handleError(res, err, 400) })
  }
})

router.get('/aggregrate', (req, res) => {
  console.info('getting agg')
  return getAggregrate().then((aggRes) => {
    return res.send(aggRes)
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/refresh-cache', (req, res) => {
  console.log('Manually refreshing cache')
  getApps(true).then((appsRes) => {
    return res.send('Successfully refreshed cache')
  }).catch((err) => { handleError(res, err, 400) })
})

router.get('/getLogsTest/:appGuid', (req, res) => {
  console.log(req.params)
  getLogs(req.params.appGuid)
  .then((logRes) => {
    console.log(logRes)
    res.send('success')
  }).catch((err) => {
    console.error(err)
    res.send(err)
  })
})

/* Utility routes */
router.get('/apps/:appGuid/name', (req, res) => {
  const {filterByKey} = require('../api/client-cache/aggregrate')
  return res.send(filterByKey('guid', req.params.appGuid))
})

module.exports = router
