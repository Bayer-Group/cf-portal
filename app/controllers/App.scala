package controllers

import java.net.URI

import controllers.models.CFApp
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.domain.InstanceStats
import org.cloudfoundry.client.lib.{CloudCredentials, CloudFoundryClient}
import spray.json._
import play.api.mvc.{Action, Controller}

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._

class App(cfSettings: (String => String)) extends Controller() {}


object App extends App(new Settings("cf")) {
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

    cfClient.getApplicationStats(name.toString).getRecords.map(instance => CFApp(instance.getUsage.getCpu, instance.getHost,
      instance.getId, instance.getUptime, instance.getState.toString, instance.getName, instance.getUsage.getMem)).toVector
 }

}

