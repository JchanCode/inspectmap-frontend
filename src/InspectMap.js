import React, {useState, useContext} from 'react';
import AppContext from "./Context/AppContext"
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import { callSodaApi, getIcon, consolidate, getStartingCoord} from "./helper/functions";
import  ChangeView  from "./helper/ChangeView"
import { PopUpComp } from "./PopupComp";
import RestaModal from "./Modal/RestaModal";
import {v4} from "uuid"
import "./InspectMap.css";


export default function InspectMap() {
  const [ sRestaModal, setsRestaModal ] = useState({show:false, data:null});  
  const { searchMarker, restMarker, setRestMarker, setSearchMarker} = useContext(AppContext);
  const [ magLocation, setMagLocation ] = useState(getStartingCoord(searchMarker))

  const [ zoomLvl, setZoomLvl ] = useState(13)



  return (
      <>
      
      { sRestaModal.show
          ? 
              <RestaModal 
                address = {`${sRestaModal.data.building} ${sRestaModal.data.street}, ${sRestaModal.data.boro}, ${sRestaModal.data.zipcode}`}
                setModal = {setsRestaModal}
                name = {sRestaModal.data.dba}
                camis = {sRestaModal.data.camis}
                phone = {sRestaModal.data.phone}
                violation = {sRestaModal.data.violation}
                grade = {sRestaModal.data.grade_data.grade}
              />

          : null }

      <MapContainer center={getStartingCoord(searchMarker)} 
                    zoom={zoomLvl} 
                    scrollWheelZoom={false}>
        <ChangeView center={searchMarker ? getStartingCoord(searchMarker) : magLocation} zoom={zoomLvl} />
        <TileLayer  
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          eventHandlers={{
            dragend : async (e)=>{
              setSearchMarker(null)
              const lat = e.target._latlng.lat;
              const lng = e.target._latlng.lng;
              const result = await callSodaApi(lat, lng);
              const data = consolidate(result.data);
              setMagLocation([lat, lng])
              setRestMarker(data)
            },
            dragstart : (e) => {
              setZoomLvl(e.target._map._zoom)
            }
          }}
          autoPan={true}
          draggable={true}
          position={searchMarker? getStartingCoord(searchMarker) : magLocation}
          riseOnHover={true}
          icon={getIcon(70, false ,"search")}
          >
        </Marker>
        { restMarker
          ? restMarker.map( (r,idx) => {
            if (!r.dba) return null;
            return <>
                    < Marker
                      key={v4()}
                      draggable={false}
                      position={[r.latitude, r.longitude]}
                      riseOnHover={true}
                      riseOffset={1000}
                      icon={getIcon(40, false, r.grade_data.grade)}
                      >
                      <PopUpComp
                        key={v4()}
                        setsRestaModal={setsRestaModal}
                        restaData={r}
                      />
                    </Marker>
                  </>
          })
          : null
        }
        { searchMarker
            ? searchMarker.map( (r,idx) => (
              r.boro && r.latitude
                ?
                <>
                  <Marker
                    key={v4()}
                    draggable={false}
                    position={[r.latitude, r.longitude]}
                    riseOnHover={true}
                    riseOffset={1000}
                    icon={getIcon(40, false, r.grade_data.grade)}
                    >
                    <PopUpComp
                      key={v4()}
                      setsRestaModal={setsRestaModal}
                      restaData={r}
                    />
                  </Marker>
                </>                
                :
                null
            ))
            : null
        }
      </MapContainer>
      </>
  )
};



