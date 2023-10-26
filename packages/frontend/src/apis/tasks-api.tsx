import { FindAndCountResponse } from "@vps/utils/lib/data";
import {
  TaskSummaryReportResponse,
  TaskReport,
  TaskMonthlyReport,
  TaskDailyReport,
  RouteTaskResponse
} from "@vps/utils/lib/dto"; // TODO: Check this
import {
  API_METHOD, ApiRequest, ApiResult, ApiService
} from "model-type/service";
import { vpsApi } from "./utils";
import { TaskStatus } from "@vps/utils/lib/data";
const TASK_API = "/task";

export const apiGetTasks = async (obj : {
    fromDate ?: string,
    toDate ?: string,
    searchText? : string,
    status? : string[],
    filterShift?: string,
    limit?: number,
    offset?: number,
    siteId ?: string
  }): Promise<ApiResult<FindAndCountResponse<RouteTaskResponse>>> => {
  const params = {
    fromDate : obj?.fromDate,
    toDate : obj?.toDate,
    filterStatuses : JSON.stringify(obj?.status),
    filterShift : obj?.filterShift || "",
    limit : obj?.limit,
    offset : obj?.offset,
    searchText : obj?.searchText,
    siteId : obj?.siteId
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/list",
    method : API_METHOD.GET,
    params,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: FindAndCountResponse<RouteTaskResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetTaskById = async (taskId: string, includeReport : boolean): Promise<ApiResult<RouteTaskResponse>> => {
  const params = {};
  if (!!includeReport) {
    params["includeReport"] = true;
  }
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId,
    method : API_METHOD.GET,
    authToken : true,
    params
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiStartTask = async (
  taskId: string,
  startComment?: string
): Promise<ApiResult<RouteTaskResponse>> => {
  const body = { startComment };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/start",
    method : API_METHOD.PUT,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiEndTask = async (
  taskId: string,
  endComment: string,
  endStatus: TaskStatus
): Promise<ApiResult<RouteTaskResponse>> => {
  const body = {
    endStatus,
    endComment
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/end",
    method : API_METHOD.PUT,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiResumeTask = async (taskId: string): Promise<ApiResult<RouteTaskResponse>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/resume",
    method : API_METHOD.PUT,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateOngoingTask = async (taskId: string): Promise<ApiResult<RouteTaskResponse>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/ongoing",
    method : API_METHOD.PUT,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiPauseOnGoingTask = async (taskId: string): Promise<ApiResult<RouteTaskResponse>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/pause",
    method : API_METHOD.PUT,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiRaiseAlert = async (
  taskId: string,
  cameraId: string,
  checkpointId: string,
  snapshotTimeInEpoch: number,
  alert: {
    type: string,
    description: string,
    actionsTaken: string[]
  }
): Promise<ApiResult<TaskReport>> => {
  const body = {
    cameraId,
    checkpointId,
    snapshotTimeInEpoch,
    alert
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/raise-alert",
    method : API_METHOD.POST,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: TaskReport = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiSubmitComment = async (
  taskId: string,
  cameraId: string,
  checkpointId: string,
  snapshotTimeInEpoch: number,
  comment: string
): Promise<ApiResult<RouteTaskResponse>> => {
  const body = {
    cameraId,
    checkpointId,
    snapshotTimeInEpoch,
    comment
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/comment",
    method : API_METHOD.POST,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiAcknowledgeCameras = async (
  taskId: string,
  data : {
    checkpointId: string,
    cameras: {
      id: string,
      snapshotTimeInEpoch: number }[]
    }
): Promise<ApiResult<RouteTaskResponse>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/" + taskId + "/acknowledge",
    method : API_METHOD.POST,
    data : data,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: RouteTaskResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiListMonthlyReports = async (siteId ?: string, month ?: string, limit ?: number, offset ?: number): Promise<ApiResult<FindAndCountResponse<TaskSummaryReportResponse>>> => {
  const params = {
    siteId,
    month,
    limit,
    offset
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/monthly-report/list",
    method : API_METHOD.GET,
    authToken : true,
    params
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: FindAndCountResponse<TaskSummaryReportResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetMonthlyReport = async (id : string): Promise<ApiResult<TaskMonthlyReport>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/monthly-report/" + id,
    method : API_METHOD.GET,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: TaskMonthlyReport = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiListDailyTaskReports = async (siteId ?: string, date ?: string, limit ?: number, offset ?: number): Promise<ApiResult<FindAndCountResponse<TaskSummaryReportResponse>>> => {
  const params = {
    siteId,
    date,
    limit,
    offset
  };

  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/daily-report/list",
    method : API_METHOD.GET,
    authToken : true,
    params
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: FindAndCountResponse<TaskSummaryReportResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetDailyTaskReport = async (id : string): Promise<ApiResult<TaskDailyReport>> => {
  const request: ApiRequest = {
    service : ApiService.vps,
    url : TASK_API + "/daily-report/" + id,
    method : API_METHOD.GET,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success, data : responseData, errorCode
  } = apiResponse;

  let rp: TaskDailyReport = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
