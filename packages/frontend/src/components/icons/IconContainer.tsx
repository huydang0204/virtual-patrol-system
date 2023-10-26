import React from "react";

function IconContainer(props : {
  viewBox : string,
  children : unknown,
  className? : string
  style? : React.CSSProperties
}): JSX.Element {
  const {
    viewBox,
    children,
    className,
    style
  } = props;

  return (
    <svg
      className={ `sy-svg-icon${ className ? " " + className : "" }` }
      version="1.1"
      viewBox={ viewBox }
      xmlSpace="preserve"
      style={ style }>
      { children }
    </svg>
  );
}

export default IconContainer;
