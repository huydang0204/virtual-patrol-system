import { vpsApi } from "./utils";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import {
  NotificationCountResponse, AppNotificationResponse
} from "@vps/utils/lib/dto/app-notification";

import {
  API_METHOD, ApiRequest, ApiResult, ApiService
} from "model-type/service";


const ROUTE_API = "/notification";

export const apiGetNotifications = async (): Promise<ApiResult<FindAndCountResponse<AppNotificationResponse>>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/list",
    method : API_METHOD.GET,
    params : {
      limit : 100,
      offset : 0
    },
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp: FindAndCountResponse<AppNotificationResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetNotificationsCount = async (): Promise<ApiResult<NotificationCountResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/count",
    method : API_METHOD.GET,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp: NotificationCountResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiReadNotifications = async () : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/read",
    method : API_METHOD.PUT,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    errorCode
  } = apiResponse;

  return {
    data : success,
    error : errorCode
  };
};

export const apiReadNotiById = async (id : string) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + id,
    method : API_METHOD.PUT,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    errorCode
  } = apiResponse;

  return {
    data : success,
    error : errorCode
  };
};


export const apiDeleteNotiById = async (id : string) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + id,
    method : API_METHOD.DELETE,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    errorCode
  } = apiResponse;

  return {
    data : success,
    error : errorCode
  };
};

export const apiDeleteAllNotis = async () : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + "list",
    method : API_METHOD.DELETE,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    errorCode
  } = apiResponse;

  return {
    data : success,
    error : errorCode
  };
};
