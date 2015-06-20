package controllers.models

import play.api._
import play.api.db.DB
import play.api.libs.concurrent._
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.duration._
import scala.slick.driver.H2Driver.simple._


class CFApplicationTable(tag: Tag) extends Table[CFApplication](tag, CFApplicationTable.Name) {
  def name = column[String]("NAME")
  def org = column[String]("ORG")
  def space = column[String]("SPACE")
  def uris = column[String]("URIS")
  def state = column[String]("STATE")
  def guid = column[String]("GUID", O.PrimaryKey)

  def * = (name, org, space, uris, state, guid) <> (CFApplication.fromDB, CFApplication.unapplyFromDB)

}

object CFApplicationTable {
  val Name = "APPS"
  val apps = TableQuery[CFApplicationTable]
}

