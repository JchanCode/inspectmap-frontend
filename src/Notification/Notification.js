import React from "react"


export default function Notification ({message}) {
  return (
    <div className='Notification-Item'>
      <p >{message}</p>
    </div>
  )
}