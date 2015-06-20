package controllers.models

import scala.slick.driver.H2Driver.simple._

case class Updated (id: Int, date: String)

class Updates(tag: Tag) extends Table[Updated](tag, Updates.Name)  {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def date = column[String]("date")
  def * = (id, date) <> (Updated.tupled, Updated.unapply)
}

object Updates {
  val Name = "UPDATES"
  val updates = TableQuery[Updates]
}