name := """cf-portal"""

version := "1.0-SNAPSHOT"

resolvers += "Local Maven Repository" at "file:///"+Path.userHome.absolutePath+"/.m2/repository"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.2"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "org.cloudfoundry" % "cloudfoundry-client-lib" % "1.1.2",
  "io.spray" %%  "spray-json" % "1.3.1",
  "com.typesafe.play" %% "play-slick" % "0.8.1",
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  "io.prometheus" % "simpleclient" % "0.0.15",
  "io.prometheus" % "simpleclient_hotspot" % "0.0.15",
  "io.prometheus" % "simpleclient_servlet" % "0.0.15",
  "io.prometheus" % "simpleclient_pushgateway" % "0.0.15"
)
