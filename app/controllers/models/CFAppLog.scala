package controllers.models

import java.util.Date

import org.cloudfoundry.client.lib.domain.ApplicationLog.MessageType

case class CFAppLog(messageType: String, timestamp: String, message: String, sourcename: String, sourceid: String)
