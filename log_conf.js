var bunyan = require('bunyan')
var PrettyStream = require('bunyan-prettystream-circularsafe')
var prettyStdOut = new PrettyStream()
var os = require('os')
var CloudWatchStream = require('bunyan-aws')

console.log('Configuring logger. Hostname is %s', os.hostname())

prettyStdOut.pipe(process.stdout)
const localLoggerStream = {
  level: 'trace', // Sets to most verbose when local
  type: 'raw',
  stream: prettyStdOut
}

/* Log to cloudwatch if running in cloudfoundry
  must have AWS credentials set for this to work
*/
const cloudwatchStream = new CloudWatchStream({
  logGroupName: 'cloudops-apps',
  logStreamName: 'cf-portal-combined-' + os.hostname(),
  cloudWatchOptions: {
    region: 'us-east-1',
    sslEnabled: true
  }
})
const cwLoggerStream = {
  stream: cloudwatchStream,
  type: 'raw',
  level: 'info'
}

if (process.env.VCAP_SERVICES) console.log('Running cloudfoundry logger')
else console.log('Running local logger')

let logInstance = { name: 'cf-portal-orgs', src: true }

logInstance.streams = (process.env.VCAP_SERVICES) ? [cwLoggerStream] : [localLoggerStream]

let logger = bunyan.createLogger(logInstance)

module.exports.log = logger
