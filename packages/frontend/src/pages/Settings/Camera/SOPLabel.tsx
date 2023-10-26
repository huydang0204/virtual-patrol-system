import React from "react";

function SOPLabel(props : { sop : string}) : JSX.Element {
  return <div
    style={ {
      border : "0.5px solid",
      padding : "2px 5px"
    } }
    className="rounded-pill text-success border-success">
    { props.sop }
  </div>;
}

export default SOPLabel;