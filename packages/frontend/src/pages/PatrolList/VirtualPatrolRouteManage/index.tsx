import _ from "lodash";
import React, {
  ChangeEvent,
  MouseEvent,
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  useHistory,
  useParams,
  useLocation
} from "react-router-dom";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  List,
  Row,
  Tooltip
} from "reactstrap";
import { FiPlus } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { CgAdd } from "react-icons/cg";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineMinus
} from "react-icons/ai";
import {
  RxDragHandleDots2,
  RxPencil2,
  RxTrash
} from "react-icons/rx";
import { TiWarning } from "react-icons/ti";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import Badge from "components/Badge";
import CheckBox from "components/CheckBox";
import CheckboxList from "components/CheckboxList";
import CamerasGrid from "pages/PatrolList/VirtualPatrolRouteCreate/common/CamerasGrid";
import ConfirmationModal from "components/ConfirmationModal";
import NotifyMessageModal from "components/NotificationModal";
import LoadingSpinner from "components/LoadingSpinner";
import ValidationErrors from "pages/PatrolList/VirtualPatrolRouteCreate/common/ValidationErrors";
import InputDate from "components/InputDate";
import InputTimeRangePicker from "components/InputTimeRangePicker";
import AddCamerasTableModal from "../VirtualPatrolRouteCreate/common/AddCamerasTableModal";

import {
  CHECK_POINTS_IMAGE_LAYOUTS,
  CHECK_POINTS_VIDEO_LAYOUTS,
  DATE_OF_WEEK,
  PatrolViewModes,
  REMINDER_TIME_PATROL,
  RepeatEveryXHoursForSchedule,
  StartAllowTimeForPatrol
} from "data/common-data";
import { ActivityType } from "@vps/utils/lib/data";
import { PATROL_LIST_PATH } from "data/route-path";
import {
  CalendarDate,
  ConfirmationModalProps,
  NotificationModalProps
} from "model-type/component-style";
import {
  addCheckpoints,
  addSchedules,
  deleteCheckpointsList,
  deletePatrolRoute,
  deleteSchedulesList,
  fetchPatrolRouteById,
  updateCheckpointsList,
  updateRoute,
  updateSchedulesList
} from "services/route";
import {
  TIME_ZONE,
  getTodayInCalendarAcceptedFormat
} from "utils/time-format";
import {
  // convertCalendarDateToDate,
  convertISOToTimeObj,
  convertSecondsToHumanReadableFormat,
  isDateXGreaterThanDateY
} from "utils/date-time";
import { fetchSites } from "services/site";
import { fetchUsers } from "services/user";
import { swapElements } from "utils/swap-elements";
import {
  Step1Validations,
  Step2Validations
} from "pages/PatrolList/VirtualPatrolRouteCreate/common/validationMessages";
import {
  checkAllSchedulesValidity,
  checkOverlappingSchedules,
  checkOverlappingTimeWithinSchedule,
  getDuplicatedCameraNamesArr
} from "utils/route";
import { logActivity } from "services/activities";
import moment from "moment-timezone";
import SelectCustom from "components/SelectCustom";
import RadioButton from "components/RadioButton";
import { SiteResponse } from "@vps/utils/src/dto/site";
import { 
  CameraResponse,
  MiniUserResponse, 
  UserResponse,
  RouteCheckpointResponse, 
  RouteDetailResponse,
  RouteScheduleResponse 
} from "@vps/utils/lib/dto";
import { 
  CheckpointsState,
  SchedulesState 
} from "data/types";
import { ExecuteTime } from "@vps/utils/lib/data";

const today = new Date().getDate();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

function VirtualPatrolRouteManagePage() : JSX.Element {
  const history = useHistory();
  const location = useLocation();
  const { routeId } = useParams();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  // --- 📌 Get patrol route details 📌 --- //
  const [oldPatrolRoute,
    setOldPatrolRoute] = useState<RouteDetailResponse>(null);

  // --- 📌 Edit patrol route 📌 --- //
  const [isEditing,
    setIsEditing] = useState(false);
  // Reminder time in minutes
  const [selectedReminderTimeInMinutes,
    setSelectedReminderTimeInMinutes] = useState(30 * 60); // 30 mins * 60 => 1800 sec
  // Patrol route name
  const [patrolName,
    setPatrolName] = useState<string>("");
  // Sites
  const [sites,
    setSites] = useState<SiteResponse[]>([]);
  const [selectedSite,
    setSelectedSite] = useState<string>("0");
  const [originalSelectedSite,
    setOriginalSelectedSite] = useState<string>("0");
  // Checkpoints
  const prevCheckpointRef = useRef<CheckpointsState[]>([]);
  const [checkpoints,
    setCheckpoints] = useState<CheckpointsState[]>([]);
  const [deletingCheckpointIds,
    setDeletingCheckpointIds] = useState<string[]>([]);
  const [updatingCheckpoints,
    setUpdatingCheckpoints] = useState<CheckpointsState[]>([]);
  const [currentEditingCheckpoint,
    setCurrentEditingCheckpoint] = useState<number>(1);
  const [maxCheckableCameraCount,
    setMaxCheckableCameraCount] = useState<number>(1);
  // Cameras
  const [isAddCamerasTableOpen,
    setIsAddCamerasTableOpen] = useState<boolean>(false);
  const [duplicatedCameras,
    setDuplicatedCameras] = useState<string[]>([]);
  const [checkedCameras,
    setCheckedCameras] = useState<CameraResponse[]>([]);
  // Assign users
  const [users,
    setUsers] = useState([]);
  const [checkedUsers,
    setCheckedUsers] = useState<MiniUserResponse[]>([]);
  // Start allow time
  const [startAllowTimeInSeconds,
    setStartAllowTimeInSeconds] = useState<number>(0);
  // Patrol view mode
  const [patrolViewMode,
    setPatrolViewMode] = useState("");
  // Sortable list by dragging
  const [dragItemIndex,
    setDragItemIndex] = useState<number>(); // old position index
  const [dragOverItemIndex,
    setDragOverItemIndex] = useState<number>(); // new position index
  // Schedules
  const [schedules,
    setSchedules] = useState<SchedulesState[]>([]);
  const [deletingScheduleIds,
    setDeletingScheduleIds] = useState<string[]>([]);
  const [creatingSchedules,
    setCreatingSchedules] = useState<SchedulesState[]>([]); // here using separate var for creating schedules. for checkpoints, can't as we have `order`
  const [updatingSchedules,
    setUpdatingSchedules] = useState<SchedulesState[]>([]);
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);

  // --- 📌 Modals 📌 --- //
  const [notifyModal,
    setNotifyModal] = useState<NotificationModalProps>({
      color : "primary",
      iconType : "notify",
      header : null,
      message : null,
      isOpen : false
    });

  const [confirmModal,
    setConfirmModal] = useState<ConfirmationModalProps>({
      header : null,
      message : null,
      isOpen : false,
      confirm : null,
      confirmBtnText : "Delete"
    });

  // 📌 fetch patrol route by id and prepare it acc to fe data structure
  const fetchPatrolRoute = async () : Promise<void> => {
    setLoading(true);
    const patrolRoute = await fetchPatrolRouteById(routeId);

    if (!!patrolRoute) {
      // reminder time to receive notis
      setSelectedReminderTimeInMinutes(patrolRoute.reminderTime);

      // allow start time
      setStartAllowTimeInSeconds(patrolRoute.allowStartTime);

      // patrol view mode
      setPatrolViewMode(patrolRoute?.patrolMode);

      prevCheckpointRef.current = patrolRoute?.routeCheckpoints;

      // sort checkpoints by order
      const routeCheckpoints = _.sortBy(patrolRoute?.routeCheckpoints, (obj : RouteCheckpointResponse) => obj.setOrder);
      // const transformedRoute = routeCheckpoints.map((point : RouteCheckpointResponse) : RouteCheckpointResponse => {
      //   const checkpoint : RouteCheckpointResponse = {
      //     id : "",
      //     setOrder : 0,
      //     layoutCol : 0,
      //     layoutRow : 0,
      //     cameras : []
      //   };

      //   checkpoint.id = point.id;
      //   checkpoint.setOrder = point.setOrder;
      //   checkpoint.layoutCol = point.layoutCol;
      //   checkpoint.layoutRow = point.layoutRow;
      //   checkpoint.cameras = point.cameras;

      //   return checkpoint;
      // });

      patrolRoute.routeCheckpoints = routeCheckpoints;
      setOldPatrolRoute(patrolRoute);
    }
    setLoading(false);
  };

  // --- ⬇︎ START - Delete patrol route - Handlers ⬇︎ --- //
  // confirm to delete patrol route
  const handlePatrolRouteDeleteConfirm = () : void => {
    setConfirmModal({
      header : (
        <div className="d-flex align-items-center gap-2">
          <RxTrash /> Delete Patrol Route
        </div>
      ),
      message : `Are you sure you want delete this patrol route — ${ !!oldPatrolRoute && oldPatrolRoute.name }?`,
      isOpen : true,
      confirmBtnText : "Delete",
      confirm : handlePatrolRouteDelete,
      close : handlePatrolRouteDeleteCancel
    });
  };

  // confirm modal to delete route cancel
  const handlePatrolRouteDeleteCancel = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirm : null,
      confirmBtnText : "Remove",
      close : null
    });
  };

  // delete route
  const handlePatrolRouteDelete = async () : Promise<void> => {
    const deleted = await deletePatrolRoute(routeId);

    if (deleted)
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Successful!",
        message : <div className="text-center text-black">{ !!oldPatrolRoute ? oldPatrolRoute.name : "—" } is
          successfully deleted!</div>,
        isOpen : true,
        close : handleDeleteRouteSuccessModalClose
      });
  };

  // close success modal of deleting route
  const handleDeleteRouteSuccessModalClose = () : void => {
    setNotifyModal({
      iconType : "notify",
      header : "",
      message : "",
      isOpen : false
    });
    history.push(PATROL_LIST_PATH);
  };
  // --- ⬆︎ END - Delete patrol route - Handlers ⬆︎ --- //

  // --- ⬇︎ START - Edit patrol route - Handlers ⬇︎ --- //
  const handleReminderTimeChange = (value : number) : void => {
    setSelectedReminderTimeInMinutes(value);
  };

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
    })); // currently, returning data's id being string, so parse id to int and sort by that
    setSites(sortedArray);
  };

  // change site => [updates state - updatingCheckpoints]
  const handleSiteChange = (value : string) : void => {
    setSelectedSite(value);

    // clear checkpoints as the cameras will be inrelevant to new selected site
    setCheckpoints([
      {
        setOrder : 1,
        layoutRow : 1,
        layoutCol : 1,
        cameras : []
      }
    ]);

    setUpdatingCheckpoints([]);
  };
  // 📌 End - Sites

  // 📌 Order
  // update order => [updates state - updatingCheckpoints]
  const handleDrop = () : void => {
    const _checkpoints = [...checkpoints];
    const sortedCheckpoints = swapElements(_checkpoints, dragItemIndex, dragOverItemIndex, "setOrder");

    // update ui
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      prevCheckpoints = sortedCheckpoints;
      return [...prevCheckpoints];
    });

    // store or update (if already exists bc of other updating options) updating checkpoints (which will go into api)
    setUpdatingCheckpoints((prevData : CheckpointsState[]) => {
      const mergedData = [...prevData];

      sortedCheckpoints.forEach((obj : CheckpointsState) => {
        const index = mergedData.findIndex((item : CheckpointsState) => item.id === obj.id);
        if (index !== -1) {
          mergedData[index] = obj;
        } else {
          mergedData.push(obj);
        }
      });

      return mergedData;
    });
  };

  const handleDragStart = (index : number) : void => {
    setDragItemIndex(index);
  };

  const handleDragOver = (e : React.DragEvent<HTMLElement>) : void => {
    !!e && e.preventDefault();
  };

  const handleDragEnter = (index : number) : void => {
    setDragOverItemIndex(index);
  };

  const handleDragEnd = () : void => {
    setDragItemIndex(undefined);
    setDragOverItemIndex(undefined);
  };
  // 📌 End - Order

  // 📌 Layout
  const layouts = Object.values(patrolViewMode ===
  "LiveImage" ? CHECK_POINTS_IMAGE_LAYOUTS : CHECK_POINTS_VIDEO_LAYOUTS).map((layout : string) => ({
    value : layout,
    label : layout
  }));
  // update layout => [updates state - updatingCheckpoints]
  const handleLayoutChange = (e : React.ChangeEvent<HTMLInputElement>, order : number) : void => {
    !!e && e.preventDefault();
    setCurrentEditingCheckpoint(order);

    const value = e.target.value; // 2x2 or 3x3 or 5x5 etc
    if (value) {
      const _layout = value.split("x");
      const row = Number(_layout[0]),
        col = Number(_layout[1]);

      const updatingCheckpoints = [...checkpoints];
      const checkpointIndex = updatingCheckpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);

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
  // 📌 End - Layout

  // 📌 Checkpoints
  // open/close cameras modal
  const handleAddCamerasTableToggle = (order : number | undefined, command : string) : void => {
    if (command === "close" && order === undefined) {
      setIsAddCamerasTableOpen(false);
    } else {
      const index = checkpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);

      if (index >= 0 && selectedSite !== "0") {
        setCheckedCameras(checkpoints[index].cameras);
        setDuplicatedCameras([]);
        setIsAddCamerasTableOpen(!isAddCamerasTableOpen);
        setCurrentEditingCheckpoint(order);
        setMaxCheckableCameraCount(checkpoints[index].layoutRow * checkpoints[index].layoutCol); // update max checkable count
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

  // remove camera from a checkpoint by clicking x icon => [updates state - updatingCheckpoints]
  const handleCameraRemove = (checkpointId : string | undefined, order : number, item : CameraResponse) : void => {
    let checkpointIndex;

    // updating existing checkpoints
    if (!!checkpointId) {
      checkpointIndex = checkpoints.findIndex((checkpoint : CheckpointsState) : boolean => checkpoint.id === checkpointId);
    } else {
      // updating newly added checkpoints
      checkpointIndex = checkpoints.findIndex((checkpoint : CheckpointsState) : boolean => checkpoint.setOrder === order);
    }

    if (checkpointIndex >= 0) {
      const updatingCameras = checkpoints[checkpointIndex].cameras;
      const updatedCameras = updatingCameras.filter((camera : CameraResponse) : boolean => camera.id !== item.id); // remove x-clicked camera

      const _updatingCheckpoints = [...checkpoints];
      _updatingCheckpoints[checkpointIndex] = {
        ..._updatingCheckpoints[checkpointIndex],
        cameras : [...updatedCameras]
      };
      setCheckpoints(_updatingCheckpoints); // updating ui

      // if checkpointId exists, update updated data to updatingCheckpoints state (which will go to api)
      if (!!checkpointId) {
        const targetCheckpoint = _updatingCheckpoints.find((pt : CheckpointsState) : boolean => pt.id === checkpointId);
        setUpdatingCheckpoints((prevData : CheckpointsState[]) : CheckpointsState[] => {
          const sourceCheckpoint = prevData.find((pt : CheckpointsState) : boolean => pt.id === checkpointId);
          if (!!sourceCheckpoint && !_.isEmpty(sourceCheckpoint)) {
            sourceCheckpoint.cameras = [];
            sourceCheckpoint.cameras.push(...targetCheckpoint.cameras);
          }

          return [...prevData];
        });
      }
    }
  };

  // confirm to remove entire checkpoint row
  const handleCheckpointRowRemoveConfirm = (e : MouseEvent<HTMLButtonElement>, checkpointId : string | undefined | null, order : number) : void => {
    !!e && e.preventDefault();

    // if checkpointId is present, that checkpoint is from database and can be deleted. if not, it is newly added.
    if (!!checkpointId) {
      const checkpoint = checkpoints.filter((checkpoint : CheckpointsState) => !!checkpoint.id && checkpoint.id === checkpointId);
      const camerasLength = checkpoint.reduce((count : number, item : CheckpointsState) => count + item.cameras.length, 0);

      if (camerasLength > 0) {
        setConfirmModal({
          header : "Notice!",
          message : "Are you sure to delete this checkpoint? Once updated, these data will be lost.",
          isOpen : true,
          confirmBtnText : "Remove",
          confirm : () => handleCheckpointsDelete(checkpointId),
          close : handleConfirmModalClose
        });
      } else {
        handleCheckpointsDelete(checkpointId);
      }
    } else {
      // remove checkpoint which is newly added (not from database)
      const checkpoint = checkpoints.filter((checkpoint : CheckpointsState) => checkpoint.setOrder === order);
      const camerasLength = checkpoint.reduce((count : number, item : CheckpointsState) => count + item.cameras.length, 0);

      if (camerasLength > 0)
        setConfirmModal({
          header : "Notice!",
          message : "Are you sure to delete this checkpoint? Filled data will be lost.",
          isOpen : true,
          confirmBtnText : "Remove",
          confirm : () => handleCheckpointRowRemove(order),
          close : handleConfirmModalClose
        });
      else {
        handleCheckpointRowRemove(order);
      }
    }
  };

  // remove checkpoint row from UI*
  const handleCheckpointRowRemove = (order : number) : void => {
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      const updated = prevCheckpoints.filter((checkpoint : CheckpointsState) => checkpoint.setOrder !== order);

      // resort order
      const remainingCheckpoints = updated.map((point : CheckpointsState, index : number) => ({
        ...point,
        order : index + 1
      }));

      return [...remainingCheckpoints];
    });

    handleConfirmModalClose();
  };

  // delete checkpoint row from db* => [updates state - deletingCheckpoints]
  const handleCheckpointsDelete = (checkpointId : string) : void => {
    // add to the deleting checkpoints ids (which will go to api)
    setDeletingCheckpointIds((prevDeletingCheckpointIds : string[]) => {
      return [...prevDeletingCheckpointIds,
        checkpointId];
    });

    // also needs to delete from `checkpoints` for ui updates
    let sortedCheckpoints : CheckpointsState[] = [];
    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      const existingCheckpointsInDB = [];
      const newCheckpoints = [];

      prevCheckpoints.filter((obj : CheckpointsState) => {
        if ("id" in obj) existingCheckpointsInDB.push(obj);
        else newCheckpoints.push(obj);
      });

      const remainingCheckpoints = existingCheckpointsInDB.filter((checkpoint : CheckpointsState) => checkpoint.id !== checkpointId);
      const results : CheckpointsState[] = [...remainingCheckpoints,
        ...newCheckpoints];

      // sort order after deleting checkpoints
      const sortedResults = results.map((obj : CheckpointsState, index : number) => {
        return {
          ...obj,
          order : index + 1
        };
      });

      sortedCheckpoints = sortedResults;

      return [...sortedResults];
    });

    // update order of remaining checkpoints
    // store or update (if already exists bc of other updating options) updating checkpoints (which will go into api)
    setUpdatingCheckpoints((prevData : CheckpointsState[]) => {
      const mergedData = [...prevData];

      sortedCheckpoints.forEach((obj : CheckpointsState) : void => {
        const index = mergedData.findIndex((item : CheckpointsState) => item.id === obj.id);
        if (index !== -1) {
          mergedData[index] = obj;
        } else {
          mergedData.push(obj);
        }
      });

      return mergedData;
    });

    setConfirmModal({
      header : "",
      message : "",
      isOpen : false,
      confirmBtnText : "Remove",
      confirm : null,
      close : null
    });
  }; // finish

  const handleConfirmModalClose = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirmBtnText : "",
      confirm : null
    });
  };

  // add new checkpoint row
  const handleCheckpointRowAdd = () : void => {
    const totalCheckpoints = checkpoints.length;
    const lastItem = checkpoints[totalCheckpoints - 1];
    if (!!lastItem.cameras && Array.isArray(lastItem.cameras) && lastItem.cameras.length === 0) {
      return setNotifyModal({
        iconType : "notify",
        header : "Notice!",
        message : <div className="text-center text-black">Please add cameras to previous checkpoint first.</div>,
        isOpen : true,
        close : () => {
          setNotifyModal({
            header : "",
            message : "",
            isOpen : false
          });
        }
      });
    }

    setCheckpoints((prevCheckpoints : CheckpointsState[]) => {
      const newCheckpoints = [
        ...prevCheckpoints,
        {
          setOrder : totalCheckpoints + 1,
          layoutRow : 1,
          layoutCol : 1,
          cameras : []
        }
      ];

      return newCheckpoints;
    });
  };

  // add cameras to checkpoint => [updates state - updatingCheckpoints]
  const handleCamerasToCheckpointAdd = () : void => {
    const updatingCheckpoints = [...checkpoints];
    const checkpointIndex = updatingCheckpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder ===
      currentEditingCheckpoint);

    if (checkpointIndex >= 0) {
      // const uniqueCameras = _.uniqBy(checkedCameras, "id");

      updatingCheckpoints[checkpointIndex] = {
        ...updatingCheckpoints[checkpointIndex],
        cameras : [...checkedCameras]
      };

      // update ui
      setCheckpoints(updatingCheckpoints);

      // also add to updatingCheckpoints (which will go to api)
      const existingCheckpointsInDB : CheckpointsState[] = [];
      updatingCheckpoints.filter((obj : CheckpointsState) => {
        if ("id" in obj) existingCheckpointsInDB.push(obj);
      });
      const results : CheckpointsState[] = existingCheckpointsInDB;

      // sort order
      const sortedResults = results.map((obj : CheckpointsState, index : number) => {
        return {
          ...obj,
          setOrder : index + 1
        };
      });

      // update order of checkpoints
      // store or update (if already exists bc of other updating options) updating checkpoints (which will go into api)
      setUpdatingCheckpoints((prevData : CheckpointsState[]) => {
        const mergedData = [...prevData];

        sortedResults.forEach((obj : CheckpointsState) => {
          const index = mergedData.findIndex((item : CheckpointsState) => item.id === obj.id);
          if (index !== -1) {
            mergedData[index] = obj;
          } else {
            mergedData.push(obj);
          }
        });

        return mergedData;
      });

      handleConfirmModalClose();
    }
  };

  const checkLayoutAndCheckedCamerasMatch = (
    acceptableCamerasCount : number,
    checkedCamerasCount : number,
    order : number
  ) : JSX.Element | void => {
    let _layout = "";
    const checkpointIndex = checkpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);

    if (checkpointIndex >= 0)
      _layout = checkpoints[checkpointIndex].layoutRow + "x" + checkpoints[checkpointIndex].layoutCol;

    if (checkedCamerasCount > acceptableCamerasCount)
      return (
        <span className="text-warning">
          According to selected layout ({ _layout }), the maximum acceptable item count is{ " " }
          { acceptableCamerasCount }. Please select more wider layout or remove extra items. Otherwise, extra
          ones will be cut off when creating patrol route.
        </span>
      );
  };
  // 📌 End - Checkpoints

  // 📌 User
  const getUsers = async () : Promise<void> => {
    const { data } = await fetchUsers(["Admin",
      "Officer"]);
    setUsers(data);
  };

  const handleUserSelect = (e : MouseEvent, user : UserResponse) : void => {
    !!e && e.preventDefault();

    const isChecked = !_.isEmpty(checkedUsers.find((checkedRow : UserResponse) => checkedRow.id === user.id));
    if (!isChecked) {
      setCheckedUsers((prevChecked : UserResponse[]) => [...prevChecked,
        user]);
    } else setCheckedUsers(checkedUsers.filter((checkedUser : UserResponse) => checkedUser.id !== user.id));
  };

  const handleUserUnselect = (e : MouseEvent, user : UserResponse) : void => {
    !!e && e.preventDefault();
    setCheckedUsers(checkedUsers.filter((checkedUser : UserResponse) => checkedUser.id !== user.id));
  };
  // 📌 End - User

  // 📌 Start allow time
  const handleStartAllowTimeChange = (value : number) : void => {
    setStartAllowTimeInSeconds(Number(value));
  };
  // 📌 End - Start allow time

  // Start patrol view mode
  const handlePatrolViewModeChange = (value : string) : void => {
    setPatrolViewMode(value);
  };
  // End - patrol view mode
  // --- ⬆︎ END - Edit patrol route - Handlers ⬆︎ --- //

  // --- ⬇︎ START - Edit Schedules - Handlers ⬇︎ --- //
  // !ok => add new schedule
  const handleScheduleAdd = () : void => {
    // create a new skleton schedule obj
    const newSchedule : SchedulesState = {
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
    };

    // add it to `creatingSchedules` state for api
    setCreatingSchedules((prevSchedule : SchedulesState[]) => {
      prevSchedule.push(newSchedule);
      return [...prevSchedule];
    });
  };

  // !ok => remove existing schedule in db
  const handleScheduleRemove = (scheduleId : string | undefined, scheduleNo : number | undefined) : void => {
    // prepare deleting existing schedules in db using schedule id
    if (!!scheduleId) {
      setSchedules((prevSchedules : SchedulesState[]) => {
        return [..._.reject(prevSchedules, { id : scheduleId })];
      });

      setDeletingScheduleIds((prevData : string[]) => [...prevData,
        scheduleId]);
    } else {
      // remove newly added schedule from UI using schedule index inside `creatingSchedules` state
      setCreatingSchedules((prevSchedule : SchedulesState[]) => {
        return prevSchedule.filter((item : SchedulesState, index : number) => index !== scheduleNo);
      });
    }
  };

  // !ok => update start occurrence and end occurrence date
  const handleDateSelect = (
    scheduleId : string | undefined,
    scheduleNo : number | undefined,
    selectedDate : CalendarDate,
    type : "startOccurrenceDate" | "endOccurrenceDate"
  ) : void => {
    // working with existing schedules (with schedule id)
    if (!!scheduleId) {
      // update ui of schedules
      setSchedules((prevSchedules : SchedulesState[]) =>
        prevSchedules.map((obj : SchedulesState) =>
          obj.id === scheduleId
            ? {
              ...obj,
              [type] : selectedDate
            }
            : obj));

      // update `updatingSchedules` state for api data
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that could match with incoming scheduleId and update its [type] (startOccurrrenceDate or endOccurrenceDate)
        if (prevData.length > 0) {
          const _updatedSchedules = prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              return {
                ...schedule,
                [type] : selectedDate
              };
            }
            return schedule;
          });

          return _updatedSchedules;
        } else {
          // 2) updatingSchedules doesn't have some data initially, so push new correct-data-containing obj
          const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
          const data = {
            ...target,
            [type] : selectedDate
          };

          return [...prevData,
            data];
        }
      });
    } else {
      // update schedules dates for newly added schedule, using scheduleNo
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        prevSchedules[scheduleNo][type] = selectedDate;
        return [...prevSchedules];
      });
    }
  };

  // !ok => update time ranges
  const handleTimeRangeSelect = (
    scheduleId : string | undefined,
    scheduleNo : number | undefined,
    timeNo : number,
    selectedTimeRange : ExecuteTime
  ) : void => {
    // edit time ranges of existing schedules using scheduleId
    if (!!scheduleId) {
      // update `schedules` for ui updates
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
              if (index === timeNo) {
                if (time.startTime === undefined && time.endTime === undefined) {
                  return {
                    startTime : undefined,
                    endTime : undefined,
                    repeatHours : 1
                  };
                } else {
                  return {
                    startTime : selectedTimeRange.startTime,
                    endTime : selectedTimeRange.endTime,
                    repeatHours : null
                  };
                }
              }
              return time;
            });

            return {
              ...schedule,
              executingTime : updatedExecutingTime
            };
          }

          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that matches with incoming scheduleId and update its executingTime (array of objs)
        if (prevData.length > 0) {
          return prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
                if (index === timeNo) {
                  if (time.startTime === undefined && time.endTime === undefined) {
                    return {
                      startTime : undefined,
                      endTime : undefined,
                      repeatHours : 1
                    };
                  } else {
                    return {
                      startTime : selectedTimeRange.startTime,
                      endTime : selectedTimeRange.endTime,
                      repeatHours : null
                    };
                  }
                }
                return time;
              });

              return {
                ...schedule,
                executingTime : updatedExecutingTime
              };
            }

            return schedule;
          });
        } else {
          // 2) updatingSchedules state doens't have some data initially, so push new correct-data-containing obj
          const updatedExecutingTime = target.executingTime.map((time : ExecuteTime, index : number) => {
            if (index === timeNo) {
              if (time.startTime === undefined && time.endTime === undefined) {
                return {
                  startTime : undefined,
                  endTime : undefined,
                  repeatHours : 1
                };
              } else {
                return {
                  startTime : selectedTimeRange.startTime,
                  endTime : selectedTimeRange.endTime,
                  repeatHours : null
                };
              }
            }
            return time;
          });

          const result = {
            ...target,
            executingTime : updatedExecutingTime
          };

          return [...prevData,
            result];
        }
      });
    } else {
      // new schedule
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        const targetSchedule = prevSchedules[scheduleNo];
        targetSchedule.executingTime[timeNo] = selectedTimeRange;
        targetSchedule.executingTime[timeNo].repeatHours = null; // here

        return [...prevSchedules];
      });
    }
  };

  const handleRepeatEveryXHourCheck = (scheduleId : string | undefined, scheduleNo : number | undefined, timeNo : number, hour : number) : void => {
    // edit time ranges of existing schedules using scheduleId
    if (!!scheduleId) {
      // update `schedules` for ui updates
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
              if (index === timeNo) {
                if (time.startTime === undefined && time.endTime === undefined) {
                  return {
                    startTime : 3600,
                    endTime : 7200,
                    repeatHours : null
                  };
                } else {
                  return {
                    startTime : undefined,
                    endTime : undefined,
                    repeatHours : 1
                  };
                }
              }
              return time;
            });

            // const target = schedule.executingTime[timeNo];

            return {
              ...schedule,
              executingTime : updatedExecutingTime
            };
          }

          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that matches with incoming scheduleId and update its executingTime (array of objs)
        if (prevData.length > 0) {
          return prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
                if (index === timeNo) {
                  if (time.startTime === undefined && time.endTime === undefined) {
                    return {
                      startTime : 3600,
                      endTime : 7200,
                      repeatHours : null
                    };
                  } else {
                    return {
                      startTime : undefined,
                      endTime : undefined,
                      repeatHours : 1
                    };
                  }
                }
                return time;
              });

              return {
                ...schedule,
                executingTime : updatedExecutingTime
              };
            }

            return schedule;
          });
        } else {
          // 2) updatingSchedules state doens't have some data initially, so push new correct-data-containing obj
          const updatedExecutingTime = target.executingTime.map((time : ExecuteTime, index : number) => {
            if (index === timeNo) {
              if (time.startTime === undefined && time.endTime === undefined) {
                return {
                  startTime : 3600,
                  endTime : 7200,
                  repeatHours : null
                };
              } else {
                return {
                  startTime : undefined,
                  endTime : undefined,
                  repeatHours : 1
                };
              }
            }
            return time;
          });

          const result = {
            ...target,
            executingTime : updatedExecutingTime
          };

          return [...prevData,
            result];
        }
      });
    } else {
      // add for newly added schedule, using scheduleNo
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
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
    }
  };

  const handleRepeatEveryXHourChange = (scheduleId : string | undefined, scheduleNo : number | undefined, timeNo : number, hour : number) : void => {
    // edit time ranges of existing schedules using scheduleId
    if (!!scheduleId) {
      // update `schedules` for ui updates
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
              if (index === timeNo) return {
                ...time,
                repeatHours : hour
              };
              return time;
            });

            return {
              ...schedule,
              executingTime : updatedExecutingTime
            };
          }

          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that matches with incoming scheduleId and update its executingTime (array of objs)
        if (prevData.length > 0) {
          return prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              const updatedExecutingTime = schedule.executingTime.map((time : ExecuteTime, index : number) => {
                if (index === timeNo) return {
                  ...time,
                  repeatHours : hour
                };
                return time;
              });

              return {
                ...schedule,
                executingTime : updatedExecutingTime
              };
            }

            return schedule;
          });
        } else {
          // 2) updatingSchedules state doens't have some data initially, so push new correct-data-containing obj
          const updatedExecutingTime = target.executingTime.map((time : ExecuteTime, index : number) => {
            if (index === timeNo) return {
              ...time,
              repeatHours : hour
            };
            return time;
          });

          const result = {
            ...target,
            executingTime : updatedExecutingTime
          };

          return [...prevData,
            result];
        }
      });
    } else {
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        const targetSchedule = prevSchedules[scheduleNo];
        const isChecked = targetSchedule.executingTime[timeNo]?.repeatHours !== null;

        if (isChecked) {
          targetSchedule.executingTime[timeNo].repeatHours = hour;
        }

        return [...prevSchedules];
      });
    }
  };

  // !ok => recurforever click
  const handleRecurForeverClick = (scheduleId : string | undefined, scheduleNo : number | undefined) : void => {
    // edit recurforever of existing schedule using scheduleId
    if (!!scheduleId) {
      // update for ui updates
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            return {
              ...schedule,
              endOccurrenceDate : !schedule.isRecurForever ? null : schedule.startOccurrenceDate,
              isRecurForever : !schedule.isRecurForever
            };
          }
          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that could match with incoming scheduleId and update its endOccurrenceDate
        if (prevData.length > 0) {
          const _schedules = prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              return {
                ...schedule,
                endOccurrenceDate : !schedule.isRecurForever ? null : schedule.endOccurrenceDate
              };
            }
            return schedule;
          });
          return _schedules;
        } else {
          // 2) updatingSchedules state doesn't have some data initially, so push new correct-data-containing object
          const result = {
            ...target,
            endOccurrenceDate : !target.isRecurForever ? null : target.endOccurrenceDate
          };
          return [...prevData,
            result];
        }
      });
    } else {
      // creating
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState, index : number) => {
          if (index === scheduleNo) {
            return {
              ...schedule,
              endOccurrenceDate : !schedule.isRecurForever ? null : schedule.startOccurrenceDate,
              isRecurForever : !schedule.isRecurForever
            };
          }
          return schedule;
        });

        return [...updatedSchedules];
      });
    }
  };

  // !ok => add time range for existing and newly added schedule ⭐️⭐️⭐️⭐️⭐️
  const handleTimeRangeAdd = (scheduleId : string | undefined, scheduleNo : number | undefined) : void => {
    // default time range -> (1am to 1pm)
    const defaultTimeRange : ExecuteTime = {
      startTime : 3600,
      endTime : 7200,
      repeatHours : null
    };

    // add time range for existing schedule, using scheduleId
    if (!!scheduleId) {
      // update ui of time range for existing schedule
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            return {
              ...schedule,
              executingTime : [...schedule.executingTime,
                defaultTimeRange]
            };
          }
          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // 1) updatingSchedules state has some data initially, so find schedule that could match with incoming scueduleId and update its executing time
        if (prevData.length > 0) {
          const c = prevData.map((schedule : SchedulesState) => {
            if (schedule.id === scheduleId) {
              return {
                ...schedule,
                executingTime : [...schedule.executingTime,
                  defaultTimeRange]
              };
            }
            return schedule;
          });
          return c;
        } else {
          // 2) updatingSchedules state doesn't have some data initially, so push new correct-data-containing object
          const target = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
          const result = {
            ...target,
            executingTime : [...target.executingTime,
              defaultTimeRange]
          };
          return [...prevData,
            result];
        }
      });
    } else {
      // add time range for newly added schedule, using scheduleNo
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        prevSchedules[scheduleNo].executingTime.push(defaultTimeRange);
        return [...prevSchedules];
      });
    }
  };

  // !ok => remove time for both newly added schedule and existing schedule in db
  const handleTimeRangeRemove = (
    scheduleId : string | undefined,
    scheduleNo : number | undefined,
    timeNo : number
  ) : void => {
    // remove time range from existing schedule, using scheduleId
    if (!!scheduleId) {
      // update ui of time range for existing schedule
      setSchedules((prevSchedules : SchedulesState[]) => {
        const updatedSchedules = prevSchedules.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            const updatedExecutingTime = schedule.executingTime.filter((_ : ExecuteTime, index : number) => index !== timeNo);
            return {
              ...schedule,
              executingTime : updatedExecutingTime
            };
          }
          return schedule;
        });

        return updatedSchedules;
      });

      // update `updatingSchedules` state for api data
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        // updatingSchedules state has some data initially, so find schedule that could match with incoming scueduleId and update its executing time
        const c = prevData.map((schedule : SchedulesState) => {
          if (schedule.id === scheduleId) {
            const updatedExecutingTime = schedule.executingTime.filter((_ : ExecuteTime, index : number) => index !== timeNo);
            return {
              ...schedule,
              executingTime : updatedExecutingTime
            };
          }
          return schedule;
        });
        return c;
      });
    } else {
      // remove time range from newly added schedule, using scheduleNo
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
        _.pullAt(prevSchedules[scheduleNo].executingTime, timeNo);
        return [...prevSchedules];
      });
    }
  };

  // !ok => check/uncheck executing days for both newly added schedule and existing schedule in db
  const handleExecutingDayCheck = (
    scheduleId : string | undefined,
    scheduleNo : number | undefined,
    selectedDay : number
  ) : void => {
    // edit executing days of existing schedule using scheduleId
    if (!!scheduleId) {
      setSchedules((prevSchedules : SchedulesState[]) => {
        return prevSchedules.map((obj : SchedulesState) => {
          if (obj.id === scheduleId) {
            let updatedDays;
            if (selectedDay < 0) updatedDays = [];
            else if (selectedDay === 8) updatedDays = [0,
              1,
              2,
              3,
              4,
              5,
              6];
            else
              updatedDays = obj.executingDays.includes(selectedDay)
                ? obj.executingDays.filter((value : number) => value !== selectedDay)
                : [...obj.executingDays,
                  selectedDay];

            return {
              ...obj,
              executingDays : updatedDays
            };
          }
          return obj;
        });
      });

      // update `updatingSchedules` state for api data
      // first, check if there is already a schedule obj inside `updatingSchedules` state which is matched with incoming scheduleId
      // 1) if it doesn't, push new obj with updated data
      // 2) if it does, update just executing days of it
      setUpdatingSchedules((prevData : SchedulesState[]) => {
        const existingUpdatingSchedules = [...prevData];
        const targetIndex = prevData.findIndex((obj : SchedulesState) => obj.id === scheduleId);

        // 1) no matching object with incoming scheduleId, so push new object
        if (targetIndex === -1) {
          const targetSchedule = schedules.find((schedule : SchedulesState) => schedule.id === scheduleId);
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

          existingUpdatingSchedules.push(targetSchedule);
        } else {
          // 2) object with matching id exists, so update just executing days of it
          const targetSchedule = existingUpdatingSchedules[targetIndex];
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

          existingUpdatingSchedules[targetIndex] = {
            ...prevData[targetIndex],
            executingDays : targetSchedule.executingDays
          };
        }

        return existingUpdatingSchedules;
      });
    } else {
      // edit executing days of newly added schedule using scheduleNo
      setCreatingSchedules((prevSchedules : SchedulesState[]) => {
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
    }
  };
  // --- ⬆︎ END - Edit Schedules - Handlers ⬆︎ --- //

  // --- ⬇︎ START - Update ⬇︎ --- //
  const handleUpdate = async () : Promise<void> => {
    setLoading(true);
    const validationErrors = [];

    // 1) update details first (patrol name, site id and assigned users)
    const _reminderTimeInMinutes = selectedReminderTimeInMinutes;
    const _patrolName = patrolName;
    const _startAllowTimeInSeconds = startAllowTimeInSeconds;
    const _patrolViewMode = patrolViewMode;
    const _selectedSiteId = !!selectedSite ? selectedSite : undefined;
    const _assignedUserIds = _.map(checkedUsers, "id");

    // 1.1) check if these are updated - (reminderTime, patrol name, site id, assigned users, and patrol start allow time)
    const { errors } = await updateRoute(
      routeId,
      _patrolName,
      _startAllowTimeInSeconds,
      _selectedSiteId,
      _assignedUserIds,
      _patrolViewMode,
      _reminderTimeInMinutes
    );

    const hasErrors = !!errors ? Object.values(errors).some((value : boolean) => value === true) : false;

    if (hasErrors) {
      if (errors?.InvalidName) {
        validationErrors.push(Step1Validations["EMPTY_PATROL_NAME"].label);
      }
      if (errors?.InvalidSiteId) {
        validationErrors.push(Step1Validations["EMPTY_SITE"].label);
      }
      if (errors?.InvalidAssignedUserIds) {
        validationErrors.push(Step1Validations["EMPTY_USERS"].label);
      }
    }

    let checkpointsUpdated = false;
    // --- CHECKPOINTS --- //
    // 2) update checkpoints (1. creating checkpoint, 2. deleting checkpoint, 3. updating content of existing checkpoint)
    // 2.1) creating checkpoint
    if (duplicatedCameras.length > 0) {
      validationErrors.push(Step1Validations["DUPLICATE_CAMERAS"].label);
    } else {
      const isEmptyCamerasInNewCheckpointsExist = checkpoints.filter((_checkpoint : CheckpointsState) => _checkpoint.cameras.length ===
        0).length > 0;
      if (isEmptyCamerasInNewCheckpointsExist) {
        if (!validationErrors.includes(Step1Validations["EMPTY_CAMERAS"].label))
          validationErrors.push(Step1Validations["EMPTY_CAMERAS"].label);
      } else {
        const newCheckpoints = checkpoints.filter((checkpoint : CheckpointsState) => !("id" in checkpoint));
        if (newCheckpoints.length > 0) {
          await addCheckpoints(routeId, newCheckpoints);
          checkpointsUpdated = true;
        }
      }

      // 2.2) deleting checkpoints - by checkpointIds
      let _deletingCheckpointIds : string[] = [];
      if (originalSelectedSite != selectedSite) {
        _deletingCheckpointIds = prevCheckpointRef.current.map((checkpoint : CheckpointsState) => checkpoint?.id.toString());
      } else if (deletingCheckpointIds.length > 0) {
        _deletingCheckpointIds = deletingCheckpointIds;
      }
      if (_deletingCheckpointIds.length > 0) {
        await deleteCheckpointsList(_deletingCheckpointIds);
        checkpointsUpdated = true;
      }

      // 2.3) updating content of existing checkpoint
      const isEmptyCamerasInUpdatingCheckpointsExist = updatingCheckpoints.filter((_checkpoint : CheckpointsState) => _checkpoint.cameras.length ===
        0).length > 0;
      if (isEmptyCamerasInUpdatingCheckpointsExist) {
        if (!validationErrors.includes(Step1Validations["EMPTY_CAMERAS"].label))
          validationErrors.push(Step1Validations["EMPTY_CAMERAS"].label);
      } else {
        console.log("here => ", updatingCheckpoints);
        const updatingData = _.filter(updatingCheckpoints, (obj : CheckpointsState) => _.has(obj, "id"));
        if (updatingData.length > 0) {
          await updateCheckpointsList(routeId, updatingData);
          checkpointsUpdated = true;
        }
      }
    }

    let schedulesUpdated = false;
    // --- SCHEDULES --- //
    // 3) update schedules (1. delete schedule, 2. create schedule, 3. updating content of existing schedule)
    // 3.0) check for time overlapping, if fail => ignore 3 schedule apis running
    const timeRangesDuplicated = checkOverlappingTimeWithinSchedule(schedules);
    if (timeRangesDuplicated) {
      if (!validationErrors.includes(Step2Validations["DUPLICATE_TIMES"].label)) {
        validationErrors.push(Step2Validations["DUPLICATE_TIMES"].label);
      }
    }
    const liveFeedTimeRangesDuplicated = patrolViewMode === "LiveVideoFeed" && checkOverlappingSchedules(schedules);
    if (liveFeedTimeRangesDuplicated) {
      if (!validationErrors.includes(Step2Validations["EXISTED_DUPLICATED_TIMES"].label)) {
        validationErrors.push(Step2Validations["EXISTED_DUPLICATED_TIMES"].label);
      }
    }
    const hasTimeRangesDuplicated = liveFeedTimeRangesDuplicated || timeRangesDuplicated;

    // 3.1) delete schedule
    if (deletingScheduleIds.length > 0 && !hasTimeRangesDuplicated) {
      const success = await deleteSchedulesList(deletingScheduleIds);
      if (success) {
        setDeletingScheduleIds([]);
        schedulesUpdated = true;
      }
    }

    // 3.2) check duplicates time ranges in all schedule cards
    // schedules => old schedules if user hasn't changed anything abouth old ones
    // creatingSchedules => newly created schedules
    // updatingSchedules => updating schedules
    const combinedSchedules = [...schedules,
      ...creatingSchedules];
    const includeInvalidSchedulesInAllSchedules = !checkAllSchedulesValidity(combinedSchedules);
    if (includeInvalidSchedulesInAllSchedules) {
      validationErrors.push(Step2Validations["DUPLICATE_DATES_AND_TIMES"].label);
    } else {
      // 3.3) create new schedule
      if (creatingSchedules.length > 0) {
        // check dates
        let isDatesInvalid = false;
        const invalidSchedule = schedules.find((schedule : SchedulesState) => {
          if (isDateXGreaterThanDateY(schedule.startOccurrenceDate, schedule.endOccurrenceDate)) return schedule;
        });
        if (!!invalidSchedule && !_.isEmpty(invalidSchedule)) isDatesInvalid = true;

        const isExecutingDaysEmpty = creatingSchedules.filter((schedule : SchedulesState) => schedule.executingDays.length ===
          0).length > 0;

        if (isDatesInvalid) {
          if (!validationErrors.includes(Step2Validations["INVALID_DATES"].label))
            validationErrors.push(Step2Validations["INVALID_DATES"].label);
        }
        if (isExecutingDaysEmpty) {
          if (!validationErrors.includes(Step2Validations["EMPTY_EXECUTING_DAYS"].label))
            validationErrors.push(Step2Validations["EMPTY_EXECUTING_DAYS"].label);
        }

        if (!isDatesInvalid && !hasTimeRangesDuplicated && !isExecutingDaysEmpty) {
          const {
            data : addedSchedules,
            errors
          } = await addSchedules(routeId, creatingSchedules);
          if (addedSchedules && !errors) {
            setCreatingSchedules([]);
            schedulesUpdated = true;
          } else {
            if (!validationErrors.includes(Step2Validations["EXISTED_DUPLICATED_TIMES"].label)) {
              validationErrors.push(Step2Validations["EXISTED_DUPLICATED_TIMES"].label);
            }
          }
        }
      }

      // 3.4) update existing schedule
      if (updatingSchedules.length > 0) {
        // check dates
        let isDatesInvalid = false;
        const invalidSchedule = schedules.find((schedule : SchedulesState) => {
          if (isDateXGreaterThanDateY(schedule.startOccurrenceDate, schedule.endOccurrenceDate)) return schedule;
        });
        if (!!invalidSchedule && !_.isEmpty(invalidSchedule)) isDatesInvalid = true;

        // check executing days
        const isExecutingDaysEmpty = updatingSchedules.filter((schedule : SchedulesState) => schedule.executingDays.length ===
          0).length > 0;

        if (isDatesInvalid) {
          if (!validationErrors.includes(Step2Validations["INVALID_DATES"].label))
            validationErrors.push(Step2Validations["INVALID_DATES"].label);
        }
        if (isExecutingDaysEmpty) {
          if (!validationErrors.includes(Step2Validations["EMPTY_EXECUTING_DAYS"].label))
            validationErrors.push(Step2Validations["EMPTY_EXECUTING_DAYS"].label);
        }

        if (!isDatesInvalid && !hasTimeRangesDuplicated && !isExecutingDaysEmpty) {
          const {
            data : updatedSchedules,
            errors
          } = await updateSchedulesList(routeId, updatingSchedules);
          if (updatedSchedules && !errors) {
            setUpdatingSchedules([]);
            schedulesUpdated = true;
          } else {
            if (!validationErrors.includes(Step2Validations["EXISTED_DUPLICATED_TIMES"].label)) {
              validationErrors.push(Step2Validations["EXISTED_DUPLICATED_TIMES"].label);
            }
          }
        }
      }
    }

    if (validationErrors.length > 0) {
      setNotifyModal({
        iconType : "notify",
        header : "Error!",
        message : <ValidationErrors errors={ validationErrors } />,
        isOpen : true,
        close : handleFormErrorsModalClose
      });
    } else {
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Successful!",
        message : <div className="text-center text-black">Successfully updated route.</div>,
        isOpen : true,
        close : handleUpdateSuccessModalClose
      });
      if (checkpointsUpdated || schedulesUpdated) {
        logActivity(ActivityType.UpdateRoute, _patrolName);
      }
    }

    setLoading(false);
  };

  const handleUpdateSuccessModalClose = () : void => {
    setNotifyModal({
      header : "",
      message : "",
      isOpen : false,
      close : null
    });

    setIsEditing(false);
    fetchPatrolRoute(); // reload the data after updating
  };

  const handleFormErrorsModalClose = () : void => {
    setNotifyModal({
      header : "",
      message : "",
      isOpen : false,
      close : null
    });
  };
  // --- ⬆︎ END - Update ⬆︎ --- //

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    fetchPatrolRoute();
  }, []);

  useEffect(() => {
    getSites();
    getUsers();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setPatrolName(oldPatrolRoute?.name);
      setSelectedSite(oldPatrolRoute?.siteId);
      setOriginalSelectedSite(oldPatrolRoute?.siteId);
      setCheckedUsers(oldPatrolRoute?.assignedUsers);
      setCheckpoints(oldPatrolRoute?.routeCheckpoints); // sorted by order
      setPatrolViewMode(oldPatrolRoute?.patrolMode);

      // transform routeSchedules from api to fe structure
      const routeSchedules = oldPatrolRoute?.routeSchedules;
      if (!!routeSchedules) {
        const transformedData = routeSchedules.map((item : RouteScheduleResponse) => {
          const startOccurrenceDate = convertISOToTimeObj(item.startOccurrenceDate.toString());
          const endOccurrenceDate = !!item.endOccurrenceDate ? convertISOToTimeObj(item.endOccurrenceDate.toString()) : null;
          const executingTime = item.executingTime;

          return {
            ...item,
            startOccurrenceDate,
            endOccurrenceDate,
            executingTime,
            isRecurForever : !endOccurrenceDate
          };
        });

        setSchedules(transformedData);
      }

    } else {
      // cleanup
      setPatrolName("");
      setSelectedSite("0");
      setOriginalSelectedSite("0");
      setCheckedUsers([]);
      setCheckpoints([]);
      setSchedules([]);
      setCreatingSchedules([]);
      setDeletingCheckpointIds([]);
      setUpdatingCheckpoints([]);
    }
  }, [isEditing]);

  // duplicated cameras check: check checkpoints (which have same layout) have duplicated cameras
  useEffect(() => {
    // combine existing and new added checkpoints and check duplicated cameras
    const combinedCheckpoints = [...checkpoints,
      ...updatingCheckpoints];
    const uniqueObjects = {};
    const result = [];

    combinedCheckpoints.forEach((obj : CheckpointsState) => {
      if (obj.id) {
        if (!uniqueObjects[obj.id]) {
          uniqueObjects[obj.id] = obj;
          result.push(obj);
        }
      } else {
        result.push(obj);
      }
    });

    if (result.length > 1) {
      const comparingData = [];

      // get the cameras of checkpoints whose row and col are same with current editing checkpoint
      const currentEditingCheckpointObj = result.find((point : CheckpointsState) : boolean => point.setOrder ===
        currentEditingCheckpoint);
      if (!!currentEditingCheckpointObj) {
        result.map((point : CheckpointsState) => {
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
    updatingCheckpoints]);

  // redirecting back to previous page
  const [prevPageStateValues,
    setPrevPageStateValues] = useState(null);
  useEffect(() => {
    if (location.state) {
      const searchText = location.state?.searchText;
      const dateRange = location.state?.dateRange;
      const limit = location.state?.limit;
      const currentPage = location.state?.currentPage;

      setPrevPageStateValues({
        searchText,
        dateRange,
        limit,
        currentPage
      });
    }
  }, [location.state]);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="test-page">
        <Row className="d-flex justify-content-between">
          <PageHeaderTitle
            title="Manage Patrol Route"
            redirect={ {
              label : "Patrol List",
              action : () : void => {
                history.push({
                  pathname : PATROL_LIST_PATH,
                  state : { prevPageStateValues }
                });
              }
            } }
            ActionComponents={
              <div className="d-flex gap-2">
                { !isEditing ? (
                  <>
                    <Button
                      color="blue"
                      className="d-flex align-items-center gap-1 rounded-3"
                      onClick={ () : void => setIsEditing(true) }>
                      <RxPencil2 size={ 15 } /> Edit
                    </Button>
                    <Button
                      color="danger"
                      className="d-flex align-items-center gap-1 rounded-3"
                      onClick={ handlePatrolRouteDeleteConfirm }>
                      <RxTrash size={ 15 } /> Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="blue"
                      className="d-flex align-items-center gap-1 rounded-3"
                      onClick={ handleUpdate }>
                      <AiOutlineCheck size={ 15 } /> Update
                    </Button>
                    <Button
                      color="secondary"
                      className="d-flex align-items-center gap-1 rounded-3"
                      onClick={ () : void => {
                        setIsEditing(false);
                        setDuplicatedCameras([]);
                      } }>
                      <AiOutlineClose size={ 15 } /> Cancel
                    </Button>
                  </>
                ) }
              </div>
            }
          />
        </Row>

        { !isEditing ? (
          // --- 📌 Viewing Details #details-markup 📌 --- //
          <div className="container form-container text-white p-4 px-4">

            <div className="d-flex gap-3 align-items-center justify-content-start">
              <span className="mb-0">Reminder to receive notification : </span>
              <div
                className="order text-white d-flex align-items-center"
                style={ {
                  border : 0,
                  width : "80px"
                } }>
                { !!oldPatrolRoute && oldPatrolRoute?.reminderTime / 60 } mins
              </div>
            </div>

            <hr className="my-3" />

            {/* Patrol Name and Site Name */ }
            <Row className="mb-4">
              <div className="col-4">
                <h5 className="text-secondary mb-2">Patrol Name</h5>
                <span>{ (!!oldPatrolRoute && oldPatrolRoute?.name) || "—" }</span>
              </div>
              <div className="col-4">
                <h5 className="text-secondary mb-2">Site Name</h5>
                <span>{ (!!oldPatrolRoute && oldPatrolRoute.site.name) || "—" }</span>
              </div>
            </Row>

            {/* Start allow time and Patrol view mode */ }
            <Row className="mb-4">
              <div className="col-4">
                <h5 className="text-secondary mb-2">Start time limit</h5>
                <span>{ StartAllowTimeForPatrol.find((option : { id : number, name : string }) => Number(option.id) === startAllowTimeInSeconds)?.name || "—" }</span>
              </div>
              <div className="col-4">
                <h5 className="text-secondary mb-2">Patrol view mode</h5>
                <span>{ PatrolViewModes.find((option : { id : string, name : string }) => option.id === patrolViewMode)?.name || "—" }</span>
              </div>
            </Row>

            {/* Patrol Camera Details */ }
            <Row>
              <h5 className="text-secondary mb-2">Patrol camera details</h5>

              { !!oldPatrolRoute &&
                oldPatrolRoute.routeCheckpoints.map((checkpoint : CheckpointsState, index : number) => {
                  return (
                    <Row
                      className="mb-1"
                      key={ index }>
                      <Col md="2">
                        <FormGroup>
                          { index === 0 && <Label className="text-white">Checkpoint</Label> }
                          <div
                            className="order text-white d-flex align-items-center"
                            style={ { border : 0 } }>
                            { checkpoint.setOrder }
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          { index === 0 && <Label className="text-white">Layout</Label> }
                          <div
                            className="order text-white d-flex align-items-center"
                            style={ { border : 0 } }>
                            { checkpoint.layoutRow } x { checkpoint.layoutCol }
                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          { index === 0 && <Label className="text-white">Cameras</Label> }
                          <div className="d-flex gap-2 align-items-stretch">
                            <div
                              className="input-cameras d-flex flex-column"
                              style={ {
                                border : 0,
                                minHeight : "34px"
                              } }>
                              <div className="d-flex align-items-center justify-content-start">
                                { !!checkpoint.cameras && checkpoint.cameras.length > 0 ? (
                                  <CamerasGrid
                                    order={ checkpoint.setOrder }
                                    row={ checkpoint.layoutRow }
                                    col={ checkpoint.layoutCol }
                                    items={ !!checkpoint.cameras ? checkpoint.cameras : [] }
                                  />
                                ) : (
                                  "—"
                                ) }
                              </div>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  );
                }) }
            </Row>

            {/* Assignees */ }
            <Row>
              <h5 className="text-secondary mb-2">
                Assignees{ " " }
                <Badge
                  text={ !!oldPatrolRoute ? oldPatrolRoute.assignedUsers.length.toString() : "0" }
                  variant="secondary"
                />
              </h5>
              <div className="d-flex gap-2">
                { !!oldPatrolRoute && oldPatrolRoute.assignedUsers.length > 0
                  ? oldPatrolRoute.assignedUsers.map((user : MiniUserResponse, index : number) => (
                    <Badge
                      key={ index }
                      text={ user.name }
                      variant="secondary" />
                  ))
                  : "—" }
              </div>
            </Row>

            <hr className="my-3" />

            {/* Schedule */ }
            <Row className="mb-2">
              <div className="d-flex justify-content-between">
                <h5 className="text-secondary mb-2">
                  Schedules{ " " }
                  <Badge
                    text={ !!oldPatrolRoute ? oldPatrolRoute.routeSchedules.length.toString() : "0" }
                    variant="secondary"
                  />
                </h5>
              </div>
            </Row>
            { !!oldPatrolRoute && Array.isArray(oldPatrolRoute.routeSchedules) &&
              oldPatrolRoute.routeSchedules.map((schedule : RouteScheduleResponse, scheduleNo : number) => (
                <div
                  key={ scheduleNo }
                  className="schedule-container p-4 mb-2 border border-gray">
                  {/* Start Date */ }
                  <Row className="align-items-center mb-3">
                    <Col className="label">
                      <Label for="input-1">Start Date</Label>
                    </Col>
                    <Col className="input">
                      <div
                        className="order text-white d-flex align-items-center"
                        style={ { border : 0 } }>
                        { moment(schedule.startOccurrenceDate).tz(TIME_ZONE)
                          .format("DD/MM/YYYY") }
                      </div>
                    </Col>
                    <Col></Col>
                  </Row>

                  {/* End Date */ }
                  <Row className="align-items-center mb-3">
                    <Col className="label">
                      <Label for="input-2">End Recurrence</Label>
                    </Col>
                    <Col className="input">
                      { !schedule.endOccurrenceDate || moment(schedule.endOccurrenceDate).valueOf() < moment(schedule.startOccurrenceDate).valueOf() ? (
                        <div
                          className="order text-white d-flex align-items-center"
                          style={ { border : 0 } }>
                          Recur Forever
                        </div>
                      ) : (
                        <div
                          className="order text-white d-flex align-items-center"
                          style={ { border : 0 } }>
                          { moment(schedule.endOccurrenceDate).tz(TIME_ZONE)
                            .format("DD/MM/YYYY") }
                        </div>
                      ) }
                    </Col>
                  </Row>

                  {/* Time */ }
                  <Row className={`align-items-${schedule.executingTime.length > 1 ? "start" : "center"}`}>
                    <Col className="label label-time mt-0">
                      <Label for="input-3 -mt-2">Time</Label>
                    </Col>
                    <Col>
                      { schedule.executingTime.map((time : ExecuteTime, timeNo : number) => (
                        <div key={timeNo} className="d-flex align-items-start">
                          {!time?.repeatHours || time?.repeatHours === null ?
                            <Col className="input">
                              <div
                                className="times-wrapper"
                                key={ timeNo }>
                                <div className="w-100 mb-2">
                                  <div
                                    className="order text-white d-flex align-items-center"
                                    style={{
                                      border : 0,
                                      width : "230px"
                                    }}>
                                    { convertSecondsToHumanReadableFormat(time?.startTime.toString()) }
                                    { " to " }
                                    { convertSecondsToHumanReadableFormat(time?.endTime.toString()) }
                                  </div>
                                </div>
                              </div>
                            </Col> :
                            <Col>
                              {!!time.repeatHours && time.repeatHours !== null && <div className="checkbox d-flex align-items-center gap-2 mt-2">
                            Repeat every {time.repeatHours} hour{time.repeatHours > 1 ? "s" : ""}
                              </div>}
                            </Col>}
                        </div>
                      )) }
                    </Col>
                  </Row>

                  {/* Executing Days */ }
                  <Row className={`align-items-center ${!!schedule.executingTime[0].repeatHours ? "mt-4" : "mt-2"}`}>
                    <div className="d-flex align-items-center">
                      <Col className="label">
                        <Label for="input-1">Executing Days</Label>
                      </Col>
                      <Col>
                        {!!schedule.executingDays && schedule.executingDays.length === 7 ? <div>Daily</div> : <div className="d-flex gap-3">
                          {schedule.executingDays.length > 0
                            ? _.sortBy(schedule.executingDays).map((day : number, index : number) => (
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
              )) }
          </div>
        ) : (
          // --- 📌 Updating #updating-markup 📌 --- //
          <div className="container form-container p-4">
            <div className="d-flex gap-3 align-items-center justify-content-start">
              <p className="mb-0 text-white">Set Reminder to receive notification</p>
              <SelectCustom
                styles={{
                  backgroundColor : "#343439",
                  border : "1px solid #808080",
                  width : "100%"
                }}
                popupTheme="dark"
                data={ REMINDER_TIME_PATROL }
                selectedValue={ selectedReminderTimeInMinutes.toString() || "all" }
                displayedValue={ REMINDER_TIME_PATROL.find((time : { id : number, name : string }) => time.id === selectedReminderTimeInMinutes)?.name || "Select" }
                onChange={ handleReminderTimeChange } />
            </div>

            <hr className="my-3" />

            <Row
              className="mb-4"
              xs="2">
              <FormGroup>
                <Label className="text-white">Patrol Name</Label>
                <Input
                  value={ patrolName }
                  onChange={ handlePatrolNameChange }
                  bsSize="lg"
                  type="text"
                  className="bg-gray-999 text-white"
                  placeholder="Morning patrol #1234"></Input>
              </FormGroup>

              <FormGroup>
                <Label className="text-white">Site</Label>
                <SelectCustom
                  styles={{
                    backgroundColor : "#343439",
                    border : "1px solid #808080",
                    width : "100%"
                  }}
                  popupTheme="dark"
                  data={ sites }
                  selectedValue={ selectedSite || "all" }
                  displayedValue={ sites?.find((site : SiteResponse) => parseInt(site.id) === parseInt(selectedSite))?.name || "Select site" }
                  renderOption={(item : SiteResponse) : JSX.Element => (
                    <div className="d-flex justify-content-between align-items-center gap-4">
                      <span>{item.name}</span>
                      <span className="text-secondary">({item.noCameras} cameras)</span>
                    </div>
                  )}
                  onChange={ handleSiteChange } />
              </FormGroup>
            </Row>
            {/* --- End Patrol and Site --- */ }

            {/* --- Start Start allow time and Patrol view mode --- */ }
            <Row
              className="mb-4"
              xs="2">
              <FormGroup>
                <Label className="text-white">Start allow time:</Label>
                <SelectCustom
                  styles={{
                    backgroundColor : "#343439",
                    border : "1px solid #808080",
                    width : "100%"
                  }}
                  popupTheme="dark"
                  data={ StartAllowTimeForPatrol }
                  selectedValue={ startAllowTimeInSeconds.toString() || "" }
                  displayedValue={ StartAllowTimeForPatrol.find((time : { id : number, name : string }) => time.id === startAllowTimeInSeconds)?.name || "Select" }
                  onChange={ handleStartAllowTimeChange } />
              </FormGroup>

              <FormGroup>
                <Label className="text-white">Patrol View</Label>
                <SelectCustom
                  styles={{
                    backgroundColor : "#343439",
                    border : "1px solid #808080",
                    width : "100%"
                  }}
                  popupTheme="dark"
                  data={ PatrolViewModes }
                  selectedValue={ patrolViewMode }
                  displayedValue={ PatrolViewModes.find((mode : { id : string, name : string }) => mode.id === patrolViewMode)?.name || "Select" }
                  onChange={ handlePatrolViewModeChange } />
              </FormGroup>
            </Row>

            {/* --- Patrol Check Points --- */ }
            <div className="d-flex align-items-center gap-3">
              <Label className="text-white">Patrol Checkpoints</Label>
              { duplicatedCameras.length > 0 ? <DuplicatedCameras data={ duplicatedCameras } /> : "" }
            </div>
            {/* START - Checkpoint rows */ }
            <Row>
              <Col xs="auto"></Col>
              <Col md="2">
                <Label
                  className="text-white mb-1"
                  style={ {
                    marginLeft : "14px",
                    marginBottom : 0
                  } }>
                  Order
                </Label>
              </Col>
              <Col md="2">
                <Label
                  className="text-white mb-1"
                  style={ {
                    marginLeft : "14px",
                    marginBottom : 0
                  } }>
                  Layout
                </Label>
              </Col>
              <Col>
                <Label
                  className="text-white mb-1"
                  style={ {
                    marginLeft : "14px",
                    marginBottom : 0
                  } }>
                  Cameras
                </Label>
              </Col>
            </Row>

            <div className="draggable-container">
              { !!checkpoints &&
                Array.isArray(checkpoints) &&
                checkpoints.map((checkpoint : CheckpointsState, index : number) : JSX.Element => {
                  return (
                    <Row
                      key={ index }
                      className={
                        dragOverItemIndex === index ? "draggable-item next-position" : "draggable-item"
                      }
                      draggable={ checkpoints.length > 1 }
                      onDragStart={ () : void => handleDragStart(index) }
                      onDragOver={ handleDragOver }
                      onDrop={ handleDrop }
                      onDragEnter={ () : void => handleDragEnter(index) }
                      onDragEnd={ handleDragEnd }>
                      <Col
                        xs="auto"
                        className="d-flex align-items-start">
                        <RxDragHandleDots2
                          color="white"
                          className="btn-drag"
                          title="Sort by dragging and dropping"
                        />
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <div
                            style={ { minHeight : "42px" } }
                            className="order text-white d-flex align-items-center">{ checkpoint.setOrder }</div>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Input
                            style={ { minHeight : "42px" } }
                            bsSize="lg"
                            type="select"
                            className="bg-gray-999 text-white"
                            onChange={ (e : React.ChangeEvent<HTMLInputElement>) : void => handleLayoutChange(e, checkpoint.setOrder) }
                            value={`${ checkpoint.layoutRow }x${ checkpoint.layoutCol }`}>
                            { !!layouts &&
                              Array.isArray(layouts) &&
                              layouts.map((layout : { value : string, label : string }) => (
                                <option
                                  key={ layout.value }
                                  value={ layout.value }>
                                  { layout.label }
                                </option>
                              )) }
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="d-flex gap-2 align-items-stretch">
                            <div className="input-cameras d-flex justify-content-between align-items-start gap-2 py-1">
                              <div className="d-flex align-items-center justify-contents-start gap-2">
                                { !!checkpoint.cameras && (
                                  <CamerasGrid
                                    checkpointId={ checkpoint?.id }
                                    order={ checkpoint.setOrder }
                                    row={ checkpoint.layoutRow }
                                    col={ checkpoint.layoutCol }
                                    items={ checkpoint.cameras }
                                    onCameraRemove={ handleCameraRemove }
                                  />
                                ) }
                              </div>
                              <Button
                                title="Add cameras"
                                onClick={ () : void => {
                                  handleAddCamerasTableToggle(checkpoint.setOrder, "");
                                } }
                                className="btn-open-cameras-table secondary text-white mt-1 me-1">
                                <FiPlus size={ 15 } />
                              </Button>
                            </div>
                            <div className="d-flex">
                              <Button
                                disabled={ checkpoints.length === 1 }
                                title="Remove checkpoint"
                                onClick={ (e : MouseEvent<HTMLButtonElement>) : void => {
                                  handleCheckpointRowRemoveConfirm(e, checkpoint?.id, checkpoint.setOrder);
                                } }
                                className="btn-remove-checkpoint rounded-3 text-white border border-1 border-gray px-2 mt-1">
                                <TbTrash size={ 15 } />
                              </Button>
                            </div>
                          </div>
                          { checkLayoutAndCheckedCamerasMatch(
                            checkpoint.layoutRow * checkpoint.layoutCol,
                            checkpoint.cameras.length,
                            checkpoint.setOrder
                          ) }
                        </FormGroup>
                      </Col>
                    </Row>
                  );
                }) }
            </div>
            {/* END - Checkpoint rows */ }
            <div className="d-inline-block text-white btn-add-checkpoints pt-1">
              <div
                className="d-flex gap-2 align-items-center"
                onClick={ handleCheckpointRowAdd }>
                <CgAdd
                  size={ 18 }
                  color="white" />
                Add check point
              </div>
            </div>
            {/* --- End Patrol Check Points --- */ }

            {/* --- Assign Users  --- */ }
            <div className="my-3">
              <FormGroup className="form-group">
                <Label className="text-white">Assign to:</Label>
                <CheckboxList<MiniUserResponse>
                  selectedItemsShownOnTop={ true }
                  isLoading={ false }
                  name="name"
                  columns={ ["name",
                    "email"] }
                  items={ users }
                  checkedItems={ checkedUsers }
                  search={ {
                    placeholder : "Search by name, email",
                    searchColumns : [
                      "name",
                      "email"
                    ]
                  } }
                  onItemChange={ handleUserSelect }
                  onItemRemove={ handleUserUnselect }
                />
              </FormGroup>
            </div>
            {/* --- End Assign Users --- */ }

            <hr className="my-3" />

            {/* Schedule */ }
            <Row className="mb-2">
              <div className="d-flex justify-content-between">
                <h5 className="text-secondary mb-2">Schedules</h5>
              </div>
            </Row>

            {/* Old Schedule Lists */ }
            { !!schedules && Array.isArray(schedules) && schedules.map((schedule : SchedulesState, scheduleNo : number) => {
              return (
                <div
                  key={ scheduleNo }
                  className="schedule-container p-4 mb-2 border border-gray text-white">
                  {/* Start Date */ }
                  <Row className="align-items-center mb-3">
                    <Col className="label">
                      <Label for="input-1">Start Date</Label>
                    </Col>
                    <Col className="input">
                      <InputDate
                        minimumDate={ getTodayInCalendarAcceptedFormat() }
                        date={ schedule.startOccurrenceDate }
                        onDateSelect={ (selectedDate : CalendarDate) : void =>
                          handleDateSelect(schedule.id, undefined, selectedDate, "startOccurrenceDate")
                        }
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
                        disabled={ schedule.isRecurForever }
                        minimumDate={ schedule.startOccurrenceDate }
                        date={ schedule.endOccurrenceDate }
                        onDateSelect={ (selectedDate : CalendarDate) : void =>
                          handleDateSelect(schedule.id, undefined, selectedDate, "endOccurrenceDate")
                        }
                      />
                    </Col>
                    <Col>
                      <div
                        className="checkbox d-flex align-items-center gap-2"
                        onClick={ () : void => handleRecurForeverClick(schedule?.id, undefined) }>
                        <CheckBox isChecked={ schedule.isRecurForever } /> Recur forever
                      </div>
                    </Col>
                  </Row>

                  {/* Time */ }
                  <Row className="align-items-start mb-3">
                    <Col className="label label-time">
                      <Label for="input-3">Time</Label>
                    </Col>
                    <Col className="input">
                      {
                      // (schedule.executingTime.length === 1 && !!schedule.executingTime[0].repeatHours) &&
                        schedule.executingTime.map((time : ExecuteTime, timeNo : number) => (
                          <div className="d-flex" key={ timeNo }>
                            <Col className="input">
                              <div
                                className="times-wrapper" style={{ width : "226px" }}>
                                <div className="w-100 mb-2">
                                  {!!schedule.executingTime[timeNo].repeatHours ?
                                    <div className="time-range-disabled-placeholder">—</div> :
                                    <InputTimeRangePicker
                                      timeRange={ time }
                                      disabled={ !!schedule.executingTime[timeNo].repeatHours }
                                      onTimeRangePick={ (selectedTimeRange : ExecuteTime) : void => handleTimeRangeSelect(schedule.id, undefined, timeNo, selectedTimeRange) } />
                                  }
                                </div>
                                { timeNo > 0 && (
                                  <div className="btn-remove-time-wrapper">
                                    <Button
                                      title="Remove time"
                                      onClick={ () : void => {
                                        handleTimeRangeRemove(schedule?.id, undefined, timeNo);
                                      } }
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
                            <div className="d-flex align-items-center gap-2" onClick={ () : void => handleRepeatEveryXHourCheck(schedule.id, undefined, 0, schedule.executingTime[0].repeatHours) }>
                              <CheckBox isChecked={ typeof schedule.executingTime[0].repeatHours === "number" } /> Repeat every
                            </div>
                            <SelectCustom
                              styles={{
                                backgroundColor : "#343439",
                                border : "1px solid #808080",
                                width : "100%",
                                cursor : schedule.executingTime[0]?.repeatHours === null ? "not-allowed" : "pointer"
                              }}
                              contentMinWidth="74px"
                              popupTheme="dark"
                              isDisabled={schedule.executingTime[0]?.repeatHours === null}
                              data={ RepeatEveryXHoursForSchedule }
                              selectedValue={ schedule.executingTime[0].repeatHours !== null ? schedule.executingTime[0].repeatHours?.toString() : "1" }
                              displayedValue={ RepeatEveryXHoursForSchedule?.find((hour : { id : number, name : string }) => hour.id === schedule.executingTime[0]?.repeatHours)?.name || RepeatEveryXHoursForSchedule[0].name}
                              onChange={ (hour : number) : void => handleRepeatEveryXHourChange(schedule.id, undefined, 0, hour)}
                            />
                          </div>
                        </Col>}
                    <div className="d-inline-block text-white btn-add-times mt-2">
                      <div
                        className={`d-flex gap-2 align-items-center ${ !!schedule.executingTime[0].repeatHours ? "disabled" : "" }`}
                        onClick={ () : void => {
                          if (!schedule.executingTime[0].repeatHours) handleTimeRangeAdd(schedule?.id, undefined);
                        } }>
                        <CgAdd
                          size={ 18 }
                          color="white" />
                          Add another time
                      </div>
                    </div>
                  </Row>

                  {/* Executing Days */ }
                  <Row className="align-items-start">
                    <Col className="label">
                      <Label for="input-1">Executing Days</Label>
                    </Col>
                    <Col className="input">
                      <div className="d-flex justify-content-start gap-4">
                        <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => handleExecutingDayCheck(schedule?.id, undefined, 8)}>
                          <RadioButton isChecked={ schedule.executingDays.length === 7 } /> Daily
                        </div>
                        <div className="d-flex justify-content-start align-items-center gap-4">
                          <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => handleExecutingDayCheck(schedule?.id, undefined, -1)}>
                            <RadioButton isChecked={ schedule.executingDays.length !== 7 } /> Custom
                          </div>
                          {schedule.executingDays.length !== 7 && <div className="d-flex gap-3">
                            { DATE_OF_WEEK.map((day : string, index : number) => (
                              <div
                                className="checkbox d-flex gap-2 align-items-center"
                                key={ index }
                                onClick={ () : void => handleExecutingDayCheck(schedule?.id, undefined, index) }>
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
                    disabled={ schedules.length + creatingSchedules.length === 1 }
                    title="Remove schedule"
                    onClick={ () : void => handleScheduleRemove(schedule?.id, undefined) }
                    className="btn-remove-checkpoint rounded-3 text-white border border-1 border-gray p-1">
                    <TbTrash size={ 15 } />
                  </Button>
                </div>
              );
            }) }

            {/* New Schedule Lists */ }
            { !!creatingSchedules && creatingSchedules.length > 0 &&
              creatingSchedules.map((schedule : SchedulesState, scheduleNo : number) => (
                <div
                  key={ scheduleNo }
                  className="schedule-container p-4 mb-2 border border-gray text-white">
                  {/* Start Date */ }
                  <Row className="align-items-center mb-3">
                    <Col className="label">
                      <Label for="input-1">Start Date</Label>
                    </Col>
                    <Col className="input">
                      <InputDate
                        minimumDate={ getTodayInCalendarAcceptedFormat() }
                        date={ schedule.startOccurrenceDate }
                        onDateSelect={ (selectedDate : CalendarDate) : void =>
                          handleDateSelect(undefined, scheduleNo, selectedDate, "startOccurrenceDate")
                        }
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
                        disabled={ schedule.isRecurForever }
                        minimumDate={ schedule.startOccurrenceDate }
                        date={ schedule.endOccurrenceDate }
                        onDateSelect={ (selectedDate : CalendarDate) : void =>
                          handleDateSelect(undefined, scheduleNo, selectedDate, "endOccurrenceDate")
                        }
                      />
                    </Col>
                    <Col>
                      <div
                        className="checkbox d-flex align-items-center gap-2"
                        onClick={ () : void => handleRecurForeverClick(undefined, scheduleNo) }>
                        <CheckBox isChecked={ schedule.isRecurForever } /> Recur forever
                      </div>
                    </Col>
                  </Row>

                  {/* Time */ }
                  <Row className="align-items-start">
                    <Col className="label label-time">
                      <Label for="input-3">Time</Label>
                    </Col>
                    <Col className="input">
                      { schedule.executingTime.map((time : ExecuteTime, timeNo : number) => {
                        return (
                          <div className="d-flex" key={timeNo}>
                            <Col className="input">
                              <div className="times-wrapper" style={{ width : "226px" }}>
                                <div className="w-100 mb-2">
                                  {schedule.executingTime[timeNo].repeatHours !== null ?
                                    <div className="time-range-disabled-placeholder">—</div> :
                                    <InputTimeRangePicker
                                      timeRange={ time }
                                      disabled={schedule.executingTime[timeNo].repeatHours !== null }
                                      onTimeRangePick={ (selectedTimeRange : ExecuteTime) : void => handleTimeRangeSelect(undefined, scheduleNo, timeNo, selectedTimeRange) } />
                                  }
                                </div>
                                { timeNo > 0 && (
                                  <div className="btn-remove-time-wrapper">
                                    <Button
                                      title="Remove time"
                                      onClick={ () : void => {
                                        handleTimeRangeRemove(undefined, scheduleNo, timeNo);
                                      } }
                                      disabled={ schedule.executingTime.length === 1 }
                                      className="btn-remove-time rounded-3 text-white border border-1 border-gray">
                                      <AiOutlineMinus size={ 10 } />
                                    </Button>
                                  </div>
                                ) }
                              </div>
                            </Col>
                          </div>
                        );
                      })}
                    </Col>
                    {schedule.executingTime.length === 1 &&
                      <Col>
                        <div className="checkbox d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center gap-2" onClick={ () : void => handleRepeatEveryXHourCheck(undefined, scheduleNo, 0, 1) }>
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
                            onChange={ (hour : number) : void => handleRepeatEveryXHourChange(undefined, scheduleNo, 0, hour) } />
                        </div>
                      </Col>}
                    <div className="d-inline-block text-white btn-add-times mt-2">
                      <div
                        className="d-flex gap-2 align-items-center"
                        onClick={ () : void => handleTimeRangeAdd(undefined, scheduleNo) }>
                        <CgAdd
                          size={ 18 }
                          color="white" />
                        Add another time
                      </div>
                    </div>
                  </Row>

                  {/* Executing Days */ }
                  <Row className="align-items-center mt-4">
                    <Col className="label">
                      <Label for="input-1">Executing Days</Label>
                    </Col>
                    <Col className="input">
                      <div className="d-flex justify-content-start gap-4">
                        <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => handleExecutingDayCheck(undefined, scheduleNo, 8)}>
                          <RadioButton isChecked={ schedule.executingDays.length === 7 } /> Daily
                        </div>
                        <div className="d-flex justify-content-start align-items-center gap-4">
                          <div className="d-flex justify-content-start align-items-center gap-2 cursor-pointer" onClick={() : void => handleExecutingDayCheck(undefined, scheduleNo, -1)}>
                            <RadioButton isChecked={ schedule.executingDays.length !== 7 } /> Custom
                          </div>
                          {schedule.executingDays.length !== 7 && <div className="d-flex gap-3">
                            { DATE_OF_WEEK.map((day : string, index : number) => (
                              <div
                                className="checkbox d-flex gap-2 align-items-center"
                                key={ index }
                                onClick={ () : void => handleExecutingDayCheck(undefined, scheduleNo, index)}>
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
                    disabled={ schedules.length + creatingSchedules.length === 1 }
                    title="Remove schedule"
                    onClick={ () : void => handleScheduleRemove(undefined, scheduleNo) }
                    className="btn-remove-checkpoint rounded-3 text-white border border-1 border-gray p-1">
                    <TbTrash size={ 15 } />
                  </Button>
                </div>
              )) }

            {/* Add another schedule */ }
            <div className="d-inline-block text-white btn-add-checkpoints mt-0">
              <div
                className="btn-add-schedule d-flex gap-2 align-items-center"
                onClick={ handleScheduleAdd }>
                <CgAdd
                  size={ 18 }
                  color="white" />
                Add another schedule
              </div>
            </div>
          </div>
        ) }

        <AddCamerasTableModal
          isOpen={ isAddCamerasTableOpen }
          selectedSite={ sites.find((site : SiteResponse) => parseInt(site.id) === parseInt(selectedSite)) }
          isMaxCheckableCountReached={ checkedCameras.length >= maxCheckableCameraCount }
          checkedCameras={ checkedCameras }
          footerMessage={ duplicatedCameras.length > 0 ? <DuplicatedCameras data={ duplicatedCameras } /> : "" }
          onRowCheck={ handleCameraTableRowCheck }
          onModalClose={ handleAddCamerasTableToggle }
          onCamerasAdd={ handleCamerasToCheckpointAdd }
        />

        <ConfirmationModal
          isOpen={ confirmModal.isOpen }
          message={ confirmModal.message }
          header={ confirmModal.header }
          close={ handlePatrolRouteDeleteCancel }
          confirmBtnText={ confirmModal.confirmBtnText }
          confirm={ confirmModal.confirm }
        />

        <NotifyMessageModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          message={ notifyModal.message }
          header={ notifyModal.header }
          close={ notifyModal.close }
        />
        <LoadingSpinner
          full
          active={ loading } />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(VirtualPatrolRouteManagePage);

interface DuplicatedCamerasProps {
  data : string[]
}
const DuplicatedCameras = ({ data } : DuplicatedCamerasProps ) : JSX.Element => {
  const [isCheckpointWarningOpen,
    setIsCheckpointWarningOpen] = useState(false);
  const checkpointWarningToggle = () : void => setIsCheckpointWarningOpen(!isCheckpointWarningOpen);

  return (
    <div
      className="d-flex align-items-center gap-1 text-danger"
      style={ {
        cursor : "pointer",
        marginBottom : "0.5rem"
      } }>
      <TiWarning />
      <span
        style={ {
          textDecoration : "underline",
          textDecorationStyle : "dotted"
        } }
        id="checkpoint-warning">
        Duplicated cameras present!
      </span>
      <Tooltip
        placement="right"
        isOpen={ isCheckpointWarningOpen }
        target="checkpoint-warning"
        toggle={ checkpointWarningToggle }
        className="custom-tooltip">
        <div className="text-left">
          <List>
            Cannot add one or more of cameras into same layout of checkpoints.
            <ul>
              { data.map((d : string) => <li key={d}>{ d }</li>) }
            </ul>
          </List>
        </div>
      </Tooltip>
    </div>
  );
};