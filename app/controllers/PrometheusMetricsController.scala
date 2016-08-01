package controllers

import java.io.{StringWriter, Writer}

import io.prometheus.client.Collector.MetricFamilySamples.Sample
import io.prometheus.client.CollectorRegistry
import io.prometheus.client.exporter.common.TextFormat
import play.api.libs.json.{JsString, Json}
import play.api.mvc.{Action, Controller}

import scala.collection.JavaConversions._

class PrometheusMetricsController() extends Controller() {}

object PrometheusMetricsController extends PrometheusMetricsController() {
  trait PrometheusMetricsController extends Controller
  private val registry: CollectorRegistry = CollectorRegistry.defaultRegistry

  def loadAction() = Action {
    val writer: Writer = new StringWriter
    TextFormat.write004(writer, registry.metricFamilySamples)
    writer.flush()
    writer.close()

    Ok(writer.toString)
  }

  def applyJson() = Action {
    var j = Json.obj()
    registry.metricFamilySamples().toList.foreach(element => j = j ++ Json.obj(element.name -> element.samples.map(sample => convertSampleToJson(sample))))
    Ok(j)
  }

  private def convertSampleToJson(sample: Sample) = {
    val namesZipped = sample.labelNames.zipWithIndex
    var j = Json.obj(sample.name -> sample.value.toString)
    namesZipped.map({case (label, index) => j = j + (label, JsString(sample.labelValues.get(index)))})
    j
  }

}