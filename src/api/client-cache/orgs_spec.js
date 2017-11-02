const should = require('chai').should()
const {getNameByOrgGuid, getSpacesByOrg, getOrgs} = require('./orgs')
// const orgsExample = require('../json/orgs')
const orgGuid = '2a744f76-b6e0-4476-b214-9e092249ef4e'
describe('orgs-cache-spec', function () {
  this.timeout(0)
  before((done) => {
    console.info('in done')
    getOrgs().then((res) => {
      console.info('got orgs')
      done()
    })
  })

  it('gets a Orgnization name by Org Guid', (done) => {
    getNameByOrgGuid(orgGuid).then((org) => {
      // console.log(org)
      org.entity.name.should.equal('system')
      done()
    })
  }).timeout(0)

  it('grabs all spaces in an orgs', (done) => {
    getSpacesByOrg(orgGuid).then((spacesInOrg) => {
      console.log(spacesInOrg)
      done()
    })
  }).timeout(0)
})
