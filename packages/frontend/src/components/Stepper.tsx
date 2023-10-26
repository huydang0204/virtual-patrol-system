import _ from "lodash";
import React from "react";

import { StepperProps } from "model-type/component-style";

const Stepper = (props: StepperProps): JSX.Element => {
  const {
    steps = [], activeStep = 0, style 
  } = props;

  const totalSteps = steps.length;
  const completedSteps = !!totalSteps && _.range(0, totalSteps).filter((step) => step < activeStep);

  return (
    <div className="stepper-container">
      <div className="d-flex justify-content-center">
        {!!totalSteps &&
          steps.map((step, index) => {
            return (
              <div key={index} className="d-flex align-items-center">
                <div className="step d-flex flex-column justify-content-center align-items-center">
                  <label
                    className={`step-label ${
                      completedSteps.includes(index)
                        ? style.completeLabelColor
                        : activeStep === index
                          ? style.activeLabelColor
                          : style.defaultLabelColor
                    }`}>
                    {step.title}
                  </label>
                  <div
                    className={`step-number
                  ${
              completedSteps.includes(index)
                ? `${style.completeBgColor} ${style.completeStepItemColor}`
                : activeStep === index
                  ? `${style.activeBgColor} ${style.activeStepItemColor}`
                  : `${style.defaultBgColor} ${style.defaultStepItemColor}`
              }`}>
                    {index + 1}
                  </div>
                </div>
                {index + 1 !== totalSteps && (
                  <div
                    className={`step-line ${
                      completedSteps.includes(index) ? style.completeBgColor : style.defaultBgColor
                    }`}></div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Stepper;
