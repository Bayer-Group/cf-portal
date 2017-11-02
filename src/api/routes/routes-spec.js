const chai = require('chai')
const should = chai.should()
const supertest = require('supertest')
// const express = require('express')
/* global describe it before */
const app = require('../../../build/dev-server').app
// const routes = require('../routes')
const keysToBeFiltered = require('../client-cache/filtered_keys')
const expectedAppName = 'aws-service-account-admin'
describe('Routes spec', function () {
  this.timeout(60000)
  this.slow(800)
  // routes(app)
  const test = supertest(app)
  // const appGuid = '13318a98-fc33-46a6-8a00-af46d4538d99'
  const appGuid = '1d1ed6fb-9938-49de-b514-a1dc3bbe7c0a'
  const orgGuid = '8ed64499-48d0-4b3d-9023-2984c51b2d7c'
  const spacesGuid = 'ec95cf92-c727-4d81-be25-6c32a76ab811'
  const agg = require('../client-cache/aggregrate')

  before((done) => {
    agg.initialize().then((res) => {
      console.info('loaded agg')
      done()
    }).catch((err) => {
      console.error(err)
    })
  })

  it('gets all spaces', function (done) {
    test.get(`/rest/spaces`)
    .expect((response) => {
      const body = response.body.all
      body.length.should.be.gte(1)
      should.exist(body[0].metadata.guid)
      should.exist(body[0].entity.name)
    })
    .expect(200, done)
  })

  it('gets a space by guid', function (done) {
    test.get(`/rest/spaces/${spacesGuid}`)
    .expect((response) => {
      const body = response.body
      should.exist(body.metadata.guid)
      should.exist(body.entity.name)
    })
    .expect(200, done)
  })

  it('gets a space summary', function (done) {
    test.get(`/rest/spaces/${spacesGuid}/summary`)
    .expect((response) => {
      const body = response.body
      should.exist(body.guid)
      should.exist(body.name)
      should.exist(body.apps)
      should.exist(body.services)
    })
    .expect(200, done)
  })

  it('gets an org summary', function (done) {
    test.get(`/rest/orgs/${orgGuid}/summary`)
    .expect((response) => {
      const body = response.body
      should.exist(body.guid)
      should.exist(body.name)
      body.spaces.length.should.be.gte(1)
    })
    .expect(200, done)
  })

  it('gets all apps in a space', function (done) {
    test.get(`/rest/spaces/${spacesGuid}/apps`)
    .expect((response) => {
      const body = response.body
      should.exist(body.total_results)
      should.exist(body.total_pages)
      should.exist(body.hasOwnProperty('next_url')) // this value may be null
      body.resources.length.should.be.gte(1)
    })
    .expect(200, done)
  })

  it('gets an org by guid', function (done) {
    test.get(`/rest/orgs/${orgGuid}`)
    .expect((response) => {
      const body = response.body
      should.exist(body.metadata.guid)
      should.exist(body.entity.name)
    })
    .expect(200, done)
  })

  it('gets all orgs', function (done) {
    test.get(`/rest/orgs`)
    .expect((response) => {
      const body = response.body.all
      body.length.should.be.gte(1)
      should.exist(body[0].metadata.guid)
      should.exist(body[0].entity.name)
    })
    .expect(200, done)
  })

  it('gets the routes of an app', function (done) {
    test.get(`/rest/apps/${appGuid}/routes`)
    .expect((response) => {
      const body = response.body
      body.resources.length.should.be.equal(1)
      body.resources[0].entity.host.should.equal(expectedAppName)
      should.exist(body.total_results)
      should.exist(body.total_pages)
    })
    .expect(200, done)
  })

  it('returns a 400 when getting the routes of an invalid app', function (done) {
    test.get(`/rest/apps/invalidApp/routes`)
    .expect(400, done)
  })

  it('gets stats of an app', function (done) {
    test.get(`/rest/apps/${appGuid}/stats`)
    .expect((response) => {
      response.body.stats.name.should.equal(expectedAppName)
      should.exist(response.text)
      should.exist(response.body)
    })
    .expect(200, done)
  })

  it('returns a 400 when getting the stats of an invalid app', function (done) {
    test.get(`/rest/apps/invalidApp/stats`)
    .expect(400, done)
  })

  it('gets summary of an app', function (done) {
    test.get(`/rest/apps/${appGuid}/summary`)
    .expect((response) => {
      should.exist(response.body)
      const body = response.body
      body.guid.should.equal(appGuid)
      body.name.should.equal(expectedAppName)
      keysToBeFiltered.forEach((theKey) => {
        should.not.exist(body[theKey])
        should.not.exist(body[theKey])
      })
    })
    .expect(200, done)
  })

  it('returns a 400 when getting the summary of an invalid app', function (done) {
    test.get(`/rest/apps/invalidApp/summary`)
    .expect(400, done)
  })

  it('gets an app by guid', function (done) {
    test.get(`/rest/apps/${appGuid}`)
    .expect((response) => {
      // console.log(response.body)
      should.exist(response.body)
      const body = response.body
      body.metadata.guid.should.equal(appGuid)
      body.entity.name.should.equal(expectedAppName)
      keysToBeFiltered.forEach((theKey) => {
        should.not.exist(body.entity[theKey])
        should.not.exist(body[theKey.entity])
      })
    })
    .expect(200, done)
  })

  it('gets an app by page', function (done) {
    test.get(`/rest/apps?page=1`)
    .expect((response) => {
      should.exist(response.body)
      const body = response.body
      should.exist(body.total_pages)
      should.exist(body.next_url)
      should.exist(body.total_results)
      should.exist(body.resources[0].metadata.guid)
      should.exist(body.resources[0].entity.name)
      body.resources.length.should.be.gte(1)
      body.resources.forEach((item) => {
        should.not.exist(item.entity.environment_json)
        should.not.exist(item.entity.docker_credentials)
      })
    })
    .expect(200, done)
  })

  it('gets all apps', function (done) {
    test.get(`/rest/apps/all`)
    .expect((response) => {
      should.exist(response.body)
      const body = response.body.all
      body.forEach((item) => {
        keysToBeFiltered.forEach((theKey) => {
          should.not.exist(item.entity[theKey])
        })
      })
    })
    .expect(200, done)
  })

  it('gets the aggregrate by page', function (done) {
    test.get(`/rest/aggregrate/1`)
    .expect((response) => {
      const body = response.body
      body.length.should.be.gte(1)
      const first = body[0]
      should.exist(first.name)
      should.exist(first.guid)
      should.exist(first.space_guid)
      should.exist(first.space)
      should.exist(first.org)
      should.exist(first.organization_guid)
    })
    .expect(200, done)
  })

  it('gets aggregrate', function (done) {
    test.get(`/rest/aggregrate`)
    .expect((response) => {
      const body = response.body.all
      body.length.should.be.gte(1)
      body.forEach((item) => {
        Object.keys(item).length.should.equal(9)
        should.exist(item.name)
        should.exist(item.hasOwnProperty('docker_image')) // this value may be null
        should.exist(item.hasOwnProperty('buildpack')) // this value may be null
        should.exist(item.state)
        should.exist(item.guid)
        should.exist(item.space_guid)
        should.exist(item.space)
        should.exist(item.org)
        should.exist(item.organization_guid)
      })
    })
    .expect(200, done)
  })

  it('gets events for an app', function (done) {
    test.get(`/rest/apps/${appGuid}/events`)
    .expect((response) => {
      should.exist(response.body)
      const body = response.body
      should.exist(body.total_pages)
      should.exist(body.total_results)
      if (body.resources.length >= 1) {
        should.exist(body.resources[0].metadata.guid)
        should.exist(body.resources[0].entity.type)
        should.exist(body.resources[0].entity.actee)
        should.exist(body.resources[0].entity.actee_name)
      }
    })
    .expect(200, done)
  })
})
