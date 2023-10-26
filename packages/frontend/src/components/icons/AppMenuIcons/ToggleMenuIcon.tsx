import React from "react";

import IconContainer from "../IconContainer";

function ToggleMenuIcon(props : {
  color? : string,
  className? : string
}) : JSX.Element {
  const {
    color,
    className
  } = props;

  return (
    <IconContainer
      viewBox="0 0 29 29"
      className={ className }>
      <path color={ color } fill="none" d="M0.7 2C0.7 1.28203 1.28203 0.7 2 0.7H26C26.718 0.7 27.3 1.28203 27.3 2V26C27.3 26.718 26.718 27.3 26 27.3H2C1.28203 27.3 0.7 26.718 0.7 26V2Z"/>
      <path color={ color } fill="none" d="M6 1V27" />
      <path color={ color } fill="none" d="M14 8L20 14L14 20" strokeLinejoin="bevel"/>
    </IconContainer>
  );
}


export default ToggleMenuIcon;


