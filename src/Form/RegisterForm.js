import React, {useContext, useState} from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../Context/AppContext";
import { REGISTER_INIT_STATE } from "./initialStates";
import { useFormik } from "formik";
import "./RegisterForm.css"

const validate = values => {
  const errors = {};
  if (!values.firstname) {
    errors.firstname = "Required";
  } 

  if (!values.lastname) {
    errors.lastname = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if ( values.password.length < 6) {
    errors.password = "Password must have 6 characters or more"
  }

  if (!values.username) {
    errors.username = "Required";
  } else if ( values.username.length < 5) {
    errors.username = "Username must be 5 characters long or more"
  }

  return errors;
};

const RegisterForm = () => {
  const history = useHistory();
  const formik = useFormik({
    initialValues: REGISTER_INIT_STATE,
    validate,
    onSubmit :async (values) => {
        const result = await register(values);
        if (result.success) {
          handleShowNotification({type:"registerSuccess", username:null})
          history.push("/");
        } else {
          setFormErrors(result.errors);
          handleShowNotification({type:"registerFailed",username:null})
        }
      }
  });

  const { register, handleShowNotification } = useContext(AppContext);
  const [ formErrors, setFormErrors ] = useState([]);

  console.debug(
    "Register Form",
    "register=", typeof register,
    "formData=", formik.values,
    "formErrors=", formErrors
  )

  return (
    <div className="RegisterForm-Container">
      <h2>Register</h2>
      <form className="RegisterForm" onSubmit={formik.handleSubmit}>
        <div className="RegisterForm-Input-Box">
          <input id="firstname"
                name="firstname"
                type="text"
                value={formik.values.firstname}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
          />
          <label htmlFor="firstname">
          First Name
          {
            formik.touched.firstname && formik.errors.firstname 
              ? <div className="RegisterForm-Error">{formik.errors.firstname}</div> 
              : null
          }  
          </label>      
        </div>

        <div className="RegisterForm-Input-Box">
          <input id="lastname"
                name="lastname"
                type="text"
                value={formik.values.lastname}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
          />
          <label htmlFor="lastname">
          Last Name          
          {
            formik.touched.lastname && formik.errors.lastname 
              ? <div className="RegisterForm-Error">{formik.errors.lastname}</div> 
              : null
          }  
          </label>          
       </div>

        <div className="RegisterForm-Input-Box">
          <input id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
          />
          <label htmlFor="email">Email Address          
          {
            formik.touched.email && formik.errors.email
              ? <div className="RegisterForm-Error">{formik.errors.email}</div>
              : null
          }   
          </label>          
       </div>

        <div className="RegisterForm-Input-Box">
          <input id="username"
                name="username"
                type="text"
                value={formik.values.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
          />
          <label htmlFor="username">Username
          {
            formik.touched.username && formik.errors.username
              ? <div className="RegisterForm-Error"> {formik.errors.username}</div>
              : null
          }   
          </label>              
       </div>

        <div className="RegisterForm-Input-Box">
          <input id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
          />
          <label htmlFor="password">Password          
          {
            formik.touched.password && formik.errors.password
              ? <div className="RegisterForm-Error">{formik.errors.password}</div>
              : null
          }  
          </label>          
       </div>


        <button type="submit">Create Account</button>
      </form>      
    </div>

  );
};

export default RegisterForm;