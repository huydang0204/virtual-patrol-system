import _ from "lodash";
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  ChangeEvent
} from "react";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";

import PageHeaderTitle from "components/PageHeaderTitle";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import VpsAppPage from "components/VpsAppPage";
import Stepper from "components/Stepper";
import Step1AddCheckpoints from "./Step1AddCheckPoints";
import Step2AddSchedules from "./Step2AddSchedules";
import Step3Confirmation from "./Step3Confirmation";
import ValidationErrors from "./common/ValidationErrors";
import OverlayModal from "components/OverlayModal";
import SubmittingFormModal from "./common/SubmittingFormModal";
import NotifyMessageModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";

import {
  CalendarDate,
  ConfirmationModalProps,
  NotificationModalProps,
  OverlayModalProps
} from "model-type/component-style";
import { fetchSites } from "services/site";
import {
  addCheckpoints,
  addSchedules,
  countRoutes,
  createRoute
} from "services/route";
import {
  PATROL_LIST_PATH,
  PATROL_MANAGE_PATH
} from "data/route-path";
import {
  SUBMIT_FORM_PROGRESSES,
  Step1Validations,
  Step2Validations
} from "./common/validationMessages";
import {
  Checkpoints,
  Schedule
} from "model-type/component-types";
import { isDateXGreaterThanDateY } from "utils/date-time";
import {
  checkAllSchedulesValidity,
  checkOverlappingSchedules,
  checkOverlappingTimeWithinSchedule,
  getDuplicatedCameraNamesArr
} from "utils/route";

import { SiteResponse } from "@vps/utils/src/dto/site";
import { 
  CheckpointsState, 
  SchedulesState 
} from "data/types";
import { 
  CameraResponse, 
  UserResponse 
} from "@vps/utils/lib/dto";
import { ExecuteTime } from "@vps/utils/lib/data";

const STEPPER_STYLE = {
  defaultBgColor : "bg-gray-100",
  defaultStepItemColor : "text-gray-800",
  defaultLabelColor : "text-gray-100",

  activeBgColor : "bg-primary",
  activeStepItemColor : "text-white",
  activeLabelColor : "text-primary",

  completeBgColor : "bg-primary",
  completeStepItemColor : "text-white",
  completeLabelColor : "text-primary"
};

const steps = [{ title : "Add Checkpoints" },
  { title : "Add Schedule" },
  { title : "Confirmation" }];

const today = new Date().getDate();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

function VirtualPatrolPage() : JSX.Element {
  const history = useHistory();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [activeStep,
    setActiveStep] = useState<number>(0);

  // --- 📌 Step - 1: Add checkpoints 📌 --- //
  // Patrol route name
  const [patrolName,
    setPatrolName] = useState<string>("");
  // Sites
  const [sites,
    setSites] = useState<SiteResponse[]>([]);
  const [selectedSite,
    setSelectedSite] = useState<string>("0");
  // Checkpoints
  const [checkpoints,
    setCheckpoints] = useState<CheckpointsState[]>([
      {
        setOrder : 1,
        layoutRow : 1,
        layoutCol : 1,
        cameras : []
      }
    ]);
  const [currentEditingCheckpoint,
    setCurrentEditingCheckpoint] = useState<number>(1);
  const [maxCheckableCameraCount,
    setMaxCheckableCameraCount] = useState<number>(1);
  // Cameras
  const [isAddCamerasTableOpen,
    setIsAddCamerasTableOpen] = useState<boolean>(false);
  const [checkedCameras,
    setCheckedCameras] = useState<CameraResponse[]>([]);
  const [duplicatedCameras,
    setDuplicatedCameras] = useState<string[]>([]);
  // Cameras table modal
  const [confirmModal,
    setConfirmModal] = useState<ConfirmationModalProps>({
      header : null,
      message : null,
      isOpen : false,
      footerMessage : "",
      confirm : null,
      confirmBtnText : "Add",
      close : null
    });
  // Notify modal (Validations, warning modal)
  const [notifyModal,
    setNotifyModal] = useState<NotificationModalProps>({
      iconType : "notify",
      size : "md",
      header : null,
      message : null,
      isOpen : false
    });
  // Assign users
  const [checkedUsers,
    setCheckedUsers] = useState<UserResponse[]>([]);
  // Start allow time
  const [startAllowTimeInSeconds,
    setStartAllowTimeInSeconds] = useState<number>(0);
  // Patrol view mode
  const [patrolViewMode,
    setPatrolViewMode] = useState<string>("");

  // --- 📌 Step - 2: Add schedules 📌 --- //
  const [schedules,
    setSchedules] = useState<SchedulesState[]>([
      {
        startOccurrenceDate : {
          year : currentYear,
          month : currentMonth,
          day : today
        },
        endOccurrenceDate : {
          year : currentYear,
          month : currentMonth,
          day : today
        },
        isRecurForever : false,
        executingTime : [
          {
            startTime : 3600,
            endTime : 7200,
            repeatHours : null
          }
        ],
        executingDays : [0,
          1,
          2,
          3,
          4,
          5,
          6]
      }
    ]);

  // --- 📌 Step 3: Confirmation 📌 --- //
  // reminder time
  const [reminderTimeInSeconds,
    setReminderTimeInSeconds] = useState(30 * 60);
  const [apiCallingStep,
    setApiCallingStep] = useState<0 | 1 | 2 | 3>(0); // to display stepper progress as going as the current api call
  const [submitFormModal,
    setSubmitFormModal] = useState<OverlayModalProps>({
      message : null,
      isOpen : false,
      close : null
    });
  const [successModalOpen,
    setSuccessModalOpen] = useState<boolean>(false);
  const [
    routeCreationConfirmationModal,
    setRouteCreationConfirmationModal
  ] = useState<ConfirmationModalProps>({
    header : null,
    message : null,
    isOpen : false,
    footerMessage : "",
    confirm : null,
    confirmBtnText : "",
    close : null
  });
  const [apiErrorSteps,
    setApiErrorSteps] = useState<Record<number, boolean>>({});
  // --- ⬆︎ END - STATES ⬆︎ ---  //

  const routeIdRef = useRef<string>(null);

  // --- ⬇︎ START - Step 1 - Add Checkpoints - Handlers ⬇︎ --- //
  // 📌 Patrol route name
  const handlePatrolNameChange = (e : ChangeEvent<HTMLInputElement>) : void => {
    !!e && e.preventDefault();
    setPatrolName(e.target.value);
  };

  // 📌 Sites
  const getSites = async () : Promise<void> => {
    const { data : listSites } = await fetchSites();

    const sortedArray = _.sortBy(listSites, ["id"]).map((obj : SiteResponse) => ({
      ...obj,
      id : parseInt(obj.id)
    })); // currently, returning data's id being string
    setSites(sortedArray);
  };

  const handleSiteChange = (value : string) : void => {
    setSelectedSite(value);

    // clear checkpoints as the cameras might be irrelevant to new selected site
    setCheckpoints([
      {
        setOrder : 1,
        layoutRow : 1,
        layoutCol : 1,
        cameras : []
      }
    ]);
  };

  // 📌 Layout
  const handleLayoutChange = (e : React.ChangeEvent<HTMLInputElement>, order : number) : void => {
    !!e && e.preventDefault();
    setCurrentEditingCheckpoint(order);

    const value = e.target.value; // 1x1, 2x2, ...
    if (value) {
      const _layout = value.split("x");
      const row = Number(_layout[0]),
        col = Number(_layout[1]);

      const updatingCheckpoints = [...checkpoints];
      const checkpointIndex = updatingCheckpoints.findIndex((checkpoint : CheckpointsState) : boolean => checkpoint.setOrder ===
        order);

      if (checkpointIndex >= 0) {
        updatingCheckpoints[checkpointIndex] = {
          ...updatingCheckpoints[checkpointIndex],
          cameras : [],
          layoutRow : row,
          layoutCol : col
        };
        setCheckpoints(updatingCheckpoints);
        setMaxCheckableCameraCount(row * col);
      }
    }
  };

  // 📌 Checkpoints
  // add checkpoint row
  const handleCheckpointRowAdd = () : void => {
    // check if previous checkpoints has been filled with cameras. otherwise, not allowed to create a new checkpoint
    const totalCheckpoints = checkpoints.length;
    const lastItem = checkpoints[totalCheckpoints - 1];
    if (lastItem.cameras.length === 0) {
      return setNotifyModal({
        iconType : "success",
        header : "Notice!",
        message : <div className="text-center text-black">Please add cameras to the previous checkpoint first.</div>,
        isOpen : true
      });
    }

    // add new checkpoint row
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      return [
        ...prevCheckpoints,
        {
          setOrder : totalCheckpoints + 1,
          layoutRow : 1,
          layoutCol : 1,
          cameras : []
        }
      ];
    });
  };

  // confirm to remove checkpoint row
  const handleCheckpointRowRemoveConfirm = (e : MouseEvent<HTMLButtonElement>, order : number) : void => {
    !!e && e.preventDefault();

    const checkpoint = checkpoints.filter((checkpoint : CheckpointsState) => checkpoint.setOrder === order);
    const camerasLength = checkpoint.reduce((count : number, item : CheckpointsState) => count + item.cameras.length, 0);

    if (camerasLength > 0)
      setConfirmModal({
        header : "Notice!",
        message : "Are you sure to delete this checkpoint? Filled data will be lost.",
        isOpen : true,
        confirmBtnText : "Remove",
        footerMessage : "",
        confirm : () => handleCheckpointRowRemove(order),
        close : handleConfirmModalClose
      });
    else handleCheckpointRowRemove(order);
  };

  // remove checkpoint row
  const handleCheckpointRowRemove = (order : number) : void => {
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      const updated = prevCheckpoints.filter((checkpoint : CheckpointsState) => checkpoint.setOrder !== order);

      const remainingPoints = updated.map((point : CheckpointsState, index : number) => ({
        ...point,
        setOrder : index + 1
      }));

      return [...remainingPoints];
    });

    handleConfirmModalClose();
  };

  // add cameras to checkpoint
  const handleCamerasToCheckpointAdd = () : void => {
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      const updatingCheckpoints = [...prevCheckpoints];
      const checkpointIndex = updatingCheckpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder ===
        currentEditingCheckpoint);

      if (checkpointIndex >= 0) {
        const uniqueItems = _.uniqBy(checkedCameras, "id");

        updatingCheckpoints[checkpointIndex] = {
          ...updatingCheckpoints[checkpointIndex],
          cameras : [...uniqueItems]
        };
      }

      return updatingCheckpoints;
    });

    setMaxCheckableCameraCount(1);

    handleConfirmModalClose();
  };

  // sort checkpoint order (by drag n drop)
  const handleCheckpointOrderSort = (newSortedCheckpoints : CheckpointsState[]) : void => {
    setCheckpoints(newSortedCheckpoints);
  };

  // check cameras (to add them to a checkpoint)
  const handleCameraTableRowCheck = (checkedCamera : CameraResponse) : void => {
    const isChecked = !_.isEmpty(checkedCameras.find((checkedRow : CameraResponse) => checkedRow.id ===
      checkedCamera.id));

    if (!isChecked) {
      setCheckedCameras((prevChecked : CameraResponse[]) => [...prevChecked,
        checkedCamera]);
    } else setCheckedCameras(checkedCameras.filter((_checkedCamera : CameraResponse) => _checkedCamera.id !==
      checkedCamera.id));
  };

  // toggle add cameras table
  const handleAddCamerasTableToggle = (order : number | undefined, command : string) : void => {
    if (command === "close" && order === undefined) {
      setIsAddCamerasTableOpen(false);
    } else {
      const index = checkpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);

      if (index >= 0 && selectedSite !== "0") {
        setCheckedCameras(checkpoints[index].cameras); // !important
        setIsAddCamerasTableOpen(!isAddCamerasTableOpen);
        setCurrentEditingCheckpoint(order);
      } else {
        setCheckedCameras([]);
        setNotifyModal({
          iconType : "notify",
          header : "Notice!",
          message : <div className="text-center text-black">Please select the site first.</div>,
          isOpen : true
        });
      }
    }
  };

  // close camera table
  const handleConfirmModalClose = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      footerMessage : "",
      confirmBtnText : "",
      confirm : null
    });
  };

  // uncheck camera from checkpoint
  const handleCameraRemoveFromCheckpoint = (
    checkpointId : string | undefined,
    order : number,
    item : CameraResponse
  ) : void => {
    if (!checkpointId) {
      setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
        const checkpointIndex = prevCheckpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);

        if (checkpointIndex >= 0) {
          const updatingCameras = prevCheckpoints[checkpointIndex].cameras;
          const updatedCameras = updatingCameras.filter((camera : CameraResponse) => camera.id !== item.id);

          const updatingCheckpoints = [...prevCheckpoints];
          updatingCheckpoints[checkpointIndex] = {
            ...updatingCheckpoints[checkpointIndex],
            cameras : [...updatedCameras]
          };

          return updatingCheckpoints;
        }

        return prevCheckpoints;
      });
    }
  };

  const handleNotifyModalClose = () : void => {
    setNotifyModal({
      header : null,
      message : null,
      isOpen : false
    });
  };

  // 📌 select user
  const handleUserSelect = (e : MouseEvent, user : UserResponse) : void => {
    !!e && e.preventDefault();

    const isChecked = !_.isEmpty(checkedUsers.find((checkedRow : UserResponse) => checkedRow.id === user.id));
    if (!isChecked) {
      setCheckedUsers((prevChecked : UserResponse[]) => [...prevChecked,
        user]);
    } else setCheckedUsers(checkedUsers.filter((checkedUser : UserResponse) => checkedUser.id !== user.id));
  };

  // unselect user
  const handleUserUnselect = (e : MouseEvent, user : UserResponse) : void => {
    !!e && e.preventDefault();
    setCheckedUsers(checkedUsers.filter((checkedUser : UserResponse) => checkedUser.id !== user.id));
  };

  // select start allow time
  const handleStartTimeChange = (value : number) : void => {
    setStartAllowTimeInSeconds(value);
  };

  // select view mode change
  const handlePatrolViewModeChange = (value : string) : void => {
    setPatrolViewMode(value);
    setCheckpoints([
      {
        setOrder : 1,
        layoutRow : 1,
        layoutCol : 1,
        cameras : []
      }
    ]);
  };
  // --- ⬆︎ END - Step 1 - Add Checkpoints - Handlers ⬆︎ --- //

  // --- ⬇︎ START - Step 2 - Add Schedules - Handlers ⬇︎ --- //
  // 📌 select date
  const handleDateSelect = (
    scheduleNo : number,
    selectedDate : CalendarDate,
    type : "startOccurrenceDate" | "endOccurrenceDate"
  ) : void => {
    // incoming selectedDate format => { year: number, month: number, day: number }
    setSchedules((prevSchedules : Schedule[]) => {
      prevSchedules[scheduleNo][type] = selectedDate;
      return [...prevSchedules];
    });
  };

  // 📌 toggle recur forever
  const handleRecurForeverClick = (scheduleNo : number) : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      const targetSchedule = prevSchedules[scheduleNo];
      targetSchedule.isRecurForever = !targetSchedule.isRecurForever;

      return [...prevSchedules];
    });
  };

  // repeat every x hour
  const handleRepeatEveryXHourCheck = (scheduleNo : number, timeNo : number, hour : number) : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      const targetSchedule = prevSchedules[scheduleNo];
      const isChecked = targetSchedule.executingTime[timeNo]?.repeatHours !== null;

      if (!isChecked) {
        targetSchedule.executingTime[timeNo].repeatHours = hour;
      } else {
        targetSchedule.executingTime[timeNo].repeatHours = null;
      }

      targetSchedule.executingTime = [targetSchedule.executingTime[timeNo]];

      return [...prevSchedules];
    });
  };

  // repeat every x hour change
  const handleRepeatEveryXHourChange = (scheduleNo : number, timeNo : number, hour : number) : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      const targetSchedule = prevSchedules[scheduleNo];
      const isChecked = targetSchedule.executingTime[timeNo]?.repeatHours !== null;

      if (isChecked) {
        targetSchedule.executingTime[timeNo].repeatHours = hour;
      }

      return [...prevSchedules];
    });
  };

  // 📌 check/uncheck executing days (Mon, ..., Sun)
  const handleExecutingDaysCheck = (scheduleNo : number, selectedDay : number) : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      const targetSchedule = prevSchedules[scheduleNo];
      const isChecked = targetSchedule.executingDays.includes(selectedDay);

      if (selectedDay < 0) targetSchedule.executingDays = [];
      else if (selectedDay === 8) targetSchedule.executingDays = [0,
        1,
        2,
        3,
        4,
        5,
        6];
      else {
        if (!isChecked) {
          targetSchedule.executingDays = _.concat(targetSchedule.executingDays, selectedDay);
        } else {
          targetSchedule.executingDays = _.without(targetSchedule.executingDays, selectedDay);
        }
      }

      return [...prevSchedules];
    });
  };

  // 📌 select executing times
  const handleTimeRangeSelect = (
    scheduleNo : number,
    timeNo : number,
    selectedTimeRange : ExecuteTime
  ) : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      const targetSchedule = prevSchedules[scheduleNo];
      targetSchedule.executingTime[timeNo] = selectedTimeRange;
      targetSchedule.executingTime[timeNo].repeatHours = null;

      return [...prevSchedules];
    });
  };

  // add another executing time
  const handleTimeRangeAdd = (scheduleNo : number) : void => {
    const lastTimeOfLastSchedule = schedules[schedules.length - 1].executingTime;
    const lastItemOflastTime = lastTimeOfLastSchedule[lastTimeOfLastSchedule.length - 1];
    if (_.isEqual(lastItemOflastTime.startTime, lastItemOflastTime.endTime)) {
      setNotifyModal({
        iconType : "notify",
        header : "Notice!",
        message : <div className="text-center text-black">Please add valid times to previous time range first.</div>,
        isOpen : true
      });
    } else
      setSchedules((prevSchedules : Schedule[]) => {
        prevSchedules[scheduleNo].executingTime.push({
          startTime : 3600,
          endTime : 7200,
          repeatHours : null
        });

        return [...prevSchedules];
      });
  };

  // remove executing time
  const handleTimeRangeRemove = (e : MouseEvent<HTMLButtonElement>, scheduleNo : number, timeNo : number) : void => {
    !!e && e.preventDefault();
    
    setSchedules((prevSchedules : Schedule[]) => {
      _.pullAt(prevSchedules[scheduleNo].executingTime, timeNo);
      return [...prevSchedules];
    });
  };

  // 📌 add another schedule
  const handleScheduleAdd = () : void => {
    setSchedules((prevSchedules : Schedule[]) => {
      prevSchedules.push({
        startOccurrenceDate : {
          year : currentYear,
          month : currentMonth,
          day : today
        },
        endOccurrenceDate : {
          year : currentYear,
          month : currentMonth,
          day : today
        },
        isRecurForever : false,
        executingTime : [
          {
            startTime : 3600, // 1am
            endTime : 7200, // 2am
            repeatHours : null
          }
        ],
        executingDays : [0,
          1,
          2,
          3,
          4,
          5,
          6]
      });

      return [...prevSchedules];
    });
  };

  // remove schedule
  const handleScheduleRemove = (e : MouseEvent<HTMLButtonElement>, scheduleNo : number) : void => {
    !!e && e.preventDefault();

    setSchedules((prevSchedules : Schedule[]) => {
      _.pullAt(prevSchedules, scheduleNo);
      return [...prevSchedules];
    });
  };
  // --- ⬆︎ END - Step 2 - Add Schedules - Handlers ⬆︎ --- //

  // --- ⬇︎ START - Step 3 - Confirm and Submit Data - Handlers ⬇︎ --- //
  const handleReminderTimeChange = (value : number) : void => {
    setReminderTimeInSeconds(value);
  };

  const handleSubmittingFormModalClose = () : void => {
    setSubmitFormModal({
      message : null,
      isOpen : false,
      close : null
    });

    const errorSteps = Object.keys(apiErrorSteps);
    if (errorSteps.length > 0) {
      const messages : string[] = [];
      if (errorSteps.includes("1")) {
        // checkpoint created failed
        messages.push("Checkpoints created failed due to some conflicts on the request.");
      }
      if (errorSteps.includes("2")) {
        // schedules created failed
        messages.push("Schedules created failed due to conflicted with existed schedules of the selected site.");
      }

      const messageComponent : JSX.Element = (
        <div>
          <div className="h5 text-warning mb-1">
            Patrol Route has been created, but there are some steps failed to execute.
          </div>
          {
            messages.map((aMsg : string, id : number) => {
              return <div
                key={ id }
                className="mb-1">
                { aMsg }
              </div>;
            })
          }
        </div>
      );

      setRouteCreationConfirmationModal({
        header : "Route Creation",
        message : messageComponent,
        isOpen : true,
        confirmBtnText : "View",
        footerMessage : "",
        confirm : redirectToPatrolDetailPage,
        close : closeRouteCreateConfirmationModal
      });
      setApiErrorSteps({});
      setApiCallingStep(0);
    } else {
      setSuccessModalOpen(true);
    }
  };

  const handleSuccessModalClose = () : void => {
    setSuccessModalOpen(false);
    setSubmitFormModal({
      message : null,
      isOpen : false,
      close : null
    });

    history.push(PATROL_LIST_PATH);
  };

  const redirectToPatrolDetailPage = () : void => {
    closeRouteCreateConfirmationModal();
    history.push(PATROL_MANAGE_PATH.replace(":routeId", routeIdRef.current));
  };

  const closeRouteCreateConfirmationModal = () : void => {
    setRouteCreationConfirmationModal({
      header : null,
      message : null,
      isOpen : false,
      footerMessage : "",
      confirm : null,
      confirmBtnText : "",
      close : null
    });
  };

  // ⭐️ Calls API ⭐️
  const handlePatrolRouteCreate = async () : Promise<void> => {
    setSubmitFormModal({
      message : <SubmittingFormModal
        progressMsg={ SUBMIT_FORM_PROGRESSES }
        errorSteps={ apiErrorSteps }
        currentProgress={ apiCallingStep } />,
      isOpen : true,
      close : handleSubmittingFormModalClose
    });

    // 1) Add details info (name, site, assignees)
    const assignedUserIds = _.map(checkedUsers, "id");
    const selectedSiteId = !!selectedSite ? selectedSite : undefined;
    const { data : createdRoute } = await createRoute(reminderTimeInSeconds, patrolName, selectedSiteId, assignedUserIds, startAllowTimeInSeconds, patrolViewMode);
    if (!createdRoute)
      return setNotifyModal({
        iconType : "notify",
        header : "Notice!",
        message : <div className="text-center text-black">Something went wrong while creating route.</div>,
        isOpen : true
      });
    routeIdRef.current = createdRoute.id;
    setApiCallingStep(1);

    // 2) Add checkpoints
    const {
      data : addedCheckpoints,
      errors
    } = await addCheckpoints(createdRoute.id, checkpoints);
    if (!addedCheckpoints && errors) {
      setApiErrorSteps((prevSteps : Record<number, boolean>) => (
        {
          ...prevSteps,
          1 : true
        }
      ));
    }
    setApiCallingStep(2);

    // 3) Add schedules
    const { data : addedSchedules } = await addSchedules(createdRoute.id, schedules);
    if (!addedSchedules) {
      setApiErrorSteps((prevSteps : Record<number, boolean>) => (
        {
          ...prevSteps,
          2 : true
        }
      ));
    }
    setApiCallingStep(3);
  };
  // --- ⬆︎ END - Step 3 - Confirm and Submit Data - Handlers ⬆︎ --- //

  // --- 📌 Stepper Validations 📌 --- //
  const handleGoNextStep = async (nextStep : number) : Promise<void> => {
    // 1) Validate Step-1
    if (nextStep === 1) {
      const isPatrolNameEmpty = patrolName.length === 0;
      let duplicatedName = false;
      if (!isPatrolNameEmpty) {
        const duplicatedRouteCount = await countRoutes(patrolName, null, true);
        duplicatedName = !!duplicatedRouteCount;
      }
      const isSiteEmpty = selectedSite === "0";
      const isCamerasEmpty = _.every(checkpoints, (checkpoint : Checkpoints) => checkpoint.cameras.length === 0);
      const isUsersEmpty = checkedUsers.length === 0;
      const isPatrolViewModeInvalid = patrolViewMode === "";
      const isDuplicatedCamerasPresent = duplicatedCameras.length > 0;

      const errors = [];
      if (isPatrolNameEmpty) errors.push(Step1Validations["EMPTY_PATROL_NAME"].label);
      if (duplicatedName) errors.push(Step1Validations["DUPLICATED_PATROL_NAME"].label);
      if (isSiteEmpty) errors.push(Step1Validations["EMPTY_SITE"].label);
      if (isCamerasEmpty) errors.push(Step1Validations["EMPTY_CAMERAS"].label);
      if (isUsersEmpty) errors.push(Step1Validations["EMPTY_USERS"].label);
      if (isPatrolViewModeInvalid) errors.push(Step1Validations["INVALID_VIEW_MODE"].label);
      if (isDuplicatedCamerasPresent) errors.push(Step1Validations["DUPLICATE_CAMERAS"].label);

      if (errors.length === 0) {
        setActiveStep(nextStep);
      } else {
        setNotifyModal({
          iconType : "notify",
          size : "md",
          header : "Notice!",
          message : <ValidationErrors errors={ errors } />,
          isOpen : true
        });
      }
    } else if (nextStep === 2) {
      // 2) Validate Step-2

      // check dates
      let isDatesInvalid = false;
      const invalidSchedule = schedules.find((schedule : Schedule) => {
        if (isDateXGreaterThanDateY(schedule.startOccurrenceDate, schedule.endOccurrenceDate)) return schedule;
      });
      if (!!invalidSchedule && !_.isEmpty(invalidSchedule)) isDatesInvalid = true;

      // check time ranges
      const hasTimeRangesDuplicated = checkOverlappingTimeWithinSchedule(schedules);
      const liveFeedTimeRangesDuplicated = patrolViewMode === "LiveVideoFeed" && checkOverlappingSchedules(schedules);

      // check executing days
      const isExecutingDaysEmpty =
        schedules.filter((schedule : Schedule) => schedule.executingDays.length === 0).length > 0;

      // check duplicates time ranges in all schedule cards
      const includeInvalidSchedulesInAllSchedules = !checkAllSchedulesValidity(schedules);

      const errors = [];
      if (isDatesInvalid) errors.push(Step2Validations["INVALID_DATES"].label);
      if (isExecutingDaysEmpty) errors.push(Step2Validations["EMPTY_EXECUTING_DAYS"].label);
      if (hasTimeRangesDuplicated) errors.push(Step2Validations["DUPLICATE_TIMES"].label);
      if (liveFeedTimeRangesDuplicated) errors.push(Step2Validations["EXISTED_DUPLICATED_TIMES"].label);
      if (includeInvalidSchedulesInAllSchedules) errors.push(Step2Validations["DUPLICATE_DATES_AND_TIMES"].label);

      if (errors.length === 0) setActiveStep(nextStep);
      else
        setNotifyModal({
          iconType : "notify",
          header : "Notice!",
          message : <ValidationErrors errors={ errors } />,
          isOpen : true
        });
    }
  };

  // Steps components
  let ContentComponent : JSX.Element;
  switch (activeStep) {
    case 0:
      ContentComponent = (
        <Step1AddCheckpoints
          // Patrol Name
          patrolName={ {
            name : patrolName,
            onPatrolNameChange : handlePatrolNameChange
          } }
          // Sites
          sites={ sites }
          site={ {
            siteId : selectedSite,
            name : sites?.find((site : SiteResponse) => parseInt(site.id) === parseInt(selectedSite))?.name || "",
            onSiteChange : handleSiteChange
          } }
          // Layout
          onLayoutChange={ handleLayoutChange }
          onCheckpointsSort={ handleCheckpointOrderSort }
          // Checkpoint
          checkpoints={ checkpoints }
          duplicatedCameras={ duplicatedCameras }
          onCheckpointAdd={ handleCheckpointRowAdd }
          onCheckpointRemove={ handleCheckpointRowRemoveConfirm }
          onCameraRemoveFromCheckpoint={ handleCameraRemoveFromCheckpoint }
          // Notify Modal
          confirmModal={ confirmModal }
          notifyModal={ notifyModal }
          onNotifyModalClose={ handleNotifyModalClose }
          // Add Camera Modal
          addCamerasTable={ {
            isOpen : isAddCamerasTableOpen,
            isMaxCheckableCountReached : checkedCameras.length >= maxCheckableCameraCount,
            selectedSite : sites.find((site : SiteResponse) => parseInt(site.id) === parseInt(selectedSite)),
            checkedCameras : checkedCameras,
            onAddCamerasTableToggle : handleAddCamerasTableToggle,
            onCameraRowCheckUncheck : handleCameraTableRowCheck,
            onCamerasAdd : handleCamerasToCheckpointAdd
          } }
          // Users
          checkedUsers={ checkedUsers }
          onUserSelect={ handleUserSelect }
          onUserUnselect={ handleUserUnselect }
          // Start allow time
          startAllowTime={ {
            value : startAllowTimeInSeconds,
            onStartAllowTimeChange : handleStartTimeChange
          } }
          // Patrol view mode
          patrolViewMode={ {
            value : patrolViewMode,
            onPatrolViewModeChange : handlePatrolViewModeChange
          } }
        />
      );
      break;
    case 1:
      ContentComponent = (
        <Step2AddSchedules
          // Schedules
          schedules={ schedules }
          onScheduleAdd={ handleScheduleAdd }
          onScheduleRemove={ handleScheduleRemove }
          // Start and End dates
          onDateSelect={ handleDateSelect }
          // Recur Forever
          onRecurForeverClick={ handleRecurForeverClick }
          // Repeat every x hour
          onRepeatEveryXHourCheck={ handleRepeatEveryXHourCheck }
          onRepeatEveryXHourChange={ handleRepeatEveryXHourChange }
          // Executing Times
          onTimeRangeSelect={ handleTimeRangeSelect }
          onTimeRangeAdd={ handleTimeRangeAdd }
          onTimeRangeRemove={ handleTimeRangeRemove }
          // Executing days
          onExecutingDaysCheck={ handleExecutingDaysCheck }
          // Notify Modal
          notifyModal={ notifyModal }
          onNotifyModalClose={ handleNotifyModalClose }
        />
      );
      break;
    case 2:
      ContentComponent = (
        <Step3Confirmation
          reminder={ {
            value : reminderTimeInSeconds,
            onReminderChange : handleReminderTimeChange
          } }
          patrolName={ patrolName }
          site={ {
            id : selectedSite,
            name : sites.find((site : SiteResponse) : boolean => parseInt(site.id) === parseInt(selectedSite))?.name ||
              ""
          } }
          checkpoints={ checkpoints }
          checkedUsers={ checkedUsers }
          startAllowTime={ startAllowTimeInSeconds }
          patrolViewMode={ patrolViewMode }
          schedules={ schedules }
          onStepChange={ (e : MouseEvent<HTMLButtonElement>, step : number) : void => {
            !!e && e.preventDefault();
            setActiveStep(step);
          } }
        />
      );
      break;
    default:
      ContentComponent = <span className="text-danger">Something went wrong.</span>;
  }

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    getSites();
  }, []);

  // duplicated cameras check: check checkpoints (which have same layout) have duplicated cameras
  useEffect(() => {
    // combine checkpoints and check duplicated cameras
    if (checkpoints.length > 1) {
      const comparingData = [];

      // get the cameras of checkpoints whose row and col are same with current editing checkpoint
      const currentEditingCheckpointObj = checkpoints.find((point : CheckpointsState) : boolean => point.setOrder ===
        currentEditingCheckpoint);
      if (!!currentEditingCheckpointObj) {
        checkpoints.map((point : CheckpointsState) => {
          if (
            point.layoutRow === currentEditingCheckpointObj.layoutRow &&
            point.layoutCol === currentEditingCheckpointObj.layoutCol
          ) {
            return comparingData.push(...point.cameras);
          }
        });

        const duplicatedNames = getDuplicatedCameraNamesArr(comparingData);
        if (duplicatedNames.length > 0) setDuplicatedCameras(duplicatedNames);
        else setDuplicatedCameras([]);
      }
    }
  }, [checkpoints, 
    currentEditingCheckpoint]);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="test-page">
        <PageHeaderTitle
          title="Create Patrol Route"
          redirect={ {
            label : "Patrol List",
            path : PATROL_LIST_PATH
          } }
        />

        <div
          className="container"
          style={ {
            paddingLeft : 0,
            paddingRight : 0
          } }>
          <div className="d-flex justify-content-center">
            <Stepper
              steps={ steps }
              activeStep={ activeStep }
              style={ STEPPER_STYLE } />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="container content-container d-flex justify-content-center my-3">
              { ContentComponent }
            </div>
          </div>

          <div
            className={ `container d-flex align-items-center ${ activeStep >
            0 ? "justify-content-between" : "justify-content-end" }` }>
            { activeStep > 0 &&
              <Button
                className="rounded-1"
                onClick={ () : void => setActiveStep(activeStep - 1) }>
                Previous
              </Button>
            }
            { activeStep !== steps.length - 1 && (
              <Button
                className="rounded-1"
                color="primary"
                onClick={ () : Promise<void> => handleGoNextStep(activeStep + 1) }>
                Next
              </Button>
            ) }
            { activeStep + 1 === steps.length && (
              <Button
                className="rounded-1"
                color="primary"
                onClick={ handlePatrolRouteCreate }>
                Submit
              </Button>
            ) }
          </div>
        </div>
      </VpsAppBodyContainer>

      <OverlayModal
        isOpen={ submitFormModal.isOpen }
        close={ handleSubmittingFormModalClose }>
        <SubmittingFormModal
          progressMsg={ SUBMIT_FORM_PROGRESSES }
          errorSteps={ apiErrorSteps }
          currentProgress={ apiCallingStep } />
      </OverlayModal>

      <NotifyMessageModal
        iconType={ "success" }
        color={ "success" }
        header={ "Successfully created" }
        message={ <div className="text-black text-center">You have successfully created a virtual patrol route.</div> }
        isOpen={ successModalOpen }
        close={ handleSuccessModalClose }
      />

      <ConfirmationModal
        isOpen={ routeCreationConfirmationModal.isOpen }
        message={ routeCreationConfirmationModal.message }
        header={ routeCreationConfirmationModal.header }
        close={ routeCreationConfirmationModal.close }
        confirmBtnText={ routeCreationConfirmationModal.confirmBtnText }
        confirm={ routeCreationConfirmationModal.confirm }
      />
    </VpsAppPage>
  );
}

export default memo(VirtualPatrolPage);