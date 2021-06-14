import React from "react"
import {useLocation} from "react-router-dom"



export default function Page404 () {
  const location = useLocation();

  return (
    <div>
      <h2> Page 404 </h2>
      <p>Opps something went wrong</p>
      <p>No match for <code>{location.pathname}</code></p>
    </div>
  )
}