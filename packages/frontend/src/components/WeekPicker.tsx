import _ from "lodash";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

import IconButton from "./IconButton";
import useOutsideClick from "hooks/useOutsideClick";

import {
  CalendarDateRange, TableInputDateRangeProps 
} from "model-type/component-style";
import {
  getCurrentWeekSaturday,
  getCurrentWeekSunday
} from "utils/date-time";

const MAXIMUM_DATE = {
  year : new Date().getFullYear(),
  month : new Date().getMonth() + 1,
  day : new Date().getDate()
};

const defaultRange = { 
  from : getCurrentWeekSunday(),
  to : getCurrentWeekSaturday()
};

const WeekPicker: React.FC<TableInputDateRangeProps> = ({
  selectedDateRange, style, onDateRangeSelect 
}): JSX.Element => {
  const [_selectedDateRange,
    setSelectedDateRange] = useState<CalendarDateRange>(selectedDateRange);

  const handleDateRangeSelect = (e) => {
    !!e && e.preventDefault();

    onDateRangeSelect(_selectedDateRange);
    togglePopup();
  };

  const handleDateRangeSelectReset = (e) => {
    !!e && e.preventDefault();

    setSelectedDateRange(defaultRange);
    onDateRangeSelect(defaultRange);
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const calculateWeekRange = (selectedDate) => {
    const date = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
  
    const dayOfWeek = date.getDay(); // day of week for the selected date (0 for Sun, 1 for Mon, and so on)
  
    // calculate the start date by subtracting the day of the week from the selected date
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);
  
    // calculate the end date by adding the difference between 6 (Saturday) and the day of the week
    const treasure = 6 - dayOfWeek;
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + (treasure));
  
    return {
      from : {
        year : startDate.getFullYear(),
        month : startDate.getMonth() + 1,
        day : startDate.getDate()
      },
      to : {
        year : endDate.getFullYear(),
        month : endDate.getMonth() + 1,
        day : endDate.getDate()
      }
    };
  };
  
  const handleDayClick = (selectedDate) => {
    const weekRange = calculateWeekRange(selectedDate.from);
    setSelectedDateRange(weekRange);
  };

  return (
    <div data-test="table__date-range-picker" className="date-input-container">
      <IconButton
        Icon={<CiCalendar size={20} />}
        label="Select week"
        color="secondary"
        className={`rounded-1 outline text-white rounded-3 ${
          (selectedDateRange.from === null && selectedDateRange.to === null) || (_.isEqual(_selectedDateRange.from, defaultRange.from) && _.isEqual(_selectedDateRange.to, defaultRange.to))
            ? "bg-transparent border border-1 border-gray"
            : "bg-primary border-none"
        }`}
        onClick={togglePopup}
      />
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="calendar-container" style={{ right : style?.rightAlign ? "0" : "" }}>
            <Calendar
              value={_selectedDateRange}
              onChange={handleDayClick}
              maximumDate={MAXIMUM_DATE}
              shouldHighlightWeekends
              calendarClassName="calendar"
              calendarTodayClassName="custom-today-day"
              colorPrimary="var(--bs-primary)"
              colorPrimaryLight="var(--bs-primary-light)"
              renderFooter={() => (
                <div className="d-flex justify-content-center pb-3 gap-2">
                  <Button data-test="date-range-picker__btn-clear" color="outline-primary" className="p-2" onClick={handleDateRangeSelectReset}>
                    Reset
                  </Button>
                  <Button data-test="date-range-picker__btn-apply" color="primary" className="p-2" onClick={handleDateRangeSelect}>
                    Apply
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekPicker;
