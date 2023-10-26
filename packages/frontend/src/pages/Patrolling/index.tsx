import _ from "lodash";
import React, {
  CSSProperties,
  ChangeEvent,
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import moment from "moment-timezone";
import {
  useLocation,
  useHistory
} from "react-router-dom";
import {
  Button,
  Input
} from "reactstrap";
import { Progress } from "reactstrap";
import {
  BsChevronLeft,
  BsFillCircleFill
} from "react-icons/bs";
import PerfectScrollbar from "react-perfect-scrollbar";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import LoadingSpinner from "components/LoadingSpinner";
import PatrolCameraImage from "./PatrolCameraImage";
import RefreshTimer from "./RefreshTimer";
import NotifyMessageModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";
import CurrentClock from "components/CurrentClock";
import RaiseAlertModal from "./Components/RaiseAlertModal";

import { TIME_ZONE } from "utils/time-format";
import { Checkpoints } from "model-type/component-types";
import { fetchPatrolRouteById } from "services/route";
import {
  AlertTypeResponse,
  CameraResponse,
  MiniUserResponse,
  RouteCheckpointResponse,
  RouteDetailResponse,
  RouteTaskResponse
} from "@vps/utils/lib/dto";
import {
  ACKNOWLEDGE_IN_MILLISECOND,
  AlertTypeButtons,
  REFRESH_TIME_IN_SECOND,
  UPDATE_ONGOING_INTERVAL
} from "data/common-data";
import { TaskStatus } from "@vps/utils/lib/data";
import {
  ConfirmationModalProps,
  NotificationModalProps
} from "model-type/component-style";
import {
  apiAcknowledge,
  endTask,
  fetchTaskById,
  listTodayDoableTask,
  pauseOnGoingTask,
  raiseAlert,
  resumeTask,
  startTask,
  submitComment,
  updateOngoingTask
} from "services/tasks";
import {
  convertSecondsToHumanReadableFormat,
  getCurrentTimeInSgInEpoch,
  getReminingTimeInSeconds
} from "utils/date-time";
import {
  TASK_LIST_PATH,
  VIRTUAL_PATROL_PATH
} from "data/route-path";
import {
  UserAccountModel,
  getInfo
} from "model/user-account";
import PatrolCameraLiveVideo from "./PatrolCameraLiveVideo";
import {
  getCameraImageSnapshot,
  getCameraVideoStreamURL
} from "apis/nx-api";
import { fetchAlertTypes } from "services/alert-types";
import { getCanStartNowTasks } from "./utils";
import AvatarsOverlay from "components/AvatarsOverlay";

const enum PatrolMode {
  "LiveImage" = "LiveImage",
  "LiveVideoFeed" = "LiveVideoFeed"
}

function VirtualPatrolPage() : JSX.Element {
  const history = useHistory();
  const location = useLocation();
  let taskId, routeId;
  if (location.state) {
    taskId = location.state.taskId;
    routeId = location.state.routeId;
  }

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [isApiProcessing,
    setIsApiProcessing] = useState(false);
  const [isTodayDoableModalLoading,
    setTodayDoableModalLoading] = useState(false);
  const [todayDoableTasks,
    setTodayDoableTasks] = useState<RouteTaskResponse[]>([]);
  const [patrolRoute,
    setPatrolRoute] = useState<RouteDetailResponse>(null);
  const [taskDetails,
    setTaskDetails] = useState<RouteTaskResponse>(null);
  const [currentCheckpoint,
    setCurrentCheckpoint] = useState<Checkpoints>(null);
  const [currentCheckpointOrder,
    setCurrentCheckpointOrder] = useState<number>(1);
  const [checkpoints,
    setCheckpoints] = useState<Record<number, string>>({});
  // alert types
  const [
    alertTypes,
    setAlertTypes
  ] = useState<AlertTypeResponse[]>([]);
  const [
    alertTypeButtons,
    setAlertTypeButtons
  ] = useState<AlertTypeButtons[]>([]);
  const [isSubmitAlertModalOpen,
    setIsSubmitAlertModalOpen] = useState<boolean>(false);
  const [currentRaisingAlertCamera,
    setCurrentRaisingAlertCamera] = useState<CameraResponse>(null);
  const [currentRaisingAlertType,
    setCurrentRaisingAlertType] = useState<AlertTypeResponse>(null);
  const [currentRaisingAlertEpochTime,
    setCurrentRaisingAlertEpochTime] = useState<number>(0);
  const [alertActionTaken,
    setAlertActionTakens] = useState<string[]>([]);
  const [newActionTaken,
    setNewActionTaken] = useState<string[]>([]);
  const [alertDetected,
    setAlertDetected] = useState<string>("");
  // video feed
  const [syncVideoKey,
    setSyncVideoKey] = useState(0);
  const [isSyncing,
    setIsSyncing] = useState(true);
  const [liveRemainingDurationBeforeEndtime,
    setLiveRemainingDurationBeforeEndtime] = useState<number>(0);
  // refresh settings
  const [intervalId,
    setIntervalId] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [renderCount,
    setRenderCount] = useState(0); // IMPORTANT! for refreshing image CONTENT
  const [isAcknowledgeEnable,
    setIsAcknowledgeEnable] = useState(false);
  const [isRaiseAlertEnabled,
    setIsRaiseAlertEnabled] = useState<boolean>(true);
  const [isGoToNextEnable,
    setIsGoToNextEnable] = useState(false);
  const [currentUser,
    setCurrentUser] = useState<UserAccountModel>(null);
  // fullscreen mode
  const [fullscreenCamera,
    setFullscreenCamera] = useState<CameraResponse>(null);
  // Notify modal (Validations, warning modal)
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
      size : "md",
      header : null,
      message : null,
      isOpen : false,
      confirm : null,
      confirmBtnText : "Add",
      cancelBtnText : "",
      close : null
    });

  // refs
  const inputEndPatrolCommentRef = useRef(null);
  const inputCommentRef = useRef(null);

  // variables
  const reachToLastCheckpoint = patrolRoute?.routeCheckpoints.length === currentCheckpointOrder;

  // ✅ Construct grid
  const gridStyle = {
    display : "grid",
    gridTemplateRows : `repeat(${ currentCheckpoint?.layoutRow }, 1fr)`,
    gridTemplateColumns : `repeat(${ currentCheckpoint?.layoutCol }, 1fr)`,
    gap : "5px",
    padding : "0 70px"
  };
  const imgStyle : CSSProperties = {
    maxWidth : "100%",
    width : "100%",
    objectFit : "cover"
  };
  const currentGridView = transformOrigins.find((obj : TransformOriginsType) => obj.itemsCount ===
    (currentCheckpoint?.layoutRow * currentCheckpoint?.layoutCol));

  const placeholderCount = (currentCheckpoint?.layoutRow * currentCheckpoint?.layoutCol) -
    (currentCheckpoint?.cameras.length);

  const fetchTaskDetails = async (routeId : string, taskId : string) : Promise<void> => {
    const patrolRoute = await fetchPatrolRouteById(routeId);
    if (!!patrolRoute) {
      patrolRoute?.routeCheckpoints.forEach((item : RouteCheckpointResponse) => {
        setCheckpoints((prevData : Record<number, string>) => ({
          ...prevData,
          [item.setOrder] : item.id
        }));
      });

      setPatrolRoute(patrolRoute);
    }

    const taskDetails = await fetchTaskById(taskId);
    setTaskDetails(taskDetails);

    // sort checkpoints by order
    const routeCheckpoints = _.sortBy(patrolRoute?.routeCheckpoints, (obj : RouteCheckpointResponse) => obj.setOrder);
    const transformedCheckpoints : Checkpoints[] = routeCheckpoints.map((point : RouteCheckpointResponse) : Checkpoints => {
      const checkpoint : Checkpoints = {
        id : "",
        order : 0,
        layoutCol : 0,
        layoutRow : 0,
        cameras : []
      };

      checkpoint.id = point.id;
      checkpoint.order = point.setOrder;
      checkpoint.layoutCol = point.layoutCol;
      checkpoint.layoutRow = point.layoutRow;
      checkpoint.cameras = point.cameras;

      return checkpoint;
    });

    if (!!taskDetails.lastCheckpointId) {
      const lastCheckpoint = transformedCheckpoints.find((pt : Checkpoints) => pt.id === taskDetails.lastCheckpointId);
      if (!!lastCheckpoint) {
        const lastIndex = transformedCheckpoints.findIndex((pt : Checkpoints) => pt.id === lastCheckpoint.id);
        if (lastIndex !== transformedCheckpoints.length - 1) {
          setCurrentCheckpoint(transformedCheckpoints[lastIndex + 1]);
          setCurrentCheckpointOrder(transformedCheckpoints[lastIndex + 1].order);
        } else {
          setCurrentCheckpoint(lastCheckpoint);
          setCurrentCheckpointOrder(lastCheckpoint.order);
        }
      }
    } else {
      setCurrentCheckpoint(transformedCheckpoints[0]);
      setCurrentCheckpointOrder(1);
    }

    if (!!taskDetails) {
      // calculate & set `duration` for live url from current time to endTime of task
      setLiveRemainingDurationBeforeEndtime(getReminingTimeInSeconds(taskDetails.endTime));
    }
  };

  // --- ⬇︎ Get current user ⬇︎ --- //
  const getCurrentLoggedInUser = () : void => {
    const currentUser = getInfo();
    setCurrentUser(currentUser);
  };

  // --- ⬇︎ Handlers ⬇︎ --- //
  const handleAcknowledgeClick = async () : Promise<void> => {
    setIsApiProcessing(true);

    const checkpointId = currentCheckpoint.id;
    const cameras = currentCheckpoint.cameras.map((camera : CameraResponse) => {
      return {
        id : camera.id,
        snapshotTimeInEpoch : getCurrentTimeInSgInEpoch()
      };
    });
    const response = await apiAcknowledge(taskId, checkpointId, cameras);

    setIsApiProcessing(false);

    if (response.errors === null) {
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Acknowledged",
        message : <div className="text-center text-black">All cameras in this set are successfully acknowledged.</div>,
        isOpen : true
      });

      setIsRaiseAlertEnabled(false);
      setIsAcknowledgeEnable(false);
      setTaskDetails((prevTask : RouteTaskResponse) => ({
        ...prevTask,
        lastCheckpointId : checkpointId
      }));
    } else {
      setNotifyModal({
        iconType : "notify",
        isOpen : true,
        header : "Error",
        message : <div className="text-center text-black">Something went wrong while acknowledging.</div>,
        close : handleNotifyModalClose
      });
    }
  };

  const handleNextCheckpointProceed = () : void => {
    if (currentCheckpointOrder < patrolRoute.routeCheckpoints.length) {
      setCurrentCheckpointOrder((prevOrder : number) => prevOrder + 1);

      const nextPoint = patrolRoute.routeCheckpoints.find((pt : RouteCheckpointResponse) => pt.setOrder ===
        currentCheckpointOrder + 1);
      const checkpoint : Checkpoints = {
        id : nextPoint.id,
        order : nextPoint.setOrder,
        layoutCol : nextPoint.layoutCol,
        layoutRow : nextPoint.layoutRow,
        cameras : nextPoint.cameras
      };
      setCurrentCheckpoint(checkpoint);
    }

    const lastCheckpointIdNumber = Object.keys(checkpoints).find((key : string) => checkpoints[key] ===
      taskDetails?.lastCheckpointId);
    const isDifferenceOne = Math.abs(parseInt(lastCheckpointIdNumber) - currentCheckpointOrder) === 1;
    if (isDifferenceOne) {
      setIsAcknowledgeEnable(false);
      setIsRaiseAlertEnabled(true);
      setIsGoToNextEnable(false);
    } else {
      setIsAcknowledgeEnable(false);
      setIsRaiseAlertEnabled(false);
      setIsGoToNextEnable(true);
    }
  };

  const handleReturnToPrevCheckpoint = () : void => {
    setCurrentCheckpointOrder(currentCheckpointOrder - 1);

    const prevPoint = patrolRoute.routeCheckpoints.find((pt : RouteCheckpointResponse) => pt.setOrder ===
      currentCheckpointOrder - 1);
    const checkpoint : Checkpoints = {
      id : prevPoint.id,
      order : prevPoint.setOrder,
      layoutCol : prevPoint.layoutCol,
      layoutRow : prevPoint.layoutRow,
      cameras : prevPoint.cameras
    };
    setCurrentCheckpoint(checkpoint);

    setIsAcknowledgeEnable(false);
    setIsRaiseAlertEnabled(false);
    setIsGoToNextEnable(true);
  };

  const handleEndPatrolConfirm = () : void => {
    setConfirmModal({
      size : "md",
      header : (
        <div className="d-flex align-items-center gap-2">
          <span style={ { color : "black" } }>End patrol with a comment</span>
        </div>
      ),
      message : (
        <div>
          <div>
            <Input
              innerRef={ inputEndPatrolCommentRef }
              type="textarea"
              placeholder="All SOP have been checked and cameras acknowledged , Issues have been raised (if any)"
              style={ {
                resize : "none",
                borderRadius : "7px"
              } }
              rows={ 4 }
            />
          </div>
        </div>
      ),
      isOpen : true,
      confirmBtnText : "Submit",
      confirm : handlePatrolEnd,
      close : handleConfirmModalClose
    });
  };

  const handlePatrolEnd = async () : Promise<void> => {
    if (!!inputEndPatrolCommentRef) {
      const endComment = inputEndPatrolCommentRef.current.value;

      const response = await endTask(taskId, endComment, TaskStatus.Completed);
      if (response.data && !response.errors) history.push(TASK_LIST_PATH);
      else {
        setConfirmModal({
          header : null,
          message : null,
          isOpen : false,
          confirmBtnText : "Submit",
          confirm : null,
          close : null
        });

        setNotifyModal({
          iconType : "notify",
          header : "!Error",
          message : <div className="text-center text-black">Something went wrong with ending patrolling.</div>,
          isOpen : true,
          close : handleNotifyModalClose
        });
      }
    }
  };

  const handleStartPatrolling = async (task : RouteTaskResponse) : Promise<void> => {
    const {
      data,
      errors
    } = await startTask(task.id, "");

    if (!!data && !errors) {
      redirectToVirtualRoute(task);
    } else {
      setNotifyModal({
        iconType : "notify",
        header : "Failed",
        message : <div className="text-center text-black">Something went wrong starting this task.</div>,
        isOpen : true
      });
    }
  };

  const handleResumePatrolling = async (task : RouteTaskResponse) : Promise<void> => {
    const {
      data,
      errors
    } = await resumeTask(task.id);

    if (!!data && !errors) {
      redirectToVirtualRoute(task);
    } else {
      setNotifyModal({
        iconType : "notify",
        header : "Failed",
        message : <div className="text-center text-black">Something went wrong resuming this task.</div>,
        isOpen : true
      });
    }
  };

  const redirectToVirtualRoute = (task : RouteTaskResponse) : void => {
    history.push({
      pathname : VIRTUAL_PATROL_PATH,
      state : {
        taskId : task.id,
        routeId : task.routeId
      }
    });
  };

  const handleTodayDoableTasksRefresh = () : void => {
    loadTodayDoableTasks(currentUser.accountId);
  };

  // video sync
  const handleVideosSync = () : void => {
    setIsSyncing(true);
    setSyncVideoKey((prevKey : number) => prevKey + 1);
    updateLiveVideoTimes(taskDetails);
  };

  /**
   * Update the video's URL using new below 2 params
   * =====
   * On sync / reload, recalculate
   * - startTime of strem (based on current time) and
   * - duration of strem left from that startTime, till endTime of the task
   */
  const updateLiveVideoTimes = (task : RouteTaskResponse) : void => {
    const remainingDuration = getReminingTimeInSeconds(task.endTime);
    setLiveRemainingDurationBeforeEndtime(remainingDuration);
  };

  // alert
  const toggleSubmitAlertModal = () : void => {
    setIsSubmitAlertModalOpen((prevState : boolean) => !prevState);
  };

  const handleAlertClick = (camera : CameraResponse, id : string) : void => {
    setCurrentRaisingAlertCamera(camera);

    const _alertType = alertTypes.find((alertType : AlertTypeResponse) => alertType.id === id);
    if (!!_alertType) {
      setCurrentRaisingAlertType(_alertType);
      setAlertDetected(_alertType.description);
      setAlertActionTakens(_alertType.actionTaken);
    }

    setCurrentRaisingAlertEpochTime(moment().tz(TIME_ZONE)
      .valueOf());

    toggleSubmitAlertModal();
  };

  const handleAlertDetectedChange = (e : ChangeEvent<HTMLInputElement>) : void => {
    setAlertDetected(e.target.value);
  };

  const handleAlertActionTakenAdd = () : void => {
    setNewActionTaken((prevData : string[]) => {
      return [...prevData,
        ""];
    });
  };

  const handleNewActionTakenChange = (e : ChangeEvent<HTMLInputElement>, order : number) : void => {
    setNewActionTaken((prevData : string[]) => {
      const newData = [...prevData];
      newData[order] = e.target.value;
      return newData;
    });
  };

  const handleAlertActionTakenRemove = (actionTaken : string | undefined, order : number | undefined) : void => {
    if (order !== undefined) setNewActionTaken((prevData : string[]) => prevData.filter((
      _ : string,
      i : number
    ) => i !== order));
    else if (actionTaken !== undefined) setAlertActionTakens((prevData : string[]) => {
      const newData = [...prevData];
      return _.without(newData, actionTaken);
    });
  };

  const handleAlertActionTakenReset = () : void => {
    setAlertActionTakens(currentRaisingAlertType.actionTaken);
  };

  const handleRaiseAlertSubmit = async () : Promise<void> => {
    setIsApiProcessing(true);

    const response = await raiseAlert(
      taskId,
      currentRaisingAlertCamera.id,
      currentCheckpoint.id,
      currentRaisingAlertEpochTime,
      {
        type : currentRaisingAlertType.type,
        description : alertDetected,
        actionsTaken : (alertActionTaken.length > 0 || newActionTaken.length > 0)
          ? _.compact([...alertActionTaken,
            ...newActionTaken])
          : []
      }
    );

    setIsApiProcessing(false);

    if (response.errors === null) {
      setConfirmModal({
        header : null,
        message : null,
        isOpen : false,
        confirmBtnText : "",
        confirm : null
      });

      setNotifyModal({
        iconType : "success",
        isOpen : true,
        header : "Recorded",
        message : <div className="text-center text-black">The issue is raised successfully.</div>,
        close : handleNotifyModalClose
      });
    } else {
      let errorMsg = "Something went wrong while raising issue.";
      if (response.errors.InvalidAlertActionsTaken) errorMsg = "Action Taken required.";
      else if (response.errors.InvalidAlertDescription) errorMsg = "Description required.";

      setNotifyModal({
        iconType : "notify",
        isOpen : true,
        header : "Error",
        message : <div className="text-center text-black">{ errorMsg }</div>,
        close : handleNotifyModalClose
      });
    }
  };

  const handleCommentClick = (camera : CameraResponse) : void => {
    const timeInEpoch = moment().tz(TIME_ZONE)
      .valueOf();

    setConfirmModal({
      size : "lg",
      header : "Add your comment",
      message : (
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div
            className="d-flex flex-column gap-3"
            style={ { width : "75%" } }>
            <div className="row">
              <div className="col-sm-3">
                <span>Description</span>
              </div>
              <div className="col">
                <Input
                  innerRef={ inputCommentRef }
                  type="textarea"
                  placeholder="Enter"
                  style={ {
                    resize : "none",
                    borderRadius : "7px"
                  } }
                  rows={ 10 }
                />
              </div>
            </div>
          </div>

          <div
            className="alert-modal-camera-image"
            style={ {
              width : "400px",
              height : "172px",
              border : "1px solid gray",
              borderRadius : "8.5px",
              marginBottom : "3rem"
            } }>
            <img
              src={ getCameraImageSnapshot(camera.id, timeInEpoch) }
              style={ { borderRadius : "8px" } } />

            {/* <div className="alert-modal-camera-name">{ camera.name }</div> */ }
            <div className="mt-2">Camera: { camera.name || "—" }</div>
            <div className="mt-2">Address: { camera.address || "—" }</div>
          </div>
        </div>
      ),
      isOpen : true,
      confirmBtnText : "Submit",
      confirm : () => handleCommentSubmit(camera, timeInEpoch),
      close : handleConfirmModalClose
    });
  };

  const handleCommentSubmit = async (camera : CameraResponse, snapshotTimeInEpoch : number) : Promise<void> => {
    setIsApiProcessing(true);

    const comment = inputCommentRef.current.value;
    const response = await submitComment(
      taskId,
      camera.id,
      currentCheckpoint.id,
      snapshotTimeInEpoch,
      comment
    );

    setIsApiProcessing(false);

    if (response.errors === null) {
      setConfirmModal({
        header : null,
        message : null,
        isOpen : false,
        confirmBtnText : "",
        confirm : null
      });

      setNotifyModal({
        iconType : "success",
        isOpen : true,
        header : "Submitted",
        message : <div className="text-center text-black">The comment is submitted successfully.</div>,
        close : handleNotifyModalClose
      });
    } else {
      setNotifyModal({
        iconType : "notify",
        isOpen : true,
        header : "Error",
        message : <div className="text-center text-black">Something went wrong while submitting comment.</div>,
        close : handleNotifyModalClose
      });
    }
  };

  // fullscreen mode
  const handleFullscreenActive = (camera : CameraResponse) : void => {
    setFullscreenCamera(camera);
  };
  const handleFullscreenInactive = () : void => {
    setFullscreenCamera(null);
  };

  // modals
  const handleNotifyModalClose = () : void => {
    setNotifyModal({
      color : "",
      header : null,
      message : null,
      isOpen : false
    });

    setIsGoToNextEnable(true);
  };

  const handleConfirmModalClose = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirmBtnText : "",
      confirm : null
    });
  };

  const getAssignees = (users : MiniUserResponse[]) : JSX.Element => {
    if (!!users && users.length > 0) {
      const currentUserId = currentUser.accountId;

      // place `my avatar` at the front
      users.sort((a : MiniUserResponse, b : MiniUserResponse) => {
        if (a.id === currentUserId) return -1;
        else if (b.id === currentUserId) return 1;
        return 0;
      });

      // place users with avatar at the front
      const updatedData = users
        .filter((item : MiniUserResponse) => item.avatar !== null && item.avatar !== undefined)
        .map((item : MiniUserResponse) => {
          if (item.id === currentUserId) {
            return {
              ...item,
              name : `You (${ item.name })`
            };
          }
          return item;
        })
        .concat(users.filter((item : MiniUserResponse) => item.avatar === null || item.avatar === undefined));

      return (
        <div className="d-flex justify-content-start align-items-center">
          <AvatarsOverlay items={ updatedData } />
        </div>
      );
    }
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //

  // acknowledge button
  useEffect(() => {
    let timer;
    const lastCheckpointIdNumber = Object.keys(checkpoints).find((key : string) => checkpoints[key] ===
      taskDetails?.lastCheckpointId);
    if (!!lastCheckpointIdNumber) {
      const isDifferenceOne = (parseInt(lastCheckpointIdNumber) - currentCheckpointOrder) === -1;
      if (isDifferenceOne) {
        setIsRaiseAlertEnabled(true);
        timer = setTimeout(() => {
          setIsAcknowledgeEnable(true);
        }, ACKNOWLEDGE_IN_MILLISECOND);
        setIsGoToNextEnable(false);
      } else {
        setIsAcknowledgeEnable(false);
        setIsRaiseAlertEnabled(false);
        setIsGoToNextEnable(true);
      }
    } else {
      setIsRaiseAlertEnabled(true);
      timer = setTimeout(() => {
        setIsAcknowledgeEnable(true);
      }, ACKNOWLEDGE_IN_MILLISECOND);
      setIsGoToNextEnable(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [
    currentCheckpointOrder,
    checkpoints,
    taskDetails?.lastCheckpointId
  ]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!!taskId) await updateOngoingTask(taskId);
    }, UPDATE_ONGOING_INTERVAL); // 2 minutes in milliseconds

    return () => {
      clearInterval(intervalId);
      pauseOnGoingTask(taskId);
    };
  }, [taskId]);

  const loadTodayDoableTasks = async (currentUserId : string) : Promise<void> => {
    setTodayDoableModalLoading(true);

    const todayTasks = await listTodayDoableTask();
    const todayTasksAssigned = todayTasks?.filter((task : RouteTaskResponse) => task.route.assignedUsers.some((user : MiniUserResponse) => user.id ===
      currentUserId));

    const canStartNowTasks = getCanStartNowTasks(todayTasksAssigned);
    setTodayDoableTasks(canStartNowTasks);

    setTodayDoableModalLoading(false);
  };

  const loadAlertTypes = async () : Promise<void> => {
    const { data } = await fetchAlertTypes();
    setAlertTypes(data);

    const preparedData : AlertTypeButtons[] = [];

    data.map((alertType : AlertTypeResponse) => {
      const obj = {
        id : alertType.id,
        label : alertType.type,
        value : alertType.id,
        imageUrl : alertType.imageUrl
      };
      preparedData.push(obj);
    });
    setAlertTypeButtons(preparedData);
  };

  useEffect(() => {
    const noTaskDirected = !taskId || !routeId;
    if (!noTaskDirected) {
      fetchTaskDetails(routeId, taskId);
    } else if (noTaskDirected && currentUser) {
      setTodayDoableModalLoading(true);
      const timeoutId = setTimeout(() => loadTodayDoableTasks(currentUser.accountId), 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [
    taskId,
    routeId,
    currentUser
  ]);

  useEffect(() => {
    if (!!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveVideoFeed"]) {
      updateLiveVideoTimes(taskDetails);
    }
  }, [taskDetails]);

  useEffect(() => {
    getCurrentLoggedInUser();
    loadAlertTypes();
  }, []);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="patrolling-index-page">

        {/* ⭐️ Coming from Tasks List page */ }
        { !!taskId && !!routeId ?
          <>
            {/* Title bar */ }
            <div className="mb-2 text-white">
              <div
                className="d-flex justify-content-between align-items-center"
                style={ { padding : "0 70px" } }>
                <h2
                  data-test="patrolling__checkpoint-title"
                  className="m-0 d-flex align-items-center">
                  { `Checkpoint ${ currentCheckpointOrder }` }
                  { !!fullscreenCamera ?
                    <em
                      className="text-warning"
                      style={ { fontSize : "0.8rem" } }>/ Fullscreen</em> :
                    (currentCheckpointOrder > 1 && <em
                      className="btn-return-to-prev-checkpoint"
                      onClick={ handleReturnToPrevCheckpoint }><BsChevronLeft /> Return</em>)
                  }
                </h2>
                <div className="d-flex">
                  <CurrentClock
                    style={ {
                      color : "white",
                      fontSize : "0.8rem"
                    } } />&nbsp;/&nbsp;
                  <span
                    className="d-flex align-items-center gap-2"
                    style={ { color : "#39E30F" } }>LIVE <BsFillCircleFill size={ 10 } /></span>
                </div>
                { !!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveImage"] &&
                  <div className="d-flex">
                    <RefreshTimer
                      intervalId={ intervalId }
                      setIntervalId={ setIntervalId }
                      autoRefreshTime={ REFRESH_TIME_IN_SECOND }
                      setRenderCount={ setRenderCount }
                    />&nbsp;/&nbsp;{ moment.utc(moment.duration(REFRESH_TIME_IN_SECOND, "seconds").asMilliseconds()).format("m:ss") }
                  </div>
                }
                { !!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveVideoFeed"] &&
                  <Button
                    disabled={ isSyncing }
                    outline
                    size="sm"
                    className="btn-sync"
                    onClick={ handleVideosSync }>{ isSyncing ? "Reloading..." : "Reload" }</Button>
                }
              </div>
            </div>

            {/* --- ⬇︎ START - Cameras Grid ⬇︎ --- */ }
            {/* Not Fullscreen Mode */ }
            { !fullscreenCamera ?
              <>
                <div style={ gridStyle }>
                  { !!currentCheckpoint?.cameras &&
                    currentCheckpoint?.cameras.map((camera : CameraResponse, index : number) => {
                      // Live Image Feed
                      if (!!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveImage"]) {
                        return <div key={ camera.id }>
                          <PatrolCameraImage
                            cols={ currentCheckpoint?.layoutCol }
                            camera={ camera }
                            timeInEpoch={ moment().tz(TIME_ZONE)
                              .valueOf() }
                            imageStyle={ imgStyle }
                            largerOnHover={ true }
                            transformOrigin={ currentGridView?.transformOrigins[index] || "center center" }
                            autoHideOnPointingDevices={ true }
                            alert={ {
                              data : alertTypeButtons,
                              isEnabled : isRaiseAlertEnabled,
                              onAlertClick : handleAlertClick
                            } }
                            comment={ { onCommentClick : handleCommentClick } }
                            onFullscreenActive={ handleFullscreenActive }
                          />
                        </div>;
                      } else if (!!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveVideoFeed"]) {
                        // Live Video Feed
                        const videoURL = getCameraVideoStreamURL(camera.id, liveRemainingDurationBeforeEndtime);

                        return (
                          <div key={ `video-${ index }-${ syncVideoKey }` }>
                            <PatrolCameraLiveVideo
                              layout={ {
                                rows : currentCheckpoint?.layoutRow,
                                cols : currentCheckpoint?.layoutCol
                              } }
                              camera={ camera }
                              videoURL={ videoURL }
                              setIsSyncing={ setIsSyncing }
                              alert={ {
                                data : alertTypeButtons,
                                onAlertClick : handleAlertClick
                              } }
                              comment={ { onCommentClick : handleCommentClick } }
                            />
                          </div>
                        );
                      }
                    }) }
                  { !!placeholderCount && placeholderCount > 0 &&
                    _.range(0, placeholderCount).map((placeholder : number) =>
                      <div
                        key={ placeholder }
                        className="placeholder">
                        <em>— blank —</em>
                      </div>) }
                </div>
                {/* --- ⬆︎ END - Cameras Grid ⬆︎ --- */ }

                {/* --- ⬇︎ START - Progress Bar ⬇︎ --- */ }
                <div style={ { padding : "5px 70px" } }>
                  <Progress
                    color="primary"
                    value={ (currentCheckpointOrder / patrolRoute?.routeCheckpoints.length) * 100 }
                    max={ 100 }
                    style={ {
                      height : "10px",
                      borderRadius : "10px"
                    } } />
                </div>
                {/* --- ⬆︎ END - Progress Bar ⬆︎ --- */ }

                {/* --- ⬇︎ START - Action Buttons ⬇︎ --- */ }
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={ { padding : "5px 70px" } }>
                  <Button
                    color="success"
                    className="rounded rounded-3"
                    disabled={ !isAcknowledgeEnable }
                    onClick={ () : void => {
                      if (isAcknowledgeEnable) handleAcknowledgeClick();
                    } }
                    title={ `Currently, acknowledge can be done after ${ ACKNOWLEDGE_IN_MILLISECOND /
                    1000 } sec for dev purposes.` }>Acknowledge Cameras</Button>
                  <Button
                    color="danger"
                    className="rounded rounded-3"
                    disabled={ !isGoToNextEnable }
                    onClick={ () : void => {
                      if (reachToLastCheckpoint) handleEndPatrolConfirm();
                      else handleNextCheckpointProceed();
                    } }>
                    { reachToLastCheckpoint ? "Confirm end patrol" : "Proceed to next set" }
                  </Button>
                </div>
                {/* --- ⬆︎ END - Action Buttons ⬆︎ --- */ }
              </>
              :
              // Fullscreen Mode
              !!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveImage"] ?
                <div style={ { padding : "0 70px" } }>
                  <PatrolCameraImage
                    cols={ 1 }
                    camera={ fullscreenCamera }
                    timeInEpoch={ moment().tz(TIME_ZONE)
                      .valueOf() }
                    imageStyle={ imgStyle }
                    largerOnHover={ true }
                    transformOrigin={ "center center" }
                    autoHideOnPointingDevices={ true }
                    alert={ {
                      data : alertTypeButtons,
                      isEnabled : isRaiseAlertEnabled,
                      onAlertClick : handleAlertClick
                    } }
                    comment={ { onCommentClick : handleCommentClick } }
                    onFullscreenInactive={ handleFullscreenInactive }
                  />
                </div> :
                !!taskDetails && taskDetails?.route.patrolMode === PatrolMode["LiveVideoFeed"] ?
                  <div key={ `video-1-${ syncVideoKey }` }>
                    <PatrolCameraLiveVideo
                      layout={ {
                        rows : currentCheckpoint?.layoutRow,
                        cols : currentCheckpoint?.layoutCol
                      } }
                      camera={ fullscreenCamera }
                      videoURL={ getCameraVideoStreamURL(fullscreenCamera.id, liveRemainingDurationBeforeEndtime) }
                      setIsSyncing={ setIsSyncing }
                      alert={ {
                        data : alertTypeButtons,
                        onAlertClick : handleAlertClick
                      } }
                      comment={ { onCommentClick : handleCommentClick } }
                    />
                  </div>
                  : <></>
            }
          </>
          :
          // ⭐️ Coming directly to Virtual Page //
          <div className="bg-white rounded rounded-3 p-3">
            {/* header */ }
            <h4 className="mb-3">
              <div className="d-flex justify-content-between align-items-center gap-2">
                <div>
                  <div style={ { color : "black" } }>
                    { "Today's tasks " }
                  </div>
                  <small
                    data-test="patrol-list__refresh-btn"
                    onClick={ handleTodayDoableTasksRefresh }
                    className="link-warning"
                    style={ {
                      textUnderlineOffset : 3,
                      textDecoration : "underline",
                      fontSize : "0.8rem",
                      cursor : "pointer"
                    } }>Refresh
                  </small>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <CurrentClock
                    style={ {
                      color : "gray",
                      fontSize : "0.8rem",
                      marginTop : "3px"
                    } } />
                  <small>{ moment().tz(TIME_ZONE)
                    .format("D MMMM, YYYY") }</small>
                </div>
              </div>
            </h4>

            {/* body */ }
            {
              !!todayDoableTasks && todayDoableTasks.length > 0 ? (
                <div
                  data-test="patrol-list__today-doable-tasks"
                  className="container">
                  <div className="row bg-gray-300 rounded rounded-3 py-3">
                    <div className="col-2">Start — End time</div>
                    <div className="col-2">Name</div>
                    <div className="col-2">Site</div>
                    <div className="col-2">Assignees</div>
                    <div className="col-2">Status</div>
                    <div className="col-2">Action</div>
                  </div>
                  <PerfectScrollbar>
                    <div
                      style={ { overflowX : "hidden" } }>
                      {
                        !!todayDoableTasks && todayDoableTasks.length === 0 ?
                          // No today tasks
                          <div className="row">
                            <div className="col-2">—</div>
                            <div className="col-2">—</div>
                            <div className="col-2">—</div>
                            <div className="col-2">—</div>
                            <div className="col-2">—</div>
                            <div className="col-2">—</div>
                          </div>
                          :
                          // Today tasks list
                          todayDoableTasks.map((
                            task : RouteTaskResponse,
                            index : number,
                            item : RouteTaskResponse[]
                          ) => {
                            return (
                              <div
                                className={ "row py-3 align-items-center" }
                                style={ { borderBottom : index + 1 === item.length ? "" : "1px solid #E5E4E2" } }
                                key={ index }>
                                <div className="col-2">{ convertSecondsToHumanReadableFormat(task.startTime.toString()) } — { convertSecondsToHumanReadableFormat(task.endTime.toString()) }</div>
                                <div className="col-2">{ task.name }</div>
                                <div className="col-2">{ task.route.site.name }</div>
                                <div className="col-2">{ getAssignees(task.route.assignedUsers) }</div>
                                <div className="col-2">
                                  <span
                                    className={ `${ TaskStatus.Pending === task.status &&
                                    "text-success" } ${ TaskStatus.Paused === task.status &&
                                    "text-warning" } ${ TaskStatus.NotStarted === task.status &&
                                    "text-danger" }` }>{ task.status }</span>
                                </div>
                                <div className="col-2"><Button
                                  data-test={ `patrol-list__action-btn-${ task.id }` }
                                  color="success"
                                  size="md"
                                  onClick={ () : void => {
                                    if (task.status === TaskStatus.Paused) handleResumePatrolling(task);
                                    else handleStartPatrolling(task);
                                  } }>
                                  { task.status === TaskStatus.Paused ? "Resume" : "Start" }
                                </Button>
                                </div>
                              </div>
                            );
                          })
                      }
                    </div>
                  </PerfectScrollbar>
                </div>
              ) : (
                !isTodayDoableModalLoading && <h5
                  data-test="patrol-list__no-records"
                  className="w-100 text-center text-success fw-bold">No records</h5>
              )
            }
          </div>
        }

        <NotifyMessageModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          message={ notifyModal.message }
          header={ notifyModal.header }
          close={ handleNotifyModalClose }
        />

        <ConfirmationModal
          size={ confirmModal.size }
          isOpen={ confirmModal.isOpen }
          message={ confirmModal.message }
          header={ confirmModal.header }
          close={ confirmModal.close }
          confirmBtnText={ confirmModal.confirmBtnText }
          cancelBtnText={ confirmModal.cancelBtnText }
          confirm={ confirmModal.confirm }
        />

        <RaiseAlertModal
          isOpen={ isSubmitAlertModalOpen }
          camera={ currentRaisingAlertCamera }
          data={ currentRaisingAlertType }
          timeInEpoch={ currentRaisingAlertEpochTime }
          alertDetected={ {
            value : alertDetected,
            onChange : handleAlertDetectedChange
          } }
          actionTakens={ {
            data : alertActionTaken,

            //
            newActionTakens : newActionTaken,
            onNewActionTakenChange : handleNewActionTakenChange,

            //
            onActionTakenAdd : handleAlertActionTakenAdd,
            onActionTakenRemove : (
              actionTaken : string | undefined,
              order : number | undefined
            ) : void => handleAlertActionTakenRemove(actionTaken, order),
            onActionTakensReset : handleAlertActionTakenReset
          } }
          onModalClose={ toggleSubmitAlertModal }
          onSubmit={ handleRaiseAlertSubmit }
        />

        <LoadingSpinner
          full
          active={ isApiProcessing || isTodayDoableModalLoading } />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(VirtualPatrolPage);

type TransformOriginsType = {
  itemsCount : number,
  transformOrigins : string[]
};

// for making images larger on hover when grid items > 4
export const transformOrigins : TransformOriginsType[] = [
  {
    itemsCount : 1,
    transformOrigins : []
  },
  {
    itemsCount : 4,
    transformOrigins : []
  },
  {
    itemsCount : 9,
    transformOrigins : [
      "top left",
      "top center",
      "top right",
      "center left",
      "center center",
      "center right",
      "bottom left",
      "bottom center",
      "bottom right"
    ]
  },
  {
    itemsCount : 25,
    transformOrigins : []
  }
];
