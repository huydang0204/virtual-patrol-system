import React from "react";

import IconContainer from "./IconContainer";
import { IconProps } from "model-type/component-style";

function CameraIcon(props : IconProps) : JSX.Element {
  const {
    color,
    className
  } = props;

  return (
    <IconContainer
      viewBox="0 0 104 82"
      className={ className }>
      <path
        className={ `svg-stroke-${ color }` }
        style={
          {
            "fill" : "none",
            "strokeWidth" : 8,
            "strokeLinecap" : "round",
            "strokeLinejoin" : "round",
            "strokeMiterlimit" : 10
          }
        }
        d="M100,62V21.7c0-3.7-3-6.7-6.7-6.7H75.8c-1.7,0-3.2-1.1-3.8-2.6l-2-5.8C69.4,5,67.9,4,66.2,4H37.8
		c-1.7,0-3.2,1.1-3.8,2.6l-2,5.8C31.4,14,29.9,15,28.2,15H10.7C7,15,4,18,4,21.7v49.6C4,75,7,78,10.7,78H86" />
      <circle
        className={ `svg-stroke-${ color }` }
        style={
          {
            "fill" : "none",
            "strokeWidth" : 8,
            "strokeLinecap" : "round",
            "strokeLinejoin" : "round",
            "strokeMiterlimit" : 10
          }
        }
        cx="52"
        cy="47"
        r="15" />
    </IconContainer>
  );
}


export default CameraIcon;
