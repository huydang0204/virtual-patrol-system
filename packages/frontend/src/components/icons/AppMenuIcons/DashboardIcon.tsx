import React from "react";

import IconContainer from "../IconContainer";
import { ComponentColor } from "types/enums";

function DashboardIcon(props : {
  color? : ComponentColor,
  className? : string
}) : JSX.Element {
  const {
    color,
    className
  } = props;

  return (
    <IconContainer
      viewBox="0 0 24 24"
      className={ className }>
      <rect x="1.275" y="1.275" width="21.45" height="21.45" rx="0.975" stroke={ color } fill="none" strokeWidth="1.05"/>
      <path d="M12 0.75V22.5" stroke={ color } strokeWidth="1.05"/>
      <path d="M12 12H22.5" stroke={ color } strokeWidth="1.05"/>
    </IconContainer>
  );
}


export default DashboardIcon;
