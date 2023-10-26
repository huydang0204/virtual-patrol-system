import React from "react";

import IconContainer from "./IconContainer";
import { IconProps } from "model-type/component-style";

function AppSidebarCollapseIcon(props : IconProps) : JSX.Element {
  const {
    color,
    className
  } = props;

  return (
    <IconContainer
      viewBox="0 0 50 40"
      className={ className }>
      <path fill="none" className={ `svg-stroke-${ color }` } d="M35.0414 31.9838C35.0403 32.7017 34.4573 33.283 33.7394 33.282L8.45607 33.2471C7.7381 33.2461 7.15698 32.6633 7.1581 31.9453L7.19482 8.43055C7.19594 7.71258 7.77888 7.13135 8.49685 7.13234L33.7802 7.1672C34.4981 7.16819 35.0792 7.75102 35.0781 8.46899L35.0414 31.9838Z" stroke="#2C405A" strokeWidth="1.4"/>
      <path fill="none" className={ `svg-stroke-${ color }` } d="M29.4648 32.9934L29.5047 7.44397" stroke="#2C405A" strokeWidth="1.4"/>
      <path fill="none" className={ `svg-stroke-${ color }` } d="M21.1094 26.1031L14.8436 20.1985L21.1278 14.3111" stroke="#2C405A" strokeWidth="1.4" strokeLinejoin="bevel"/>
    </IconContainer>
  );
}


export default AppSidebarCollapseIcon;
