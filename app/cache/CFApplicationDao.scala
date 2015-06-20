package cache

import java.net.URI

import controllers.Applications._
import controllers.models.CFApplication
import controllers.settings.Settings
import org.cloudfoundry.client.lib.domain.CloudSpace
import org.cloudfoundry.client.lib.{CloudFoundryClient, CloudCredentials}
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._


class CFApplicationDao {

    lazy val settings = new Settings("cf")
    lazy val credentials = new CloudCredentials(settings("user"), settings("password"))
    lazy val url = settings("url")

    def loadAll() = {
      def cfClient = new CloudFoundryClient(credentials, URI.create(url).toURL, true)
      def cfSpaceClient(space: CloudSpace) = new CloudFoundryClient(credentials, URI.create(url).toURL, space, true)

      cfClient.getSpaces.asScala.par.flatMap(space => {
        val spaceClient = cfSpaceClient(space)
        spaceClient.getApplications.map(app => CFApplication(app.getName, space.getOrganization.getName, space.getName, app.getUris,
          app.getState.toString, app.getMeta.getGuid.toString))
      }).toVector
    }
}




