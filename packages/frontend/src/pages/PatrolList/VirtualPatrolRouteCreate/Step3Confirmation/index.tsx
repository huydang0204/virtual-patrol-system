import React, { MouseEvent } from "react";
import {
  Button, Col, FormGroup, Label, Row
} from "reactstrap";
import { TiWarning } from "react-icons/ti";

import Badge from "components/Badge";
import CheckBox from "components/CheckBox";
import CamerasGrid from "../common/CamerasGrid";
import SelectCustom from "components/SelectCustom";

import {
  DATE_OF_WEEK, PatrolViewModes, REMINDER_TIME_PATROL, StartAllowTimeForPatrol
} from "data/common-data";
import { convertSecondsToHumanReadableFormat } from "utils/date-time";
import { 
  CheckpointsState, 
  SchedulesState 
} from "data/types";
import { UserResponse } from "@vps/utils/lib/dto";
import { ExecuteTime } from "@vps/utils/lib/data";

interface ComponentProps {
  reminder : { value : number, onReminderChange : (value : number) => void }
  patrolName: string;
  site: { id: string, name: string };
  checkpoints: CheckpointsState[];
  checkedUsers: UserResponse[];
  startAllowTime: number;
  patrolViewMode: string;
  schedules: SchedulesState[];
  onStepChange: (e : MouseEvent<HTMLButtonElement>, step: number) => void;
}

const Step3Confirmation: React.FC<ComponentProps> = ({
  reminder,
  patrolName,
  site,
  checkpoints,
  checkedUsers,
  startAllowTime,
  patrolViewMode,
  schedules,
  onStepChange
} : ComponentProps): JSX.Element => {
  const startAllowTimeObj = StartAllowTimeForPatrol.find((option : { id : number, name : string }) : boolean => Number(option.id) === Number(startAllowTime));
  const startAllowTimeLabel= !!startAllowTimeObj ? startAllowTimeObj.name : "—";

  const patrolViewModeObj = PatrolViewModes.find((option : { id : string, name : string }) => option.id === patrolViewMode);
  const patrolViewModeLabel= !!patrolViewModeObj ? patrolViewModeObj.name : "—";

  console.log("orange => ", schedules);

  return (
    <div className="container form-container text-white p-4 px-4">
      {/* Description */}
      <Row>
        <h6 className="d-flex gap-1 align-items-center text-warning">
          <TiWarning /> Reiveiw details to ensure they are accurate before creating a Patrol Route.
        </h6>
      </Row>

      <hr className="my-4" />

      <div className="d-flex gap-3 align-items-center justify-content-start">
        <p className="mb-0">Set Reminder to receive notification</p>
        <SelectCustom
          styles={{
            backgroundColor : "#343439",
            border : "1px solid #808080",
            width : "100%"
          }}
          popupTheme="dark"
          data={ REMINDER_TIME_PATROL }
          selectedValue={ reminder.value.toString() || "all" }
          displayedValue={ REMINDER_TIME_PATROL.find((time : { id : number, name : string }) => time.id === reminder.value)?.name || "Select" }
          onChange={ reminder.onReminderChange } />
      </div>

      <hr className="my-4" />

      {/* Patrol Name and Site Name */}
      <Row className="mb-4">
        <div className="d-flex justify-content-between">
          <div className="container-row d-flex gap-5">
            <div>
              <h5 className="text-secondary mb-2">Patrol Name</h5>
              <span>{patrolName || "—"}</span>
            </div>
            <div>
              <h5 className="text-secondary mb-2">Site Name</h5>
              <span>{site.name || "—"}</span> <span className="text-secondary">(ID: {site.id || "—"})</span>
            </div>
          </div>
          <div className="btn-edit">
            <Button color="primary" outline size="sm" onClick={(e : MouseEvent<HTMLButtonElement>): void => onStepChange(e, 0)}>
              Edit patrol details
            </Button>
          </div>
        </div>
      </Row>

      {/* Start allow time and Patrol view mode */}
      <Row className="mb-4">
        <div className="d-flex justify-content-between">
          <div className="container-row d-flex gap-5">
            <div>
              <h5 className="text-secondary mb-2">Start time limit</h5>
              <span>{startAllowTimeLabel}</span>
            </div>
            <div>
              <h5 className="text-secondary mb-2">Patrol view mode</h5>
              <span>{patrolViewModeLabel}</span>
            </div>
          </div>
        </div>
      </Row>

      {/* Patrol Camera Details */}
      <Row>
        <h5 className="text-secondary mb-2">Patrol camera details</h5>

        {checkpoints.map((checkpoint : CheckpointsState, index : number) => {
          return (
            <Row key={index}>
              <Col md="2">
                <FormGroup className="form-group  mb-4">
                  {index === 0 && <Label className="text-white">Checkpoint</Label>}
                  <div className="order text-white d-flex align-items-center" style={{ border : 0 }}>
                    {checkpoint.setOrder}
                  </div>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup className="form-group  mb-4">
                  {index === 0 && <Label className="text-white">Layout</Label>}
                  <div className="order text-white d-flex align-items-center" style={{ border : 0 }}>
                    {checkpoint.layoutRow} x {checkpoint.layoutCol}
                  </div>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="form-group mb-3">
                  {index === 0 && <Label className="text-white">Cameras</Label>}
                  <div className="d-flex gap-2 align-items-stretch">
                    <div className="input-cameras d-flex flex-column py-1" style={{ border : 0 }}>
                      <div className="d-flex align-items-center justify-content-start">
                        {checkpoint.cameras.length > 0 ? (
                          <CamerasGrid
                            order={checkpoint.setOrder}
                            row={checkpoint.layoutRow}
                            col={checkpoint.layoutCol}
                            items={checkpoint.cameras}
                          />
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          );
        })}
      </Row>

      {/* Assignees */}
      <Row className="mb-4">
        <h5 className="text-secondary mb-2">Assignees</h5>
        <div className="d-flex gap-2">
          {checkedUsers.length > 0
            ? checkedUsers.map((user : UserResponse, index : number) => <Badge key={index} text={user.name} variant="secondary" />)
            : "—"}
        </div>
      </Row>

      <hr className="my-4" />

      {/* Schedule */}
      <Row className="mb-2">
        <div className="d-flex justify-content-between">
          <h5 className="text-secondary mb-2">Schedules</h5>
          <div className="btn-edit">
            <Button color="primary" outline size="sm" onClick={(e : MouseEvent<HTMLButtonElement>): void => onStepChange(e, 1)}>
              Edit schedules
            </Button>
          </div>
        </div>
      </Row>

      {/* Schedule Lists */}
      {schedules.map((schedule : SchedulesState, scheduleNo : number) => (
        <div key={scheduleNo} className="schedule-container p-4 mb-2 border border-gray">
          {/* Start Date */}
          <Row className="align-items-center mb-3">
            <Col className="label">
              <Label for="input-1">Start Date</Label>
            </Col>
            <Col className="input">
              <div className="order text-white d-flex align-items-center" style={{ border : 0 }}>
                {schedule.startOccurrenceDate.day}/{schedule.startOccurrenceDate.month}/
                {schedule.startOccurrenceDate.year}
              </div>
            </Col>
            <Col></Col>
          </Row>

          {/* End Date */}
          <Row className="align-items-center mb-3">
            <Col className="label">
              <Label for="input-2">End Recurrence</Label>
            </Col>
            <Col className="input">
              {schedule.isRecurForever ? (
                <div className="d-flex align-items-center gap-2">Recur forever</div>
              ) : (
                <div className="order text-white d-flex align-items-center" style={{ border : 0 }}>
                  {schedule.endOccurrenceDate.day}/{schedule.endOccurrenceDate.month}/
                  {schedule.endOccurrenceDate.year}
                </div>
              )}
            </Col>
          </Row>

          {/* Time */}
          <Row className={`align-items-${schedule.executingTime.length > 1 ? "start" : "center"}`}>
            <Col className="label label-time mt-0">
              <Label for="input-3 -mt-2">Time</Label>
            </Col>
            <Col>
              {schedule.executingTime.map((timeRange : ExecuteTime, timeNo : number) => (
                <div key={timeNo} className="d-flex align-items-start">
                  {timeRange.repeatHours === null ?
                    <Col className="input">
                      <div className="times-wrapper" key={timeNo}>
                        <div className="w-100 mb-2">
                          <div className="order text-white d-flex align-items-center" style={{
                            border : 0,
                            width : "230px"
                          }}>
                            {convertSecondsToHumanReadableFormat(timeRange.startTime.toString())} to {convertSecondsToHumanReadableFormat(timeRange.endTime.toString())}
                          </div>
                        </div>
                      </div>
                    </Col> :
                    <Col>
                      {timeRange.repeatHours !== null && <div className="checkbox d-flex align-items-center gap-2">
                        Repeat every {timeRange.repeatHours} hour{timeRange.repeatHours > 1 ? "s" : ""}
                      </div>}
                    </Col>}
                </div>
              ))}
            </Col>
          </Row>

          {/* Executing Days */}
          <Row className={`align-items-center ${schedule.executingDays.length === 7 ? "mt-3" : "mt-4"}`}>
            <div className="d-flex align-items-center">
              <Col className="label">
                <Label for="input-1">Executing Days</Label>
              </Col>
              <Col>
                {schedule.executingDays.length === 7 ? <div>Daily</div> : <div className="d-flex gap-3">
                  {schedule.executingDays.length > 0
                    ? schedule.executingDays.map((day : number, index : number) => (
                      <div key={index} className="d-flex gap-2 align-items-center">
                        <CheckBox isChecked={true} />
                        {DATE_OF_WEEK[day]}
                      </div>
                    ))
                    : "—"}
                </div>}
              </Col>
            </div>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default Step3Confirmation;
