import axios from "axios";
import config from "../data/config"
import { consolidate } from './functions'

class SodaApi {
  static token;

  static async searchResta (searchTerm, boro) {
    // const headerOptions = {
    //   headers : {
    //     'X-App-Token' : `${config.MY_APP_TOKEN}`
    //   }
    // };

    // const queryOptions = `$query=SELECT camis,dba,boro,building,street,zipcode,phone,cuisine_description,inspection_date,action,violation_code,violation_description,critical_flag,score,grade,grade_date,record_date,inspection_type,latitude,longitude WHERE dba like '%${searchTerm.toUpperCase()}%' AND boro = '${boro}'`;
    // const sodaApiQueryString = config.NYC_RESTA_API_URL + queryOptions;
    // const results = await axios.get( sodaApiQueryString, headerOptions);
    // const cleanedResults = consolidate(results);

  const options = {
    headers : {
      'X-App-Token': config.MY_APP_TOKEN
    },
    params: {
      "$query": `SELECT camis,dba,boro,building,street,zipcode,phone,cuisine_description,inspection_date,action,violation_code,violation_description,critical_flag,score,grade,grade_date,record_date,inspection_type,latitude,longitude WHERE dba like '%${searchTerm.toUpperCase()}%' AND boro = '${boro}'`
    }
  };

  const results = await axios.get(config.NYC_RESTA_API_URL, options);

  return consolidate(results.data)
  };

  static async getRestas (markerLat, markerLng, radiusSize=config.RADIUS_SMALL) {
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
  };

  static async register (data) {
    try {
      const url = " http://localhost:3001/users/register";
      const result = await axios.post(url, data);
      // I AM EXpecting a {jsonWebToken: token}
      return result.data.jsonWebToken
    } catch (error) {
      console.error(error)
      return error
    }
  }

  static async login (data) {
    try {
      const url = " http://localhost:3001/users/login"
      const result = await axios.post(url, data)
      return result.data.jsonWebToken
    } catch (error) {
      console.error(error)
      return error
    }
  }

  static async getUser (username) {
    try {

      const url = `http://localhost:3001/users/${username}`
      const result = await axios.get(url, { 
        headers : { 
          Authorization : `${SodaApi.token}` }})
      return result.data
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

export default SodaApi