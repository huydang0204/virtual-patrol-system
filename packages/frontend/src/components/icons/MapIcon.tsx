import React from "react";

import IconContainer from "./IconContainer";
import { IconProps } from "model-type/component-style";

function MapIcon(props: IconProps): JSX.Element {
  const {
    color, className 
  } = props;

  return (
    <IconContainer viewBox="0 0 42 42" className={className}>
      <path
        d="M6.375 23.0131C3.05798 24.4763 1 26.5154 1 28.7708C1 33.2236 9.02157 36.8333 18.9167 36.8333C28.8118 36.8333 36.8333 33.2236 36.8333 28.7708C36.8333 26.5154 34.7754 24.4763 31.4583 23.0131M29.6667 11.75C29.6667 19.0308 21.6042 22.5 18.9167 27.875C16.2292 22.5 8.16667 19.0308 8.16667 11.75C8.16667 5.81294 12.9796 1 18.9167 1C24.8537 1 29.6667 5.81294 29.6667 11.75ZM20.7083 11.75C20.7083 12.7395 19.9062 13.5417 18.9167 13.5417C17.9272 13.5417 17.125 12.7395 17.125 11.75C17.125 10.7605 17.9272 9.95833 18.9167 9.95833C19.9062 9.95833 20.7083 10.7605 20.7083 11.75Z"
        color={color}
        stroke={color}
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconContainer>
  );
}

export default MapIcon;
