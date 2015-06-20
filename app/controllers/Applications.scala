package controllers

import java.net.URI

import controllers.models.CFApplication
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.{CloudCredentials, CloudFoundryClient}
import spray.json._
import play.api.mvc.{Action, Controller}

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import play.api.db.slick.Config.driver.simple._
import models.CFApplicationTable
//import scala.slick.driver.H2Driver.simple._
import controllers.models._
import play.api.Play.current


class Applications(cfSettings: (String => String)) extends Controller() {}

object Applications extends Applications(new Settings("cf")) {
  lazy val settings = new Settings("cf")
  lazy val credentials = new CloudCredentials(settings("user"), settings("password"))
  lazy val url = settings("url")

  def loadAction() = Action {
    play.api.db.slick.DB.withSession { implicit session =>
      val apps = CFApplicationTable.apps.list
      val sorted = apps.sortBy(app => (app.org, app.space, app.name))
      import controllers.ModelJsonProtocol._
      Ok(sorted.toJson.prettyPrint).as("application/json")
    }
  }

}
