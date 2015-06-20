package controllers.models

import java.util.UUID

case class CFAppEvent(eventType: String, actor: String, actorType: String, actorName: String,
                      actee: String, acteeType: String, acteeName: String, timeStamp: String)

