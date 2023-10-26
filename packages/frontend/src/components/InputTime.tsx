import React, {
  useEffect, useState 
} from "react";
import {
  Button, Col, Input, Row 
} from "reactstrap";
import {
  MdKeyboardArrowDown, MdKeyboardArrowUp 
} from "react-icons/md";

import useOutsideClick from "hooks/useOutsideClick";

import {
  HOURS_12, MINUTES_5_INTERVALS 
} from "data/common-data";
import {
  InputTimesRange, InputTimeProps 
} from "model-type/component-style";

const InputTime: React.FC<InputTimeProps> = ({
  timeRange, onTimeRangeSelect 
}) => {
  const [time,
    setTime] = useState<InputTimesRange>({
      startTime : {
        hour : 1,
        minute : 0,
        time : 0
      },
      endTime : {
        hour : 1,
        minute : 0,
        time : 1
      }
    });

  const handleTimeChange = (e, type: "startTime" | "endTime", time: "hour" | "minute" | "time"): void => {
    const value = !!e && Number(e.target.value);

    setTime((prevTime) => {
      const updatedTime = {
        startTime : { ...prevTime.startTime },
        endTime : { ...prevTime.endTime }
      };
      updatedTime[type][time] = value;
      return updatedTime;
    });
  };

  const handleTimeRangeSelect = (e) => {
    !!e && e.preventDefault();

    onTimeRangeSelect(time);
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // get diaplayed minutes
  let startMinute,
    endMinute = "";
  MINUTES_5_INTERVALS.forEach((min) => {
    if (min.value === timeRange.startTime.minute) startMinute = min.label;
    if (min.value === timeRange.endTime.minute) endMinute = min.label;
  });

  useEffect(() => {
    if (!!timeRange)
      setTime(timeRange);
  }, []);

  return (
    <div className="time-input-container">
      <div
        className="time-input text-white d-flex justify-content-between align-items-center px-2"
        onClick={togglePopup}>
        {timeRange.startTime.hour}:{startMinute} {timeRange.startTime.time === 0 ? "am" : "pm"} to{" "}
        {timeRange.endTime.hour}:{endMinute} {timeRange.endTime.time === 0 ? "am" : "pm"}
        {isPopupOpen ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
      </div>
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="time-container text-primary">
            <div className="inner-wrapper pt-3">
              {/* Start Minute */}
              <Row className="text-center d-flex align-items-center">
                <Col md={2}>From</Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" value={timeRange.startTime.hour} onChange={(e) => handleTimeChange(e, "startTime", "hour")}>
                    <option defaultChecked disabled>
                      Hr
                    </option>
                    {HOURS_12.map((hour) => (
                      <option
                        key={hour.value}
                        value={hour.value}>
                        {hour.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" onChange={(e) => handleTimeChange(e, "startTime", "minute")}>
                    <option defaultChecked disabled>
                      Min
                    </option>
                    {MINUTES_5_INTERVALS.map((minute) => (
                      <option
                        key={minute.value}
                        value={minute.value}
                        selected={minute.value === timeRange.startTime.minute}>
                        {minute.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" onChange={(e) => handleTimeChange(e, "startTime", "time")}>
                    <option defaultChecked disabled>
                      Time
                    </option>
                    {["AM",
                      "PM"].map((time, _index) => (
                      <option key={time} value={_index} selected={_index === timeRange.startTime.time}>
                        {time}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              {/* End Minute */}
              <Row className="mt-2 text-center d-flex align-items-center">
                <Col md={2}>To</Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" onChange={(e) => handleTimeChange(e, "endTime", "hour")}>
                    <option defaultChecked disabled>
                      Hr
                    </option>
                    {HOURS_12.map((hour) => (
                      <option
                        key={hour.value}
                        value={hour.value}
                        selected={hour.value === timeRange.endTime.hour}>
                        {hour.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" onChange={(e) => handleTimeChange(e, "endTime", "minute")}>
                    <option defaultChecked disabled>
                      Min
                    </option>
                    {MINUTES_5_INTERVALS.map((minute) => (
                      <option
                        key={minute.value}
                        value={minute.value}
                        selected={minute.value === timeRange.endTime.minute}>
                        {minute.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={3} className="col-auto p-1">
                  <Input type="select" onChange={(e) => handleTimeChange(e, "endTime", "time")}>
                    <option defaultChecked disabled>
                      Time
                    </option>
                    {["AM",
                      "PM"].map((time, _index) => (
                      <option key={time} value={_index} selected={_index === timeRange.endTime.time}>
                        {time}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row>
                <div className="d-flex justify-content-center mt-3">
                  <Button color="primary" onClick={handleTimeRangeSelect}>
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

export default InputTime;
