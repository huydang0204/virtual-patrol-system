import React from "react";

import IconContainer from "../IconContainer";
import { ComponentColor } from "types/enums";

function ReportIcon(props : {
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
      <path stroke={ color } fill="none" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </IconContainer>
  );
}


export default ReportIcon;
