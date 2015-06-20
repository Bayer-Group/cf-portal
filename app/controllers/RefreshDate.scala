package controllers

import java.net.URI
import controllers.models.Updates
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.domain.InstanceStats
import org.cloudfoundry.client.lib.{CloudCredentials, CloudFoundryClient}
import spray.json._
import play.api.mvc.{Action, Controller}
import play.api.Play.current
import scala.slick.driver.H2Driver.simple._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._

class RefreshDate() extends Controller() {}

object RefreshDate extends RefreshDate() {

  def loadAction() = Action {
    play.api.db.slick.DB.withSession { implicit session =>

      val tstamp = Updates.updates.list

      import controllers.ModelJsonProtocol._
      Ok(tstamp.toJson.prettyPrint).as("application/json")
    }
  }
}