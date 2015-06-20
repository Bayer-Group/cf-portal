package controllers

import java.net.URI

import controllers.models.{CFAppLog, CFApp, CFAppEvent}
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.{CloudCredentials, CloudFoundryClient}
import org.cloudfoundry.client.lib._
import play.api.mvc.{Action, Controller}
import spray.json._

import scala.collection.JavaConversions._

class AppEvent(cfSettings: (String => String)) extends Controller() {}

object AppEvent extends App(new Settings("cf")) {
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

    cfClient.getApplicationEvents(name.toString).map(event => CFAppEvent(event.getType, event.getActor.toString(),
      event.getActorType, event.getActorName, event.getActee.toString(), event.getActeeType, event.getActeeName,
        event.getTimestamp.toString())).toVector
  }
}