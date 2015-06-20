package controllers.models

import org.cloudfoundry.client.lib.domain.{InstanceState, CloudApplication, CloudSpace}
import scala.collection.JavaConverters._

case class CFApp(cpu: Double, host: String, instanceid: String, uptime: Double, state: String, name: String, mem: Int)