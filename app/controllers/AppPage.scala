package controllers

import play.api._
import play.api.mvc._

object AppPage extends Controller {

  def index = Action {
    Ok(views.html.appdetail())
  }

}