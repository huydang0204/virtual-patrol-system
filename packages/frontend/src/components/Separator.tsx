import React from "react";

function Separator(props : {
  className : string
}) {
  const { className } = props;
  return <div className={ `separator ${ className }` } />;
}

export default Separator;
