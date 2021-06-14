import React, {useState} from "react"
import Accordion from "./Accordion"


const AccordionController = ({restaViolations, stateIdx}) => {
  const [isActive, setIsActive] = useState(false);

  // pass the right data down to Accordion
  const toggle = (index) => {
    if (isActive === index) {
      return setIsActive(null);
    }
    setIsActive(index);
  }

  return (
    <div className="Accordion-Container">
      {restaViolations.map((inspectionDay, idx)=>(
        <Accordion
          key={idx}
          isActive={isActive}
          toggle={toggle}
          stateIdx={stateIdx+idx}
          inspectionDay={inspectionDay}
        />
      ))}

    </div>
  )
}

export default  AccordionController;

