import React, { useState ,useContext } from "react"
import AppContext from "../Context/AppContext"
import SodaApi from "../helper/SodaApi"
import config from "../data/config"
import "./SearchForm.css"


const SearchForm = () => {
  const { setSearchMarker, setRestMarker, handleShowNotification } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState(config.INIT_SEARCH_STATE)
  const handleChange = e => {
    const { value, name }  = e.target;    
    setSearchTerm((e)=>{
      return {
        ...searchTerm,
        [name] : value
      }
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await SodaApi.searchResta(searchTerm.searchTerm, searchTerm.boro);

    if (res.length === 0 ) {
      handleShowNotification({type:"noRestaurant",user:null});
    } else {
      setRestMarker(null);
      setSearchTerm(config.INIT_SEARCH_STATE);
      setSearchMarker(res);
    }      
    // res.length === 0 
    //   ?
    //     handleShowNotification({type:"noRestaurant",user:null})
    //   :  
    //     setRestMarker(null)    
    //     setSearchTerm(config.INIT_SEARCH_STATE);
    //     setSearchMarker(res);   
  }

  

  return (

    <form className="SearchForm" onSubmit={handleSubmit}>

        <label htmlFor="searchBar">Restaurant Name:</label>
        <input type="text"
              id="searchBar"
              name="searchTerm"
              placeholder="Enter Restaurant Name"
              value={searchTerm.searchTerm}
              onChange={handleChange}       
        />        

        <label htmlFor="boro">Borough: <span>*</span></label>
        <select id="boro" 
                name="boro"
                value={searchTerm.boro}
                onChange={handleChange}
                required
        > 
          <option value="" defaultValue disabled hidden>Select a Boro</option>
          <option value="Brooklyn">Brooklyn</option>
          <option value="Manhattan">Manhattan</option>
          <option value="Staten Island">Staten Island</option>
          <option value="Bronx">Bronx</option>
          <option value="Queens">Queens</option>
        </select>        
   
        <button className="SearchFormButton" type="submit">Search</button>      
    </form>
)}


export default SearchForm;