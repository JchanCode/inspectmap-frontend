import React, { useContext } from "react";
import AppContext from "./Context/AppContext";
import {Link, useLocation} from "react-router-dom";
import SearchForm from "./Form/SearchForm";
import "./Navbar.css";
import logo from "./static/images/logo.png";


function Navbar() {
  let location = useLocation();
  const { currUser } = useContext(AppContext);



  return (
    <div className="Navbar">
      <img className="Navbar-logo" src={logo} alt="logo" />
      { currUser 
          ?   <>
                <SearchForm/>
                <Link to={{
                        pathname : '/logout',
                        state: {background: location}
                      }}
                      className="NavBar-Logout-Link"
                >Logout
                </Link>
              </>
          :   <Link to={{
                      pathname : `/registerlogin`,
                      state: {background: location}
                      }}
                    className="NavBar-Login-Link"
              >Register / Login
              </Link>
      }          

    </div>
  )
};

export default Navbar;