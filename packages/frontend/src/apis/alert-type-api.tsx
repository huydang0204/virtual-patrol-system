import { vpsApi } from "./utils";
import {
  FindAndCountResponse, CountResponse
} from "@vps/utils/lib/data";
import { AlertTypeResponse } from "@vps/utils/lib/dto";
import {
  API_METHOD, ApiRequest, ApiResult, ApiService
} from "model-type/service";

const ROUTE_API = "/alert-type";

export const apiGetAlertTypes = async (
  searchText : string,
  limit : number,
  offset : number
) : Promise<ApiResult<FindAndCountResponse<AlertTypeResponse>>> => {
  const params = {
    searchText,
    limit,
    offset
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

  let rp : FindAndCountResponse<AlertTypeResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountAlertType = async (searchText : string) : Promise<ApiResult<CountResponse>> => {
  const params = { searchText };
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

export const apiCreateAlertType = async (name : string, description : string, actionTaken : string[], imageUrl : string) : Promise<ApiResult<AlertTypeResponse>> => {
  const body = {
    type : name,
    description,
    actionTaken,
    imageUrl
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

  let rp : AlertTypeResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateAlertType = async (
  id : string,
  name : string,
  description : string,
  actionTaken : string[],
  imageUrl : string
) : Promise<ApiResult<AlertTypeResponse>> => {
  const body = {
    type : name,
    description,
    actionTaken,
    imageUrl
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + id,
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

  let rp : AlertTypeResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteAlertType = async (id : string) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ROUTE_API + "/" + id,
    method : API_METHOD.DELETE,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp = false;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
