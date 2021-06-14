import './App.css';
import { useState, useEffect } from "react" 
import {Switch, Route, useLocation} from "react-router-dom";
import Navbar from "./Navbar";
import NotificationContainer from "./Notification/NotificationContainer"
import InspectMap from "./InspectMap";
import LoginModal from "./Modal/LoginModal"
import LogoutModal from "./Modal/LogoutModal"
import AppContext from "./Context/AppContext"
import SodaApi from "./helper/SodaApi"
import useLocalStorage from "./hooks/useLocalStorage"
import jwt from "jsonwebtoken"
import config from "./data/config"





function App() {
  const [ restMarker, setRestMarker ] = useState(null);
  const [token, setToken] = useLocalStorage(config.TOKEN_STORAGE_KEY);
  const [currUser, setCurrUser] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationType, setNotificationType] = useState(config.INIT_NOTIF_STATE );
  const [ searchMarker, setSearchMarker] = useState(null);
  let location = useLocation();
  let background = location.state && location.state.background;

  useEffect(()=> {
    async function getCurrUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          SodaApi.token = token;
          let currentUser = await SodaApi.getUser(username);
          setCurrUser(currentUser);
        } catch (error) {
          console.error("App getCurrUser Error", error)
          setCurrUser(null)
        }
      };
    };
    getCurrUser()
  }, [token])

  
  useEffect(()=>{
    const timeout = setTimeout(() => {
      setNotificationType(config.INIT_NOTIF_STATE);
      setNotification(false)
    }, 5000);
    return ()=> clearTimeout(timeout)
  },[notification])

  const register = async(formData) => {
    try {
      let token = await SodaApi.register(formData);
      SodaApi.token = token;
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("register failed", errors);
      return { success: false, errors};
    }
  };

  const login = async(formData) =>{
    try {
      let token = await SodaApi.login(formData);
      let { username } = jwt.decode(token);
      setToken(token);
      SodaApi.token = token
      return { success: true, username };
    } catch (errors) {
      console.error("Login failed", errors)
      return { success: false, errors};
    }
  }

  const handleShowNotification = (type)=>{
    setNotificationType(type)
    setNotification(true);
  }

 

  const logout = () => {
    setCurrUser(null);
    setToken(null);
  };

  // need to put user Context into userContext
  return (
    <AppContext.Provider value={{register, login, logout, currUser, handleShowNotification, searchMarker, setSearchMarker, restMarker, setRestMarker}}>
      <div className="App">
        <Navbar />
          { notification
              ? <NotificationContainer type={notificationType}/>
              : null}
        <InspectMap />
        <Switch location={ background ||  location }>
        </Switch>
        { background && <Route path="/logout" ><LogoutModal/></Route>}
        { background && <Route path="/registerlogin" ><LoginModal/></Route>}
      </div>
    </AppContext.Provider>
  );
}

export default App;



// import './App.css';
// import {Link, Switch, Route} from "react-router-dom";
// import Navbar from "./Navbar";
// import InspectMap from "./InspectMap";


// function App() {
//   return (

//     <div className="App">
//         <Navbar/>      
//       <Switch>
//         <Route path="/" exact component={InspectMap} />
//       </Switch>
//     </div>
//   );
// }

// export default App;
