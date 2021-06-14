import React from 'react';

import AccordionController from "../Accordion/AccordionController"
import "./RestaModal.css"
import {getIcon, cleanViolation} from "../helper/functions"

const RestaModal = ({grade, phone, address, name, camis, setModal, violation}) => {

  const restaViolations = cleanViolation(violation);

  const closeModal = e => {
    e.stopPropagation();
  }
  
  return (
    <div className="RestaModal" onClick={()=>setModal({show:false, data:null})}>
      <div className="RestaModal-Content" onClick={closeModal}>
        <div className="RestaModal-Header">
          <button onClick={()=>{setModal({show:false, data:null})}}>X</button>
        </div>
        <div className="RestaModal-Body">
          <table className="RestaModal-Table">       
            <tbody>
              <tr>
                <td colSpan="2" className="RestaModal-Img">
                  <img src={getIcon(null, true, grade)} alt="Grade"/>
                </td>
              </tr>
              <tr className="RestaModal-Tr">
                <td >Name : </td>
                <td className="RestaModal-Table-Value">{name}</td>
              </tr>
              <tr className="RestaModal-Tr">
                <td>Address : </td>
                <td className="RestaModal-Table-Value">{address}</td>
              </tr>
              <tr className="RestaModal-Tr">
                <td>Permit Number : </td>
                <td className="RestaModal-Table-Value">{camis}</td>
              </tr>
              <tr className="RestaModal-Tr">
                <td>Phone Number : </td>
                <td className="RestaModal-Table-Value">{phone}</td>
              </tr>
            </tbody>
          </table>
          <div className="RestaModal-Accordion-Container">
            <AccordionController
              restaViolations = {restaViolations}
              stateIdx={camis}
              />
          </div>
        </div>
        <div className="RestaModal-footer">
        </div>
      </div>
    </div>
  )
};

export default RestaModal;

