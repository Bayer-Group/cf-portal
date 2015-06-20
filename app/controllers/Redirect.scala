package controllers

import play.api.mvc.{Action, Controller}

object Redirect extends Controller {
  def to(url: String) = Action(request => MovedPermanently(url))
}
