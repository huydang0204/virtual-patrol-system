import _ from "lodash";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

import IconButton from "./IconButton";
import useOutsideClick from "hooks/useOutsideClick";

import { TableInputDateProps } from "model-type/component-style";
import {
  getFormattedDateForCalendar, getTodayInCalendarAcceptedFormat 
} from "utils/time-format";

const today = getTodayInCalendarAcceptedFormat();

const TableDatePicker: React.FC<TableInputDateProps> = ({
  maximumDate, selectedDate, style, reset, onDateSelect 
}): JSX.Element => {
  const [_selectedDate,
    setSelectedDate] = useState(today);

  const handleDateSelect = (e) => {
    !!e && e.preventDefault();

    onDateSelect(_selectedDate);
    togglePopup();
  };

  const handleDateSelectReset = (e) => {
    !!e && e.preventDefault();

    setSelectedDate(today);
    onDateSelect(today);
    !!reset && reset.handleDateReset && reset.handleDateReset();
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div data-test="table__date-picker" className="date-input-container">
      <IconButton
        Icon={<CiCalendar size={20} />}
        label={`${(style?.isDateDisplay && !_.isEqual(selectedDate, today)) ? getFormattedDateForCalendar(selectedDate) : "Select date"}`}
        color="secondary"
        className={`rounded-1 outline text-white rounded-3 ${
          _.isEqual(today, selectedDate) || selectedDate === null
            ? "bg-transparent border border-1 border-gray"
            : "bg-primary border-none"
        }`}
        onClick={togglePopup}
      />
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="calendar-container" style={{ right : style?.rightAlign ? "0" : "" }}>
            <Calendar
              value={_selectedDate}
              maximumDate={maximumDate}
              onChange={setSelectedDate}
              shouldHighlightWeekends
              calendarClassName="calendar"
              calendarTodayClassName="custom-today-day"
              colorPrimary="var(--bs-primary)"
              renderFooter={() => (
                <div className="d-flex justify-content-center pb-3 gap-2">
                  <Button data-test="table-date-picker__btn-clear" color="outline-primary" className="p-2" onClick={handleDateSelectReset}>
                    {(!!reset && reset?.label) ? reset.label : "Reset to Today"}
                  </Button>
                  <Button data-test="table-date-picker__btn-apply" color="primary" className="p-2" onClick={handleDateSelect}>
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

export default TableDatePicker;
