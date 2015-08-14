import java.sql.{Timestamp, Time, Date}
import java.util.Calendar
import _root_.cache.CFApplicationDao
import akka.actor.{Actor, Props}
import play.api._
import play.api.libs.concurrent._
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.duration._
import scala.slick.driver.H2Driver.simple._
import controllers.models._
import play.api.Play.current


object Global extends GlobalSettings {

  override def onStart(app: Application) {

    val updateActor = Akka.system.actorOf(Props[dbUpdater])
    Akka.system(app).scheduler.schedule(30 seconds, 5 minutes)(updateActor ! "update db")

    println("App Starting....")
    loadDB()
  }

  class dbUpdater extends Actor {
    def receive = {
      case _ => refreshDB()
    }
  }

  def loadDB() = {
    play.api.db.slick.DB.withSession{ implicit session =>
      CFApplicationTable.apps.ddl.create
      Updates.updates.ddl.create

      val date = Calendar.getInstance().getTime().toString
      val updateTime = new Updated(1,date)
      Updates.updates.insert(updateTime)
    }
 }

  def refreshDB() = {
    {
     println("Refreshing DB....")

      play.api.db.slick.DB.withSession { implicit session =>
        lazy val applicationDao = new CFApplicationDao
        var apps=applicationDao.loadAll()
        apps.foreach(CFApplicationTable.apps.insertOrUpdate)
        val date = Calendar.getInstance().getTime().toString
        val updateTime = new Updated(1,date)
        Updates.updates.insertOrUpdate(updateTime)

        val old = for {
          g <- CFApplicationTable.apps
        }yield (g.guid)

        val current = apps.map(_.guid)

        val unwanted = old.list.filterNot(current.toSet)

        unwanted.foreach(guid => CFApplicationTable.apps.filter(_.guid === guid ).delete)

       //println("Done with DB refresh at " + updateTime)
      }
    }
  }
}
