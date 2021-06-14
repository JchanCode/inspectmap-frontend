import React, { useContext } from "react";
import AppContext from "../Context/AppContext"
import {useHistory} from "react-router-dom";
import logo from "../static/images/logo.png"
import "./LogoutModal.css";

export default function LogoutModal() {
  const { logout, handleShowNotification } = useContext(AppContext);
  const history = useHistory();
  const cModal = e => {
    e.stopPropagation();
    history.goBack();
  }

  const closeModal = e => {
    e.stopPropagation();
  };

  return (
     <div className="LogoutModal" onClick={cModal} >
      <div className="LogoutModal-Content" onClick={closeModal} >
        <img className="LogoutModal-Logo" src={logo} alt="logo" />
        <p className="LogoutModal-Message" >Some features would be disabled, Log out?</p>
        <button className="LogoutModal-Yes-Btn" 
                onClick={(e)=>{
                  cModal(e);
                  logout();
                  handleShowNotification({type:"logout", username:null})
                }}>
        Yes, log out
        </button>
        <button className="LogoutModal-No-Btn" 
                onClick={cModal}>
        No
        </button>

      </div>
    </div>
  )
}


