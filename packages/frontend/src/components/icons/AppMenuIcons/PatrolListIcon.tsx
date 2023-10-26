import React from "react";

import IconContainer from "../IconContainer";
import { ComponentColor } from "types/enums";

function PatrolListIcon(props : {
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
      <path color={ color } fill="none" strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </IconContainer>
  );
}


export default PatrolListIcon;


