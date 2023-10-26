import React, {
  useEffect, useRef, useState 
} from "react";
import { BsClock } from "react-icons/bs";
import PerfectScrollbar from "react-perfect-scrollbar";

import useOutsideClick from "hooks/useOutsideClick";

import { TIME_RANGES } from "data/common-data";
import { InputTimePickerProps } from "model-type/component-style";

const InputTimePicker: React.FC<InputTimePickerProps> = ({
  timeInSeconds, disableBeforeTimeInSeconds, onTimeSelect 
}) => {
  const [_timeLabel,
    setTimeText] = useState<string>("Selecte time");
  const [_timeInSeconds,
    setTimeInSeconds] = useState<number>(timeInSeconds);

  const handleTimeSelect = (selectedTimeInSeconds : number, selectedTimeText : string) : void => {
    setTimeInSeconds(selectedTimeInSeconds);
    setTimeText(selectedTimeText);
    onTimeSelect(selectedTimeInSeconds);

    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const scrollbarRef = useRef<PerfectScrollbar>(null);

  useEffect(() => {
    if (isPopupOpen && scrollbarRef.current) {
      const disabledItems = document.querySelectorAll(".time");
      const firstNonDisabledItem = Array.from(disabledItems).find((item) => !item.classList.contains("disabled")) as HTMLElement;

      if (firstNonDisabledItem) {
        firstNonDisabledItem.scrollIntoView({ block : "start" });
      }
    }
  }, [isPopupOpen]);  

  useEffect(() => {
    const timeRangeGroup = TIME_RANGES.find((group) => {
      return group.ranges.some((range) => range.value === timeInSeconds);
    });

    if (timeRangeGroup) {
      const label = timeRangeGroup.ranges.find((range) => range.value === timeInSeconds).label;
      setTimeText(label);
    }
  }, []);

  useEffect(() => {
    if (timeInSeconds <= disableBeforeTimeInSeconds) {
      setTimeText("Select time");
      setTimeInSeconds(-1);
      onTimeSelect(-1);
    } else setTimeInSeconds(timeInSeconds);
  }, [disableBeforeTimeInSeconds]);

  return (
    <div id="time-picker">
      <div className="time-picker-input" onClick={togglePopup}>
        {_timeLabel} <BsClock size={15} color="gray" />
      </div>
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="time-picker-container text-primary">
            <div className="time-picker-inner-wrapper">
              <PerfectScrollbar ref={scrollbarRef}>
                {TIME_RANGES.map((group, index : number) => {
                  return (
                    <div className="group" key={group.title}>
                      <div className={`group-title ${index === 1 ? "_border-top-none" : ""}`}>{group.title}</div>
                      {group.ranges.map((range, index) => {
                        let isDisabled = false;
                        if (disableBeforeTimeInSeconds) isDisabled = range.value <= disableBeforeTimeInSeconds;
                        return (
                          <div key={index} className={`time ${_timeInSeconds === range.value ? "selected" : ""} ${isDisabled ? "disabled" : ""}`} onClick={() : void => {
                            if(!isDisabled) handleTimeSelect(range.value, range.label); 
                          }}>
                            <div key={range.value}>{range.label}</div>
                            <small className="time-24">({range.value / 3600} hrs)</small>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputTimePicker;