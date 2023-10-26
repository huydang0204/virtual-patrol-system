import React, { useState } from "react";
import {
  Button, Col, Row 
} from "reactstrap";
import { BsClock } from "react-icons/bs";

import useOutsideClick from "hooks/useOutsideClick";
import InputTimePicker from "./InputTimePicker";

import { convertSecondsToHumanReadableFormat } from "utils/date-time";
import { InputTimeRangePickerProps } from "model-type/component-style";

const enum Time {
    "StartTime" = "StartTime",
    "EndTime" = "EndTime"
}

const InputTimeRangePicker: React.FC<InputTimeRangePickerProps> = ({
  disabled = false,
  timeRange = {
    startTime : 3600,
    endTime : 7200 
  }, onTimeRangePick 
}) => {
  const [startTimeInSeconds,
    setStartTimeInSeconds] = useState<number>(timeRange.startTime);
  const [endTimeInSeconds,
    setEndTimeInSeconds] = useState<number>(timeRange.endTime);

  const handleTimeSelect = (time : Time, timeInSeconds : number): void => {
    if (time === Time.StartTime) setStartTimeInSeconds(timeInSeconds);
    else if (time === Time.EndTime) setEndTimeInSeconds(timeInSeconds);
  };

  const handleTimeRangeSelect = () => {
    if (startTimeInSeconds !== -1 || endTimeInSeconds !== -1) {
      onTimeRangePick({
        startTime : startTimeInSeconds,
        endTime : endTimeInSeconds 
      });

      togglePopup();
    }
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div id="time-range-picker">
      <div className={`time-input ${ disabled && "disabled" }`} onClick={() => {
        if (!disabled) togglePopup(); 
      }}>
        {convertSecondsToHumanReadableFormat(timeRange?.startTime.toString())} to {convertSecondsToHumanReadableFormat(timeRange?.endTime.toString())}
        <BsClock color="gray" size={15} />
      </div>
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="time-container text-primary">
            <div className="inner-wrapper pt-3">
              <Row className="text-center d-flex align-items-center">
                <Col md={2}>From</Col>
                <Col md={9} className="col-auto p-1">
                  {/* initial value => 12 am */}
                  <InputTimePicker timeInSeconds={startTimeInSeconds} onTimeSelect={(selectedTimeInSeconds) => handleTimeSelect(Time.StartTime, selectedTimeInSeconds)} /> 
                </Col>
              </Row>
              <Row className="text-center d-flex align-items-center">
                <Col md={2}>To</Col>
                <Col md={9} className="col-auto p-1">
                  {/* initial value => 1 am */}
                  {/* <InputTimePicker timeInSeconds={endTimeInSeconds} disableBeforeTimeInSeconds={startTimeInSeconds} onTimeSelect={(selectedTimeInSeconds) => handleTimeSelect(Time.EndTime, selectedTimeInSeconds)} />  */}
                  
                  {/* disabled validation */}
                  <InputTimePicker timeInSeconds={endTimeInSeconds} disableBeforeTimeInSeconds={-1} onTimeSelect={(selectedTimeInSeconds) => handleTimeSelect(Time.EndTime, selectedTimeInSeconds)} /> 
                </Col>
              </Row>

              <Row>
                <div className="d-flex justify-content-center mt-3">
                  <Button disabled={startTimeInSeconds === -1 || endTimeInSeconds === -1} color="primary" onClick={handleTimeRangeSelect}>
                        Apply
                  </Button>
                </div>
              </Row>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputTimeRangePicker;
