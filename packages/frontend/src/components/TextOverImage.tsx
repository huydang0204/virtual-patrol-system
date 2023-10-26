import React from "react";

const TextOverImge = (props: { Icon?: JSX.Element; text: string; cols?: number }) => {
  const {
    Icon, text, cols 
  } = props;
  
  return (
    <div
      id="text-over-image"
      style={{
        fontSize : cols >= 6 ? "10px" : cols >= 8 && "8px",
        width : "100%"
      }}>
      <div className="wrapper">
        <div className="inner-wrapper">
          {Icon || <></>}
          <span className="mt-2">{text}</span>
        </div>
      </div>
    </div>
  );
};
  
export default TextOverImge;