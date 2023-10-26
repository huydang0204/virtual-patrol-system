import moment from "moment-timezone";

import {
  apiAcknowledgeCameras,
  apiEndTask,
  apiListDailyTaskReports,
  apiListMonthlyReports,
  apiGetTaskById,
  apiGetTasks,
  apiPauseOnGoingTask,
  apiRaiseAlert,
  apiResumeTask,
  apiStartTask,
  apiSubmitComment,
  apiUpdateOngoingTask,
  apiGetMonthlyReport,
  apiGetDailyTaskReport
} from "apis/tasks-api";
import {
  RouteTaskResponse,
  TaskDailyReport,
  TaskMonthlyReport,
  TaskSummaryReportResponse
} from "@vps/utils/lib/dto";
import { 
  FindAndCountResponse,
  TaskStatus 
} from "@vps/utils/lib/data";
import { ServiceResponse } from "model-type/service";
import {
  TIME_ZONE,
  getStartAndEndTimeOfDay,
  getTodayInCalendarAcceptedFormat
} from "utils/time-format";

export enum TaskError {
  InvalidId = "InvalidId",
  InvalidStartComment = "InvalidStartComment",
  InvalidEndComment = "InvalidEndComment",
  InvalidCameraId = "InvalidCameraId",
  InvalidTaskId = "InvalidTaskId",
  InvalidCameras = "InvalidCameras",
  InvalidCheckpointId = "InvalidCheckpointId",
  InvalidAlertDescription = "InvalidAlertDescription",
  InvalidAlertActionsTaken = "InvalidAlertActionsTaken",
  InvalidComment = "InvalidComment",
}

export const fetchTasks = async (obj : {
  fromDate? : string,
  toDate? : string,
  searchText? : string,
  status? : string[],
  filterShift?: string
  limit?: number,
  offset?: number,
  siteId ?: string
}, forReport ?: boolean) : Promise<FindAndCountResponse<RouteTaskResponse>> => {
  if (forReport) {
    if (!obj.status || obj.status.length == 0) {
      obj.status = [
        TaskStatus.Completed,
        TaskStatus.Incomplete,
        TaskStatus.Missed
      ];
    }
  }

  const {
    data,
    error
  } = await apiGetTasks(obj);

  if (!error && data) return data;
};

export const fetchTaskById = async (taskId : string, includeReport ? : boolean) : Promise<RouteTaskResponse> => {
  const {
    data,
    error
  } = await apiGetTaskById(taskId, includeReport);
  if (!error) return data;
};

export const listTodayDoableTask = async () : Promise<RouteTaskResponse[]> => {
  const todayObj = getTodayInCalendarAcceptedFormat();
  const {
    start : fromDate,
    end : toDate
  } = getStartAndEndTimeOfDay(moment({
    year : todayObj.year,
    month : todayObj.month - 1,
    day : todayObj.day
  }).tz(TIME_ZONE));

  const todayTasks = await fetchTasks({
    fromDate,
    toDate,
    status : [TaskStatus.Pending,
      TaskStatus.NotStarted,
      TaskStatus.Paused]
  });

  return todayTasks.data;
};

export const startTask = async (
  taskId : string,
  startComment : string
) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidId = !taskId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiStartTask(taskId, startComment);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const endTask = async (
  taskId : string,
  endComment : string,
  taskStatus : TaskStatus
) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidId = !taskId;
  const invalidEndComment = taskStatus === TaskStatus.Missed && !endComment; // missed task needs end comment

  let result = false;
  if (!invalidId && !invalidEndComment) {
    const {
      data,
      error
    } = await apiEndTask(taskId, endComment, taskStatus);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidId] = invalidId;
    errors[TaskError.InvalidEndComment] = invalidEndComment;
  }

  return {
    data : result,
    errors
  };
};

export const resumeTask = async (taskId : string) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidId = !taskId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiResumeTask(taskId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const updateOngoingTask = async (taskId : string) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidId = !taskId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiUpdateOngoingTask(taskId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const pauseOnGoingTask = async (taskId : string) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidId = !taskId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiPauseOnGoingTask(taskId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const raiseAlert = async (
  taskId : string,
  cameraId : string,
  checkpointId : string,
  snapshotTimeInEpoch : number,
  alert : {
    type : string,
    description : string,
    actionsTaken : string[]
  }
) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidCameraId = !cameraId;
  const invalidCheckpointId = !checkpointId;
  const invalidAlertDescription = !!alert && !alert.description;
  const invalidAlertActionsTaken = !!alert && !alert.actionsTaken;

  let result = false;
  if (!invalidCameraId && !invalidCheckpointId && !invalidAlertDescription && !invalidAlertActionsTaken) {
    const {
      data,
      error
    } = await apiRaiseAlert(taskId, cameraId, checkpointId, snapshotTimeInEpoch, alert);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidCameraId] = invalidCameraId;
    errors[TaskError.InvalidCheckpointId] = invalidCheckpointId;
    errors[TaskError.InvalidAlertDescription] = invalidAlertDescription;
    errors[TaskError.InvalidAlertActionsTaken] = invalidAlertActionsTaken;
  }

  return {
    data : result,
    errors
  };
};

export const submitComment = async (
  taskId : string,
  cameraId : string,
  checkpointId : string,
  snapshotTimeInEpoch : number,
  comment : string
) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidTaskId = !taskId;
  const invalidCameraId = !cameraId;
  const invalidCheckpointId = !checkpointId;
  const invalidComment = comment.length === 0;

  let result = false;
  if (!invalidTaskId && !invalidCameraId && !invalidCheckpointId && !invalidComment) {
    const {
      data,
      error
    } = await apiSubmitComment(taskId, cameraId, checkpointId, snapshotTimeInEpoch, comment);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidTaskId] = invalidTaskId;
    errors[TaskError.InvalidCameraId] = invalidCameraId;
    errors[TaskError.InvalidCheckpointId] = invalidCheckpointId;
    errors[TaskError.InvalidComment] = invalidComment;
    errors[TaskError.InvalidAlertActionsTaken] = invalidComment;
  }

  return {
    data : result,
    errors
  };
};

export const apiAcknowledge = async (
  taskId : string,
  checkpointId : string,
  cameras : { id : string, snapshotTimeInEpoch : number }[]
) : Promise<ServiceResponse<boolean, TaskError>> => {
  let errors = {} as Record<TaskError, boolean>;
  const invalidTaskId = !taskId;
  const invalidCheckpointId = !checkpointId;
  const invalidCameras = cameras.length === 0;

  let result = false;
  if (!invalidTaskId && !invalidCheckpointId && !invalidCameras) {
    const {
      data,
      error
    } = await apiAcknowledgeCameras(taskId, {
      checkpointId,
      cameras
    });
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[TaskError.InvalidTaskId] = invalidTaskId;
    errors[TaskError.InvalidCheckpointId] = invalidCheckpointId;
    errors[TaskError.InvalidCameras] = invalidCameras;
  }

  return {
    data : result,
    errors
  };
};

export const fetchMonthlyReport = async (siteId ?: string, month ?: string, limit ?: number, offset ?: number) : Promise<FindAndCountResponse<TaskSummaryReportResponse>> => {
  const {
    data,
    error
  } = await apiListMonthlyReports(siteId, month, limit, offset);
  if (!error && data) return data;
};

export const fetchDailyTaskReport = async (siteId ?: string, date ?: string, limit ?: number, offset ?: number) : Promise<FindAndCountResponse<TaskSummaryReportResponse>> => {
  const {
    data,
    error
  } = await apiListDailyTaskReports(siteId, date, limit, offset);
  if (!error && data) return data;
};

export const getMonthlyReport = async (id : string) : Promise<TaskMonthlyReport> => {
  const {
    data,
    error
  } = await apiGetMonthlyReport(id);
  if (!error) return data;
};

export const getDailyReport = async (id : string) : Promise<TaskDailyReport> => {
  const {
    data,
    error
  } = await apiGetDailyTaskReport(id);
  if (!error) return data;
};