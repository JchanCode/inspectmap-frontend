import "./Notification.css"
import Notification from "./Notification";


export default function NotificationContainer({type}) {

  let msg;
  switch (type.type) {
    case "registerSuccess":
      msg = "Welcome to InspectMap NYC."
      break;
    case "registerFailed":
    case "loginFailed":
      msg = "Opps something went wrong. Please try again."
      break;
    case "loginSuccess":
      msg = `Welcome back ${type.username}!`
      break;
    case "logout":
      msg = "You've been logged out."
      break;
    case "noRestaurant":
      msg = "No Matching Restaurant."
      break;
    default:
      msg = "error"
      break;
  }
  return (
      <div className="Notification-Container">
          <Notification message={msg}/>
      </div>
  )
}