import React from "react"
import "./Accordion.css"
import AccordionItem from "./AccordionItem"
import { colorByScore } from "../helper/functions"

const Accordion = (
  { inspectionDay, stateIdx, toggle, isActive}) => {
  const date = inspectionDay.date.slice(0,10);
  const violationData = inspectionDay.data;
  const {type, point} = inspectionDay;

  const scoreColor = colorByScore(point || "--");


  return (
      <div className="Accordion">
        <div 
          className="Accordion-Title"
          onClick={()=>( toggle(stateIdx) )}
        >
          <p>
              <b>{`${date}`}  </b>
              <span>   
              {`${type === "Administrative Miscellaneous /  Re-inspection" ||      "Administrative   Miscellaneous / Initial Inspection"
                    ? "Administrative / Re-inspection"
                    : type }`}               
              </span>
              <span 
                style={{color: scoreColor}}>
              {`Score:${point || "--"}`}
              </span>
            
          </p>
          { isActive === stateIdx
            ? <i> - </i>
            : <i> + </i>
          }
        </div>
        { isActive === stateIdx &&
          <div className="Accordion-Table-Container">
            <table className="Accordion-Table">
              <thead className="Accordion-Thead">
                <tr>
                  <th >Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody className="Accordion-Tbody">
                {violationData.map((v,idx)=>(
                  <AccordionItem
                    key={idx}
                    code={v.code}
                    desc={v.description}
                  />
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
  )
};

export default Accordion;
