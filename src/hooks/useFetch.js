import { useEffect, useState } from "react"
import axios from "axios"


const useFetch = (url, options={}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // after first render fetch our data
  useEffect(()=>{
    const fetchData = async()=>{ 
      try {
        const resp = await axios.get(url);
        setResponse(resp);
      } catch (error) {
        setError(error)
      }
      setIsLoading(false);
    };
    fetchData();
  },[url])

  return { response, error, isLoading };
};

export default useFetch