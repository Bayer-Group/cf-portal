package controllers.settings

import spray.json._
import spray.json.DefaultJsonProtocol._

class CloudProperties extends (() => Map[String, String]) {
  implicit val serviceDefinitionFormat = jsonFormat(ServiceDefinition, "credentials")
  implicit val servicesFormat = jsonFormat(Services, "user-provided")

  lazy val props = {
    val vcap = sys.env.getOrElse("VCAP_SERVICES", sys.props.getOrElse("VCAP_SERVICES", "{}"))
    val services = vcap.parseJson.convertTo[Services]
    val properties = for(service <- services.serviceDefinitions.getOrElse(List()) if service.properties.contains("alias");
                         kv <- service.properties if kv._1 != "alias")
    yield (service.properties.get("alias").get + "." + kv._1, kv._2)
    properties.toMap
  }

  override def apply(): Map[String, String] = props

  case class Services(serviceDefinitions: Option[List[ServiceDefinition]])
  case class ServiceDefinition(properties: Map[String, String])
}

object CloudProperties extends CloudProperties
