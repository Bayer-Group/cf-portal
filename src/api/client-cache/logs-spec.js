const chai = require('chai')
const should = chai.should
const logsEndpoint = 'wss://doppler.mcf-np.threega.com'
const CFLogs = new (require('cf-client')).Logs(logsEndpoint)
const {getTokenFull} = require('../auth/admin-oauth')

const textEncoding = require('text-encoding')
describe('d', () => {
  // it('e ', () => {
  //   const l = 'some random string'
  //   const g = 's'
  //   const encoded = new textEncoding.TextEncoder('utf-8').encode(l)
  //   const encoded2 = new textEncoding.TextEncoder('utf-8').encode(g)
  //   // console.log(encoded)
  //   // console.log(encoded2)
  // }
  it('uses existing doppler endpoint and library', function (done) {
    console.info('Can you see me')
    const recToken = getTokenFull()
    recToken.then((token) => {
      console.log(token)
      // console.info('received token', token)
      CFLogs.setToken(token)
      CFLogs.setEndPoint(logsEndpoint)
      const recentLogs = CFLogs.getRecent('1d1ed6fb-9938-49de-b514-a1dc3bbe7c0a')
      recentLogs.then((logsRes) => {
        console.log(logsRes)
        done()
      })
    }).catch((err) => {
      console.log(err)
      done(err)
    })
  }).timeout(0)
})
