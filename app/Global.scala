import java.sql.{Timestamp, Time, Date}
import java.util.Calendar
import _root_.cache.CFApplicationDao
import akka.actor.{Actor, Props}
import play.api.libs.concurrent._
import scala.slick.driver.H2Driver.simple._
import controllers.models._
import play.api.Play.current
import play.api.cache.Cache
import io.prometheus.client.Histogram.Timer
import io.prometheus.client.Summary.{Timer => SummaryTimer}
import io.prometheus.client.{Counter, Histogram}
import org.joda.time.{DateTime, DateTimeZone, Seconds}
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.duration._
import play.api._
import play.api.mvc.Results._
import scala.concurrent.Future


object Global extends GlobalSettings {

  final val latencyHistogram: Histogram = Histogram.build().name("latency_seconds").help("Request latency in seconds").labelNames("method").register()
  final val failureCounter: Counter = Counter.build().name("failures_total").help("Failures").labelNames("method").register()

  override def onStart(app: Application) {

    val updateActor = Akka.system.actorOf(Props[dbUpdater])
    Akka.system(app).scheduler.schedule(30 seconds, 5 minutes)(updateActor ! "update db")

    println("App Starting....")
    io.prometheus.client.hotspot.DefaultExports.initialize()
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

  override def onRequestReceived(request: play.api.mvc.RequestHeader) : scala.Tuple2[play.api.mvc.RequestHeader, play.api.mvc.Handler] = {
    request.method match {
      case "GET" =>
        request.path match {
          case "/rest/apps/" => Cache.set(s"timer-${request.id}", TimerContainer("getRestSummaries", latencyHistogram.labels("getRestSummariesHist").startTimer()), 60)
          case "/metrics/" => Cache.set(s"timer-${request.id}", TimerContainer("getMetricsSummaries", latencyHistogram.labels("getMetricsSummariesHist").startTimer()), 60)
          case "/rest/refresh/" => Cache.set(s"timer-${request.id}", TimerContainer("getRefreshSummaries", latencyHistogram.labels("getRefreshSummariesHist").startTimer()), 60)
          case _ =>
        }

      case _ =>

    }
    super.onRequestReceived(request)
  }

  override def onRequestCompletion(request : play.api.mvc.RequestHeader) : scala.Unit = {
    Cache.get(s"timer-${request.id}") match {
      case Some(container: TimerContainer) => container.timer.observeDuration()
      case Some(_) =>
      case None =>
    }
    super.onRequestCompletion(request)
  }

  override def onBadRequest(request : play.api.mvc.RequestHeader, error : scala.Predef.String) : scala.concurrent.Future[play.api.mvc.Result] = {
    Cache.get(s"timer-${request.id}") match {
      case Some(container: TimerContainer) => failureCounter.labels(container.label).inc()
      case Some(_) =>
      case None =>
    }
    Future.successful(BadRequest("Invalid request"))
  }

  // Default to Central Time midnight
  private def secondsUntilMidnight(): Int = {
    Seconds.secondsBetween(DateTime.now(DateTimeZone.forID("America/Chicago")), DateTime.now(DateTimeZone.forID("America/Chicago")).plusDays(1).withTime(0, 0, 0, 0)).getSeconds
  }

  case class TimerContainer(label: String, timer: Timer)
}
