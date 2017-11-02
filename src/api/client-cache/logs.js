const textEncoding = require('text-encoding')
const bsplit = require('buffer-split') // this could be a problem?
const envelopes = require('../util/dropsonde-protocol/envelope_pb')
const {getToken} = require('../auth/admin-oauth')
const agent = require('superagent')
const cfHostBase = 'mcf-np.threega.com'
const moment = require('moment')
const dateFmt = 'MMMM Do YYYY, h:mm:ss a'
const getRecentAppLogs = (guid) => {
  return getToken().then((token) => {
    return agent.get(`https://doppler.mcf-np.threega.com/apps/${guid}/recentlogs`)
                .responseType('blob')
                .set('Authorization', `Bearer ${token}`)
  })
}
const {log} = require('../../../log_conf')

module.exports.getRecentLogs = (guid) => {
  log.info('Getting logs for %s', guid)
  return getRecentAppLogs(guid).then((res) => {
    let messages = []
    console.info(res.headers['content-type'])
    const boundary = res.headers['content-type'].split('=')[1]
    const logMessages = bsplit(res.body, new Buffer(`\r\n--${boundary}\r\n\r\n`))
    logMessages[0] = logMessages[0].slice(boundary.length + 6)
    console.log(logMessages[0])
    logMessages[logMessages.length - 1] = logMessages[logMessages.length - 1].slice(0, logMessages[logMessages.length - 1].length - 8 - boundary.length)
    if (logMessages.length > 0) {
      logMessages.forEach((messageItem) => {
        try {
          let message = {}
          const envelope = envelopes.Envelope.deserializeBinary([...messageItem])
          message.message = `${new textEncoding.TextDecoder('utf-8').decode(envelope.getLogmessage().getMessage()).replace('\n', '')}`
          // message.timestamp = moment.unix(envelope.getLogmessage().getTimestamp())d.tz('America/Chicago').format(dateFmt)
          message.timestamp = moment(envelope.getLogmessage().getTimestamp() / 1).format(dateFmt)
          console.info(envelope.getLogmessage().getTimestamp())
          message.type = envelope.getLogmessage().getMessageType()
          messages.push(message)
          console.log(message)
        } catch (err) {
          console.error(err)
        }
      })
      return Promise.resolve(messages)
    } else return []
  })
    .catch((error) => {
      console.log(error)
      return Promise.reject('Fail')
    })
}
