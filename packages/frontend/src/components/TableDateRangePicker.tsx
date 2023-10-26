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

const MAXIMUM_DATE = {
  year : new Date().getFullYear(),
  month : new Date().getMonth() + 1,
  day : new Date().getDate()
};

const TableDateRangePicker: React.FC<TableInputDateRangeProps> = ({
  selectedDateRange, style, onDateRangeSelect 
} : TableInputDateRangeProps): JSX.Element => {
  const [_selectedDateRange,
    setSelectedDateRange] = useState<CalendarDateRange>({
      from : null,
      to : null
    });

  const handleDateRangeSelect = (e) => {
    !!e && e.preventDefault();

    onDateRangeSelect({
      from : {
        year : _selectedDateRange.from.year,
        month : _selectedDateRange.from.month - 1,
        day : _selectedDateRange.from.day 
      },
      to : {
        year : _selectedDateRange.to.year,
        month : _selectedDateRange.to.month - 1,
        day : _selectedDateRange.to.day 
      }
    });
    togglePopup();
  };

  const handleDateRangeSelectReset = (e) => {
    !!e && e.preventDefault();

    setSelectedDateRange({
      from : null,
      to : null
    });
    onDateRangeSelect({
      from : null,
      to : null
    });
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () : void => setIsPopupOpen(!isPopupOpen);

  return (
    <div data-test="table__date-range-picker" className="date-input-container">
      <IconButton
        Icon={<CiCalendar size={20} />}
        label="Select date range"
        color="secondary"
        className={`rounded-1 outline text-white rounded-3 ${
          selectedDateRange.from === null && selectedDateRange.to === null
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
              onChange={setSelectedDateRange}
              maximumDate={MAXIMUM_DATE}
              shouldHighlightWeekends
              calendarClassName="calendar"
              calendarTodayClassName="custom-today-day"
              colorPrimary="var(--bs-primary)"
              colorPrimaryLight="var(--bs-primary-light)"
              renderFooter={() : JSX.Element => (
                <div className="d-flex justify-content-center pb-3 gap-2">
                  <Button data-test="date-range-picker__btn-clear" color="outline-primary" className="p-2" onClick={handleDateRangeSelectReset}>
                    Clear
                  </Button>
                  <Button data-test="date-range-picker__btn-apply" disabled={_selectedDateRange.from === null || _selectedDateRange.to === null} color="primary" className="p-2" onClick={handleDateRangeSelect}>
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

export default TableDateRangePicker;
