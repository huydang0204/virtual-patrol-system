import { vpsApi } from "apis/utils";
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import {
  CountResponse,
  FindAndCountResponse

} from "@vps/utils/lib/data";
import {
  RouteCheckpointResponse,
  RouteDetailResponse,
  RouteScheduleResponse
} from "@vps/utils/lib/dto";

const ROUTE_API = "/route";

export const apiGetRoutes = async (
  limit : number,
  offset : number,
  searchText? : string,
  dateRange? : { from : string, to : string }
) : Promise<ApiResult<FindAndCountResponse<RouteResponse>>> => {
  const params = {
    offset,
    limit,
    searchText,
    createdDateFrom : dateRange.from,
    createdDateTo : dateRange.to
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/list",
    method : API_METHOD.GET,
    params,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : FindAndCountResponse<RouteResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountRoutes = async (
  searchText : string,
  dateRange : { from : string, to : string },
  exactSearch : boolean
) : Promise<ApiResult<CountResponse>> => {
  const params = {};
  if (!!searchText) {
    params["searchText"] = searchText;
  }
  if (!!dateRange) {
    params["createdDateFrom"] = dateRange.from;
    params["createdDateTo"] = dateRange.to;
  }
  if (!!exactSearch) {
    params["exactSearch"] = exactSearch;
  }

  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/count",
    method : API_METHOD.GET,
    params,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : CountResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetPatrolRouteById = async (routeId : string) : Promise<ApiResult<RouteDetailResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + routeId,
    method : API_METHOD.GET,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteDetailResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeletePatrolRoute = async (routeId : string) : Promise<ApiResult<RouteResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + routeId,
    method : API_METHOD.DELETE,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCreateRoute = async (
  reminderTimeInSeconds : number,
  name : string,
  siteId : string,
  assignedUserIds : string[],
  startAllowTimeInSeconds : number,
  patrolMode : string
) : Promise<ApiResult<RouteResponse>> => {
  const body = {
    reminderTime : reminderTimeInSeconds,
    name,
    siteId,
    assignedUserIds,
    allowStartTime : startAllowTimeInSeconds,
    patrolMode
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API,
    method : API_METHOD.POST,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateRoute = async (
  routeId : string,
  name : string,
  siteId : string,
  assignedUserIds : string[],
  startAllowTimeInSeconds : number,
  patrolMode : string,
  reminderTimeInSeconds : number
) : Promise<ApiResult<RouteResponse>> => {
  const body = {
    name,
    siteId,
    assignedUserIds,
    allowStartTime : startAllowTimeInSeconds,
    patrolMode,
    reminderTime : reminderTimeInSeconds
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + routeId,
    method : API_METHOD.PUT,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiAddCheckpoints = async (routeId, payload) : Promise<ApiResult<RouteCheckpointResponse[]>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/${ routeId }/checkpoint/list`,
    method : API_METHOD.POST,
    data : payload,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteCheckpointResponse[] = [];
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteCheckpointsList = async (ids) : Promise<ApiResult<RouteResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/checkpoint/list`,
    method : API_METHOD.DELETE,
    data : { ids },
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateCheckpointsList = async (routeId, payload) : Promise<ApiResult<RouteResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/${ routeId }/checkpoint/list`,
    method : API_METHOD.PUT,
    data : payload,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiAddSchedules = async (routeId, payload) : Promise<ApiResult<RouteScheduleResponse[]>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/${ routeId }/schedule/list`,
    method : API_METHOD.POST,
    data : payload,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteScheduleResponse[] = [];
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteSchedulesList = async (ids) : Promise<ApiResult<RouteResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/schedule/list`,
    method : API_METHOD.DELETE,
    data : { ids },
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateSchedulesList = async (routeId : string, payload) : Promise<ApiResult<RouteScheduleResponse[]>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : `${ ROUTE_API }/${ routeId }/schedule/list`,
    method : API_METHOD.PUT,
    data : payload,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : RouteScheduleResponse[] = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
