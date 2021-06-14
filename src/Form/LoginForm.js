import React, { useState ,useContext } from "react";
import { LOGIN_INIT_STATE } from "./initialStates";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import AppContext from "../Context/AppContext"
import "./LoginForm.css"


const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = "Required";
  } 

  if (!values.password) {
    errors.password = "Required"
  }

  return errors;
}

const LoginForm = () => {
  const history = useHistory();
  const formik = useFormik({
    initialValues : LOGIN_INIT_STATE,
    validate,
    onSubmit :async values => {
      const result = await login(values);
      if (result.success) {
        handleShowNotification({type:"loginSuccess", username:result.username})
        history.push("/")
      } else {
        handleShowNotification({type:"loginFailed", username:null})
        setFormErrors(result.errors)
      }
    },
  });

  const { login, handleShowNotification } = useContext(AppContext);
  const [ formErrors, setFormErrors ] = useState([]);

  console.debug(
    "LoginForm",
    "login=", typeof login,
    "formData=", formik.values,
    "formErrors=", formErrors,
  )


  return (
    <div className="LoginForm-Container">
      <h2>Login</h2>
      <form className="LoginForm" onSubmit= {formik.handleSubmit}>
        <div className="LoginForm-Input-Box">  
          <input type ="text" 
                id ="fUsername" 
                {...formik.getFieldProps("username")}
        />              
          <label htmlFor ="fUsername">Username
          { 
          formik.touched.username && formik.errors.username
            ? <div className="LoginForm-Error">{formik.errors.username}</div>
            : null
          }  
          </label>             
        </div>


        <div className="LoginForm-Input-Box">
          <input type ="password" 
                id ="fPw" 
                {...formik.getFieldProps("password")}
          />
          <label htmlFor ="fPw">Password        
          { 
          formik.touched.password && formik.errors.password
            ? <div className="LoginForm-Error">{formik.errors.password}</div>
            : null
          } 
          </label>        
        </div>

        <button type="submit">Login</button>
      </form>      
    </div>
  )
} 
export default LoginForm;