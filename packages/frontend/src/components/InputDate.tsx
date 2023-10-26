import React, { useState } from "react";
import { Button } from "reactstrap";
import { AiOutlineCalendar } from "react-icons/ai";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

import useOutsideClick from "hooks/useOutsideClick";

import {
  CalendarDate, InputDateProps 
} from "model-type/component-style";
import { getFormattedDateForCalendar } from "utils/time-format";

const today = new Date().getDate();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const InputDate : React.FC<InputDateProps> = ({
  name = "",
  disabled = false,
  date,
  minimumDate,
  onDateSelect
} : InputDateProps) : JSX.Element => {
  const [selectedDate,
    setSelectedDate] = useState<CalendarDate>(date || {
      year : currentYear,
      month : currentMonth,
      day : today
    });

  const handleDateSelect = (e) : void => {
    !!e && e.preventDefault();

    onDateSelect(selectedDate);
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () : void => setIsPopupOpen(!isPopupOpen);

  return (
    <div className="date-input-container">
      <div
        data-test={`date-input__${name}`}
        className={`date-input text-white d-flex justify-content-between align-items-center px-2 ${ disabled && "disabled" }`}
        onClick={ () : void => {
          if (!disabled) togglePopup();
        } }>
        { date ? getFormattedDateForCalendar(date) : "∞" } <AiOutlineCalendar
          color="gray"
          size={ 18 } />
      </div>
      { isPopupOpen && (
        <div ref={ popupRef }>
          <div className="calendar-container">
            <Calendar
              value={ selectedDate }
              minimumDate={ minimumDate }
              onChange={ setSelectedDate }
              shouldHighlightWeekends
              calendarClassName="calendar"
              colorPrimary="var(--bs-primary)"
              renderFooter={ () : JSX.Element => (
                <div className="d-flex justify-content-center pb-3">
                  <Button
                    data-test="table-date-picker__btn-apply"
                    color="primary"
                    onClick={ handleDateSelect }
                    className="p-2">
                    Apply
                  </Button>
                </div>
              ) }
            />
          </div>
        </div>
      ) }
    </div>
  );
};

export default InputDate;
