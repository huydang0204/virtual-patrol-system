import React, {
  CSSProperties,
  memo
} from "react";

function VerticalBlock(props : {
  position? : "center" | "top" | "bottom",
  children? : JSX.Element | JSX.Element[],
  className? : string,
  containerClassName? : string,
  containerStyle? : CSSProperties
}) {
  const {
    position,
    children,
    className,
    containerClassName,
    containerStyle
  } = props;
  const positionClass = (position ? position : "center") + "-element";
  return <div className={ `vertical-block${ className ? " " + className : "" }` }>
    <div className={ `block-element ${ positionClass }` }>
      <div
        className={ containerClassName ? containerClassName : "" }
        style={ containerStyle }>
        { children }
      </div>
    </div>
  </div>;
}

export default memo(VerticalBlock);
