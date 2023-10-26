import React, { MouseEvent } from "react";
import { CgAdd } from "react-icons/cg";
import { TbTrash } from "react-icons/tb";
import { AiOutlineMinus } from "react-icons/ai";
import {
  Button,
  Col,
  Label,
  Row
} from "reactstrap";

import CheckBox from "components/CheckBox";
import InputDate from "components/InputDate";
import InputTimeRangePicker from "components/InputTimeRangePicker";
import NotifyMessageModal from "components/NotificationModal";

import {
  DATE_OF_WEEK, RepeatEveryXHoursForSchedule
} from "data/common-data";
import { getTodayInCalendarAcceptedFormat } from "utils/time-format";
import {
  CalendarDate,
  NotificationModalProps
} from "model-type/component-style";
import RadioButton from "components/RadioButton";
import SelectCustom from "components/SelectCustom";
import { SchedulesState } from "data/types";
import { ExecuteTime } from "@vps/utils/lib/data";

interface ComponentProps {
  schedules : SchedulesState[];
  notifyModal : NotificationModalProps;
  // select date
  onDateSelect : (
    scheduleNo : number,
    selectedDate : CalendarDate,
    type : "startOccurrenceDate" | "endOccurrenceDate"
  ) => void;
  // recur forever
  onRecurForeverClick : (scheduleNo : number) => void;
  // repeat every x hour
  onRepeatEveryXHourCheck : (scheduleNo : number, timeNo : number, hour : number) => void;
  onRepeatEveryXHourChange : (scheduleNo : number, timeNo : number, hour : number) => void;
  // executing times
  onTimeRangeSelect : (scheduleNo : number, timeNo : number, selectedTimeRange : ExecuteTime) => void;
  onTimeRangeAdd : (scheduleNo : number) => void;
  onTimeRangeRemove : (e : MouseEvent<HTMLButtonElement>, scheduleNo : number, timeNo : number) => void;
  // executing days
  onExecutingDaysCheck : (scheduleNo : number, selectedDayIndex : number) => void;
  // schedule
  onScheduleAdd : () => void;
  onScheduleRemove : (e : MouseEvent<HTMLButtonElement>, scheduleNo : number) => void;
  // modal
  onNotifyModalClose : () => void;
}

const Step2AddSchedules : React.FC<ComponentProps> = ({
  schedules,
  notifyModal,
  onDateSelect,
  onRecurForeverClick,
  onRepeatEveryXHourCheck,
  onRepeatEveryXHourChange,
  onTimeRangeSelect,
  onTimeRangeAdd,
  onScheduleRemove,
  onExecutingDaysCheck,
  onScheduleAdd,
  onTimeRangeRemove,
  onNotifyModalClose
} : ComponentProps) : JSX.Element => {
  return (
    <div className="text-white w-100">
      { schedules.map((schedule : SchedulesState, scheduleNo : number) => (
        <div
          key={ scheduleNo }
          className="schedule-container p-4 mb-2">
          {/* Start Date */ }
          <Row className="align-items-center mb-3">
            <Col className="label">
              <Label for="input-1">Start Date</Label>
            </Col>
            <Col className="input">
              <InputDate
                minimumDate={ getTodayInCalendarAcceptedFormat() }
                date={ schedule.startOccurrenceDate }
                onDateSelect={ (selectedDate : CalendarDate) : void => onDateSelect(scheduleNo, selectedDate, "startOccurrenceDate") }
              />
            </Col>
            <Col></Col>
          </Row>

          {/* End Date */ }
          <Row className="align-items-center mb-3">
            <Col className="label">
              <Label for="input-2">End Recurrence</Label>
            </Col>
            <Col className="input">
              <InputDate
                date={ schedule.isRecurForever ? null : schedule.endOccurrenceDate }
                disabled={ schedule.isRecurForever }
                minimumDate={ schedule.startOccurrenceDate }
                onDateSelect={ (selectedDate : CalendarDate) : void => onDateSelect(scheduleNo, selectedDate, "endOccurrenceDate") }
              />
            </Col>
            <Col>
              <div
                className="checkbox d-flex align-items-center gap-2"
                onClick={ () : void => onRecurForeverClick(scheduleNo) }>
                <CheckBox isChecked={ schedule.isRecurForever } /> Recur forever
              </div>
            </Col>
          </Row>

          {/* Executing Times */ }
          <Row className="align-items-start mb-3">
            <Col className="label label-time">
              <Label for="input-3">Time</Label>
            </Col>
            <Col className="input">
              { schedule.executingTime.map((time : ExecuteTime, timeNo : number) => (
                <div className="d-flex" key={ timeNo }>
                  <Col className="input">
                    <div className="times-wrapper" style={{ width : "226px" }}>
                      <div className="w-100 mb-2">
                        {schedule.executingTime[timeNo].repeatHours !== null ?
                          <div className="time-range-disabled-placeholder">—</div> :
                          <InputTimeRangePicker
                            timeRange={ time }
                            disabled={schedule.executingTime[timeNo].repeatHours !== null }
                            onTimeRangePick={ (selectedTimeRange : ExecuteTime) : void => {
                              onTimeRangeSelect(scheduleNo, timeNo, selectedTimeRange);
                            } } />
                        }
                      </div>
                      { timeNo > 0 && (
                        <div className="btn-remove-time-wrapper">
                          <Button
                            title="Remove time"
                            onClick={ (e : MouseEvent<HTMLButtonElement>) : void => onTimeRangeRemove(e, scheduleNo, timeNo) }
                            disabled={ schedule.executingTime.length === 1 }
                            className="btn-remove-time rounded-3 text-white border border-1 border-gray">
                            <AiOutlineMinus size={ 10 } />
                          </Button>
                        </div>
                      ) }
                    </div>
                  </Col>
                </div>
              )) }
            </Col>
            {schedule.executingTime.length === 1 &&
              <Col>
                <div
                  className="checkbox d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-2" onClick={ () : void => onRepeatEveryXHourCheck(scheduleNo, 0, 1) }>
                    <CheckBox isChecked={ schedule.executingTime[0].repeatHours !== null } /> Repeat every
                  </div>
                  <SelectCustom
                    styles={{
                      backgroundColor : "#343439",
                      border : "1px solid #808080",
                      width : "100%",
                      cursor : schedule.executingTime[0].repeatHours === null ? "not-allowed" : "pointer"
                    }}
                    contentMinWidth="74px"
                    popupTheme="dark"
                    isDisabled={schedule.executingTime[0].repeatHours === null}
                    data={ RepeatEveryXHoursForSchedule }
                    selectedValue={ schedule.executingTime[0].repeatHours !== null ? schedule.executingTime[0].repeatHours?.toString() : "1" }
                    displayedValue={ RepeatEveryXHoursForSchedule?.find((hour : { id : number, name : string }) => hour.id === schedule.executingTime[0].repeatHours)?.name || RepeatEveryXHoursForSchedule[0].name}
                    onChange={ (hour : number) : void => onRepeatEveryXHourChange(scheduleNo, 0, hour) } />
                </div>
              </Col>}
            <div className="d-inline-block text-white btn-add-times mt-0">
              <div
                className={`d-flex gap-2 align-items-center ${ schedule.executingTime[0].repeatHours !== null ? "disabled" : "" }`}
                onClick={ () : void => {
                  if (schedule.executingTime[0].repeatHours === null) onTimeRangeAdd(scheduleNo);
                } }>
                <CgAdd
                  size={ 18 }
                  color="white" />
                Add another time
              </div>
            </div>
          </Row>

          {/* here */}
          {/* Executing Days */ }
          <Row className="align-items-center mt-4">
            <Col className="label">
              <Label for="input-1">Executing Days</Label>
            </Col>
            <Col className="input">
              <div className="d-flex justify-content-start gap-4">
                <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => onExecutingDaysCheck(scheduleNo, 8)}>
                  <RadioButton isChecked={ schedule.executingDays.length === 7 } /> Daily
                </div>
                <div className="d-flex justify-content-start align-items-center gap-4">
                  <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => onExecutingDaysCheck(scheduleNo, -1)}>
                    <RadioButton isChecked={ schedule.executingDays.length !== 7 } /> Custom
                  </div>
                  {schedule.executingDays.length !== 7 && <div className="d-flex gap-3">
                    { DATE_OF_WEEK.map((day : string, index : number) => (
                      <div
                        className="checkbox d-flex gap-2 align-items-center"
                        key={ index }
                        onClick={ () : void => onExecutingDaysCheck(scheduleNo, index) }>
                        <CheckBox isChecked={ schedule.executingDays.includes(index) } /> { day }
                      </div>
                    )) }
                  </div>}
                </div>
              </div>
            </Col>
            <Col></Col>
          </Row>

          {/* Remove Schedule */ }
          <Button
            disabled={ schedules.length === 1 }
            title="Remove schedule"
            onClick={ (e : MouseEvent<HTMLButtonElement>) : void => onScheduleRemove(e, scheduleNo) }
            className="btn-remove-checkpoint rounded-3 text-white border border-1 border-gray p-1">
            <TbTrash size={ 15 } />
          </Button>
        </div>
      )) }

      {/* Add another schedule */ }
      <div className="d-inline-block text-white btn-add-checkpoints mt-0">
        <div
          className="btn-add-schedule d-flex gap-2 align-items-center"
          onClick={ onScheduleAdd }>
          <CgAdd
            size={ 18 }
            color="white" />
          Add another schedule
        </div>
      </div>

      <NotifyMessageModal
        isOpen={ notifyModal.isOpen }
        message={ notifyModal.message }
        header={ notifyModal.header }
        close={ onNotifyModalClose }
      />
    </div>
  );
};

export default Step2AddSchedules;
