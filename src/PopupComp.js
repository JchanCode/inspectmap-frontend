import React from "react"
import { Popup } from "react-leaflet"
import { getIcon } from "./helper/functions"
import "./PopupComp.css"

export const PopUpComp = ({setsRestaModal, restaData}) => {


  return (
    <Popup>
      <div className="Popup-Container">
        <img width="115" height="120" className="Popup-Img" src={getIcon(null,true ,`${restaData.grade_data.grade}`)} alt="A"></img>
        <address className  ="Popup-info">
          <h3><b>{restaData.dba}</b></h3><br/>
          <h4>{`Tel: ${restaData.phone}`}</h4>
          <p>{`${restaData.building} ${restaData.street}, ${restaData.boro} ${restaData.zipcode}`}</p>
        </address>
        <div className="Popup-Footer">
          <button 
            className="Popup-Btn"
            onClick={()=>(setsRestaModal({
              show: true,
              data: {...restaData}
            }))}
          >Details
          </button>
          <button className="Popup-Btn">Bookmark</button>
        </div>
      </div>
    </Popup>
  )
}