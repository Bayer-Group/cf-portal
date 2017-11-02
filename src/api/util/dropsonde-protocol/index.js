module.exports = {
  Envelope: require('./envelope_pb').Envelope,
  Error: require('./error_pb').Error,
  HttpStartStop: require('./error_pb').HttpStartStop,
  LogMessage: require('./log_pb').LogMessage,
  ValueMetric: require('./metric_pb').ValueMetric,
  CounterMetric: require('./metric_pb').CounterMetric,
  ContainerMetric: require('./metric_pb').ContainerMetric,
  UUID: require('./uuid_pb').UUID
}
