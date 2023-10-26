import _ from "lodash";
import moment from "moment-timezone";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { CiCalendar } from "react-icons/ci";
import {
  HiOutlineArrowLeft, HiOutlineArrowRight 
} from "react-icons/hi";

import IconButton from "./IconButton";
import useOutsideClick from "hooks/useOutsideClick";

import { MonthPickerProps } from "model-type/component-style";
import { MONTHS_3STRING } from "data/common-data";

const currentYear = moment().year();
const currentMonth = moment().month();

const MonthPicker: React.FC<MonthPickerProps> = ({
  selectedMonth,
  selectedYear,
  isCurrentMonthSelectable = false,
  reset,
  onSelect
}): JSX.Element => {
  const previousMonth = currentMonth - 1;

  const [_selectedMonth,
    setSelectedMonth] = useState(isCurrentMonthSelectable ? currentMonth : previousMonth);
  const [_selectedYear,
    setSelectedYear] = useState(currentYear);

  const handleMonthSelect = (e) => {
    !!e && e.preventDefault();

    onSelect(_selectedMonth, _selectedYear);
    togglePopup();
  };

  const handleMonthSelectReset = (e) => {
    !!e && e.preventDefault();

    if (!isCurrentMonthSelectable) {
      setSelectedMonth(previousMonth);
      setSelectedYear(currentYear);
  
      onSelect(previousMonth, _selectedYear);
    } else {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
  
      onSelect(currentMonth, _selectedYear);
    }

    !!reset && reset.handleMonthReset && reset.handleMonthReset();
    togglePopup();
  };

  // close popup on outside-click
  const [popupRef,
    isPopupOpen,
    setIsPopupOpen] = useOutsideClick(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div data-test="month-picker" className="month-input-container">
      <IconButton
        Icon={<CiCalendar size={20} />}
        label="Select month"
        color="secondary"
        className={`rounded-1 outline text-white rounded-3 ${
          isCurrentMonthSelectable ? (currentMonth === selectedMonth
            ? "bg-transparent border border-1 border-gray"
            : "bg-primary border-none") : ((_.isEqual(previousMonth, selectedMonth)) || (selectedMonth === null)
            ? "bg-transparent border border-1 border-gray"
            : "bg-primary border-none")
        }`}
        onClick={togglePopup}
      />
      {isPopupOpen && (
        <div ref={popupRef}>
          <div className="month-picker-container">
            <div className="year">
              <div className="navigation-buttons align-items-center">
                <div
                  data-test="month-picker__prev-year"
                  className="navigation-button"
                  onClick={() => setSelectedYear((prevSelectedYear) => prevSelectedYear - 1)}>
                  <HiOutlineArrowLeft size={18} />
                </div>
                <span>{_selectedYear}</span>
                <div
                  data-test="month-picker__next-year"
                  className={`navigation-button ${_selectedYear === currentYear && "disabled"}`}
                  onClick={() => {
                    if (_selectedYear < currentYear)
                      setSelectedYear((prevSelectedYear) => prevSelectedYear + 1);
                  }}>
                  <HiOutlineArrowRight size={18} />
                </div>
              </div>
            </div>
            <div className="months">
              {MONTHS_3STRING.map((month, idx) => {
                // check if the selected year is current year - then have to determine months to disable or not
                let isDisabled = false;
                if (currentYear < _selectedYear) isDisabled = true;
                else if (currentYear === _selectedYear) {
                  if (isCurrentMonthSelectable) {
                    if (MONTHS_3STRING.indexOf(month) > currentMonth) isDisabled = true;
                  } else {
                    if (MONTHS_3STRING.indexOf(month) > currentMonth - 1) isDisabled = true;
                  }
                }

                return (
                  <div
                    data-test="month-picker__month"
                    key={idx}
                    className={`month ${
                      isDisabled ? "disabled" : _selectedMonth === MONTHS_3STRING.indexOf(month) && "selected"
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedMonth(idx);
                      }
                    }}>
                    {month}
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-center pb-3 gap-2 mt-3">
              <Button data-test="month-picker__reset" color="outline-primary" onClick={handleMonthSelectReset}>
                Reset
              </Button>
              <Button data-test="month-picker__apply" color="primary" onClick={handleMonthSelect}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
