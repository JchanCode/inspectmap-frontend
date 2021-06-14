

import config from "../data/config";
import axios from "axios";
import L from "leaflet";
import searchIcon from "../static/icons/searchMagnifierMarker.png"
import defaultMarker from "../static/icons/restaurant.png"
import aMarker from "../static/icons/blueMarker.png"
import bMarker from "../static/icons/greenMarker.png"
import cMarker from "../static/icons/orangeMarker.png"
import pMarker from "../static/icons/purpleMarker.png"
import gradeA from "../static/images/gradeA.svg"
import gradeB from "../static/images/gradeB.svg"
import gradeC from "../static/images/gradeC.svg"
import gradeNot from "../static/images/gradeNotYet.svg"
import gradePending from "../static/images/gradePending.svg"
import gradeClosed from "../static/images/gradeClosed.svg"



/**
 *    Using Axios to call our NYC data's api.
 *    
 * */ 
const callSodaApi = async ( markerLat, markerLng, radiusSize=config.RADIUS_SMALL ) => {
  // sets four points of coordinates for api query string
  const latA = markerLat - radiusSize;
  const latB = markerLat + radiusSize;
  const lngA = markerLng - radiusSize;
  const lngB = markerLng + radiusSize;
  // Api needs a App token to be passed in 
  const headerOptions = {
    headers : { 
      "X-App-Token" : config.MY_APP_TOKEN }
  };

  const queryOptions = `$select=camis,dba,boro,building,street,zipcode,phone,cuisine_description,inspection_date,action,violation_code,violation_description,critical_flag,score,grade,grade_date,record_date,inspection_type,latitude,longitude&$where=latitude between ${latA} and ${latB} AND longitude between ${lngA} and ${lngB}&$order=camis ASC&$limit=1000`

  const sodaApiQueryString = config.NYC_RESTA_API_URL + queryOptions;
  const result = await axios.get( sodaApiQueryString, headerOptions );

  return result;
}

const getStartingCoord = ( searchMarker=null ) => {
  let coord;
  if (searchMarker) {
    const boro = searchMarker[0].boro
    switch (boro) {
      case 'Staten Island':
        coord = [40.589440,-74.133477]
        break;
      case "Bronx":
        coord = [40.843783,-73.855875]
        break;
      case "Brooklyn":
        coord = [40.644504,-73.958244]
        break;
      case "Queens":
        coord = [40.757887,-73.801660]
        break;
      case "Manhattan":
        coord = [40.762497,-73.972789]
        break;
      default:
        coord = [40.762497,-73.972789]
        break;
    }
    
    return coord;
  }
  
  return [40.762497,-73.972789];
}

const getIcon = (iconSize=50, isImgTag ,type) => {
  let marker;

  if (isImgTag) {
    switch (type) {
      case "A":
        marker = gradeA
        break;
      case "B":
        marker = gradeB
        break;
      case "C":
        marker = gradeC
        break;
      case "not_yet":
        marker = gradeNot
        break;
      case "P":
        marker = gradePending
        break;
      default:
        marker =  defaultMarker
    }
  } else {
      switch (type) {
    case "A":
      marker = aMarker
      break;
    case "B":
      marker = bMarker
      break;
    case "C":
      marker = cMarker
      break;
    case "P":
      marker = gradePending
      break;
    case "not_yet":
      marker = pMarker
      break;
    case "closed":
      marker =  gradeClosed
      break;
    case "search":
      marker = searchIcon
      break;
    default:
      marker = defaultMarker
  }
}

  if (isImgTag) {
    return marker
  }

  return L.icon({
      iconUrl : marker,
      iconSize: iconSize
  });    
}


/** Takes scatter apiData and organize for this app's usage**/ 
const consolidate = (apiData) => {
  let cleanedData = apiData.reduce((accu, currObj) =>{

    let violationObj = {
      date: currObj.inspection_date,
      type: currObj.inspection_type,
      code: currObj.violation_code,
      desc: currObj.violation_description,
      point: currObj.score
    };

    let gradeObj;
    if (currObj.grade_date) {
      gradeObj = {
        date : currObj.grade_date,
       grade : currObj.grade
      };
    };

    /* 
       {                           
         vioCode : data*             
         insDate : data*            {
         insType : data*              violation:[{},{},{},{}],
         vioDesc : data*    =====>    grade_data:[{},{},{},{}],
         graDate : data*              ...
         grade   : data*            }
         ...          
       }                    
    */ 
    if (accu[currObj.camis]) {
      if (currObj.grade_date) {
        if ( !accu[currObj.camis].grade_data ) {
          accu[currObj.camis].grade_data = gradeObj;
        }
        if ( currObj.grade_date.slice(0,4) > accu[currObj.camis].grade_data.date.slice(0,4) ) {
          accu[currObj.camis].grade_data = gradeObj;
        }
      };
     
      accu[currObj.camis].violation.push(violationObj);
    } else {
      const { score, inspection_date, inspection_type, violation_code, violation_description, ...obj} = currObj;

      if (obj.grade) {
        accu[currObj.camis] = {
          ...obj, 
          violation : [violationObj],
          grade_data : gradeObj
        }
      } else {
        accu[currObj.camis] = { 
          ...obj, 
          violation: [violationObj],
          grade_data : {
            date : "2015-00-29T00:00:00.000",
            grade : "not_yet"
          }
        }        
      }
    };
    if(!accu[currObj.camis].grade_data) {
      accu[currObj.camis].grade_data = {
            date : "2015-00-29T00:00:00.000",
            grade : "not_yet"
          }
    };


    return accu;
  },{})
  /**
   *    {               [
   *      123:{},         {},  
   *      765:{},  ===>   {},
   *      234:{},         {},
   *    }               ]
   * **/ 
  const data = Object.keys(cleanedData).map(key => cleanedData[key] )
  return data;
};




/**
 * The date in our restaurant obj's violation array, is not grouped or organized.  
 *          ex* violation: [{2019},{2018},{2020},{2018}]
 *   ===>   ex* violation: [{2020},{2019},{ data:[2018,2018]}]
 *              using bubble sort to sort the data.
 * **/ 
const cleanViolation = (violationArray) => {
  const newViolationArray = violationArray.reduce((accu, curr)=>{
    let dataObj = {
      code: curr.code,
      type: curr.type,
      description: curr.desc
    }
    
    let violationObj = {
      date: curr.date,
      point: curr.point,
      data: [dataObj]
    }

    if(accu.length !== 0) {
      for (let i=0; i<accu.length; i++) {
        if ( accu[i].date === curr.date ) {
          accu[i].data.push(dataObj);
          return accu;
        } 
      }      
    }
    accu.push(violationObj);    

    return accu
  },[]);

  return sort(newViolationArray);
}

const sort = (array) => {

  let i, j;
  let isSwapped = false;
  let temp;
  // debugger;
  for ( i= 0; i<array.length-1; i++) {

    isSwapped = false;

    for (j=0; j<array.length-1; j++) {
      let left = array[j];
      let right = array[j+1];
      if ( left.date.slice(0,4) < right.date.slice(0,4) ) {
        temp = array[j]
        array[j] = array[j+1]
        array[j+1] = temp;
        isSwapped = true
      } else if ( left.date.slice(0,4) === right.date.slice(0,4) ) {
        if ( left.date.slice(5,7) < right.date.slice(5,7) ) {
          temp = array[j]
          array[j] = array[j+1]
          array[j+1] = temp;
          isSwapped = true
        }
      } 
    }

    if(!isSwapped) {
      break;
    }
  }

  return array
};

const colorByScore = (point)=> {
  if ( point >= 0 && point <= 13 ) return '#0058a9'
  if ( point >= 14 && point <= 27 ) return '#26a146'
  if ( point >= 28 ) return '#f68b1f'
  if ( point === "--" ) return '#5d2881'
  return '#000000'
};



export { getStartingCoord, getIcon, callSodaApi, consolidate, cleanViolation, colorByScore};


