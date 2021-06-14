import React from "react";
import "./AccordionItem.css"


const AccordionItem = ({code, desc})=> {

  return (

    <tr className="AccordionItem-Tr">
      <td>{code}</td>
      <td>{desc}</td>
    </tr>
  )
}

export default AccordionItem;

