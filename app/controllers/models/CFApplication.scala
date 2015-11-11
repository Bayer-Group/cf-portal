package controllers.models

import org.cloudfoundry.client.lib.domain.{CloudApplication, CloudSpace}
import scala.collection.JavaConverters._

case class CFApplication(name: String, org: String, space: String, uris: Seq[String], state: String, guid: String, buildpack: String)
object CFApplication extends ( (String, String, String, Seq[String], String, String, String) => CFApplication ){

  def fromDB(tupledArgs: (String, String, String, String, String, String, String)): CFApplication =
    CFApplication(tupledArgs._1, tupledArgs._2, tupledArgs._3, tupledArgs._4.split(",").toSeq, tupledArgs._5, tupledArgs._6,
      tupledArgs._7)

  def unapplyFromDB(app: CFApplication): Option[(String, String, String, String, String, String, String)] =
    Some(app.name, app.org, app.space, app.uris.mkString(","), app.state, app.guid, app.buildpack)
}