import React from "react";
import { BiCheck } from "react-icons/bi";

function CheckBox({
  isChecked, disabled 
}: { isChecked: boolean; disabled?: boolean }) {
  if (isChecked) {
    return (
      <div className="checkbox-container bg-primary">
        <BiCheck color="white" size={16} />
      </div>
    );
  }

  return <div className={`unchecked ${disabled && "disabled"}`}></div>;
}

export default CheckBox;
