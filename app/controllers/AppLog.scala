package controllers

import java.net.URI

import controllers.models.{CFAppLog, CFApp}
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.{CloudCredentials, CloudFoundryClient}
import play.api.mvc.{Action, Controller}
import spray.json._

import scala.collection.JavaConversions._

class AppLog(cfSettings: (String => String)) extends Controller() {}


object AppLog extends App(new Settings("cf")) {
  lazy val settings = new Settings("cf")
  lazy val credentials = new CloudCredentials(settings("user"), settings("password"))
  lazy val url = settings("url")

  def loadAction(name: String) = Action {
    val aname = Option(name).filterNot(_.isEmpty).getOrElse("console")
    val app = load(aname.toString)
    import controllers.ModelJsonProtocol._
    Ok(app.toJson.prettyPrint).as("application/json")
  }

  def load(name: String) = {
    def cfClient = new CloudFoundryClient(credentials, URI.create(url).toURL, true)
    def cfSpaceClient(space: CloudSpace) = new CloudFoundryClient(credentials, URI.create(url).toURL, space, true)

    cfClient.getRecentLogs(name.toString).map(log => CFAppLog(log.getMessageType.toString,log.getTimestamp.toString, log.getMessage, log.getSourceName,
    log.getSourceId)).toVector
  }
}
