import React from "react";

const RadioButton = ({
  isChecked, disabled 
}: { isChecked: boolean; disabled?: boolean }) => {
  if (isChecked)
    return (
      <div data-test="radio-button-custom" id="radio-button">
        <div className="radio-button-container checked">
          <div className="check-div"></div>
        </div>
      </div>
    );

  return (
    <div data-test="radio-button-custom" id="radio-button">
      <div className={`radio-button-container unchecked ${disabled ? "disabled" : ""}`}></div>
    </div>
  );
};

export default RadioButton;
