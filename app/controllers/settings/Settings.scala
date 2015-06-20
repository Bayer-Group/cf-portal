package controllers.settings

import org.slf4j.{LoggerFactory, Logger}
import play.Play
import scala.collection.JavaConversions._

class Settings(key: String) extends (String => String) {
  private val log: Logger = LoggerFactory.getLogger(getClass)
  lazy val asMap = Play.application.configuration.getObject(key).asInstanceOf[java.util.HashMap[String, String]].toMap

  lazy val cloudProperties = CloudProperties.props

  override def apply(name: String): String = {
    log.info("key/name [{}]", key + "/" + name)
    def error= throw new NoSuchElementException(s"required configuration property $key/$name is missing")

    cloudProperties.getOrElse(s"$key.$name", asMap.getOrElse(name, error))
  }
}
