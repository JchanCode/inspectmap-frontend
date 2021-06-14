import React from "react";
import {useHistory} from "react-router-dom";
import LoginForm from "../Form/LoginForm";
import RegisterForm from "../Form/RegisterForm";
import logo from "../static/images/logo.png"
import "./LoginModal.css";

export default function LoginModal() {
  const history = useHistory();
  const cModal = e => {
    e.stopPropagation();
    history.goBack();
  }

  const closeModal = e => {
    e.stopPropagation();
  };

  return (
     <div className="LoginModal" onClick={cModal} >
      <div className="LoginModal-Content" onClick={closeModal} >
        <img className="LoginModal-Logo" src={logo} alt="logo" />
        <button className="LoginModal-Close-Btn" onClick={cModal}>X</button>
        <RegisterForm />
        <LoginForm />
        {/* <button type="button" onClick={closeModal}/> */}
      </div>
    </div>
  )
}


